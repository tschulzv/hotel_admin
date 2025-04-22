import React from 'react' 
import { Container, Row, Col, Button, Card, ListGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

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
  
  const editClient = () => {
    navigate("/clients/edit/1")
  }

  const clientHistory = () => {
    navigate("/clients/1/history");
  }

  return (
    <Container className="py-4">
        <div className="d-flex align-items-center mb-4">
          <span className="material-icons me-2" role="button" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} title="Volver">
            arrow_back
          </span>
          <h2 className="mb-0" style={{ color: '#2c3e50' }}>Información del Cliente</h2>
        </div>

        <Row className="gy-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm rounded-3 p-2">
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
                  <ListGroup.Item><strong>Observaciones:</strong> {client.observaciones}</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="d-flex flex-column justify-content-between h-100">
            <Card className="border-0 shadow-sm rounded-3 mb-5 p-2">
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
            <div className="d-flex  align-items-center justify-content-center gap-2">
              <Button variant="primary" onClick={clientHistory}>Ver Historial</Button>
              <Button variant="secondary" onClick={editClient}>Editar Cliente</Button>
            </div>
          </Col>
        </Row>
    </Container>
  )
}

export default ClientDetails
