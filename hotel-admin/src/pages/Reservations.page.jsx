import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Modal, Button, Form } from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable';
import TableFilterBar from '../components/TableFilterBar';
import axios from '../config/axiosConfig';
import Badge from 'react-bootstrap/Badge';
import { format, parseISO, isValid } from 'date-fns';

const Reservations = () => {
  const [originalData, setOriginalData] = useState([])


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
  const [reservas, setReservas] = useState([])

  const getStatusBadge = (statusId)=>{
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
  const headers = [{ key: "id", label: "ID" }, { key: "codigo", label: "Código" }, { key: "nombreCliente", label: "Cliente" }, { key: "numsHabitaciones", label: "Habitación(es)" }, 
    { key: "fechaIngreso", label: "Ingreso" }, { key: "fechaSalida", label: "Salida" }, { key: "llegada", label: "Llegada" }, { key: "estadoId", label: "Estado" },]

  const [selectedDetalleId, setSelectedDetalleId] = useState('');
  useEffect(() => {
    axios.get("Reservas")
      .then(response => {
        console.log(response.data)
        const limpio = response.data.map(({id, codigo, fechaIngreso, fechaSalida, estadoId, detalles, llegadaEstimada, nombreCliente}) => {
        const parsedIngreso = parseISO(fechaIngreso);
        const parsedSalida = parseISO(fechaSalida);
        console.log(detalles);
        const numsHabitaciones = detalles ? detalles.map(d => d.numHabitacion).join(', ') : "N/A";
        console.log(numsHabitaciones);
        return {
            id, 
            codigo, 
            nombreCliente: nombreCliente,
            numsHabitaciones: numsHabitaciones,
            fechaIngreso: isValid(parsedIngreso) ? format(parsedIngreso, 'dd/MM/yyyy') : '',
            fechaSalida: isValid(parsedSalida) ? format(parsedSalida, 'dd/MM/yyyy') : '',
            llegada: llegadaEstimada?.slice(0, 5) || '',
            estadoId: getStatusBadge(estadoId)
          };
        });
        setReservas(limpio);
        setFilteredData(limpio);
        console.log(limpio);
        setOriginalData(limpio); 
        setReservas(response.data);
        setFilteredData(response.data);
        console.log(response.data);
        setOriginalData(response.data);
      })
      .catch(error => console.error("Error obteniendo reservas:", error));
  }, []);

  // array de acciones para la tabla
  const actions = [
    {
      icon: <i className="material-icons">visibility</i>,
      label: "Ver",
      onClick: (rowData) => {
        navigate(`/reservations/${rowData.id}`);
      },
    },
    {
      icon: <i className="material-icons">edit</i>,
      label: "Editar",
      onClick: (rowData) => {
        navigate(`/reservations/edit/${rowData.id}`);
      },
    },
    {
      icon: <i className="material-icons">cancel</i>,
      label: "Cancelar",
      onClick: (rowData) => {
        // Buscar la reserva original (sin formatear) a partir de su id
        const rawReserva = originalData.find(r => r.id === rowData.id);
        setFilaSeleccionada(rawReserva);
        console.log("Reserva seleccionada (raw):", rawReserva);
        setRazon('');
        setShow(true);
      }
    }
  ];

  // Define "detallesArray" solo si "filaSeleccionada" existe; de lo contrario, es un arreglo vacío
let detallesArray = [];
if (filaSeleccionada) {
  if (Array.isArray(filaSeleccionada.detalles)) {
    detallesArray = filaSeleccionada.detalles.filter(det => det.activo !== false);
  } else if (typeof filaSeleccionada.detalles === 'string') {
    // Suponiendo el formato "Habitación: 4" para transformar en un arreglo con un solo elemento
    detallesArray = [{
      id: filaSeleccionada.id,
      habitacion: {
        numeroHabitacion: filaSeleccionada.detalles.replace("Habitación:", "").trim(),
        tipoHabitacionNombre: ""
      },
      habitacionId: filaSeleccionada.detalles.replace("Habitación:", "").trim(),
      activo: true
    }];
  }
}

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
    if (!selectedDetalleId) {
      alert("Seleccione una habitación a cancelar");
      return;
    }

    const payload = {
      detalleReservaId: parseInt(selectedDetalleId),
      motivo: razon,
      activo: true
    };

    axios.post("/Cancelacions", payload)
      .then(response => {
        // Convertir filaSeleccionada.detalles a arreglo, en caso de ser string
        let currentDetalles = [];
        if (filaSeleccionada) {
          if (Array.isArray(filaSeleccionada.detalles)) {
            currentDetalles = filaSeleccionada.detalles;
          } else if (typeof filaSeleccionada.detalles === 'string') {
            // Suponiendo el formato "Habitación: 4"
            currentDetalles = [{
              id: filaSeleccionada.id,
              habitacion: {
                numeroHabitacion: filaSeleccionada.detalles.replace("Habitación:", "").trim(),
                tipoHabitacionNombre: ""
              },
              habitacionId: filaSeleccionada.detalles.replace("Habitación:", "").trim(),
              activo: true
            }];
          }
        }

        const updatedDetalles = currentDetalles.filter(
          (detalle) => detalle.id !== parseInt(selectedDetalleId)
        );
        
        const updatedReserva = { ...filaSeleccionada, detalles: updatedDetalles };

        // Actualizar tanto filteredData como originalData
        const updateFn = (reservasArray) =>
          reservasArray.map((reserv) =>
            reserv.id === filaSeleccionada.id ? updatedReserva : reserv
          );
        setFilteredData(prev => updateFn(prev));
        setOriginalData(prev => updateFn(prev));

        // Reiniciar el modal
        setSelectedDetalleId('');
        setRazon('');
        setShow(false);
      })
      .catch(error => {
        console.error("Error al cancelar la habitación:", error);
      });
  };

  // sort options
  const sortOptions = [
    { value: 'id', label: 'ID' },
    { value: 'nombre', label: 'Nombre' },
    { value: 'codigo', label: 'Código' },
    { value: 'habitaciones', label: 'Habitación(es)' },
    { value: 'checkIn', label: 'Check-In' },
    { value: 'checkOut', label: 'Check-Out' },
  ];

  // Ordenar los datos
  let sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (!isNaN(aVal) && !isNaN(bVal)) {
      return Number(aVal) - Number(bVal);
    }

    if (!isNaN(Date.parse(aVal)) && !isNaN(Date.parse(bVal))) {
      return new Date(aVal) - new Date(bVal);
    }

    const aStr = aVal?.toString().toLowerCase() || "";
    const bStr = bVal?.toString().toLowerCase() || "";
    return aStr.localeCompare(bStr);
  });

  // Filtrar reservas: si tienen detalles y todos están inactivos, se omite
  let sortedDataFinal = sortedData.filter(reserva => {
    if (reserva.detalles && reserva.detalles.length > 0) {
      return reserva.detalles.some(det => det.activo !== false);
    }
    return true; // si no tiene detalles o está vacío, se muestra la reserva
  });

  // Formatear los datos, excluyendo detalles inactivos
  const sortedDataFormatted = sortedDataFinal.map((reserva) => ({
    ...reserva,
    detalles: reserva.detalles && reserva.detalles.length > 0
      ? reserva.detalles
        .filter(det => det.activo !== false)
        .map(det => `Habitación: ${det.habitacionId}`)
        .join(", ")
      : ""
  }));

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
        <PaginatedTable headers={headers} data={sortedDataFormatted} rowsPerPage={10} rowActions={actions}/>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar cancelación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filaSeleccionada && (
            <>
              <p>¿Estás seguro de que deseas cancelar una habitación de la reserva?</p>
              <p>
                <strong>Cliente:</strong> {filaSeleccionada.nombre}
              </p>
              <Form.Group controlId="detalleCancelacion" className="mb-3">
                <Form.Label>Seleccione la Habitación a cancelar</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedDetalleId}
                  onChange={(e) => setSelectedDetalleId(e.target.value)}
                  required
                >
                  <option value="">Seleccione...</option>
                  {detallesArray.map(det => {
                    const habInfo = det.habitacion && det.habitacion.numeroHabitacion
                      ? `#${det.habitacion.numeroHabitacion} - ${det.habitacion.tipoHabitacionNombre}`.trim()
                      : det.habitacionId;
                    return (
                      <option key={det.id} value={det.id}>
                        Habitación {habInfo}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="razonEliminacion" className="mb-3">
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