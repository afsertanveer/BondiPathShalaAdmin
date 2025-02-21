import axios from 'axios';

export default axios.create({
  // baseURL: 'https://api.bpexam.live/',
  baseURL: 'http://localhost:5011/',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
