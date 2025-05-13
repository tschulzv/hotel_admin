import React, { useState } from "react";
import { Container, Button, Row, Col, Card, Table, Modal, Form } from "react-bootstrap";
import { SlMinus, SlCheck, SlClose } from "react-icons/sl";
import axios from '../config/axiosConfig';

const ReservationCheckIn = () => {

  const [reservationData, setReservationData] = useState({
    nombre: "",
    codigo: "",
    habitaciones: "",
    checkIn: "",
    checkOut: "",
    estado: "",
    observaciones: "",
  });
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(null);
  const [show, setShow] = useState(false); // para el modal
  const [modalTxt, setModalTxt] = useState("");
  const [modalTitle, setModalTitle] = useState("Error");
  const [reservation, setReservation] = useState({});
  const handleClose = () => setShow(false);

  // Verificar la reserva ingresada
  const handleVerification = async (e) => {
    e.preventDefault();
    const reserv = await axios.get('/Reservas/' + reservationData.codigo) || { data: null };
    if (!reserv.data) {
      setError("Reserva No Encontrada.");
      setVerified(false);
      return;
    }
    setReservationData(reserv.data);
    setVerified(true);
    setError("");
  };

  const [guestDoc, setGuestDoc] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestList, setGuestList] = useState([]);

  const handleAddGuest = () => {
    if (guestList.length >= 2) {
      setModalTitle("Error");
      setModalTxt("Cantidad máxima de huéspedes alcanzada");
      setShow(true);
      return;
    }
    if (!guestDoc.trim() || !guestName.trim()) return;
    setGuestList((prev) => [...prev, { doc: guestDoc, name: guestName }]);
    setGuestDoc("");
    setGuestName("");
  };

  const handleCheckIn = () => {
    // Lógica para llamar a la API
    setModalTitle("Éxito");
    setModalTxt("Check-In realizado con éxito");
    setShow(true);
  };

  const renderGuestRows = () =>
    guestList.map((guest, index) => (
      <tr key={index}>
        <td>{guest.doc}</td>
        <td>{guest.name}</td>
        <td>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() =>
              setGuestList(guestList.filter((_, i) => i !== index))
            }
          >
            <SlMinus />
          </Button>
        </td>
      </tr>
    ));

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header>
          <h2 className="mb-0">Check In</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleVerification}>
            <Form.Group as={Row} className="mb-3" controlId="formCodigoReserva">
              <Form.Label column sm={3}>
                Código de Reserva
              </Form.Label>
              <Col sm={6}>
                <Form.Control
                  type="text"
                  placeholder="ID12345"
                  value={reservationData.codigo}
                  onChange={(e) =>
                    setReservationData({
                      ...reservationData,
                      codigo: e.target.value,
                    })
                  }
                />
              </Col>
              <Col sm={3}>
                <Button variant="primary" type="submit">
                  Verificar Reserva
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
            <Card className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>Cliente:</strong> {reservationData.nombreCliente}</p>
                    <p><strong>N° de Habitación:</strong> {reservationData.habitaciones}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Check In:</strong> {reservationData.checkIn}</p>
                    <p><strong>Check Out:</strong> {reservationData.checkOut}</p>
                  </Col>
                </Row>
                {reservationData.observaciones && (
                  <Row>
                    <Col>
                      <p><strong>Observaciones:</strong> {reservationData.observaciones}</p>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
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
                        <td>209</td>
                        <td>2</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              <Card className="mb-4">
                <Card.Header as="h5" className="bg-dark text-white">
                  Agregar Huésped
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row className="align-items-end">
                      <Col md={4}>
                        <Form.Group controlId="guestDoc">
                          <Form.Label>N° de Documento</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Documento"
                            value={guestDoc}
                            onChange={(e) => setGuestDoc(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="guestName">
                          <Form.Label>Nombre del Huésped</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nombre del Huésped"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Button variant="secondary" onClick={handleAddGuest}>
                          Agregar Huésped
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  {guestList.length > 0 && (
                    <Table striped bordered hover className="mt-3">
                      <thead>
                        <tr>
                          <th>N° de Documento</th>
                          <th>Nombre del Huésped</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>{renderGuestRows()}</tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
              <Row className="justify-content-end">
                <Col xs="auto">
                  <Button variant="primary" onClick={handleCheckIn}>
                    <SlCheck /> Realizar Check-In
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalTxt}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReservationCheckIn;
