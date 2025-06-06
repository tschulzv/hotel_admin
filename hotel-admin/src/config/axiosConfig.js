// src/config/axiosConfig.js
import axios from 'axios';

// Crear una instancia de Axios
const axiosInstance = axios.create({
  //baseURL: 'https://hotelapi20250503141148-f9d9acddg2h7f9ab.centralus-01.azurewebsites.net/api', 
  baseURL: 'https://localhost:7298/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar un interceptor para incluir el token JWT en los headers de todas las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');  // Obtener el token del almacenamiento local

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Incluir el token en los headers
    }

    return config; // Retornar la configuración de la solicitud
  },
  (error) => {
    return Promise.reject(error); // Manejar cualquier error de solicitud
  }
);

// Agregar un interceptor para manejar errores de autenticación (por ejemplo, 401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);

    // Obtener la URL de la solicitud original
    const originalRequest = error.config;

    // Si es un 401 y la URL no es de login, redirige
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest.url.includes('/login') // Ajusta esto según tu endpoint real
    ) {
      console.error('Token expirado o no válido');
      localStorage.removeItem('jwtToken');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;