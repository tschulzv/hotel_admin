import React, { useState, useMemo } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
//import Select from 'react-select'
import countryList from 'react-select-country-list'

const ReservationForm = () => {
  // reserva DE EJEMPLO, BORRAR CUANDO FUNCIONE LA API!!
  // useEffect y obtener datos del resevra de la db si se le pasa un id
  let reservation = {
    id: 1,
    nombre: "María Pérez",
    codigo: "ID12345",
    habitaciones: "101, 102",
    checkIn: "2025-04-10",
    checkOut: "2025-04-15",
    estado: "Activa",
    observaciones: "Solicitó servicio de desayuno a la habitación"
  }
  // 
  const navigate = useNavigate();
  const countries = useMemo(() => countryList().getData(), []);
  
  let { id } = useParams();
  // si existe un id como parametro, es modo edicion
  let isEditMode = id !== undefined;

  const [reservationData, setReservationData] = useState({
    nombre: isEditMode ? reservation.nombre : '',
    codigo: isEditMode ? reservation.codigo : '',
    habitaciones: isEditMode ? reservation.habitaciones : '',
    checkIn: isEditMode ? reservation.checkIn : '',
    checkOut: isEditMode ? reservation.checkOut : '',
    estado: isEditMode ? reservation.estado : ''
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setReservationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nuevo reservatione:', reservationData);
    if (isEditMode){
      // hacer put a la api
    } else {
      // hacer post a la api
    }
    navigate('/reservations');  // redirigir de vuelta después de guardar.
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">{isEditMode ? "Editar reserva" : "Nueva reserva"}</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cliente</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value= {reservationData.nombre}
                  onChange={handleChange}
                  disabled={isDetailsMode}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Codigo</Form.Label>
                <Form.Control
                  type="text"
                  name="codigo"
                  value= {reservationData.codigo}
                  onChange={handleChange}
                  disabled={isDetailsMode}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Habitaciones</Form.Label>
                <Form.Control
                  type="text"
                  name="habitaciones"
                  value= {reservationData.habitaciones}
                  onChange={handleChange}
                  disabled={isDetailsMode}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Check-In</Form.Label>
                <Form.Control
                  type="date"
                  name="checkIn"
                  value= {reservationData.checkIn}
                  onChange={handleChange}
                  disabled={isDetailsMode}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Check-Out</Form.Label>
                <Form.Control
                  type="date"
                  name="checkOut"
                  value= {reservationData.checkOut}
                  onChange={handleChange}
                  disabled={isDetailsMode}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observaciones"
              value= {reservationData.observaciones}
              onChange={handleChange}
              disabled={isDetailsMode}
            />
          </Form.Group>


          <div className="d-flex justify-content-end gap-2">
            <Button variant="primary" type="submit">
              Guardar
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default ReservationForm;
