import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../img/whitetextLogo.png';
import { useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { href: '/home', label: 'Panel de Control', icon: 'dashboard' },
    { href: '/checkin', label: 'Check-In', icon: 'login' },
    { href: '/checkout', label: 'Check-Out', icon: 'logout' },
    { href: '/notifications', label: 'Notificaciones', icon: 'notifications' },
    { href: '/rooms', label: 'Habitaciones', icon: 'hotel' },
    { href: '/reservations', label: 'Reservas', icon: 'event' },
    { href: '/clients', label: 'Clientes', icon: 'people' },
    { href: '/reports', label: 'Reportes', icon: 'bar_chart' },
  ];

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container className="min-vh-100 h-100">
        <Nav className="ms-auto d-flex flex-column">
          <Navbar.Brand href="/"><img src={logo} height="150" alt="Logo" /></Navbar.Brand>

          {navItems.map(({ href, label, icon }) => (
            <Nav.Link
              key={href}
              href={href}
              className={`d-flex align-items-center gap-2 ${isActive(href) ? 'text-white rounded px-2 my-1 bg-secondary' : 'px-2 my-1'}`}
            >
              <span className="material-icons">{icon}</span>
              {label}
            </Nav.Link>
          ))}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navigation;
