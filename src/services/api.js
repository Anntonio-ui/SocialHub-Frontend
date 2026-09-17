import axios from 'axios'

const api = axios.create({
  baseURL: 'https://socialhub-backend-mzol.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

export default api