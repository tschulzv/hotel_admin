import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

const RoomForm = ({ initialData = {}, onSubmit }) => {
  const [roomData, setRoomData] = useState({
    numero: initialData.numero || '',
    tipo: initialData.tipo || 'Estándar',
    maxOcupacion: initialData.maxOcupacion || '',
    tamaño: initialData.tamaño || '',
    camas: initialData.camas || [],
    observaciones: initialData.observaciones || '',
    mostrarEnWeb: initialData.mostrarEnWeb || false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(roomData);
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4"> {initialData.numero ? 'Editar' : 'Nueva'} Habitación </h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Número</Form.Label>
                <Form.Control
                  type="text"
                  name="numero"
                  value={roomData.numero}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Select name="tipo" value={roomData.tipo} onChange={handleChange}>
                  <option>Estándar</option>
                  <option>Deluxe</option>
                  <option>Ejecutiva</option>
                  <option>Presidencial</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Máxima Ocupación</Form.Label>
                <Form.Control
                  type="number"
                  name="maxOcupacion"
                  value={roomData.maxOcupacion}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tamaño</Form.Label>
                <Form.Control
                  type="text"
                  name="tamaño"
                  value={roomData.tamaño}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Aquí iría la lógica de agregar camas, imágenes, observaciones, etc. */}

          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observaciones"
              value={roomData.observaciones}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="primary" type="submit">
              Guardar
            </Button>
            <Button variant="secondary" onClick={() => window.history.back()}>
              Cancelar
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default RoomForm;
