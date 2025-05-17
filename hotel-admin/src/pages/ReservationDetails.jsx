import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, ListGroup, Accordion } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../config/axiosConfig'

function ReservationDetails() {
  const { id } = useParams() // id de la reserva pasada en la URL
  const [reservation, setReservation] = useState(null)
  const [details, setDetails] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`/Reservas/${id}`)
      .then(async response => {
        const reserva = response.data;

        try {
          const estadoResponse = await axios.get(`/EstadoReservas/${reserva.estadoId}`);
          const estado = estadoResponse.data;

          reserva.estadoNombre = estado.nombre;
        } catch (error) {
          console.error("Error al obtener el estado de la reserva:", error);
        }

        setReservation(reserva);
        setDetails(reserva.detalles || []);
      })
      .catch(error => {
        console.error("Error al obtener la reserva:", error)
      })
  }, [id])

  if (!reservation) {
    return (
      <Container className="py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <div>Cargando...</div>
      </Container>
    )
  }

  // formatear la fecha
  const obtenerFormatoFecha = (fechaStr) => {
    const fecha = new Date(fechaStr)
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones)
    return fechaFormateada 
  };

  return (
    <Container className="py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Título + Icono volver */}
      <div className="mb-4 d-flex align-items-center">
        <span
          className="material-icons me-2"
          role="button"
          onClick={() => navigate(-1)}
          style={{ cursor: 'pointer' }}
          title="Volver"
        >
          arrow_back
        </span>
        <h2 style={{ color: '#2c3e50' }}>Reserva</h2>
      </div>

      <Row className="gy-4">
        {/* Card de Reserva */}
        <Col md={6}>
          <h4 className="mb-3">Detalles</h4>
          <Card className="p-4 shadow-sm border-0 rounded-4">
            <ListGroup variant="flush no-borders">
              <ListGroup.Item><strong>Titular:</strong> {reservation.nombreCliente}</ListGroup.Item>
              <ListGroup.Item><strong>Código:</strong> {reservation.codigo}</ListGroup.Item>
              <ListGroup.Item><strong>Check-In:</strong> {obtenerFormatoFecha(reservation.fechaIngreso)}</ListGroup.Item>
              <ListGroup.Item><strong>Check-Out:</strong> {obtenerFormatoFecha(reservation.fechaSalida)}</ListGroup.Item>
              <ListGroup.Item><strong>Hora estimada de llegada:</strong> {reservation.llegadaEstimada}</ListGroup.Item>
              <ListGroup.Item><strong>Estado:</strong> {reservation.estadoNombre}</ListGroup.Item>
              <ListGroup.Item><strong>Observaciones:</strong> {reservation.comentarios}</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        {/* Acordeón de Habitaciones */}
        <Col md={6}>
          <h4 className="mb-3">Habitaciones</h4>
          {reservation.estado === 'Pendiente' || details.length === 0 ? (
            <h5 className="text-muted">Aún no se asignaron habitaciones</h5>
          ) : (
            <Accordion alwaysOpen defaultActiveKey="0">
              {details.map((detail, i) => (
                <Accordion.Item eventKey={i.toString()} key={i}>
                  <Accordion.Header>
                    {/* Si la reserva incluye la información de la habitación, se muestra el número y tipo; sino se muestra el id */}
                    Habitación {detail.habitacion && detail.habitacion.numeroHabitacion 
                      ? `#${detail.habitacion.numeroHabitacion} - ${detail.habitacion.tipoHabitacionNombre}` 
                      : detail.habitacionId}
                  </Accordion.Header>
                  <Accordion.Body>
                    <ListGroup variant="flush no-borders" className="no-item-borders">
                      <ListGroup.Item>
                        <strong>Cantidad de Adultos:</strong> {detail.cantidadAdultos}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Cantidad de Niños:</strong> {detail.cantidadNinhos}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Tipo de Pensión:</strong> {detail.pension && detail.pension.nombre 
                          ? detail.pension.nombre 
                          : detail.pensionId}
                      </ListGroup.Item>
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ReservationDetails
