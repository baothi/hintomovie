import axios from '../axios'

const handleLoginApi = (username, password) => {
  return axios.post('/account/login/', { username, password })
}

const getAllMovie = (config) => {
  return axios.get(`/movie/stream`, config)
}

const getMovieById = (config, id) => {
  return axios.get(`/movie/stream/${id}`, config)
}

const createMovie = (data, config) => {
  return axios.post(`/movie/stream/`, data, config)
}

const putMovie = (data, config, id) => {
  return axios.put(`/movie/stream/${id}`, data, config)
}

const editWatchlist = (data, config, id) => {
  return axios.put(`/movie/watch-list/${id}`, data, config)
}

const deleteWathlist = (config, id) => {
  return axios.delete(`/movie/watch-list/${id}`, config)
}

// const putMovie = (config, id) => {
//   return axios.get(`movie/stream/${id}`, config)
// }

export {
  handleLoginApi,
  getAllMovie,
  putMovie,
  getMovieById,
  editWatchlist,
  deleteWathlist,
  createMovie
}
