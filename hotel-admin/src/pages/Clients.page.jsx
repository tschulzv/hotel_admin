import React, {useState, useEffect} from 'react'
import {Container, Button, Modal} from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable';
import { useNavigate } from 'react-router-dom';
import TableFilterBar from '../components/TableFilterBar';

const Clients = () => {
  const originalData = [
    {
      id: 1,
        nombre: "Ana Martínez",
        documento: "4567890",
        telefono: "+595 21 123 4567",
        email: "ana.martinez@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 2,
        nombre: "Carlos López",
        documento: "9876543",
        telefono: "+595 21 234 5678",
        email: "carlos.lopez@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 3,
        nombre: "Lucía González",
        documento: "3456789",
        telefono: "+595 981 112 233",
        email: "lucia.gonzalez@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 4,
        nombre: "Pedro Fernández",
        documento: "8765432",
        telefono: "+595 983 221 334",
        email: "pedro.fernandez@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 5,
        nombre: "Marta Rivas",
        documento: "1234567",
        telefono: "+595 982 334 455",
        email: "marta.rivas@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 6,
        nombre: "Jorge Salinas",
        documento: "7654321",
        telefono: "+595 985 445 566",
        email: "jorge.salinas@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 7,
        nombre: "Elena Duarte",
        documento: "6543210",
        telefono: "+595 981 556 677",
        email: "elena.duarte@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 8,
        nombre: "Miguel Vera",
        documento: "2345678",
        telefono: "+595 986 667 788",
        email: "miguel.vera@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 9,
        nombre: "Laura Aguilar",
        documento: "5432109",
        telefono: "+595 971 778 899",
        email: "laura.aguilar@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 10,
        nombre: "José Cáceres",
        documento: "1122334",
        telefono: "+595 973 889 900",
        email: "jose.caceres@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 11,
        nombre: "Sandra Benítez",
        documento: "4433221",
        telefono: "+595 991 112 345",
        email: "sandra.benitez@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 12,
        nombre: "Oscar Ayala",
        documento: "5566778",
        telefono: "+595 995 223 456",
        email: "oscar.ayala@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 13,
        nombre: "Cecilia Giménez",
        documento: "9988776",
        telefono: "+595 972 334 567",
        email: "cecilia.gimenez@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 14,
        nombre: "Hugo Rojas",
        documento: "3344556",
        telefono: "+595 974 445 678",
        email: "hugo.rojas@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 15,
        nombre: "Pamela Ortiz",
        documento: "7766554",
        telefono: "+595 992 556 789",
        email: "pamela.ortiz@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 16,
        nombre: "Rodrigo Báez",
        documento: "2211333",
        telefono: "+595 996 667 890",
        email: "rodrigo.baez@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 17,
        nombre: "Verónica Acosta",
        documento: "6655443",
        telefono: "+595 984 778 901",
        email: "veronica.acosta@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 18,
        nombre: "Gustavo Franco",
        documento: "1234432",
        telefono: "+595 993 889 012",
        email: "gustavo.franco@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 19,
        nombre: "Lorena Meza",
        documento: "3322110",
        telefono: "+595 980 990 123",
        email: "lorena.meza@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 20,
        nombre: "Marcos Insfrán",
        documento: "4455667",
        telefono: "+595 994 101 234",
        email: "marcos.insfran@example.com",
        nacionalidad: "Paraguaya"
      },
      {
        id: 21,
        nombre: "Julieta Gómez",
        documento: "11223344",
        telefono: "+34 912 345 678", // España
        email: "julieta.gomez@example.com",
        nacionalidad: "Española"
      },
      {
        id: 22,
        nombre: "Tomás Rodríguez",
        documento: "22334455",
        telefono: "+55 11 98765 4321", // Brasil
        email: "tomas.rodriguez@example.com",
        nacionalidad: "Brasileña"
      },
      {
        id: 23,
        nombre: "Sofía Pérez",
        documento: "33445566",
        telefono: "+54 9 11 2345 6789", // Argentina
        email: "sofia.perez@example.com",
        nacionalidad: "Argentina"
      },
      {
        id: 24,
        nombre: "Gabriel Sánchez",
        documento: "44556677",
        telefono: "+1 202-555-0180", // Estados Unidos
        email: "gabriel.sanchez@example.com",
        nacionalidad: "Estadounidense"
      }
    ];
  const [searchTerm, setSearchTerm] = useState();
  const [sortKey, setSort] = useState(["nombre"]);
  const [filteredData, setFilteredData] = useState(originalData);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [show, setShow] = useState(false); // mostrar o no el modal

  const navigate = useNavigate();

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
  
  const handleEliminar = () => {
    let updatedData = filteredData.filter(client => client.id !== filaSeleccionada.id);
    setFilteredData(updatedData);
    // llamado a API ]!!!!
    setShow(false);
  };
  
  // array de acciones para la tabla
  const actions = [
        {
            icon: <i className="material-icons">visibility</i>, 
            label: "Ver",
            onClick: (rowData) => alert("ver datos"), 
        },
        {
            icon: <i className="material-icons">edit</i>, // o el nombre del ícono
            label: "Editar",
            onClick: (item, i) => {
              // CAMBIAR CUANDO FUNCIONE LA API!!!!
              navigate("/clients/edit/1");
              /*let updatedData = filteredData.map(client => 
                client.id === updatedItem.id ? updatedItem : client
              );
              setFilteredData(updatedData);*/
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
    { value: 'nombre', label: 'Nombre' },
    { value: 'documento', label: 'Documento' },
    { value: 'email', label: 'Email' },
    { value: 'telefono', label: 'Teléfono' },
  ];
  
  //  ordenar los datos
  let sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortKey]?.toString().toLowerCase();
    const bVal = b[sortKey]?.toString().toLowerCase();
    return aVal.localeCompare(bVal);
  });
  
  return (
    <Container className="px-5" fluid>
         <h1>Clientes</h1>
         <TableFilterBar searchTerm={searchTerm} setSearchTerm = {setSearchTerm} onSearch ={onSearch} clearSearch={clearSearch} sortOptions={sortOptions} sortKey={sortKey} setSort={setSort} btnText="Nuevo Cliente" onBtnClick={onBtnClick} />
         <PaginatedTable data={sortedData} rowsPerPage={10} rowActions={actions}/>
         
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