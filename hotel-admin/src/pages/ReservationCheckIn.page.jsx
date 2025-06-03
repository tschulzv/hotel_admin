import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card, Table, Modal, Form } from "react-bootstrap";
import { SlMinus, SlCheck, SlClose } from "react-icons/sl";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../config/axiosConfig';

const ReservationCheckIn = () => {
  const { codigo: codigoParam } = useParams();
  const [codigo, setCodigo] = useState(codigoParam || "");
  const [reservas, setReservas] = useState([]);
  const [reservationData, setReservationData] = useState(null);
  const [checkinId, setCheckinId] = useState(null);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  const [guestDoc, setGuestDoc] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestList, setGuestList] = useState([]);

  const [show, setShow] = useState(false);
  const [modalTxt, setModalTxt] = useState("");
  const [modalTitle, setModalTitle] = useState("Error");
  const handleClose = () => setShow(false);

  // validar si la reserva es para el dia de hoy
  const validateCheckinDate = (reservationData) => {
    if (!reservationData || !reservationData.fechaIngreso) {
      return false;
    }

    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const checkinDate = new Date(reservationData?.fechaIngreso);
    const checkinString = checkinDate.toISOString().split('T')[0];

    return checkinString === todayString;
  };

  // Cargar todas las reservas al montar
  useEffect(() => {
  axios.get('/Reservas')
    .then(res => {
      setReservas(res.data);
      let found = null;
      if (codigoParam !== undefined) {
        found = res.data.find(r => r.codigo === codigoParam);
        if (!found) {
          toast.error("Reserva No Encontrada.");
          setVerified(false);
          return;
        } else if (!validateCheckinDate(found)) {
          toast.error("Solo se puede hacer Check-In el mismo día de la fecha programada.");
          return;
        } else {
          setReservationData(found);
          setVerified(true);

          axios.get(`/Checkins?reservaId=${found.id}`)
            .then(response => {
              const checkin = response.data;
              if (checkin && checkin.id) {
                setCheckinId(checkin.id);
                if (Array.isArray(checkin.detalleHuespedes)) {
                  setGuestList(checkin.detalleHuespedes.map(h => ({
                    nombre: h.nombre,
                    numDocumento: h.numDocumento
                  })));
                }
              }
            })
            .catch(err => {
              console.error("No se encontró check-in previo:", err);
              // no hacer nada si no existe
            });
        }
      }
    })
    .catch(err => console.error(err));
}, [codigoParam]);


  // Verificar reserva por código
  const handleVerification = e => {
    e.preventDefault();
    const found = reservas.find(r => r.codigo === codigo);
    if (!found) {
      toast.error("Reserva no encontrada")
      setVerified(false);
      return;
    } else if(!validateCheckinDate(found)){
      toast.error("Solo se puede hacer Check-In el mismo día de la fecha programada.")
      return;
    }
    setReservationData(found);
    setError("");
    setVerified(true);
    // inicializar lista de huéspedes con detalleHuespedes si existe checkin
    // aquí podríamos GET /Checkin?reservaId=found.id para obtener detalleHuespedes
  };

  const handleAddGuest = () => {
    if (guestList.length >= foundRoomCapacity()) {
      toast.error("Cantidad máxima de huéspedes alcanzada");
      return;
    }
    if (!guestDoc.trim() || !guestName.trim()) return;
    setGuestList(prev => [...prev, { numDocumento: guestDoc, nombre: guestName }]);
    setGuestDoc("");
    setGuestName("");
  };

  const handleRemoveGuest = idx => {
    setGuestList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCheckIn = () => {
    if (!reservationData) return;
    const payload = {
      reservaId: reservationData.id,
      activo: true,
      detalleHuespedes: guestList.map(g => ({
        checkInId: checkinId ?? 0,
        nombre: g.nombre,
        numDocumento: g.numDocumento,
        activo: true
      }))
    };
    axios.post('/Checkins', payload)
      .then(res => {
        toast.success("Check-In realizado con éxito")
      })
      .catch(err => {
        toast.error("Error al procesar Check-In")
      });
  };

  const renderGuestRows = () =>
    guestList.map((guest, index) => (
      <tr key={index}>
        <td>{guest.numDocumento}</td>
        <td>{guest.nombre}</td>
        <td>
          <Button variant="outline-danger" size="sm" onClick={() => handleRemoveGuest(index)}>
            <SlMinus />
          </Button>
        </td>
      </tr>
    ));

  const foundRoomCapacity = () => {
    // sumar capacidad de todas las habitaciones en reservationData.detalles
    return reservationData?.detalles.reduce((sum, d) => sum + (d.cantidadAdultos + d.cantidadNinhos), 0) || 0;
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header><h2 className="mb-0">Check In</h2></Card.Header>
        <Card.Body>
          <Form onSubmit={handleVerification}>
            <Row className="mb-3">
              <Col sm={3}><Form.Label>Código de Reserva</Form.Label></Col>
              <Col sm={6}>
                <Form.Control
                  type="text"
                  placeholder="RES-XXXXXX"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value)}
                />
              </Col>
              <Col sm={3}><Button variant="primary" type="submit">Verificar Reserva</Button></Col>
            </Row>
          </Form>
          {error && <p className="text-danger"><SlClose /> {error}</p>}

          {verified && reservationData && (
            <>
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Cliente:</strong> {reservationData.nombreCliente}</p>
                      <p><strong>Código:</strong> {reservationData.codigo}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Check In:</strong> {reservationData.fechaIngreso.split('T')[0]}</p>
                      <p><strong>Check Out:</strong> {reservationData.fechaSalida.split('T')[0]}</p>
                    </Col>
                  </Row>
                  {reservationData.comentarios && (
                    <Row>
                      <Col><p><strong>Comentarios:</strong> {reservationData.comentarios}</p></Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Header as="h5" className="bg-dark text-white">Detalle de Habitación</Card.Header>
                <Card.Body>
                  <Table striped hover responsive>
                    <thead>
                      <tr>
                        <th>Tipo de Habitación</th>
                        <th>Adultos</th>
                        <th>Niños</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservationData.detalles.map(d => (
                        <tr key={d.id}>
                          <td>{d.tipoHabitacion}</td>
                          <td>{d.cantidadAdultos}</td>
                          <td>{d.cantidadNinhos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Header as="h5" className="bg-dark text-white">Agregar Huésped</Card.Header>
                <Card.Body>
                  <Form>
                    <Row className="align-items-end">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>N° de Documento</Form.Label>
                          <Form.Control
                            type="text"
                            value={guestDoc}
                            onChange={e => setGuestDoc(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Nombre del Huésped</Form.Label>
                          <Form.Control
                            type="text"
                            value={guestName}
                            onChange={e => setGuestName(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Button variant="secondary" onClick={handleAddGuest}>Agregar Huésped</Button>
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
                  <Button variant="primary" onClick={handleCheckIn}><SlCheck /> Realizar Check-In</Button>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReservationCheckIn;
