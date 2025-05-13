import React, {useState, useEffect} from 'react'
import {Container, Button, Modal} from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable';
import { useNavigate } from 'react-router-dom';
import TableFilterBar from '../components/TableFilterBar';
import axios from '../config/axiosConfig';

const Clients = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState();
  const [sortKey, setSort] = useState(["id"]);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [show, setShow] = useState(false); // mostrar o no el modal

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
          const response = await axios.get(`/Clientes`);
          console.log(response.data);
          setOriginalData(response.data);
          setFilteredData(response.data);
          setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    })();
  }, []);

  const onSearch = () => { 
    // filtramos los datos
    setFilteredData(originalData.filter((client) =>
    Object.values(client)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())))
  }

  const onBtnClick = () => {
    navigate('/clients/new')
  }

  // revierte los datos filtrados en la busqueda a los originales
  const clearSearch = () => {
    setFilteredData(originalData);
  }

  // funcion para manejar el cierre del modal
  const handleClose = () => setShow(false);
  
  const handleEliminar = async () => {
    try {
      await axios.delete(`/Clientes/${filaSeleccionada.id}`);
      let updatedData = filteredData.filter(client => client.id !== filaSeleccionada.id);
      setFilteredData(updatedData);
      setShow(false);
    } catch (error) {
      console.error('Error al intentar eliminar el cliente:', error);
    }
  }
  
  const columnasAmostrar = ["nombre", "apellido", "email", "telefono", "nacionalidad"] // COLUMNAS A MOSTRAR AL RENDERIZAR LA TABLA]

  // array de acciones para la tabla
  const actions = [
        {
            icon: <i className="material-icons">visibility</i>, 
            label: "Ver",
            onClick: (item, i) => {
              navigate(`/clients/${item.id}`);
            }, 
        },
        {
            icon: <i className="material-icons">edit</i>, // o el nombre del ícono
            label: "Editar",
            onClick: (item, i) => {
              navigate(`/clients/edit/${item.id}`);
            }
        },
        {
            icon: <i className="material-icons">delete</i>, // o el nombre del ícono
            label: "Eliminar",
            onClick: (item) => {
              setFilaSeleccionada(item);
              setShow(true);
            }
        },

    ]
  
  // sort options
  const sortOptions = [
    { value: 'id', label: 'ID' },
    { value: 'nombre', label: 'Nombre' },
    { value: 'documento', label: 'Documento' },
    { value: 'email', label: 'Email' },
    { value: 'telefono', label: 'Teléfono' },
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
  
  return (
    <Container className="px-5" fluid>
         <h1>Clientes</h1>
         <TableFilterBar searchTerm={searchTerm} setSearchTerm = {setSearchTerm} onSearch ={onSearch} clearSearch={clearSearch} sortOptions={sortOptions} sortKey={sortKey} setSort={setSort} showBtn={true} btnText="Crear Cliente" onBtnClick={onBtnClick} />
         {
           loading ? <h3>Cargando...</h3> : 
           <PaginatedTable 
            data={sortedData} 
            rowsPerPage={10} 
            rowActions={actions}
            columnsToShow={columnasAmostrar} // COLUMNAS A MOSTRAR AL RENDERIZAR LA TABLA
          />
         }
         
         {/* MODAL PARA ELIMINACION*/}
         <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {filaSeleccionada && (
              <>
                <p>
                  ¿Estás seguro que deseas eliminar a <strong>{filaSeleccionada.nombre}</strong>?
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleEliminar}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>

    </Container>
  )
}

export default Clients;