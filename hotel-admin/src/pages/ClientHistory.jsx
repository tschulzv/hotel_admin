import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {Container, Modal, Button, Form} from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable';
import TableFilterBar from '../components/TableFilterBar';
import axios from '../config/axiosConfig';
import { format, parseISO, isValid } from 'date-fns';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';

const Reservations = () => {
    const navigate = useNavigate();
    const [originalData, setOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState();
    const [sortKey, setSort] = useState(["codigo"]);

    const getStatusBadge = (statusId)=>{// devuelve un badge dependiendo del id del estado
    switch (statusId) {
      case 1:
        return <Badge bg="warning">Pendiente</Badge>
      case 2:
        return <Badge bg="success">Confirmada</Badge>
      case 3:
        return <Badge bg="danger">Cancelada</Badge>
      case 4:
        return <Badge bg="primary">Check-In</Badge>
      case 5:
        return <Badge bg="secondary">Check-Out</Badge>
    }
  }
  const headers = [{ key: "id", label: "ID" }, { key: "codigo", label: "Código" }, { key: "numsHabitaciones", label: "Habitación(es)" }, 
    { key: "fechaIngreso", label: "Ingreso" }, { key: "fechaSalida", label: "Salida" }, { key: "llegada", label: "Llegada" }, { key: "estadoId", label: "Estado" },]


    useEffect(() => {
      axios.get(`/Reservas/cliente/${id}`)
      .then(response => {
        console.log(response.data)
        const limpio = response.data.map(({id, codigo, fechaIngreso, fechaSalida, estadoId, detalles, llegadaEstimada}) => {
        const parsedIngreso = parseISO(fechaIngreso);
        const parsedSalida = parseISO(fechaSalida);
        console.log(detalles);
        const numsHabitaciones = detalles ? detalles.map(d => d.numHabitacion).join(', ') : "N/A";
        console.log(numsHabitaciones);
        return {
            id, 
            codigo, 
            numsHabitaciones: numsHabitaciones,
            fechaIngreso: isValid(parsedIngreso) ? format(parsedIngreso, 'dd/MM/yyyy') : '',
            fechaSalida: isValid(parsedSalida) ? format(parsedSalida, 'dd/MM/yyyy') : '',
            llegada: llegadaEstimada?.slice(0, 5) || '',
            estadoId: getStatusBadge(estadoId)
          };
        });
        setOriginalData(limpio);
        setFilteredData(limpio);
        setLoading(false);
         
      })
      .catch(error => console.error("Error obteniendo reservas:", error));
    }, []);

    
    // array de acciones para la tabla
    const actions = [
        {
            icon: <i className="material-icons">visibility</i>, // o el nombre del ícono
            label: "Ver",
            onClick: (rowData) => {
              navigate(`/reservations/${rowData.id}`);
            }
            },
    ]
  
    const onSearch = () => { 
    // filtramos los datos
      setFilteredData(originalData.filter((client) =>
      Object.values(client)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())))
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
        <div className="d-flex align-items-center mb-4">
          <span className="material-icons me-2" role="button" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} title="Volver">
            arrow_back
          </span>
          <h2 className="mb-0" style={{ color: '#2c3e50' }}>Historial del Cliente</h2>
        </div>
         <TableFilterBar searchTerm={searchTerm} setSearchTerm = {setSearchTerm} onSearch ={onSearch} clearSearch={clearSearch} sortOptions={sortOptions} sortKey={sortKey} setSort={setSort} showBtn={false} />
         
        {
        loading ? <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                  </div> : <PaginatedTable headers={headers} data={sortedData} rowsPerPage={10} rowActions={actions}/>
        }

    </Container>
  )
}

export default Reservations;