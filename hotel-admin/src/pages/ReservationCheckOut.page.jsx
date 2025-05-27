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

  const [codigo, setCodigo] = useState("");
  const [reservas, setReservas] = useState([]);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  // Cargar todas las reservas
  useEffect(() => {
    axios.get('/Reservas')
      .then(res => setReservas(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");
    setVerified(false);
    setServices([]);
    setReservaSeleccionada(null);

    const found = reservas.find(r => r.codigo === codigo.trim());
    if (!found) {
      setError("Reserva no encontrada por código.");
      return;
    }

    try {
      // Verificar si ya se realizó checkout
      const { data: checkout } = await axios.get(`/Checkouts?reservaId=${found.id}`);
      if (checkout && checkout.activo) {
        setError("El Check-Out ya fue realizado para esta reserva.");
        return;
      }
    } catch (err) {
      // si el endpoint devuelve 404 o array vacío, no hay checkout previo
    }

    // Si no hay checkout previo, permitimos
    setReservaSeleccionada(found);
    setVerified(true);

    // Generar servicios consumidos aleatorios
    const shuffled = [...possibleItems].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * possibleItems.length) + 1;
    setServices(shuffled.slice(0, count));
  };

  const handleCheckOut = () => {
    if (!reservaSeleccionada) return;
    axios.post('/Checkouts', {
      reservaId: reservaSeleccionada.id,
      activo: true
    })
      .then(() => {
        toast.success('Check-Out realizado con éxito');
        setVerified(false);
        setCodigo("");
        setServices([]);
        setReservaSeleccionada(null);
      })
      .catch(() => toast.error('Error al procesar Check-Out'));
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
              <Col sm={3}>
                <Form.Label>Código de Reserva</Form.Label>
              </Col>
              <Col sm={6}>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el código de reserva"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value)}
                />
              </Col>
              <Col sm={3}>
                <Button variant="primary" type="submit">Buscar</Button>
              </Col>
            </Row>
          </Form>

          {error && <p style={{ color: 'red', marginBottom: '1rem' }}><SlClose /> {error}</p>}

          {verified && reservaSeleccionada && services.length > 0 && (
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
