import axios from '../axios';

const handleLoginApi = (username, password) => {
  return axios.post('/account/login/', { username, password })
}

const getAllMovie = (config) => {
  return axios.get(`movie/stream/`, config)
}

const putMovie = (data, config, id) => {
  return axios.put(`movie/stream/${id}`, data, config)
}


export {
  handleLoginApi, getAllMovie,
  putMovie
}
