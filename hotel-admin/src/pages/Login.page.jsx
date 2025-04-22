import React from "react";
import logo from "../img/blacktextLogo.png";
import { Button } from "react-bootstrap";
import { SlUser } from "react-icons/sl";


const LoginPage = () => {
  const containerStyle = {
    backgroundColor: "#3E7CB1",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const boxStyle = {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "300px",
  };

  const inputStyle = {
    width: "100%",
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    width: "150px",
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#444444",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    display: "block",
    margin: "0 auto"
  };
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
    <div style={containerStyle}>
      <form style={boxStyle} onSubmit={handleSubmit}>
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
          style={inputStyle}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="contraseña"
          style={inputStyle}
          required
        />
        {error && (
        <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>
          {error}
        </div>
      )}
        <Button type="submit" style={buttonStyle}>
          INGRESAR
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
