import React, {useState, useEffect} from 'react'
import {Container, Button, Modal, Spinner} from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable';
import { useNavigate } from 'react-router-dom';
import TableFilterBar from '../components/TableFilterBar';
import axios from '../config/axiosConfig';
import { format, parseISO, isValid } from 'date-fns';

const Clients = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState();
  const [sortKey, setSort] = useState("creacion");
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [show, setShow] = useState(false); // mostrar o no el modal
  const [sortOrder, setSortOrder] = useState("desc");
  const headers = [{ key: "id", label: "ID" }, { key: "nombre", label: "Nombre" }, { key: "email", label: "Email" }, { key: "telefono", label: "Teléfono" }, 
    { key: "numDocumento", label: "Documento" }, { key: "tipoDocumento", label: "Tipo" }, { key: "nacionalidad", label: "País" }]
  
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
          const response = await axios.get(`/Clientes`);
          const limpio = response.data.map(({ id, nombre, apellido, email, telefono, numDocumento, tipoDocumento, nacionalidad, creacion }) => {
            const parsedCreacion = parseISO(creacion);
            return {
              id: id,
              nombre: nombre, 
              email: email,
              telefono: telefono,
              numDocumento: numDocumento, 
              tipoDocumento: tipoDocumento,
              nacionalidad: nacionalidad,
              creacion: isValid(parsedCreacion) ? format(parsedCreacion, 'dd/MM/yyyy') : ''
            };
          });
          setOriginalData(limpio);
          setFilteredData(limpio);
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
    { value: 'creacion', label: 'Fecha de Creación' },
  ];
  

   //  ordenar los datos
  let sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    
    let result = 0;

    if (!isNaN(Date.parse(aVal)) && !isNaN(Date.parse(bVal))) {
      result = new Date(aVal).getTime() - new Date(bVal).getTime();
    } else if (!isNaN(aVal) && !isNaN(bVal)) {
      console.log("ORDENANDO POR NUM")
      result = Number(aVal) - Number(bVal);
    } else {
      //console.log("ORDENANDO POR STRING")
      const aStr = aVal?.toString().toLowerCase() || "";
      const bStr = bVal?.toString().toLowerCase() || "";
      result = aStr.localeCompare(bStr);
    }

    return sortOrder === 'asc' ? result : -result;
  });
  
  return (
    <Container className="px-5" fluid>
         <h1>Clientes</h1>
         <TableFilterBar searchTerm={searchTerm} setSearchTerm = {setSearchTerm} onSearch ={onSearch} clearSearch={clearSearch} sortOptions={sortOptions} sortKey={sortKey} setSort={setSort} showBtn={true} btnText="Crear Cliente" onBtnClick={onBtnClick} sortOrder={sortOrder} setSortOrder={setSortOrder}/>
         {
           loading ? <div className="text-center my-5">
                      <Spinner animation="border" variant="primary" />
                    </div>
           : <PaginatedTable headers={headers} data={sortedData} rowsPerPage={10} rowActions={actions}/>
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
