import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://your-web-url/api', // Reemplaza con la URL de tu servidor
  timeout: 10000, // Tiempo máximo para una solicitud (en ms)
});

export default apiClient;
