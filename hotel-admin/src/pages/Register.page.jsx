import React from "react";
import logo from "../img/blacktextLogo.png";
import { Button, Container, Form } from "react-bootstrap";
import axios from '../config/axiosConfig'; 

const RegisterPage = () => {
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombre = e.target.nombre.value;
    const username = e.target.username.value;
    const contrasenha = e.target.contrasenha.value;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post('/Auth/register', { nombre, username, contrasenha });
      setLoading(false);

      // Si la autenticación es exitosa, guardamos el token JWT
      const token = response.data.token;  
      localStorage.setItem('jwtToken', token); // Almacenar el token en localStorage
      setLoading(false); // Finalizar estado de carga
      // Redirigir a la página principal
      window.location.href = '/home';

    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        setError(error.response.data); // mensaje del backend, ej. "Usuario ya existe."
      } else {
        setError("Error inesperado al registrar el usuario.");
      }
    }
  };



  return (
    <Container fluid className="py-5 container-style">
      <Form className="box-style bg-primary-light" onSubmit={handleSubmit}>
        <img
          style={{ display: "block", margin: "0 auto 20px" }}
          src={logo}
          height="200"
          alt="Logo"
        />
         <Form.Control
          type="text"
          name="nombre"
          placeholder="nombre"
          className="input-style bg-primary-light" 
          required
        />
        <Form.Control
          type="text"
          name="username"
          placeholder="username"
          className="input-style bg-primary-light" 
          required
        />
        <Form.Control
          type="password"
          name="contrasenha"
          placeholder="contraseña"
          className="input-style bg-primary-light"
          required
        />
        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        <Button type="submit" className="button-style bg-primary-light">
          REGISTRARSE
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
