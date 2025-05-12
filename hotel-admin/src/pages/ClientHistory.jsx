import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {Container, Modal, Button, Form} from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable';
import TableFilterBar from '../components/TableFilterBar';
import axios from '../config/axiosConfig';
import { format } from 'date-fns';

const Reservations = () => {
    const navigate = useNavigate();
    const [originalData, setOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [show, setShow] = useState(false); // mostrar o no el modal
    const [searchTerm, setSearchTerm] = useState();
    const [sortKey, setSort] = useState(["codigo"]);

    useEffect(() => {
      (async () => {
        try {
            const response = await axios.get(`/Reservas/cliente/${id}`);
            // no queremos mostrar los detalles en la tabla
            const limpio = response.data.map(({ detalles, ...reserva }) => ({
              ...reserva,
              fechaIngreso: format(new Date(reserva.fechaIngreso), 'dd/MM/yyyy'),
              fechaSalida: format(new Date(reserva.fechaSalida), 'dd/MM/yyyy'),
            }));
            setOriginalData(limpio);
            setFilteredData(limpio);
            setLoading(false);
        } catch (error) {
          console.error('Error cargando datos:', error);
        }
      })();
    }, []);

    // array de acciones para la tabla
    const actions = [
        {
            icon: <i className="material-icons">visibility</i>, // o el nombre del ícono
            label: "Ver",
            onClick: (rowData) => alert("ver datos"), // acción a ejecutar
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
         { loading ? <h4>Cargando</h4> :
          <PaginatedTable data={sortedData} rowsPerPage={10} rowActions={actions}/>
         }
    </Container>
  )
}

export default Reservations;