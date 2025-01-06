import axios from "axios";
import { error } from "console";
import { config } from "process";

//Configuracion de la base de axios
const api = axios.create({
    baseURL: 'http://localhost:5000',
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    }, 
    (error) => {
        return Promise.reject(error);
    }
);

export default api;