import React from 'react'
import {Container} from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable';

const Reservations = () => {
    const dummyData = Array.from({ length: 30 }, (_, i) => ({
        name: `Usuario ${i + 1}`,
        email: `usuario${i + 1}@mail.com`,
      }));
      
  return (
    <Container className="px-5" fluid>
        <PaginatedTable data={dummyData} rowsPerPage={10}/>
    </Container>
  )
}

export default Reservations;