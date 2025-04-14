import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RoomTypeNewPage = () => {
  const navigate = useNavigate();

  const [roomTypeData, setRoomTypeData] = useState({
    nombre: '',
    maxOcupacion: '',
    tamaño: '',
    camas: [],
    observaciones: '',
    mostrarEnWeb: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomTypeData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría tu lógica para guardar, por ejemplo una API call.
    console.log('Nuevo tipo de habitación:', roomTypeData);
    navigate('/rooms');  // redirigir de vuelta después de guardar.
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">Crear Nuevo Tipo de Habitación</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Tipo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={roomTypeData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Estándar, Deluxe, Ejecutiva..."
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Máxima Ocupación</Form.Label>
                <Form.Control
                  type="number"
                  name="maxOcupacion"
                  value={roomTypeData.maxOcupacion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tamaño (m²)</Form.Label>
                <Form.Control
                  type="text"
                  name="tamaño"
                  value={roomTypeData.tamaño}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mostrar en Web</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="mostrarEnWeb"
                  label="Sí, mostrar en la web"
                  checked={roomTypeData.mostrarEnWeb}
                  onChange={handleChange}
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
              value={roomTypeData.observaciones}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Aquí en el futuro podrías agregar la gestión de camas o imágenes. */}

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

export default RoomTypeNewPage;
