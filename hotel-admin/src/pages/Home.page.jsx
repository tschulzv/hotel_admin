import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';
import RoomCard from '../components/RoomCard';
import PensionChart from '../components/PensionChart';
import PaginatedTable from '../components/PaginatedTable';
import axios from '../config/axiosConfig';

/*
const tarjetas = [
  { numero: "Total Habitaciones", tipo: "50", estado: "EN LIMPIEZA", color: "primary" },
  { numero: "Habitaciones Libres", tipo: "40", estado: "DISPONIBLE", color: "success" },
  { numero: "Habitaciones Ocupadas", tipo: "10", estado: "OCUPADO", color: "danger" },
  { numero: "Reservas Hoy", tipo: "2", estado: "RESERVAS HOY", color: "secondary" },
];
const habitacionesOcupadas = [
  { Habitacion: '103', Tipo: 'ESTÁNDAR', FechaIngreso: '14/03/2025 8:00:53' },
  { Habitacion: '106', Tipo: 'ESTÁNDAR', FechaIngreso: '14/03/2025 8:20:20' },
  { Habitacion: '201', Tipo: 'DELUXE', FechaIngreso: '15/03/2025 9:3:14' },
  { Habitacion: '202', Tipo: 'EJECUTIVA', FechaIngreso: '15/03/2025 11:36:57' },
  { Habitacion: '204', Tipo: 'EJECUTIVA', FechaIngreso: '16/03/2025 11:38:47' },
  { Habitacion: '312', Tipo: 'PRESIDENCIAL', FechaIngreso: '17/03/2025 15:2:48' },
  { Habitacion: '315', Tipo: 'PRESIDENCIAL', FechaIngreso: '17/03/2025 15:10:47' },
  { Habitacion: '400', Tipo: 'DELUXE', FechaIngreso: '17/03/2025 20:16:50' },
  { Habitacion: '408', Tipo: 'EJECUTIVA', FechaIngreso: '17/03/2025 7:25:13' },
  { Habitacion: '407', Tipo: 'EJECUTIVA', FechaIngreso: '17/03/2025 8:0:15' },
];

const checkInsPendientes = [
  { ReservaID: 'R001', Cliente: 'Juan Pérez', Habitacion: '204', FechaCheckIn: '18/03/2025 15:00' },
  { ReservaID: 'R002', Cliente: 'María López', Habitacion: '205', FechaCheckIn: '18/03/2025 16:30' },
  // ... más registros
];

const checkOutsPendientes = [
  { Habitacion: '101', Cliente: 'Carlos Fernández', FechaCheckOut: '18/03/2025 11:00' },
  { Habitacion: '307', Cliente: 'Laura Martinez', FechaCheckOut: '18/03/2025 12:00' },
  // ... más registros
];
*/
const Home = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [checkouts, setCheckouts] = useState([]);
  const [tarjetas, setTarjetas] = useState([]);

  useEffect(() => {
    // Obtener habitaciones
    axios.get('/Habitacions')
      .then(response => {
        setHabitaciones(response.data);
        
        // Agrupar habitaciones por estado
        const agrupadas = response.data.reduce((acc, hab) => {
          acc.total = (acc.total || 0) + 1;
          acc[hab.estadoNombre] = (acc[hab.estadoNombre] || 0) + 1;
          return acc;
        }, {});
        console.log(agrupadas);
        // Actualizar las tarjetas con los datos reales
        const nuevasTarjetas = [
          { numero: agrupadas.total || 0, tipo: "Total", estado: "TOTAL", color: "primary" },
          { numero: agrupadas.DISPONIBLE || 0, tipo: "Libres", estado: "DISPONIBLE", color: "success" },
          { numero: agrupadas.OCUPADO || 0, tipo: "Ocupadas", estado: "OCUPADO", color: "danger" },
          { numero: agrupadas["EN LIMPIEZA"] || 0, tipo: "En Limpieza", estado: "EN LIMPIEZA", color: "secondary" },
        ];
        console.log(nuevasTarjetas);
        setTarjetas(nuevasTarjetas);
      })
      .catch(error => console.error('Error al obtener habitaciones:', error));

    // Obtener check-ins
    axios.get('/Checkins')
      .then(response => {
        const checkinsActivos = response.data.filter(c => c.activo).map(c => ({
          ReservaID: c.reservaId,
          ID: c.id,
          Estado: 'Pendiente',
          DetalleHuespedes: c.detalleHuespedes || []
        }));
        setCheckins(checkinsActivos);
      })
      .catch(error => console.error('Error al obtener check-ins:', error));

    // Obtener check-outs
    axios.get('/Checkouts')
      .then(response => {
        const checkoutsActivos = response.data.filter(c => c.activo).map(c => ({
          ReservaID: c.reservaId,
          ID: c.id,
          Estado: 'Pendiente'
        }));
        setCheckouts(checkoutsActivos);
      })
      .catch(error => console.error('Error al obtener check-outs:', error));
  }, []);

  // Filtrar habitaciones ocupadas para la tabla
  const habitacionesOcupadas = habitaciones
    .filter(h => h.estadoNombre === 'OCUPADO')
    .map(h => ({
      Habitacion: h.numeroHabitacion,
      Tipo: h.tipoHabitacionNombre,
      Estado: h.estadoNombre,
      Observaciones: h.observaciones || ''
    }));

  return (
    <Container>
      {/* Fila superior de tarjetas */}
      <Row>
        {tarjetas.map((card, idx) => (
          <Col xs={12} sm={6} md={4} lg={3} key={idx} className="mb-3">
            <RoomCard
              numero={card.numero}
              tipo={card.tipo}
              estado={card.estado}
              color={card.color}
              icono=""
            />
          </Col>
        ))}
      </Row>

      <Row>
        {/* Columna Izquierda: Gráfico + Tabla Habitaciones Ocupadas */}
        <Col lg={6} md={12} className="mb-4">
          <Card className="p-3 shadow-sm mb-4">
            <PensionChart />
          </Card>
          
          <Card className="p-3 shadow-sm">
            <h5 className="mb-3">Habitaciones Ocupadas</h5>
            <PaginatedTable
              data={habitacionesOcupadas}
              rowActions={[]}
              rowsPerPage={5}
            />
          </Card>
        </Col>

        {/* Columna Derecha: Tablas de Check-In y Check-Out */}
        <Col lg={6} md={12}>
          <Card className="p-3 shadow-sm mb-4">
            <h5 className="mb-3">Check-Ins Pendientes</h5>
            <PaginatedTable
              data={checkins}
              rowActions={[]}
              rowsPerPage={5}
            />
          </Card>
          
          <Card className="p-3 shadow-sm">
            <h5 className="mb-3">Check-Outs Pendientes</h5>
            <PaginatedTable
              data={checkouts}
              rowActions={[]}
              rowsPerPage={5}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Home;