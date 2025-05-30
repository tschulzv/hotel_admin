import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Modal, Button, Form, Spinner } from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable';
import { Table, Pagination } from 'react-bootstrap';
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState();
  const [sortKey, setSort] = useState(["id"]);
  const [filteredData, setFilteredData] = useState(originalData);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [show, setShow] = useState(false); // mostrar o no el modal
  const [razon, setRazon] = useState('');
  const [reservas, setReservas] = useState([]);

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
        return <Badge bg="dark">Check-Out</Badge>
      case 6:
        return <Badge bg="secondary">Rechazada</Badge>
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
            ingresoISO: fechaIngreso,
            salidaISO: fechaSalida,
            llegada: llegadaEstimada?.slice(0, 5) || '',
            estadoId: getStatusBadge(estadoId)
          };
        });
        setReservas(limpio);
        setFilteredData(limpio);
        setOriginalData(limpio);
        setLoading(false);
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
      const [anho, mes, dia] = fechaSeleccionada.split('-');
      const fechaSel = new Date(anho, mes-1, dia);

      const reservasFiltradas = originalData.filter((reserva) => {
        const fechaIngresoStr = reserva.ingresoISO.split('T')[0];
        const fechaSalidaStr = reserva.salidaISO.split('T')[0];

        const [anhoIngreso, mesIngreso, diaIngreso] = fechaIngresoStr.split('-');
        const ingreso = new Date(anhoIngreso, mesIngreso-1, diaIngreso);

        const [anhoSalida, mesSalida, diaSalida] = fechaSalidaStr.split('-');
        const salida = new Date(anhoSalida, mesSalida-1, diaSalida);

        return fechaSel >= ingreso && fechaSel <= salida;
    });
      setFilteredData(reservasFiltradas);
    } else {
      // Si no hay fecha seleccionada, mostramos todos los datos originales
      setFilteredData(originalData);
    }
  }, [fechaSeleccionada, originalData]);


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
      reserv.id === filaSeleccionada.id ? { ...reserv, estadoId: getStatusBadge(3) } : reserv
    );
    setFilteredData(updatedData);

    // Preparamos el payload para la cancelación
    const payload = {
      // No enviamos 'id' porque se genera automáticamente.
      detalleReservaId: null,
      reservaId: filaSeleccionada.id,
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
      <div className="d-flex align-items-center mb-4">
        {fechaSeleccionada && (
          <span className="material-icons me-2" role="button" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} title="Volver">
            arrow_back
          </span>
      )}
      <h1>Reservas</h1>
      </div>
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
      
      {
        loading ? <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                  </div> : <PaginatedTable headers={headers} data={sortedDataFormatted} rowsPerPage={10} rowActions={actions} />
      }

      {/*modal de eliminacion*/ }
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filaSeleccionada && (
            <>
              <p> ¿Estás seguro de que deseas cancelar la reserva?</p>
              <p><strong>Cliente:</strong> {filaSeleccionada.nombreCliente}</p>
              <p><strong>Habitación(es):</strong> {filaSeleccionada.numsHabitaciones}</p>
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
