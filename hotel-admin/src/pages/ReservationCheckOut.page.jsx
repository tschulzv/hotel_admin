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
  const [checkoutData, setCheckoutData] = useState({ detallesCostoHabitaciones: [] }); // Initialize with proper structure
  // Posibles ítems y servicios
  const possibleItems = [
    { descripcion: "Servicio a la Habitación", tarifa: 20 },
    { descripcion: "Gaseosa 500 ml", tarifa: 4 },
    { descripcion: "Gaseosa en lata", tarifa: 3 },
    { descripcion: "Botella de Agua", tarifa: 1.5 },
    { descripcion: "Snack del Mini Bar", tarifa: 3.5 },
    { descripcion: "Lavandería", tarifa: 8 },
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

  // Datos necesarios para el check-out
  const getCheckoutData = async (codigoToUse) => {
    try {
      // Obtener los datos de la reserva
      const { data: reservaData } = await axios.get(
        `/Reservas/${codigoToUse.trim()}/checkoutdata`
      );
      
      console.log("Datos recibidos:", reservaData);
      
      // La estructura es un objeto con detallesCostoHabitaciones array
      if (reservaData && reservaData.detallesCostoHabitaciones && Array.isArray(reservaData.detallesCostoHabitaciones)) {
        setCheckoutData(reservaData);
      } else {
        console.warn("Unexpected data format:", reservaData);
        setCheckoutData({ detallesCostoHabitaciones: [] });
      }
    } catch (err) {
      console.error("Error al obtener los datos de la reserva:", err);
      toast.error("Error al obtener la información de la reserva");
      setCheckoutData({ detallesCostoHabitaciones: [] }); 
    }
  };
  

  const handleVerification = async (e, codigoToVerify = null) => {
    if (e) e.preventDefault();
    const codigoToUse = codigoToVerify || codigo;

    setError("");
    setVerified(false);
    setServices([]);
    setReservaSeleccionada(null);
    setCheckoutData({ detallesCostoHabitaciones: [] });
    
    try {
      // Verificar si existe la reserva y tiene check-in
      const { data } = await axios.get(
        `/Checkouts/verificarReserva/${codigoToUse.trim()}`
      );

      if (!data.success) {
        toast.error("La reserva no tiene check-in activo o no existe");
        return;
      }
      // Si la verificación fue exitosa, guardamos el código de la reserva
      setReservaSeleccionada({ codigo: codigoToUse.trim() });
      console.log("ÉXITO, código:", codigoToUse.trim());

      setVerified(true);

      // Obtener los datos de la reserva para mostrar
      await getCheckoutData(codigoToUse);

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
    console.log(checkoutData);
    axios
      .post("/Checkouts", {
        reservaId: checkoutData.reservaId,
        codigo: checkoutData.codigoReserva,
        activo: true,
      })
      .then(() => {
        toast.success("Check-Out realizado con éxito");
        setVerified(false);
        setCodigo("");
        setServices([]);
        setReservaSeleccionada(null);
        setCheckoutData({ detallesCostoHabitaciones: [] });
      })
      .catch(() => toast.error("Ya se hizo el check-out para esta reserva"));
  };

  // Calculate totals
  const calculateTotal = () => {
    const servicesTotal = services.reduce((sum, item) => sum + item.tarifa, 0);
    const roomTotal = checkoutData.montoTotalAPagar || 0;
    return servicesTotal + roomTotal;
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

          {verified && reservaSeleccionada && (
            <>
              {/* Services consumed */}
              {services.length > 0 && (
                <Card className="mb-4">
                  <Card.Header as="h5" className="bg-dark text-white">
                    Ítems y Servicios Consumidos
                  </Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Ítem/Servicio</th>
                          <th>Tarifa ($)</th>
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
              )}

              {/* Room information */}
              {checkoutData.detallesCostoHabitaciones && checkoutData.detallesCostoHabitaciones.length > 0 && (
                <Card className="mb-4">
                  <Card.Header as="h5" className="bg-dark text-white">
                    Información de la Habitación
                  </Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Habitación</th>
                          <th>Tipo de Habitación</th>
                          <th>Tipo de Pensión</th>
                          <th>Costo Habitación ($)</th>
                          <th>Costo Pensión ($)</th>
                          <th>Total ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {checkoutData.detallesCostoHabitaciones.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.numeroHabitacionAsignada}</td>
                            <td>{item.tipoHabitacionNombre}</td>
                            <td>{item.pensionNombre || 'N/A'}</td>
                            <td>${item.subtotalCostoHabitacion ? item.subtotalCostoHabitacion.toLocaleString() : 'N/A'}</td>
                            <td>${item.subtotalCostoPension ? item.subtotalCostoPension.toLocaleString() : 'N/A'}</td>
                            <td>${item.totalDetalle ? item.totalDetalle.toLocaleString() : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}

              {/* Total summary */}
              <Card className="mb-4">
                <Card.Header as="h5" className="bg-success text-white">
                  Resumen Total
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Código Reserva:</strong> {checkoutData.codigoReserva}</p>
                      <p><strong>Fecha Ingreso:</strong> {new Date(checkoutData.fechaIngreso).toLocaleDateString()}</p>
                      <p><strong>Fecha Salida:</strong> {new Date(checkoutData.fechaSalida).toLocaleDateString()}</p>
                      <p><strong>Noches de Estadía:</strong> {checkoutData.nochesEstadia}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Subtotal Habitaciones:</strong> ${checkoutData.subtotalHabitaciones?.toLocaleString()}</p>
                      <p><strong>Total Pensión:</strong> ${checkoutData.totalAdicionalesPension?.toLocaleString()}</p>
                      <p><strong>Impuestos:</strong> ${checkoutData.impuestos?.toLocaleString()}</p>
                      <p><strong>Total Servicios:</strong> ${services.reduce((sum, item) => sum + item.tarifa, 0).toLocaleString()}</p>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col>
                      <h4><strong>Total Habitación + Pensión:</strong> ${checkoutData.montoTotalAPagar?.toLocaleString()}</h4>
                      <h4><strong>Total General (incluyendo servicios):</strong> ${calculateTotal().toLocaleString()}</h4>
                    </Col>
                  </Row>
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