import React from "react";
import logo from "../img/blacktextLogo.png";
import { Button } from "react-bootstrap";
import { Container } from "react-bootstrap";

const LoginPage = () => {
  // Datos de ejemplo para el inicio de sesión. CAMBIAR LUEGO
  const admin = {
    username: "admin",
    password: "admin123",
  };

  const [error, setError] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === admin.username && password === admin.password) {
      window.location.href = "/home";
    } else {
      setError("El usuario o la contraseña es incorrecta");
    }
  };

  return (
    <Container fluid className="py-5 container-style">
      <form className="box-style bg-primary-light" onSubmit={handleSubmit}>
        <img
          style={{ display: "block", margin: "0 auto 20px" }}
          src={logo}
          height="200"
          alt="Logo"
        />
        <input
          type="text"
          name="username"
          placeholder="nombre"
          className="input-style bg-primary-light" 
          required
        />
        <input
          type="password"
          name="password"
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
          INGRESAR
        </Button>
      </form>
    </Container>
  );
};

export default LoginPage;
