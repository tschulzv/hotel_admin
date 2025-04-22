import React from 'react'
import Navigation from './Navigation'
import {Container} from 'react-bootstrap';
import '../layout.css';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = ({children}) => {
  // PARA EL LOGIN
  const location = useLocation();
  const showNavbar = location.pathname !== "/";
  return (
    <div className="d-flex min-vh-100">
      {/* CAMBIE ESTO PARA EL LOGIN*/}
      {showNavbar && (
        <div className="min-vh-100 h-100" style={{ width: "250px" }}>
          <div className="sidebar min-vh-100" style={{ width: "200px", height: "100%" }}>
            <Navigation />
          </div>
        </div>
      )}
      <main className="page-content flex-grow-1 w-100">
        <Container fluid>
          {children}
        </Container>
      </main>
    </div>
  );
}

export default Layout;