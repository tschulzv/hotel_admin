import React, { useState } from "react";
import { Container, Button, Row, Col, Table, Modal } from "react-bootstrap";
import { SlMinus, SlCheck, SlClose } from "react-icons/sl";

const ReservationCheckIn = () => {
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
  const [show, setShow] = useState(false); // mostrar o no el modal
  const [modalTxt, setModalTxt] = useState("");
  const [modalTitle, setModalTitle] = useState("Error");

    // funcion para manejar el cierre del modal
  const handleClose = () => setShow(false);
  

  // Lo que pasa si se apreta el boton "Verificar Reserva"
  const handleVerification = (e) => {
    e.preventDefault();
    if (reservationData.codigo === reservation.codigo) {
      setReservationData({
        nombre: reservation.nombre,
        codigo: reservation.codigo,
        habitaciones: reservation.habitaciones,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        estado: reservation.estado,
        observaciones: reservation.observaciones,
      });
      setVerified(true);
      setError("");
    } else {
      setError("Reserva No Encontrada.");
      setVerified(false);
    }
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
    // logica de llamar a la api 
    setModalTxt("Check-In realizado con éxito");
    setShow(true);
  }

  const renderGuestRows = () =>
    guestList.map((guest, index) => (
      <tr key={index}>
        <td>{guest.doc}</td>
        <td>{guest.name}</td>
        <td>
          <Button
            variant="danger"
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
    <Container>
      <h1>Check In</h1>
      <h4>Código de Reserva</h4>
      <Col>
        <Row className="justify-content-left mb-3">
          <Col xs="auto">
            <input
              type="text"
              name="CodigoReserva"
              placeholder="ID12345"
              value={reservationData.codigo}
              onChange={(e) =>
                setReservationData({
                  ...reservationData,
                  codigo: e.target.value,
                })
              }
              style={{ width: "200px" }} // ancho específico
            />
          </Col>
        </Row>
        <Row className="justify-content-left mb-3">
          <Col xs="auto">
            <Button onClick={handleVerification}>Verificar Reserva</Button>
          </Col>
        </Row>
        {verified && (
          <div>
            <Row>
              <p style={{ color: "green" }}>
                <SlCheck />
                Reserva Verificada
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
                      <td>209</td>
                      <td>2</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>
              <h4>Agregar Huésped</h4>
              <div>
                <Row className="align-items-end">
                  <Col>
                    <label>N° de Documento</label>
                    <input
                      type="text"
                      placeholder="Documento"
                      className="form-control"
                      value={guestDoc}
                      onChange={(e) => setGuestDoc(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <label>Nombre del Huésped</label>
                    <input
                      type="text"
                      placeholder="Nombre del Huésped"
                      className="form-control"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                    />
                  </Col>
                  <Col xs="auto" className="d-flex align-items-end">
                    <Button onClick={handleAddGuest}>Agregar Huésped</Button>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>N° de Documento</th>
                          <th>Nombre del Huésped</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>{renderGuestRows()}</tbody>
                    </Table>
                  </Col>
                </Row>
                <Row className="justify-content-start mt-3">
                  <Col xs="auto">
                    <Button
                      onClick={handleCheckIn}
                    >
                      Check-In
                    </Button>
                  </Col>
                </Row>
              </div>
            </Row>
          </div>
        )}
        {verified === false && (
          <Row>
            <p style={{ color: "red" }}>
              <SlClose />
              Reserva No Encontrada
            </p>
          </Row>
        )}
      </Col>
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
