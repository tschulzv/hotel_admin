import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable.jsx';
import axios from '../config/axiosConfig';
import { format, parseISO } from 'date-fns';
import Badge from 'react-bootstrap/Badge';

const meses = [
  { nombre: "Enero", dias: 31 },
  { nombre: "Febrero", dias: 28 },
  { nombre: "Marzo", dias: 31 },
  { nombre: "Abril", dias: 30 },
  { nombre: "Mayo", dias: 31 },
  { nombre: "Junio", dias: 30 },
  { nombre: "Julio", dias: 31 },
  { nombre: "Agosto", dias: 31 },
  { nombre: "Septiembre", dias: 30 },
  { nombre: "Octubre", dias: 31 },
  { nombre: "Noviembre", dias: 30 },
  { nombre: "Diciembre", dias: 31 },
];

const years = ["2023", "2024", "2025"];

const ReportPage = () => {
  // Estados para almacenar la datos
  const [reservas, setReservas] = useState([]);
  const [cancelacions, setCancelacions] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para los filtros
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState(""); // "" indica que se muestran todos los meses

  // Función para obtener el badge de estado según el id
  const getStatusBadge = (statusId) => {
    switch (statusId) {
      case 1:
        return <Badge bg="warning">Pendiente</Badge>;
      case 2:
        return <Badge bg="success">Confirmada</Badge>;
      case 3:
        return <Badge bg="danger">Cancelada</Badge>;
      case 4:
        return <Badge bg="primary">Check-In</Badge>;
      case 5:
        return <Badge bg="dark">Check-Out</Badge>;
      case 6:
        return <Badge bg="secondary">Rechazada</Badge>
      default:
        return "";
    }
  };

  // Se obtienen los datos 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservasRes, cancelRes, checkInsRes, checkOutsRes] = await Promise.all([
          axios.get('/Reservas'),
          axios.get('/Cancelacions'),
          axios.get('/Checkins'),
          axios.get('/Checkouts')
        ]);

        setReservas(reservasRes.data);
        setCancelacions(cancelRes.data);
        setCheckins(checkInsRes.data);
        setCheckouts(checkOutsRes.data);
      } catch (error) {
        console.error('Error al cargar datos para los reportes: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mapeo de Reservas donde se formatea la fecha y se obtiene el estado como badge.
  const reservasData = reservas.map(r => ({
    id: r.id,
    nombreCliente: r.nombreCliente,
    codigo: r.codigo,
    fechaIngreso: r.fechaIngreso ? format(parseISO(r.fechaIngreso), 'dd/MM/yyyy') : "",
    rawFechaIngreso: r.fechaIngreso,
    fechaSalida: r.fechaSalida ? format(parseISO(r.fechaSalida), 'dd/MM/yyyy') : "",
    estadoId: getStatusBadge(r.estadoId),
    habitacionesReservadas: r.detalles ? r.detalles.map(d => d.numeroHabitacion).join(', ') : 'Sin habitación'
  }));

  const reservasHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'nombreCliente', label: 'Cliente' },
    { key: 'codigo', label: 'Código' },
    { key: 'fechaIngreso', label: 'Fecha Ingreso' },
    { key: 'fechaSalida', label: 'Fecha Salida' },
    { key: 'estadoId', label: 'Estado' },
    { key: 'habitacionesReservadas', label: 'Habitaciones Reservadas' }
  ];

  // Mapeo de Cancelacions donde se usa la fecha de ingreso de la reserva relacionada para filtrar
  const cancelacionesData = cancelacions.map(c => ({
    id: c.id,
    reservaCodigo: c.reserva ? c.reserva.codigo : "",
    nombreCliente: c.reserva ? c.reserva.nombreCliente : "",
    motivo: c.motivo,
    fechaIngresoReserva: c.reserva && c.reserva.fechaIngreso 
      ? format(parseISO(c.reserva.fechaIngreso), 'dd/MM/yyyy')
      : "",
    rawFechaIngresoReserva: c.reserva && c.reserva.fechaIngreso ? c.reserva.fechaIngreso : ""
  }));

  const cancelacionesHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'reservaCodigo', label: 'Reserva Código' },
    { key: 'nombreCliente', label: 'Cliente' },
    { key: 'motivo', label: 'Motivo' },
    { key: 'fechaIngresoReserva', label: 'Fecha de Ingreso' }
  ];

  // Mapeo de Checkins donde se asume que se recibe el campo fechaCheckIn.
  const checkinsData = checkins.map(ci => {
    const reservaCheckin = reservas.find(r => r.id === ci.reservaId);
    return {
      id: ci.id,
      codigo: reservaCheckin ? reservaCheckin.codigo : "",
      cliente: reservaCheckin ? reservaCheckin.nombreCliente : "",
      fechaCheckIn: reservaCheckin.fechaIngreso
        ? format(parseISO(reservaCheckin.fechaIngreso), 'dd/MM/yyyy')
        : "",
        rawFechaCheckIn: reservaCheckin.fechaIngreso ? reservaCheckin.fechaIngreso : "",
        cantidadHuespedes: ci.detalleHuespedes ? ci.detalleHuespedes.length : 0
    };
  });

  const checkinsHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'codigo', label: 'Reserva Código' },
    { key: 'cliente', label: 'Cliente'},
    { key: 'fechaCheckIn', label: 'Fecha de Ingreso' },
    { key: 'cantidadHuespedes', label: 'Cantidad de Huéspedes' }
  ];

  // Mapeo de Checkouts: se asume que se recibe el campo fechaCheckOut.
  const checkoutsData = checkouts.map(co => {
    const reservaCheckout = reservas.find(r => r.id === co.reservaId);
    return {
      id: co.id,
      codigo: reservaCheckout ? reservaCheckout.codigo : "",
      cliente: reservaCheckout ? reservaCheckout.nombreCliente : "",
      fechaCheckOut: reservaCheckout.fechaSalida 
        ? format(parseISO(reservaCheckout.fechaSalida), 'dd/MM/yyyy')
        : "",
      rawFechaCheckOut: reservaCheckout.fechaSalida ? reservaCheckout.fechaSalida : ""
    };
  });

  const checkoutsHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'codigo', label: 'Reserva Código' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'fechaCheckOut', label: 'Fecha de Salida' }
  ];

  // Aplica los filtros de año y mes sobre cada conjunto de datos
  const filteredReservasData = reservasData.filter(r => {
    if (!r.rawFechaIngreso) return false;
    const date = parseISO(r.rawFechaIngreso);
    const isYear = date.getFullYear().toString() === selectedYear;
    const isMonth = selectedMonth ? ((date.getMonth() + 1).toString() === selectedMonth) : true;
    return isYear && isMonth;
  });

  const filteredCancelacionesData = cancelacionesData.filter(c => {
    if (!c.rawFechaIngresoReserva) return false;
    const date = parseISO(c.rawFechaIngresoReserva);
    const isYear = date.getFullYear().toString() === selectedYear;
    const isMonth = selectedMonth ? ((date.getMonth() + 1).toString() === selectedMonth) : true;
    return isYear && isMonth;
  });

  const filteredCheckinsData = checkinsData.filter(ci => {
    if (!ci.rawFechaCheckIn) return true; // si no existe fecha, se incluyen
    const date = parseISO(ci.rawFechaCheckIn);
    const isYear = date.getFullYear().toString() === selectedYear;
    const isMonth = selectedMonth ? ((date.getMonth() + 1).toString() === selectedMonth) : true;
    return isYear && isMonth;
  });

  const filteredCheckoutsData = checkoutsData.filter(co => {
    if (!co.rawFechaCheckOut) return true;
    const date = parseISO(co.rawFechaCheckOut);
    const isYear = date.getFullYear().toString() === selectedYear;
    const isMonth = selectedMonth ? ((date.getMonth() + 1).toString() === selectedMonth) : true;
    return isYear && isMonth;
  });

  // Totales para el resumen, basados en los datos filtrados
  const totalReservas = filteredReservasData.length;
  const totalCancelaciones = filteredCancelacionesData.length;
  const totalCheckins = filteredCheckinsData.length;
  const totalCheckouts = filteredCheckoutsData.length;

  return (
    <Container className="py-4">
      <h1 className="mb-4">Reportes de Reservas</h1>

      {/* Filtros por año y mes */}
      <Row className="mb-4">
        <Col md={3}>
          <label>Año</label>
          <select 
            className="form-select" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </Col>
        <Col md={3}>
          <label>Mes</label>
          <select 
            className="form-select" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Todos</option>
            {meses.map((mes, idx) => (
              <option key={mes.nombre} value={(idx + 1).toString()}>{mes.nombre}</option>
            ))}
          </select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {/* Resumen en tarjetas con colores */}
          <Row className="mb-4">
            <Col md={3}>
              <Card bg="primary" text="white" className="mb-3">
                <Card.Body>
                  <Card.Title>Total Reservas</Card.Title>
                  <Card.Text>{totalReservas}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card bg="danger" text="white" className="mb-3">
                <Card.Body>
                  <Card.Title>Total Cancelaciones</Card.Title>
                  <Card.Text>{totalCancelaciones}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card bg="success" text="white" className="mb-3">
                <Card.Body>
                  <Card.Title>Total Check-Ins</Card.Title>
                  <Card.Text>{totalCheckins}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card bg="warning" text="white" className="mb-3">
                <Card.Body>
                  <Card.Title>Total Check-Outs</Card.Title>
                  <Card.Text>{totalCheckouts}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Detalle de Reservas */}
          <h3 className="mt-4">Detalle de Reservas</h3>
          <PaginatedTable 
            headers={reservasHeaders} 
            data={filteredReservasData} 
            rowsPerPage={10} 
          />

          {/* Detalle de Cancelaciones */}
          <h3 className="mt-4">Detalle de Cancelaciones</h3>
          <PaginatedTable 
            headers={cancelacionesHeaders} 
            data={filteredCancelacionesData} 
            rowsPerPage={10} 
          />

          {/* Detalle de Check-Ins */}
          <h3 className="mt-4">Detalle de Check-Ins</h3>
          <PaginatedTable 
            headers={checkinsHeaders} 
            data={filteredCheckinsData} 
            rowsPerPage={10} 
          />

          {/* Detalle de Check-Outs */}
          <h3 className="mt-4">Detalle de Check-Outs</h3>
          <PaginatedTable 
            headers={checkoutsHeaders} 
            data={filteredCheckoutsData} 
            rowsPerPage={10} 
          />
        </>
      )}
    </Container>
  );
};

export default ReportPage;
