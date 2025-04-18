import React from 'react'
import { Container, Row, Col, Button, Card, ListGroup } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';

function ClientDetails() {
  let client = {
    id: 1,
    nombre: "Ana",
    apellido: "Martínez",
    documento: "4567890",
    telefono: "+595 21 123 4567",
    email: "ana.martinez@example.com",
    nacionalidad: "Paraguaya",
    observaciones: "Suele hospedarse en habitaciones deluxe"
  }
  const navigate = useNavigate();
  
  const editClient = () => {}
  const clientHistory = () => {
    navigate("/clients/1/history");
  }

  return (
    <Container className="py-4">
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Body className="p-5">
          <h2 className="mb-4 text-center">Información del Cliente</h2>

          <Row className="gy-4">
            <Col md={6}>
              <Card className="border-0 h-100">
                <Card.Body>
                  <h4 className="mb-3">Datos personales</h4>
                  <ListGroup variant="flush no-borders">
                    <ListGroup.Item><strong>Nombre:</strong> {client.nombre}</ListGroup.Item>
                    <ListGroup.Item><strong>Apellido:</strong> {client.apellido}</ListGroup.Item>
                    <ListGroup.Item><strong>Documento:</strong> {client.documento}</ListGroup.Item>
                    <ListGroup.Item><strong>Teléfono:</strong> {client.telefono}</ListGroup.Item>
                    <ListGroup.Item><strong>Email:</strong> {client.email}</ListGroup.Item>
                    <ListGroup.Item><strong>Nacionalidad:</strong> {client.nacionalidad}</ListGroup.Item>
                    <ListGroup.Item><strong>Fecha de Registro:</strong> 10/03/2025</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="d-flex flex-column justify-content-between h-100">
              <div>
                <Card className="border-0">
                  <Card.Body>
                    <h4 className="mb-3">Última reserva</h4>
                    <ListGroup variant="flush no-borders">
                      <ListGroup.Item><strong>Código:</strong> AX12345</ListGroup.Item>
                      <ListGroup.Item><strong>Habitación(es):</strong> 201</ListGroup.Item>
                      <ListGroup.Item><strong>Check-In:</strong> 12/04/2025</ListGroup.Item>
                      <ListGroup.Item><strong>Check-Out:</strong> 14/04/2025</ListGroup.Item>
                      <ListGroup.Item><strong>Estado:</strong> Finalizada</ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>

                <div className="d-flex justify-content-center gap-3">
                  <Button variant="primary" onClick={editClient}>Editar Cliente</Button>
                  <Button variant="outline-secondary" onClick={clientHistory}>Ver Historial</Button>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col>
              <h4>Observaciones</h4>
              <p className="text-muted fs-5">{client.observaciones}</p>
            </Col>
          </Row>

          <div className="d-flex justify-content-center mt-4">
            <Button variant="secondary" onClick={() => {navigate('/clients')}}>Volver</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ClientDetails
