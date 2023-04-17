import React, { useState } from 'react';
import "./Login.scss";
import userIcon from '../src/assets/images/user.svg';
import passIcon from '../src/assets/images/pass.svg';
import { handleLoginApi } from "./services/UserService";
import { useNavigate } from 'react-router-dom';


const Login = (props) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  let navigate = useNavigate();

  const login = async () => {
    let res = await handleLoginApi(username, password);
    if (res.token) {
      localStorage.setItem('mytoken', res.token);
      navigate('/listmovie');
    } else {
      setError("Invalid username or password");
      return;
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="form_login">
          <h2 className="title">
            Login
          </h2>
          <div className="form-group icon-true">
            <img className="icon" src={userIcon} alt="this" />
            <input
              id="username"
              name="username"
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={evt => setUsername(evt.target.value)}
            />
          </div>

          <div id="phone-input-container" className="form-group icon-true">
            <img className="icon" src={passIcon} alt="this" />
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={evt => setPassword(evt.target.value)}
            />
          </div>

          <div className="form-group login">
            <button onClick={login} className="btn btn-success">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;