import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-custom-api.com', // Cambiar si usas APIs externas
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores (opcional)
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;
