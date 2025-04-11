import React from 'react'
import Navigation from './Navigation'
import {Container} from 'react-bootstrap';
import '../layout.css';
const Layout = ({children}) => {
  return (
    <div className="d-flex min-vh-100">
      <div className="min-vh-100 h-100" style={{ width: "250px"}}>
      <div className="sidebar min-vh-100" style={{ width: "250px", height: "100%"}}>
        <Navigation />
      </div>

      <main className="page-content flex-grow-1 w-100">
        <Container fluid>
          {children}
        </Container>
      </main>
    </div>
  );
}

export default Layout;