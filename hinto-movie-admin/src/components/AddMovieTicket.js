import React, { useMemo, useState } from "react";
import { useEffect } from 'react';
import Header from './Header';
import Container from 'react-bootstrap/Container';
import "./AddMovieTicket.scss";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";



const AddMovieTicket = () => {
  const token = localStorage.getItem('mytoken');
  const [file, setFile] = useState();
  const [startDate, setStartDate] = useState(new Date());

  const [closeDate, setCloseDate] = useState(new Date());

  useEffect(() => {
    if (!token) {
      window.location.href = '/';
      return;
    }
  }, [token])

  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }



  console.log("Loading : ", startDate)
  return (
    <div>
      <Header />
      <br /><br />
      <div className="container mt-5 movie-ticket">
        <div className="mb-3">
          <h2>Add Image:</h2>
          <img src={file} />
          <input type="file" onChange={handleChange} />
          <button onClick="" className="btn btn-success">Create Movie</button>
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
            selected={startDate}
            onChange={(date) => setCloseDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>
        <div className="mb-3"></div>
      </div>
    </div>
  );
};

export default AddMovieTicket;