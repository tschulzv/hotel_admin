import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import {Container, Modal, Button, Form} from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable';
import TableFilterBar from '../components/TableFilterBar';

const Reservations = () => {
    const navigate = useNavigate();
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [show, setShow] = useState(false); // mostrar o no el modal
    // array de acciones para la tabla
    const actions = [
        {
            icon: <i className="material-icons">visibility</i>, // o el nombre del ícono
            label: "Ver",
            onClick: (rowData) => alert("ver datos"), // acción a ejecutar
        },
    ]

    const originalData = [
        {
          id: 1,
          codigo: "ID12345",
          habitaciones: "101, 102",
          checkIn: "2025-04-10",
          checkOut: "2025-04-15",
          estado: "Activa",
        },
        {
          id: 2,
          codigo: "ID54321",
          habitaciones: "201",
          checkIn: "2025-04-12",
          checkOut: "2025-04-13",
          estado: "Finalizada",
        },
        {
          id: 3,
          codigo: "ID67890",
          habitaciones: "305",
          checkIn: "2025-04-09",
          checkOut: "2025-04-11",
          estado: "Cancelada",
        },
        {
          id: 4,
          codigo: "ID09876",
          habitaciones: "108, 109",
          checkIn: "2025-04-11",
          checkOut: "2025-04-18",
          estado: "Activa",
        },
        {
          id: 5,
          codigo: "ID11223",
          habitaciones: "210",
          checkIn: "2025-04-10",
          checkOut: "2025-04-12",
          estado: "Pendiente",
        },
        {
          id: 6,
          codigo: "ID33445",
          habitaciones: "401",
          checkIn: "2025-04-08",
          checkOut: "2025-04-10",
          estado: "Finalizada",
        },
        {
          id: 7,
          codigo: "ID55667",
          habitaciones: "502",
          checkIn: "2025-04-14",
          checkOut: "2025-04-20",
          estado: "Activa",
        },
        {
          id: 8,
          codigo: "ID77889",
          habitaciones: "303, 304",
          checkIn: "2025-04-15",
          checkOut: "2025-04-18",
          estado: "Pendiente",
        },
        {
          id: 9,
          codigo: "ID99001",
          habitaciones: "103",
          checkIn: "2025-04-13",
          checkOut: "2025-04-16",
          estado: "Activa",
        },
        {
          id: 10,
          codigo: "ID22233",
          habitaciones: "404",
          checkIn: "2025-04-07",
          checkOut: "2025-04-09",
          estado: "Cancelada",
        },]      
    const [searchTerm, setSearchTerm] = useState();
    const [sortKey, setSort] = useState(["codigo"]);
    const [filteredData, setFilteredData] = useState(originalData);
    const onSearch = () => { 
    // filtramos los datos
      setFilteredData(originalData.filter((client) =>
      Object.values(client)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())))
    }
  
    const onBtnClick = () => {
      navigate('/reservations/new')
    }
  
    // revierte los datos filtrados en la busqueda a los originales
    const clearSearch = () => {
      setFilteredData(originalData);
    }
 

     // sort options
  const sortOptions = [
    { value: 'codigo', label: 'Código' },
    { value: 'habitaciones', label: 'Habitación(es)' },
  ];
  
  //  ordenar los datos
  let sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortKey]?.toString().toLowerCase();
    const bVal = b[sortKey]?.toString().toLowerCase();
    return aVal.localeCompare(bVal);
  });
  
    

  return (
    <Container className="px-5" fluid>
         <h1>Historial del Cliente</h1>
         <TableFilterBar searchTerm={searchTerm} setSearchTerm = {setSearchTerm} onSearch ={onSearch} clearSearch={clearSearch} sortOptions={sortOptions} sortKey={sortKey} setSort={setSort} showBtn={false} />
        <PaginatedTable data={sortedData} rowsPerPage={10} rowActions={actions}/>
    </Container>
  )
}

export default Reservations;