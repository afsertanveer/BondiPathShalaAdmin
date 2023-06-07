import axios from 'axios';

export default axios.create({
  baseURL: "https://api.bpexam.live/",
  responseType: "json",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});