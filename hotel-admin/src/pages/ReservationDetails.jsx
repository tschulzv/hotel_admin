import React from 'react'
import { Container, Row, Col, Card, ListGroup,Accordion } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

function ReservationDetails() {
  let reservation = {
    id: 1,
    nombre: "María Pérez",
    codigo: "ID12345",
    checkIn: "2025-04-10",
    checkOut: "2025-04-15",
    llegadaEstimada: "14:00",
    estado: "Activa",
    observaciones: "Solicitó servicio de desayuno a la habitación"
  }
  let details = [
    {
        numHabitacion: "101",
        cantidadAdultos: 1,
        cantidadNinhos: 1,
        pension: "Media pensión", 
        huespedes: [{
            nombre: "Juan Perez",
            documento: 123456
        }, {
            nombre: "Juana Perez",
            documento: 111111
        }]
    },
    {
        numHabitacion: "102",
        cantidadAdultos: 2,
        cantidadNinhos: 1,
        pension: "Media pensión",
        huespedes: [{
            nombre: "Maria Perez",
            documento: 3333333
        }, {
            nombre: "Esteban Gimenez",
            documento: 444444
        }, {
            nombre: "Ana Gimenez",
            documento: 555555
        }]
    }
  ]

  const navigate = useNavigate();

  return (
    <Container className="py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Título + Icono volver */}
      <div className='mb-4 d-flex align-items-center'>
        <span
          className="material-icons me-2"
          role="button"
          onClick={() => navigate(-1)}
          style={{ cursor: 'pointer' }}
          title="Volver"
        >
          arrow_back
        </span>
        <h2 style={{ color: '#2c3e50' }}>Reserva</h2>
      </div>

      <Row className="gy-4">
        {/* Card de Reserva */}
        <Col md={6}>
          <h4 className="mb-3">Detalles</h4>
          <Card className="p-4 shadow-sm border-0 rounded-4">
            <ListGroup variant="flush no-borders">
              <ListGroup.Item><strong>Titular:</strong> {reservation.nombre}</ListGroup.Item>
              <ListGroup.Item><strong>Código:</strong> {reservation.codigo}</ListGroup.Item>
              <ListGroup.Item><strong>Check-In:</strong> {reservation.checkIn}</ListGroup.Item>
              <ListGroup.Item><strong>Check-Out:</strong> {reservation.checkOut}</ListGroup.Item>
              <ListGroup.Item><strong>Hora estimada de llegada:</strong> {reservation.llegadaEstimada}</ListGroup.Item>
              <ListGroup.Item><strong>Estado:</strong> {reservation.estado}</ListGroup.Item>
              <ListGroup.Item><strong>Observaciones:</strong> {reservation.observaciones}</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        {/* acordeon de habitaciones */}
        <Col md={6}>
        <h4 className="mb-3">Habitaciones</h4>
{
  reservation.estado === 'Pendiente' ? (
    <h5 className="text-muted">Aún no se asignaron habitaciones</h5>
  ) : (
    <Accordion alwaysOpen defaultActiveKey="0">
      {details.map((detail, i) => (
        <Accordion.Item eventKey={i.toString()} key={i}>
          <Accordion.Header>
            Habitación {detail.numHabitacion}
          </Accordion.Header>
          <Accordion.Body>
            <ListGroup variant="flush no-borders" className="no-item-borders">
              <ListGroup.Item><strong>Cantidad de Adultos:</strong> {detail.cantidadAdultos}</ListGroup.Item>
              <ListGroup.Item><strong>Cantidad de Niños:</strong> {detail.cantidadNinhos}</ListGroup.Item>
              <ListGroup.Item><strong>Tipo de Pensión:</strong> {detail.pension}</ListGroup.Item>
              {/*<ListGroup.Item>
                <strong>Huéspedes:</strong>
                <ul className="mb-0 ps-3">
                  {detail.huespedes.map((h, idx) => (
                    <li key={idx}>{h.nombre} – {h.documento}</li>
                  ))}
                </ul>
              </ListGroup.Item>*/}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
        </Col>
      </Row>
    </Container>
  )
}

export default ReservationDetails
