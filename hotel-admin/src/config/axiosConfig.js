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
  (response) => response, // Si la respuesta es exitosa, devolverla
  (error) => {
    console.log(error);
    if (error.response && error.response.status === 401) {
      // Si el error es 401 (Unauthorized), redirigir al login
      console.error('Token expirado o no válido');
      // Aquí puedes redirigir a la página de login, por ejemplo:
      //window.location.href = '/'; // Usar React Router si lo tienes
    }

    return Promise.reject(error); // Si es otro tipo de error, rechazarlo
  }
);

export default axiosInstance;