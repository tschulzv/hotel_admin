import React, { useState } from "react";
import { Container, Button, Row, Col, Card, Table, Form } from "react-bootstrap";
import { SlCheck, SlClose } from "react-icons/sl";

const ReservationCheckOut = () => {
  // Reserva de ejemplo, se eliminará cuando funcione la API
  const reservation = {
    id: 1,
    nombre: "Alejandra Núñez",
    codigo: "ID33456",
    habitaciones: "209",
    checkIn: "2025-04-10",
    checkOut: "2025-04-14",
    estado: "Activa",
    observaciones: "Solicitó servicio de desayuno a la habitación",
  };

  const [roomData, setRoomData] = useState("");
  const [verified, setVerified] = useState(null);
  const [error, setError] = useState("");

  const handleVerification = (e) => {
    e.preventDefault();
    // Ejemplo: Si el usuario ingresa "210" se verifica
    if (roomData === "210") {
      setVerified(true);
      setError("");
    } else {
      setVerified(false);
      setError("Habitación no encontrada o sin Check-Out pendiente.");
    }
  };

  // Ejemplo de Check-Out exitoso (se reemplazará por llamada a API)
  const handleCheckOut = () => {
    alert("Check-Out realizado con éxito");
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header >
          <h2 className="mb-0">Check-Out</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleVerification}>
            <Form.Group as={Row} className="mb-3" controlId="formRoomNumber">
              <Form.Label column sm={3}>
                Número de Habitación
              </Form.Label>
              <Col sm={6}>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el número de habitación"
                  value={roomData}
                  onChange={(e) => setRoomData(e.target.value)}
                />
              </Col>
              <Col sm={3}>
                <Button variant="primary" type="submit">
                  Buscar
                </Button>
              </Col>
            </Form.Group>
          </Form>
          {error && (
            <p style={{ color: "red", marginBottom: "1rem" }}>
              <SlClose /> {error}
            </p>
          )}
          {verified && (
            <>
              <Card className="mb-4">
                <Card.Header as="h5" className="bg-dark text-white">
                  Detalle de Habitación
                </Card.Header>
                <Card.Body>
                  <Table striped hover responsive>
                    <thead>
                      <tr>
                        <th>Tipo de Habitación</th>
                        <th>N° de Habitación</th>
                        <th>Capacidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Junior Suite</td>
                        <td>210</td>
                        <td>2</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              <Row className="mb-3">
                <Col>
                  <Card className="shadow-sm">
                    <Card.Header as="h5" className="bg-dark text-white">
                      Huéspedes
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>N° de Documento</th>
                            <th>Nombre del Huésped</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>12345678</td>
                            <td>Alejandra Núñez</td>
                          </tr>
                          <tr>
                            <td>87654321</td>
                            <td>Juan Pérez</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Card className="shadow-sm">
                    <Card.Header as="h5" className="bg-dark text-white">
                      Ítems y Servicios
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Item/Servicio</th>
                            <th>Tarifa</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Servicio a la Habitación</td>
                            <td>₲ 75.000</td>
                          </tr>
                          <tr>
                            <td>Gaseosa 500 ml</td>
                            <td>₲ 15.000</td>
                          </tr>
                          <tr>
                            <td>Gaseosa en lata</td>
                            <td>₲ 10.000</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="justify-content-end">
                <Col xs="auto">
                  <Button variant="primary" onClick={handleCheckOut}>
                    <SlCheck /> Realizar Check-Out
                  </Button>
                </Col>
              </Row>
            </>
          )}
          {verified === false && (
            <Row>
              <p style={{ color: "red" }}>
                <SlClose /> {error}
              </p>
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReservationCheckOut;
