import React from 'react'
import { Container, Row, Col, Button, Card, ListGroup } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';

function ReservationDetails() {
  // reserva DE EJEMPLO, BORRAR CUANDO FUNCIONE LA API!!
  // useEffect y obtener datos del resevra de la db si se le pasa un id
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
        }
        ]
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
  
  const editClient = () => {}
  const clientHistory = () => {
    navigate("/clients/1/history");
  }

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm rounded-4">
        <Card.Body className="p-5">
          <h2 className="mb-4 text-center">Detalles de la Reserva</h2>
          <Row className="gy-4">
            <Col md={6}>
              <Card className="border-0 h-100">
                <Card.Body>
                  <h4 className="mb-3">Reserva</h4>
                  <ListGroup variant="flush no-borders">
                    <ListGroup.Item><strong>Titular:</strong> {reservation.nombre}</ListGroup.Item>
                    <ListGroup.Item><strong>Código:</strong> {reservation.codigo}</ListGroup.Item>
                    <ListGroup.Item><strong>Check-In:</strong> {reservation.checkIn}</ListGroup.Item>
                    <ListGroup.Item><strong>Check-Out:</strong> {reservation.checkOut}</ListGroup.Item>
                    <ListGroup.Item><strong>Hora estimada de llegada:</strong> {reservation.llegadaEstimada}</ListGroup.Item>
                    <ListGroup.Item><strong>Estado:</strong> {reservation.estado}</ListGroup.Item>
                    <ListGroup.Item><strong>Observaciones:</strong> {reservation.observaciones}</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="d-flex flex-column justify-content-between h-100">
                <Card className="border-0">
                  <Card.Body>
                    <h4 className="mb-3">Habitaciones</h4>
                    {
                        reservation.estado === 'Pendiente' ? <h3>Aún no se asignaron habitaciones</h3> :
                            details.map((detail, i) => (
                            <div key={i} className="mb-3 p-3 border rounded">
                            <ListGroup variant="flush no-borders">
                                <ListGroup.Item><strong>Núm. Habitación:</strong> {detail.numHabitacion}</ListGroup.Item>
                                <ListGroup.Item><strong>Cantidad de Adultos: </strong>{detail.cantidadAdultos}</ListGroup.Item>
                                <ListGroup.Item><strong>Cantidad de Niños: </strong>{detail.cantidadNinhos}</ListGroup.Item>
                                <ListGroup.Item><strong>Tipo de Pensión:</strong> {detail.pension}</ListGroup.Item>
                            </ListGroup>
                            </div>
                            ))
                        
                    }
                  </Card.Body>
                </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ReservationDetails
