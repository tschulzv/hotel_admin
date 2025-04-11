import React from 'react'
import Navigation from './Navbar'
import Footer from './Footer';
import {Container} from 'react-bootstrap';

export const Layout = ({children}) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <main className="flex-grow-1 w-100">
        <Container fluid className='px-3'>{children}</Container>
      </main>
      <Footer />
    </div>
  );
}