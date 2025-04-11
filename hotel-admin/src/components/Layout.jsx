import React from 'react'
import Navigation from './Navigation'
import {Container} from 'react-bootstrap';

const Layout = ({children}) => {
  return (
    <div className="d-flex min-vh-100">
      <div className="min-vh-100 h-100" style={{ width: "250px"}}>
        <Navigation />
      </div>

      <main className="flex-grow-1 w-100">
        <Container fluid>
          {children}
        </Container>
      </main>
    </div>
  );
}

export default Layout;