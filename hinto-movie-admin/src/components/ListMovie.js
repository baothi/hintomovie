import React, { useState } from 'react'
import { useEffect } from 'react'
import Header from './Header'
import { getAllMovie } from '../services/UserService'
import Table from './DataTableMovie'
import './ListMovie.scss'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'

function Listmovie() {
  // let navigate = useNavigate();
  const token = localStorage.getItem('mytoken')
  const [listMovie, setListMovie] = useState([])
  useEffect(() => {
    if (!token) {
      window.location.href = '/'
      return
    }
  }, [token])

  const config = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Token ${token}`
    }
  }

  const getFullMovie = async () => {
    let res = await getAllMovie(config)
    setListMovie(res)
  }

  useEffect(() => {
    getFullMovie()
  }, [])

  return (
    <>
      <Header />
      <br />
      <br />
      <Link to={`/addmovie`}>
        <Button variant="primary">Add Movie </Button>
      </Link>
      <Table data={listMovie} />
    </>
  )
}

export default Listmovie
