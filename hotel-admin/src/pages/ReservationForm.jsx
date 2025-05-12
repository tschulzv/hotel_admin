import React, { useState, useMemo, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import countryList from 'react-select-country-list';
import axios from '../config/axiosConfig';

const ReservationForm = () => {
  const navigate = useNavigate();
  const countries = useMemo(() => countryList().getData(), []);
  let { id } = useParams();
  let isEditMode = id !== undefined;

  const [reservationData, setReservationData] = useState({
    nombre: isEditMode ? reservation.nombre : '',
    codigo: isEditMode ? reservation.codigo : '',
    checkIn: isEditMode ? reservation.checkIn : '',
    checkOut: isEditMode ? reservation.checkOut : '',
    estado: isEditMode ? reservation.estado : '',
    observaciones: isEditMode ? reservation.observaciones : '',
    detalles: isEditMode ? reservation.detalles : []  // se guardarán los detalles
  });

  // Estado para controlar el modal de detalle y sus campos
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [newDetalle, setNewDetalle] = useState({
    habitacionId: '',
    cantidadAdultos: '',
    cantidadNinhos: '',
    pensionId: ''
  });

  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);
  const [pensiones, setPensiones] = useState([]);

  // Cargar habitaciones cuyo estadoNombre sea "DISPONIBLE"
  useEffect(() => {
    axios.get("/Habitacions")
      .then(response => {
        const disponibles = response.data.filter(h => h.estadoNombre === "DISPONIBLE");
        setHabitacionesDisponibles(disponibles);
      })
      .catch(error => console.error("Error obteniendo habitaciones:", error));
  }, []);

  // Cargar pensiones desde la API
  useEffect(() => {
    axios.get("/Pensiones")
      .then(response => {
        setPensiones(response.data);
      })
      .catch(error => console.error("Error obteniendo pensiones:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDetalleChange = (e) => {
    const { name, value } = e.target;
    setNewDetalle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addDetalle = () => {
    setReservationData(prev => ({
      ...prev,
      detalles: [...prev.detalles, { ...newDetalle, activo: true }]
    }));
    setNewDetalle({
      habitacionId: '',
      cantidadAdultos: '',
      cantidadNinhos: '',
      pensionId: ''
    });
    setShowDetalleModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Transformar reservationData al formato esperado por la API
    // Ajusta los valores según corresponda (por ejemplo, clienteId se debe obtener o asignar, lo mismo para estadoId y llegadaEstimada)
    const payload = {
      clienteId: 1, // O asigna el id de cliente correcto
      codigo: reservationData.codigo,
      fechaIngreso: reservationData.checkIn,   // formulario: checkIn
      fechaSalida: reservationData.checkOut,     // formulario: checkOut
      llegadaEstimada: "12:00:00",                 // podrías obtener este dato del formulario si lo requieres
      comentarios: reservationData.observaciones,  // observaciones → comentarios
      estadoId: 1,                               // Asigna un valor por defecto o proveniente de otro campo
      detalles: reservationData.detalles.map(det => ({
        habitacionId: parseInt(det.habitacionId),
        cantidadAdultos: parseInt(det.cantidadAdultos),
        cantidadNinhos: parseInt(det.cantidadNinhos),
        pensionId: parseInt(det.pensionId),
        activo: true
      }))
    };

    console.log('Nueva reserva a enviar:', payload);

    try {
      if (isEditMode) {
        await axios.put(`/Reservas/${id}`, payload);
      } else {
        await axios.post("/Reservas", payload);
      }
      navigate('/reservations');  // redirigir después de guardar
    } catch (error) {
      console.error("Error enviando reserva:", error);
    }
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
                  value={reservationData.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Código</Form.Label>
                <Form.Control
                  type="text"
                  name="codigo"
                  value={reservationData.codigo}
                  onChange={handleChange}
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
                  value={reservationData.checkIn}
                  onChange={handleChange}
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
                  value={reservationData.checkOut}
                  onChange={handleChange}
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
              value={reservationData.observaciones}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Botón para abrir el modal y agregar detalle */}
          <div className="mb-3">
            <Button variant="primary" onClick={() => setShowDetalleModal(true)}>
              Agregar Habitaciones
            </Button>
          </div>

          {/* Mostrar resumen de Habitaciones agregadas */}
          {reservationData.detalles.length > 0 && (
            <div className="mb-3">
              <h6>Habitaciones:</h6>
              <ul>
                {reservationData.detalles.map((detalle, index) => {
                  const habitacion = habitacionesDisponibles.find(
                    h => Number(h.id) === Number(detalle.habitacionId)
                  );
                  const pension = pensiones.find(
                    p => Number(p.id) === Number(detalle.pensionId)
                  );
                  return (
                    <li key={index}>
                      Habitación: {habitacion ? `#${habitacion.numeroHabitacion} - ${habitacion.tipoHabitacionNombre}` : detalle.habitacionId}, 
                      Adultos: {detalle.cantidadAdultos}, Niños: {detalle.cantidadNinhos}, 
                      Pensión: {pension ? pension.nombre : detalle.pensionId}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

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

      {/* Modal para agregar detalle de habitación */}
      <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Habitaciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Habitación</Form.Label>
              <Form.Control
                as="select"
                name="habitacionId"
                value={newDetalle.habitacionId}
                onChange={handleDetalleChange}
                required
              >
                <option value="">Seleccione una Habitación</option>
                {habitacionesDisponibles.map(habitacion => (
                  <option key={habitacion.id} value={habitacion.id}>
                    #{habitacion.numeroHabitacion} - {habitacion.tipoHabitacionNombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad de Adultos</Form.Label>
              <Form.Control
                type="number"
                name="cantidadAdultos"
                value={newDetalle.cantidadAdultos}
                onChange={handleDetalleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad de Niños</Form.Label>
              <Form.Control
                type="number"
                name="cantidadNinhos"
                value={newDetalle.cantidadNinhos}
                onChange={handleDetalleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID de Pensión</Form.Label>
              <Form.Control
                as="select"
                name="pensionId"
                value={newDetalle.pensionId}
                onChange={handleDetalleChange}
                required
              >
                <option value="">Seleccione una Pensión</option>
                {pensiones.map(pension => (
                  <option key={pension.id} value={pension.id}>
                    {pension.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={addDetalle}>
            Agregar Detalle
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReservationForm;
