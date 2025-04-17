import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import {Container} from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable';
import TableFilterBar from '../components/TableFilterBar';

const Reservations = () => {
    const navigate = useNavigate();
    // array de acciones para la tabla
    const actions = [
        {
            icon: <i className="material-icons">visibility</i>, // o el nombre del ícono
            label: "Ver",
            onClick: (rowData) => alert("ver datos"), // acción a ejecutar
        },
        {
            icon: <i className="material-icons">edit</i>, // o el nombre del ícono
            label: "Editar",
            onClick: (rowData) => alert("editar"), // acción a ejecutar
        },
        {
            icon: <i className="material-icons">delete</i>, // o el nombre del ícono
            label: "Eliminar",
            onClick: (rowData) => alert("borrar!"), // acción a ejecutar
        },

    ]

    const originalData = [
        {
          id: 1,
          nombre: "María Pérez",
          codigo: "ID12345",
          habitaciones: "101, 102",
          checkIn: "2025-04-10",
          checkOut: "2025-04-15",
          estado: "Activa",
        },
        {
          id: 2,
          nombre: "Juan Rodríguez",
          codigo: "ID54321",
          habitaciones: "201",
          checkIn: "2025-04-12",
          checkOut: "2025-04-13",
          estado: "Finalizada",
        },
        {
          id: 3,
          nombre: "Lucía Fernández",
          codigo: "ID67890",
          habitaciones: "305",
          checkIn: "2025-04-09",
          checkOut: "2025-04-11",
          estado: "Cancelada",
        },
        {
          id: 4,
          nombre: "Carlos Méndez",
          codigo: "ID09876",
          habitaciones: "108, 109",
          checkIn: "2025-04-11",
          checkOut: "2025-04-18",
          estado: "Activa",
        },
        {
          id: 5,
          nombre: "Ana Gómez",
          codigo: "ID11223",
          habitaciones: "210",
          checkIn: "2025-04-10",
          checkOut: "2025-04-12",
          estado: "Pendiente",
        },
        {
          id: 6,
          nombre: "Pedro Sánchez",
          codigo: "ID33445",
          habitaciones: "401",
          checkIn: "2025-04-08",
          checkOut: "2025-04-10",
          estado: "Finalizada",
        },
        {
          id: 7,
          nombre: "Laura López",
          codigo: "ID55667",
          habitaciones: "502",
          checkIn: "2025-04-14",
          checkOut: "2025-04-20",
          estado: "Activa",
        },
        {
          id: 8,
          nombre: "Diego Torres",
          codigo: "ID77889",
          habitaciones: "303, 304",
          checkIn: "2025-04-15",
          checkOut: "2025-04-18",
          estado: "Pendiente",
        },
        {
          id: 9,
          nombre: "Carmen Ramírez",
          codigo: "ID99001",
          habitaciones: "103",
          checkIn: "2025-04-13",
          checkOut: "2025-04-16",
          estado: "Activa",
        },
        {
          id: 10,
          nombre: "Sofía Herrera",
          codigo: "ID22233",
          habitaciones: "404",
          checkIn: "2025-04-07",
          checkOut: "2025-04-09",
          estado: "Cancelada",
        },
        {
          id: 11,
          nombre: "Miguel Díaz",
          codigo: "ID44556",
          habitaciones: "207",
          checkIn: "2025-04-09",
          checkOut: "2025-04-13",
          estado: "Finalizada",
        },
        {
          id: 12,
          nombre: "Valeria Castro",
          codigo: "ID66778",
          habitaciones: "308",
          checkIn: "2025-04-12",
          checkOut: "2025-04-14",
          estado: "Pendiente",
        },
        {
          id: 13,
          nombre: "Fernando Ruiz",
          codigo: "ID88990",
          habitaciones: "503",
          checkIn: "2025-04-11",
          checkOut: "2025-04-17",
          estado: "Activa",
        },
        {
          id: 14,
          nombre: "Isabel Morales",
          codigo: "ID00112",
          habitaciones: "306",
          checkIn: "2025-04-16",
          checkOut: "2025-04-20",
          estado: "Pendiente",
        },
        {
          id: 15,
          nombre: "Ricardo Peña",
          codigo: "ID22334",
          habitaciones: "110, 111",
          checkIn: "2025-04-10",
          checkOut: "2025-04-13",
          estado: "Cancelada",
        },
        {
          id: 16,
          nombre: "Alejandra Núñez",
          codigo: "ID33456",
          habitaciones: "209",
          checkIn: "2025-04-13",
          checkOut: "2025-04-14",
          estado: "Activa",
        },
        {
          id: 17,
          nombre: "Gabriel Ortega",
          codigo: "ID44567",
          habitaciones: "407",
          checkIn: "2025-04-14",
          checkOut: "2025-04-16",
          estado: "Activa",
        },
        {
          id: 18,
          nombre: "Patricia Reyes",
          codigo: "ID55678",
          habitaciones: "309",
          checkIn: "2025-04-12",
          checkOut: "2025-04-13",
          estado: "Cancelada",
        },
        {
          id: 19,
          nombre: "Tomás Silva",
          codigo: "ID66789",
          habitaciones: "202",
          checkIn: "2025-04-11",
          checkOut: "2025-04-12",
          estado: "Finalizada",
        },
        {
          id: 20,
          nombre: "Claudia Ríos",
          codigo: "ID77890",
          habitaciones: "206, 207",
          checkIn: "2025-04-15",
          checkOut: "2025-04-17",
          estado: "Pendiente",
        }]      
    const [searchTerm, setSearchTerm] = useState();
    const [sortKey, setSort] = useState(["nombre"]);
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
    { value: 'nombre', label: 'Nombre' },
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
         <h1>Reservas</h1>
         <TableFilterBar searchTerm={searchTerm} setSearchTerm = {setSearchTerm} onSearch ={onSearch} clearSearch={clearSearch} sortOptions={sortOptions} sortKey={sortKey} setSort={setSort} btnText="Crear Reserva" onBtnClick={onBtnClick} />
        <PaginatedTable data={sortedData} rowsPerPage={10} rowActions={actions}/>
    </Container>
  )
}

export default Reservations;