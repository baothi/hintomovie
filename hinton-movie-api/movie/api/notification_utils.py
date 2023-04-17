import json
import os
import sys
import logging
import subprocess
import time
import requests
from collections import namedtuple
from datetime import datetime

from celery import shared_task
from account_app.models import UserLogin
from backend_app.models import Notification, NotificationUser
from utils.apns2.client import APNsClient
from utils.apns2.credentials import TokenCredentials
from utils.apns2.payload import Payload, PayloadAlert
from movie.api.constants import BaseStatus, FCM_URL, FCM_KEY, APNS_HOST_NAME, APNS_AUTH_KEY_ID, APNS_TEAM_ID, APNS_TOKEN_KEY_FILE_NAME, APNS_TOPIC

logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logger = logging.getLogger(__name__)

def addNotification(organization, title, link, users):
    notification = Notification.objects.create(
        organization=organization,
        title=title,
        link=link,
        date=datetime.now()
    )

    for user in users:
        NotificationUser.objects.create(
            notification=notification,
            user=user,
            viewed=False
        )

def sendAndroidNotification(deviceToken, title, message, data):
    try:
        headers = {
            "Authorization": f"key={FCM_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "to": "",
            "notification": {
                "body": message,
                "title": title
            },
            "data":{
                "remote": True,
                **data
            }
        }
        data["to"] = deviceToken
        requests.post(FCM_URL, data = json.dumps(data), headers=headers)

    except Exception as ex:
        logger.error(f'===> Fail to Send notification to device (Android): {deviceToken} -> ', ex)

def sendIosNotification(deviceToken, title, message, data):
    try:
        token_credentials = TokenCredentials(
                        auth_key_path=APNS_TOKEN_KEY_FILE_NAME, 
                        auth_key_id=APNS_AUTH_KEY_ID,
                        team_id=APNS_TEAM_ID
                    )

        alert = PayloadAlert(title=title, body=message)
        payload = Payload(alert=alert, custom={'remote': True, **data})

        Notification = namedtuple('Notification', ['token', 'payload'])
        notification = [Notification(payload=payload, token=deviceToken)]
        client = APNsClient(credentials=token_credentials, use_sandbox=False)
        client.send_notification_batch(notifications=[notification], topic=APNS_TOPIC)
    
    except Exception as ex:
        logger.error(f'===> Fail to Send notification to device (ios): {deviceToken} -> ', ex)

def sendIosNotificationOld(deviceToken, title, message, questionId):
    timestamp = int(time.time())
    print('deviceToken=', deviceToken)
    JWT_HEADER = subprocess.getoutput(
        '''echo $(printf '{ "alg": "ES256", "kid": "%s" }' "AUTH_KEY_ID" | openssl base64 -e -A | tr -- '+/' '-_' | tr -d =)'''\
            .replace('AUTH_KEY_ID', APNS_AUTH_KEY_ID)
    )

    print('JWT_HEADER=', JWT_HEADER)

    JWT_CLAIMS = subprocess.getoutput(
        '''echo $(printf '{ "iss": "%s", "iat": %d }' "TEAM_ID" "JWT_ISSUE_TIME" | openssl base64 -e -A | tr -- '+/' '-_' | tr -d =)'''\
            .replace('TEAM_ID', APNS_TEAM_ID)\
            .replace('JWT_ISSUE_TIME', str(timestamp))
    )

    print('JWT_CLAIMS=', JWT_CLAIMS)

    JWT_HEADER_CLAIMS=f"{JWT_HEADER}.{JWT_CLAIMS}"

    print('JWT_HEADER_CLAIMS=', JWT_HEADER_CLAIMS)

    JWT_SIGNED_HEADER_CLAIMS = subprocess.getoutput(
        '''echo $(printf "JWT_HEADER_CLAIMS" | openssl dgst -binary -sha256 -sign "TOKEN_KEY_FILE_NAME" | openssl base64 -e -A | tr -- '+/' '-_' | tr -d =)'''\
            .replace('JWT_HEADER_CLAIMS', JWT_HEADER_CLAIMS)\
            .replace('TOKEN_KEY_FILE_NAME', APNS_TOKEN_KEY_FILE_NAME)
    )

    print('JWT_SIGNED_HEADER_CLAIMS=', JWT_SIGNED_HEADER_CLAIMS)

    AUTHENTICATION_TOKEN = f"{JWT_HEADER}.{JWT_CLAIMS}.{JWT_SIGNED_HEADER_CLAIMS}"

    print('AUTHENTICATION_TOKEN=', AUTHENTICATION_TOKEN)

    data = {
        "aps": {
            "alert": {
                "title": title,
                "body": message
            }
        },
        "remote": True,
        "questionId": questionId
    }

    data = json.dumps(data)
    os.system(f'''/opt/curl/bin/curl -v --header "apns-topic: {APNS_TOPIC}" --header "apns-push-type: alert" --header "authorization: bearer {AUTHENTICATION_TOKEN}" --data '{data}' --http2 https://{APNS_HOST_NAME}/3/device/{deviceToken}''')
    #resp = requests.post(url, data = json.dumps(data), headers=headers)
    #print(resp.text)

@shared_task
def sendUserAppNotification(username, title, message, data):
    userLogins = UserLogin.objects.filter(
        user__username=username,
        status=BaseStatus.ACTIVE.name
    )

    for userLogin in userLogins:
        deviceToken = userLogin.deviceToken
        deviceType = userLogin.deviceType
        
        if deviceType == 'android':
            sendAndroidNotification(deviceToken, title, message, data)
        elif deviceType == 'ios':
            sendIosNotification(deviceToken, title, message, data)  