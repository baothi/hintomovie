import React, { useMemo, useState } from 'react'
import { useEffect } from 'react'
import Header from './Header'
import Container from 'react-bootstrap/Container'
import './AddMovieTicket.scss'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'
import TableTicket from './DataTicketMovie'
import { createMovie } from '../services/UserService'

const AddMovieTicket = () => {
  const token = localStorage.getItem('mytoken')
  const [file, setFile] = useState()
  const [startDate, setStartDate] = useState(new Date())
  const [closeDate, setCloseDate] = useState(new Date())
  const [movieTitle, setMovieTitle] = useState('')
  const [movieSummary, setMovieSummary] = useState('')

  const [ticketInfo, setTicketInfo] = useState({
    id: '',
    date_picker: '',
    time_show_date: '',
    price: '',
    website: ''
  })
  const [ticketInfoList, setTicketInfoList] = useState([])

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: `Token ${token}`
    }
  }

  useEffect(() => {
    if (!token) {
      window.location.href = '/'
      return
    }
  }, [token])

  function handleChange(e) {
    setFile(e.target.files[0])
  }

  const handleChangeInput = (setValue) => {
    return (e) => {
      setValue(e.target.value)
    }
  }

  const handleAddTicketInfo = () => {
    setTicketInfoList([
      ...ticketInfoList,
      {
        ...ticketInfo,
        id: new Date().getTime(),
        date_picker: moment(ticketInfo.date_picker).format('YYYY-MM-DD'),
        time_show_date: ticketInfo.time_show_date
          .toLocaleTimeString()
          .slice(0, -3)
      }
    ])
    setTicketInfo({})
  }

  const onEditTicketInfo = (data) => {
    setTicketInfo({
      ...data,
      date_picker: new Date(data.date_picker),
      time_show_date: new Date(`${data.date_picker} ${data.time_show_date}`)
    })
  }
  const onDeleteTicketInfo = (data) => {
    const ticketInfoListFilter = ticketInfoList.filter(
      (tk) => tk.id !== data.id
    )
    setTicketInfoList(ticketInfoListFilter)
  }

  const handleCreateMovie = async () => {
    ticketInfoList.forEach((tk) => delete tk.id)
    const data = {
      title: movieTitle,
      description: movieSummary,
      image: file,
      show_date: moment(startDate).format('YYYY-MM-DD'),
      time_show_date: startDate.toLocaleTimeString().slice(0, -3),
      close_date: moment(closeDate).format('YYYY-MM-DD'),
      time_close_date: closeDate.toLocaleTimeString().slice(0, -3),
      watchlist: ticketInfoList
    }
    await createMovie(data, config)
  }

  return (
    <div>
      <Header />
      <br />
      <br />
      <div className="container mt-5 movie-ticket">
        <div className="mb-3">
          <h2>Add Image</h2>
          <img src={file ? URL.createObjectURL(file) : ''} />
          <input type="file" onChange={handleChange} />
          <button onClick={handleCreateMovie} className="btn btn-success">
            Create Movie
          </button>
        </div>
        <div className="mb-3">
          <h2>Show Date</h2>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>
        <div className="mb-3">
          <h2>Close Date</h2>
          <DatePicker
            selected={closeDate}
            onChange={(date) => setCloseDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>

        <div className="mb-3">
          <h2>Movie Title</h2>
          <input
            value={movieTitle}
            onChange={handleChangeInput(setMovieTitle)}
          />
        </div>

        <div className="mb-3">
          <h2>Summary</h2>
          <textarea
            value={movieSummary}
            rows={3}
            onChange={handleChangeInput(setMovieSummary)}
          />
        </div>
        <div className="mb-3"></div>
        <hr />
        <div className="d-flex justify-content-center">
          <h3>Ticket Information</h3>
          <div>
            <button
              onClick={handleAddTicketInfo}
              className="btn btn-success mx-2"
            >
              Save
            </button>
            <button
              onClick={() =>
                setTicketInfo({
                  id: '',
                  date_picker: '',
                  time_show_date: '',
                  price: '',
                  website: ''
                })
              }
              className="btn btn-danger"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mb-3">
          <h2>Date picker</h2>
          <DatePicker
            selected={ticketInfo.date_picker}
            onChange={(date) => {
              setTicketInfo({
                ...ticketInfo,
                date_picker: date
              })
            }}
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy"
            className="text-center"
          />
        </div>

        <div className="mb-3">
          <h2>Time</h2>
          <DatePicker
            selected={ticketInfo.time_show_date}
            onChange={(date) => {
              setTicketInfo({
                ...ticketInfo,
                time_show_date: date
              })
            }}
            showTimeSelect
            showTimeSelectOnly
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="hh:mm aa"
            className="text-center"
            popperPlacement="bottom-end"
          />
        </div>

        <div className="mb-3">
          <h2>Price</h2>
          <input
            onChange={(e) => {
              setTicketInfo({
                ...ticketInfo,
                price: Number(e.target.value)
              })
            }}
            name="price"
            className="text-center"
            autoComplete="off"
            value={ticketInfo?.price || ''}
          />
        </div>

        <div className="mb-3">
          <h2>Link to ticket</h2>
          <input
            onChange={(e) => {
              setTicketInfo({
                ...ticketInfo,
                website: e.target.value
              })
            }}
            name="website"
            className="text-center"
            autoComplete="off"
            value={ticketInfo?.website || ''}
          />
        </div>
        <div className="mb-3"></div>
        <TableTicket
          onEditTicketInfo={onEditTicketInfo}
          onDeleteTicketInfo={onDeleteTicketInfo}
          ticketInfoList={ticketInfoList}
        />
      </div>
    </div>
  )
}

export default AddMovieTicket
