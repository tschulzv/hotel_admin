import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../img/whitetextLogo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../config/axiosConfig';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const [unreadCount, setUnreadCount] = useState(0);

  const navItems = [
    { href: '/home', label: 'Panel de Control', icon: 'dashboard' },
    { href: '/checkin', label: 'Check-In', icon: 'login' },
    { href: '/checkout', label: 'Check-Out', icon: 'logout' },
    { href: '/notifications', label: 'Notificaciones', icon: 'notifications' },
    { href: '/rooms', label: 'Habitaciones', icon: 'hotel' },
    { href: '/reservations', label: 'Reservas', icon: 'event' },
    { href: '/clients', label: 'Clientes', icon: 'people' },
    { href: '/calendar', label: 'Calendario', icon: 'calendar_today' },
    { href: '/reports', label: 'Reportes', icon: 'bar_chart' },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
         const response = await axios.get('/Solicitudes/unread');
         setUnreadCount(response.data.unreadCount || 0);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      }
    };

    fetchNotifications(); // Ejecutar al montar

    const intervalId = setInterval(fetchNotifications, 30000); // Cada 30 segundos

    return () => clearInterval(intervalId); // Limpiar al desmontar
  }, []);

  const logout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container className="min-vh-100 h-100">
        <Nav className="ms-auto d-flex flex-column">
          <Navbar.Brand href="/"><img src={logo} height="150" alt="Logo" /></Navbar.Brand>

         {navItems.map(({ href, label, icon }) => (
            <Nav.Link
              key={href}
              href={href}
              className={`d-flex align-items-center justify-content-between ${isActive(href) ? 'text-white rounded px-2 my-1 bg-secondary' : 'px-2 my-1'}`}
            >
              <div className="d-flex align-items-center gap-2">
                <span className="material-icons">{icon}</span>
                <span>{label}</span>
              </div>

              {href === '/notifications' && unreadCount > 0 && (
              <span
                className="rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  backgroundColor: '#ed4c4c', 
                  color: '#ffffff', 
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginLeft: '8px',
                  userSelect: 'none',
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            </Nav.Link>

          ))}

          <Nav.Link className={`d-flex align-items-center justify-content-between border-top mt-2 pt-2`}
            onClick={logout}>
              <div className="d-flex align-items-center gap-2">
                <span className="material-icons">exit_to_app</span>
                <span>Cerrar sesión</span>
              </div>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navigation;
