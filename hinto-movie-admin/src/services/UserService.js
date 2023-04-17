import axios from '../axios';

const handleLoginApi = (username, password) => {
  return axios.post('/account/login/', { username, password })
}

const getAllMovie = () => {
  console.log('================getAllUsers======================================')
  return axios.get(`movie/liststream/`)
}


export {
  handleLoginApi, getAllMovie
}
