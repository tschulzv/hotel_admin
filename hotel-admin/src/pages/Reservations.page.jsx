import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import {Container, Modal, Button, Form} from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable';
import TableFilterBar from '../components/TableFilterBar';

const Reservations = () => {
  const originalData = [
    {
      id: 1,
      nombre: "María Pérez",
      codigo: "ID12345",
      habitaciones: "101, 102",
      checkIn: "2025-04-10",
      checkOut: "2025-04-15",
      estado: "Confirmada",
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
      estado: "En curso",
    },
    {
      id: 5,
      nombre: "Ana Gómez",
      codigo: "ID11223",
      habitaciones: "210",
      checkIn: "2025-04-10",
      checkOut: "2025-04-12",
      estado: "A confirmar",
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
      estado: "Confirmada",
    },
    {
      id: 8,
      nombre: "Diego Torres",
      codigo: "ID77889",
      habitaciones: "303, 304",
      checkIn: "2025-04-15",
      checkOut: "2025-04-18",
      estado: "A confirmar",
    },
    {
      id: 9,
      nombre: "Carmen Ramírez",
      codigo: "ID99001",
      habitaciones: "103",
      checkIn: "2025-04-13",
      checkOut: "2025-04-16",
      estado: "En curso",
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
      estado: "A confirmar",
    },
    {
      id: 13,
      nombre: "Fernando Ruiz",
      codigo: "ID88990",
      habitaciones: "503",
      checkIn: "2025-04-11",
      checkOut: "2025-04-17",
      estado: "Confirmada",
    },
    {
      id: 14,
      nombre: "Isabel Morales",
      codigo: "ID00112",
      habitaciones: "306",
      checkIn: "2025-04-16",
      checkOut: "2025-04-20",
      estado: "A confirmar",
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
      estado: "Confirmada",
    },
    {
      id: 17,
      nombre: "Gabriel Ortega",
      codigo: "ID44567",
      habitaciones: "407",
      checkIn: "2025-04-14",
      checkOut: "2025-04-16",
      estado: "Confirmada",
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
      estado: "A confirmar",
    }]  

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fechaSeleccionada = queryParams.get('fecha'); 
  const [searchTerm, setSearchTerm] = useState();
  const [sortKey, setSort] = useState(["id"]);
  const [filteredData, setFilteredData] = useState(originalData);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [show, setShow] = useState(false); // mostrar o no el modal
  const [razon, setRazon] = useState('true');
  
  // array de acciones para la tabla
  const actions = [
        {
            icon: <i className="material-icons">visibility</i>, // o el nombre del ícono
            label: "Ver",
            onClick: () => {
              navigate('/reservations/1');
            }, // acción a ejecutar
        },
        {
            icon: <i className="material-icons">edit</i>, // o el nombre del ícono
            label: "Editar",
            onClick: () => {
              navigate('/reservations/edit/1',);
            }, // acción a ejecutar
        },
        {
            icon: <i className="material-icons">cancel</i>, 
            label: "Cancelar",
            onClick: (item) => {
              setFilaSeleccionada(item);
              setRazon('');
              setShow(true);
            }
        },

    ]

       
        
        useEffect(() => {
            // Filtrar los datos originales según la fecha seleccionada y estado de reserva
            if (fechaSeleccionada) {
              const reservasFiltradas = originalData.filter((reserva) =>
                reserva.checkIn <= fechaSeleccionada && 
                reserva.checkOut >= fechaSeleccionada &&
                reserva.estado !== 'Cancelada' &&
                reserva.estado !== 'Finalizada'
              );
              setFilteredData(reservasFiltradas);
            } else {
              // Si no hay fecha seleccionada, mostramos todos los datos originales
              setFilteredData(originalData);
            }
          }, [fechaSeleccionada]);

    
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

     // funcion para manejar el cierre del modal
  const handleClose = () => setShow(false);
  
  const handleEliminar = () => {
    let updatedData = filteredData.map(reserv => 
      reserv.id === filaSeleccionada.id ? {...reserv, estado: 'Cancelado'} : reserv
    );
    setFilteredData(updatedData);
   
    // llamado a API ]!!!!
    setShow(false);
  };

     // sort options
  const sortOptions = [
    { value: 'id', label: 'ID' },
    { value: 'nombre', label: 'Nombre' },
    { value: 'codigo', label: 'Código' },
    { value: 'habitaciones', label: 'Habitación(es)' },
    { value: 'checkIn', label: 'Check-In'},
    { value: 'checkOut', label: 'Check-Out'},
  ];
  
  //  ordenar los datos
  let sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
  
    // Si ambos son números válidos
    if (!isNaN(aVal) && !isNaN(bVal)) {
      return Number(aVal) - Number(bVal);
    }
  
    // Si ambos son fechas válidas
    if (!isNaN(Date.parse(aVal)) && !isNaN(Date.parse(bVal))) {
      return new Date(aVal) - new Date(bVal);
    }
  
    // Comparar como strings por defecto
    const aStr = aVal?.toString().toLowerCase() || "";
    const bStr = bVal?.toString().toLowerCase() || "";
    return aStr.localeCompare(bStr);
  });
  
  
  // formatear la fecha
  const obtenerFormatoFecha = (fechaStr) => {
    const [anio, mes, dia] = fechaStr.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia);

    const opcionesDia = { weekday: 'long' };
    const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' };
  
    const diaSemana = fecha.toLocaleDateString('es-ES', opcionesDia);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
  
    return {
      diaSemana: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1),
      fechaFormateada,
    };
  };   



  return (
    <Container className="px-5" fluid>
         <h1>Reservas</h1>
         {/*Subtitulo de fecha y dia seleccionados */}
         {fechaSeleccionada && (
          <div className="mb-3">
            <h5 className="text-muted">
              Día: {obtenerFormatoFecha(fechaSeleccionada).diaSemana}<br />
              Fecha: {obtenerFormatoFecha(fechaSeleccionada).fechaFormateada}
            </h5>
          </div>
        )}
         <TableFilterBar searchTerm={searchTerm} setSearchTerm = {setSearchTerm} onSearch ={onSearch} clearSearch={clearSearch} sortOptions={sortOptions} sortKey={sortKey} setSort={setSort} showBtn={true} btnText="Crear Reserva" onBtnClick={onBtnClick} />
        <PaginatedTable data={sortedData} rowsPerPage={10} rowActions={actions}/>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filaSeleccionada && (
            <>
              <p> ¿Estás seguro de que deseas cancelar la reserva?</p>
              <p><strong>Cliente:</strong> {filaSeleccionada.nombre} <strong>Habitación(es):</strong> {filaSeleccionada.habitaciones}</p>
              <Form.Group controlId="razonEliminacion">
                <Form.Label>Razón de la cancelación</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={razon}
                  onChange={(e) => setRazon(e.target.value)}
                  placeholder="Escriba la razón aquí..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Volver
          </Button>
          <Button variant="danger" onClick={handleEliminar}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Reservations;