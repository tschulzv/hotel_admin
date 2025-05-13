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

  const getStatusBadge = (statusId) => {
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

  useEffect(() => {
    axios.get("Reservas")
      .then(response => {
        //console.log(response.data)
        const limpio = response.data.map(({ id, codigo, fechaIngreso, fechaSalida, estadoId, detalles, llegadaEstimada, nombreCliente }) => {
          const parsedIngreso = parseISO(fechaIngreso);
          const parsedSalida = parseISO(fechaSalida);
          console.log(detalles);
          const numsHabitaciones = detalles ? detalles.map(d => d.numeroHabitacion || 'Sin habitación').join(', ') : "N/A";
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
        //console.log(limpio);
        setOriginalData(limpio);
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
        setFilaSeleccionada(rowData);
        setRazon('');
        setShow(true);
      }
    }
  ];

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
    // Actualizamos los datos localmente
    let updatedData = filteredData.map(reserv =>
      reserv.id === filaSeleccionada.id ? { ...reserv, estado: 'Cancelado' } : reserv
    );
    setFilteredData(updatedData);

    // Preparamos el payload para la cancelación
    const payload = {
      // No enviamos 'id' porque se genera automáticamente.
      detalleReservaId: filaSeleccionada.id, // Asumimos que este campo es el id de la reserva o detalle a cancelar
      motivo: razon, // El motivo que el usuario ingresó
      activo: true
    };

    // Enviamos la cancelación a la API
    axios.post("/Cancelacions", payload)
      .then(response => {
        console.log("Cancelación realizada:", response.data);
      })
      .catch(error => {
        console.error("Error al cancelar reserva:", error);
      });

    // Cerramos el modal
    setShow(false);
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

  const sortedDataFormatted = sortedData.map((reserva) => ({
    ...reserva,
    numsHabitaciones: reserva.numsHabitaciones || 'Sin habitación',
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
      <TableFilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={onSearch} clearSearch={clearSearch} sortOptions={sortOptions} sortKey={sortKey} setSort={setSort} showBtn={true} btnText="Crear Reserva" onBtnClick={onBtnClick} />
      <PaginatedTable headers={headers} data={sortedDataFormatted} rowsPerPage={10} rowActions={actions} />

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
