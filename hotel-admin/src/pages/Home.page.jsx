import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';
import RoomCard from '../components/RoomCard';
import PensionChart from '../components/PensionChart';
import PaginatedTable from '../components/PaginatedTable';

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
const Home = () => {
  return (
    <Container className="px-5" fluid>
      <Row>
        {tarjetas.map((card, idx) => {
          const color = card.color;
          return (
            <Col xs={1} sm={1} md={1} lg={3} key={idx} className="mb-3">
              <RoomCard
                numero={card.numero}
                tipo={card.tipo}
                estado={card.estado}
                color={color}
                icono=""
              />
            </Col>
          );
        })}
      </Row>
      <Row>
        {/* Parte Izquierda: Gráfico */}
        <Col lg={6} md={12}>
          <Card className="p-3 shadow-sm mb-4">
            <PensionChart />
          </Card>
        </Col>

        {/* Parte Derecha: Tabla */}
        <Col lg={6} md={12}>
          <Card className="p-3 shadow-sm mb-4">
            <h5 className="mb-3">Habitaciones Ocupadas</h5>
            <PaginatedTable
              data={habitacionesOcupadas}
              rowActions={[]}
              rowsPerPage={5}
            />
          </Card>
        </Col>
      </Row>
      {/* Listas de check-ins y check-outs pendientes */}
      <Row>
        <Col lg={6} md={12}>
          <Card className="p-3 shadow-sm mb-4">
            <h5 className="mb-3">Check-Ins Pendientes</h5>
            <PaginatedTable
              data={checkInsPendientes}
              rowActions={[]}  // puedes agregar botones si quieres
              rowsPerPage={5}
            />
          </Card>
        </Col>
        <Col lg={6} md={12}>
          <Card className="p-3 shadow-sm mb-4">
            <h5 className="mb-3">Check-Outs Pendientes</h5>
            <PaginatedTable
              data={checkOutsPendientes}
              rowActions={[]}  // puedes agregar botones si quieres
              rowsPerPage={5}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Home;