import axios from 'axios';

const Api = axios.create({
  baseURL: "https://e-commerce-z64r.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;