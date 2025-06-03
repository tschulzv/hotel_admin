import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  Table,
  Form,
} from "react-bootstrap";
import { SlCheck, SlClose } from "react-icons/sl";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "../config/axiosConfig";

const ReservationCheckOut = () => {
  const { codigo: codigoParam } = useParams();
  // Posibles ítems y servicios
  const possibleItems = [
    { descripcion: "Servicio a la Habitación", tarifa: 75000 },
    { descripcion: "Gaseosa 500 ml", tarifa: 15000 },
    { descripcion: "Gaseosa en lata", tarifa: 10000 },
    { descripcion: "Botella de Agua", tarifa: 5000 },
    { descripcion: "Snack del Mini Bar", tarifa: 12000 },
    { descripcion: "Lavandería", tarifa: 30000 },
  ];

  const [codigo, setCodigo] = useState(codigoParam || "");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  // Si viene código en la URL, actualizar el campo
  useEffect(() => {
    if (codigoParam) {
      setCodigo(codigoParam);
      handleVerification(null, codigoParam);
    }
  }, [codigoParam]);

  const handleVerification = async (e, codigoToVerify = null) => {
    if (e) e.preventDefault();
    const codigoToUse = codigoToVerify || codigo;

    setError("");
    setVerified(false);
    setServices([]);
    setReservaSeleccionada(null);
    try {
      // Verificar si existe la reserva y tiene check-in
      const { data } = await axios.get(
        `/Checkouts/verificarReserva/${codigoToUse.trim()}`
      );

      if (!data.success) {
        toast.error("La reserva no tiene check-in activo o no existe");
        return;
      }
      console.log("RESERVA: ", data);
      // Si la verificación fue exitosa, guardamos el código de la reserva
      setReservaSeleccionada({ codigo: codigoToUse.trim() });
      console.log("ÉXITO, código:", codigoToUse.trim());

      setVerified(true);

      // Generar servicios consumidos aleatorios
      const shuffled = [...possibleItems].sort(() => 0.5 - Math.random());
      const count = Math.floor(Math.random() * possibleItems.length) + 1;
      setServices(shuffled.slice(0, count));
    } catch (err) {
      toast.error("Error al verificar la reserva");
      console.log(err);
      return;
    }
  };
  const handleCheckOut = () => {
    if (!reservaSeleccionada) return;
    console.log(reservaSeleccionada);
    axios
      .post("/Checkouts", {
        codigo: reservaSeleccionada.codigo,
        activo: true,
      })
      .then(() => {
        toast.success("Check-Out realizado con éxito");
        setVerified(false);
        setCodigo("");
        setServices([]);
        setReservaSeleccionada(null);
      })
      .catch(() => toast.error("Ya se hizo el check-out para esta reserva"));
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
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </Col>
              <Col sm={3}>
                <Button variant="primary" type="submit">
                  Buscar
                </Button>
              </Col>
            </Row>
          </Form>

          {error && (
            <p style={{ color: "red", marginBottom: "1rem" }}>
              <SlClose /> {error}
            </p>
          )}

          {verified && reservaSeleccionada && services.length > 0 && (
            <>
              <Card className="mb-4">
                <Card.Header as="h5" className="bg-dark text-white">
                  Ítems y Servicios Consumidos
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Ítem/Servicio</th>
                        <th>Tarifa (₲)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.descripcion}</td>
                          <td>{item.tarifa.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              <Row className="justify-content-end">
                <Col xs="auto">
                  <Button variant="primary" onClick={handleCheckOut}>
                    <SlCheck /> Realizar Check-Out
                  </Button>
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
