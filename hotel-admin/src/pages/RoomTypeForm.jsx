import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig';

const RoomTypeNewPage = () => {
  const navigate = useNavigate();

  const [roomTypeData, setRoomTypeData] = useState({
    nombre: '',
    descripcion: '',
    precioBase: 0,
    cantidadDisponible: 0,
    servicios: [],
    activo: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomTypeData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      Nombre: roomTypeData.nombre,
      Descripcion: roomTypeData.descripcion,
      PrecioBase: parseFloat(roomTypeData.precioBase),
      CantidadDisponible: parseInt(roomTypeData.cantidadDisponible),
      Servicios: [] // 🟡 Opcional (no implementado en el formulario)
    };
  
    try {
      await axios.post('/api/TiposHabitaciones', payload);
      navigate('/rooms');
    } catch (error) {
      console.error('Error creando el tipo de habitación:', error);
    }
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
            <Col md={4}>
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Precio Base</Form.Label>
                <Form.Control
                  type="number"
                  name="precioBase"
                  value={roomTypeData.precioBase}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Cantidad Disponible</Form.Label>
                <Form.Control
                  type="number"
                  name="cantidadDisponible"
                  value={roomTypeData.cantidadDisponible}
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
