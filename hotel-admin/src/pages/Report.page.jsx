import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import PaginatedTable from '../components/PaginatedTable.jsx';
import axios from '../config/axiosConfig';
import { format, parseISO } from 'date-fns';
import Badge from 'react-bootstrap/Badge';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


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

  // Función para exportar a Excel
  const exportToExcel = (data, fileName = "reporte", sheetName = "Hoja1") => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};

// Función para exportar a PDF usando jsPDF y autoTable
const exportToPDF = (data, columns, title = "Reporte", fileName = "reporte") => {
  const doc = new jsPDF();

  doc.text(title, 14, 16); // Título

  const plainData = data.map(row =>
    columns.map(c => {
      const value = row[c.key];
      if (typeof value === "string" || typeof value === "number") return value;
      if (typeof value === "object" && value !== null && "props" in value) return ""; // JSX
      return value?.toString() ?? "";
    })
  );

  autoTable(doc, {
    head: [columns.map(c => c.label)],
    body: plainData,
    startY: 20
  });

  doc.save(`${fileName}.pdf`);
};

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
    nombreCliente: r.nombreCliente,
    codigo: r.codigo,
    fechaIngreso: r.fechaIngreso ? format(parseISO(r.fechaIngreso), 'dd/MM/yyyy') : "",
    rawFechaIngreso: r.fechaIngreso,
    fechaSalida: r.fechaSalida ? format(parseISO(r.fechaSalida), 'dd/MM/yyyy') : "",
    estadoId: getStatusBadge(r.estadoId),
    habitacionesReservadas: r.detalles ? r.detalles.map(d => d.numeroHabitacion).join(', ') : 'Sin habitación'
  }));

  const reservasHeaders = [
    { key: 'nombreCliente', label: 'Cliente' },
    { key: 'codigo', label: 'Código' },
    { key: 'fechaIngreso', label: 'Fecha Ingreso' },
    { key: 'fechaSalida', label: 'Fecha Salida' },
    { key: 'estadoId', label: 'Estado' },
    { key: 'habitacionesReservadas', label: 'Habitaciones Reservadas' }
  ];

  // Mapeo de Cancelacions donde se usa la fecha de ingreso de la reserva relacionada para filtrar
  const cancelacionesData = cancelacions.map(c => {
    const esCancelacionTotal = !c.detalleReservaIds || c.detalleReservaIds.length === 0;

    return {
      reservaCodigo: c.reserva ? c.reserva.codigo : "",
      nombreCliente: c.reserva ? c.reserva.nombreCliente : "",
      motivo: c.motivo,
      tipoCancelacion: esCancelacionTotal ? "Reserva completa" : "Habitación(es)",
      fechaIngresoReserva: c.reserva?.fechaIngreso 
        ? format(parseISO(c.reserva.fechaIngreso), 'dd/MM/yyyy')
        : "",
      rawFechaIngresoReserva: c.reserva?.fechaIngreso || ""
    };
  });


  const cancelacionesHeaders = [
    { key: 'reservaCodigo', label: 'Reserva Código' },
    { key: 'nombreCliente', label: 'Cliente' },
    { key: 'motivo', label: 'Motivo' },
    { key: 'tipoCancelacion', label: 'Tipo de Cancelación' },
    { key: 'fechaIngresoReserva', label: 'Fecha de Ingreso' }
  ];

   {console.log("Cancelaciones", cancelacionesData)}
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

  // Mapeo de Checkouts se asume que se recibe el campo fechaCheckOut
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
      <h1 className="mb-4">Reportes</h1>

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
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h2 className="mb-0 d-flex justify-content-between align-items-center">
                Detalle de Reservas
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => exportToExcel(filteredReservasData, "Reservas")}
                  >
                    Exportar a Excel
                  </Button>{' '}
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => exportToPDF(filteredReservasData, reservasHeaders, "Reporte de Reservas", "Reservas")}
                  >
                    Exportar a PDF
                  </Button>
                </div>
            </h2>
            </Card.Header>
            <PaginatedTable 
              headers={reservasHeaders} 
              data={filteredReservasData} 
              rowsPerPage={10} 
            />
          </Card>
          {/* Detalle de Cancelaciones */}
          <Card className= "shadow-sm mb-4">
            <Card.Header>
              <h2 className="mb-0 d-flex justify-content-between align-items-center">
                Detalle de Cancelaciones
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => exportToExcel(filteredCancelacionesData, "Cancelaciones")}
                  >
                    Exportar a Excel
                  </Button>{' '}
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => exportToPDF(filteredCancelacionesData, cancelacionesHeaders, "Reporte de Cancelaciones", "Cancelaciones")}
                  >
                    Exportar a PDF
                  </Button>
                </div>
            </h2>
            </Card.Header>
            <PaginatedTable 
              headers={cancelacionesHeaders} 
              data={filteredCancelacionesData} 
              rowsPerPage={10} 
            />
        </Card>

          {/* Detalle de Check-Ins */}
          <Card className= "shadow-sm mb-4">
            <Card.Header>
              <h2 className="mb-0 d-flex justify-content-between align-items-center">
                Detalle de Check-Ins
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => exportToExcel(filteredCheckinsData, "Check-Ins")}
                  >
                    Exportar a Excel
                  </Button>{' '}
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => exportToPDF(filteredCheckinsData, checkinsHeaders, "Reporte de Check-Ins", "Check-Ins")}
                  >
                    Exportar a PDF
                  </Button>
                </div>
            </h2>
            </Card.Header>
            <PaginatedTable 
              headers={checkinsHeaders} 
              data={filteredCheckinsData} 
              rowsPerPage={10} 
            />
          </Card>

          {/* Detalle de Check-Outs */}
          <Card className= "shadow-sm mb-4">
            <Card.Header>
              <h2 className="mb-0 d-flex justify-content-between align-items-center">
                Detalle de Check-Outs
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => exportToExcel(filteredCheckoutsData, "Check-Outs")}
                  >
                    Exportar a Excel
                  </Button>{' '}
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => exportToPDF(filteredCheckoutsData, checkoutsHeaders, "Reporte de Check-Outs", "Check-Outs")}
                  >
                    Exportar a PDF
                  </Button>
                </div>
            </h2>
            </Card.Header>
            <PaginatedTable 
              headers={checkoutsHeaders} 
              data={filteredCheckoutsData} 
              rowsPerPage={10} 
            />
          </Card>
        </>
      )}
    </Container>
  );
};

export default ReportPage;
