import React from 'react';

const NotFound = () => {
  return (
     <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        color: '#343a40',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.5rem' }}>Página no encontrada :(</p>
    </div>
  );
};

export default NotFound;
