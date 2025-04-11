import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../img/whitetextLogo.png';

function Navigation() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="bg-body-primary">
    <Container className="min-vh-100">
        <Nav className="ms-auto d-flex flex-column">
          <Navbar.Brand href="/"><img src={logo} height="150"></img></Navbar.Brand>
          <Nav.Link href="/">Panel de Control</Nav.Link>
          <Nav.Link href="/checkin">Check-In</Nav.Link>
          <Nav.Link href="/checkout">Check-Out</Nav.Link>
          <Nav.Link href="/notifications">Notificaciones</Nav.Link>
          <Nav.Link href="/rooms">Habitaciones</Nav.Link>
          <Nav.Link href="/booking">Reservas</Nav.Link>
          <Nav.Link href="/clients">Clientes</Nav.Link>
          <Nav.Link href="/reports">Reportes</Nav.Link>
        </Nav>
    </Container>
  </Navbar>
  );
}

export default Navigation;