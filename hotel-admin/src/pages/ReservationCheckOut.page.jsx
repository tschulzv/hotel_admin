import React, { useState } from "react";
import { Container, Button, Row, Col, Table } from "react-bootstrap";
import { SlCheck, SlClose } from "react-icons/sl";

const ReservationCheckOut = () => {
  // reserva de ejemplo, borrar cuando funcione la API
  const reservation = {
    id: 1,
    nombre: "Alejandra Núñez",
    codigo: "ID33456",
    habitaciones: "209",
    checkIn: "2025-04-10",
    checkOut: "	2025-04-14",
    estado: "Activa",
    observaciones: "Solicitó servicio de desayuno a la habitación",
  };
  const [roomData, setRoomData] = useState("");
  const [verified, setVerified] = useState(null);

  // Lo que pasa si se apreta el boton "Buscar Habitacion"
  const handleVerification = (e) => {
    e.preventDefault();
    if (roomData === "210") {
      setVerified(true);
    } else {
      setVerified(false);
    }
  };

  return (
    <Container>
      <h1>Check Out</h1>
      <h4>Número de Habitación</h4>
      <Col>
        <Row className="justify-content-left mb-3">
          <Col xs="auto">
            <input
              type="text"
              name="NumHabitacion"
              placeholder="300"
              value={roomData}
              onChange={(e) => setRoomData(e.target.value)}
              style={{ width: "200px" }} // ancho específico
            />
          </Col>
        </Row>
        <Row className="justify-content-left mb-3">
          <Col xs="auto">
            <Button onClick={handleVerification}>Buscar</Button>
          </Col>
        </Row>
        {verified && (
          <div>
            <Row>
              <p style={{ color: "green" }}>
                <SlCheck />
                Habitación Con Check-Out Pendiente
              </p>
            </Row>
            <Row className="justify-content-left mb-3">
              <Col md={8}>
                <Table>
                  <thead>
                    <tr>
                      <th>Tipo de Habitacion</th>
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
              </Col>
            </Row>
            <Row>
              <Row className="mt-4">
                <Col md={6}>
                  <Table striped bordered hover>
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
                </Col>
                <Col md={6}>
                  <Table striped bordered hover>
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
                </Col>
              </Row>
              <Row className="justify-content-start mt-3">
                <Col xs="auto">
                  <Button
                    onClick={() => alert("Check-Out realizado con exito")}
                  >
                    Check-Out
                  </Button>
                </Col>
              </Row>
            </Row>
          </div>
        )}
        {verified === false && (
          <Row>
            <p style={{ color: "red" }}>
              <SlClose />
              Habitacion Sin Ocupar
            </p>
          </Row>
        )}
      </Col>
    </Container>
  );
};
export default ReservationCheckOut;
