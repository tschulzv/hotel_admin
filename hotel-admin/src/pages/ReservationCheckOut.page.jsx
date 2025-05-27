import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card, Table, Form } from "react-bootstrap";
import { SlCheck, SlClose } from "react-icons/sl";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../config/axiosConfig';

const ReservationCheckOut = () => {
  // Posibles ítems y servicios
  const possibleItems = [
    { descripcion: "Servicio a la Habitación", tarifa: 75000 },
    { descripcion: "Gaseosa 500 ml", tarifa: 15000 },
    { descripcion: "Gaseosa en lata", tarifa: 10000 },
    { descripcion: "Botella de Agua", tarifa: 5000 },
    { descripcion: "Snack del Mini Bar", tarifa: 12000 },
    { descripcion: "Lavandería", tarifa: 30000 },
  ];

  const [roomData, setRoomData] = useState("");
  const [reservas, setReservas] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);

  // Cargar reservas y check-ins
  useEffect(() => {
    axios.get('/Reservas')
      .then(res => setReservas(res.data))
      .catch(err => console.error(err));

    axios.get('/Checkin')
      .then(res => setCheckins(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleVerification = (e) => {
    e.preventDefault();
    const numero = roomData.trim();
    // Buscar reserva que incluya esa habitación
    const reserva = reservas.find(r =>
      r.detalles.some(d => d.numeroHabitacion?.toString() === numero)
    );
    if (!reserva) {
      setError("Habitación no reservada o no existe.");
      setVerified(false);
      setServices([]);
      return;
    }
    // Buscar checkin activo para esa reserva
    const checkin = checkins.find(c => c.reservaId === reserva.id && c.activo);
    if (!checkin) {
      setError("No hay un check-in activo para esta habitación.");
      setVerified(false);
      setServices([]);
      return;
    }
    // Todo bien, seleccionar servicios
    setError("");
    setVerified(true);
    const shuffled = [...possibleItems].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * possibleItems.length) + 1;
    setServices(shuffled.slice(0, count));
  };

  const handleCheckOut = () => {
    axios.post('/Checkouts', {
      habitacion: roomData,
      items: services.map(item => ({ descripcion: item.descripcion, tarifa: item.tarifa })),
    })
    .then(() => {
      toast.success('Check-Out realizado con éxito');
      setVerified(false);
      setRoomData("");
      setServices([]);
    })
    .catch(() => {
      toast.error('Error al procesar Check-Out');
    });
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header>
          <h2 className="mb-0">Check-Out</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleVerification}>
            <Row className="mb-3">
              <Col sm={3}><Form.Label>Número de Habitación</Form.Label></Col>
              <Col sm={6}>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el número de habitación"
                  value={roomData}
                  onChange={e => setRoomData(e.target.value)}
                />
              </Col>
              <Col sm={3}><Button variant="primary" type="submit">Buscar</Button></Col>
            </Row>
          </Form>

          {error && <p style={{ color: 'red', marginBottom: '1rem' }}><SlClose /> {error}</p>}

          {verified && services.length > 0 && (
            <>
              <Card className="mb-4">
                <Card.Header as="h5" className="bg-dark text-white">Ítems y Servicios Consumidos</Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr><th>Ítem/Servicio</th><th>Tarifa (₲)</th></tr>
                    </thead>
                    <tbody>
                      {services.map((item, idx) => (
                        <tr key={idx}><td>{item.descripcion}</td><td>{item.tarifa.toLocaleString()}</td></tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              <Row className="justify-content-end">
                <Col xs="auto">
                  <Button variant="primary" onClick={handleCheckOut}><SlCheck /> Realizar Check-Out</Button>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default ReservationCheckOut;
