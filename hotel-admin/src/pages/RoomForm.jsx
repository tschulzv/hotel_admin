import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const RoomForm = ({ onSubmit }) => {
  const navigate = useNavigate();

  let { id } = useParams();
  // si existe un id como parametro, es modo edicion
  let isEditMode = id !== undefined;

  const [roomData, setRoomData] = useState({
    numero: '',
    tipo: 'Estándar',
    maxOcupacion: '',
    tamaño: '',
    camas: [],
    observaciones: '',
    mostrarEnWeb: false,
  });

  // Simula la carga de datos de la habitación en modo edición
  useEffect(() => {
    if (isEditMode) {
      // Simula datos de una habitación en modo edición
      const fetchedRoomData = {
        numero: '101',
        tipo: 'Deluxe',
        maxOcupacion: 4,
        tamaño: '40m²',
        camas: ['King'],
        observaciones: 'Habitación con vista al mar.',
        mostrarEnWeb: true,
      };
      setRoomData(fetchedRoomData);
    }
  }, [isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(roomData);
    navigate('/rooms'); // Redirige a la lista de habitaciones después de guardar
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">{isEditMode ? 'Editar Habitación' : 'Nueva Habitación'}</h4>
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
                  disabled={isEditMode} // Deshabilita el campo en modo edición
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

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Mostrar en la web"
              name="mostrarEnWeb"
              checked={roomData.mostrarEnWeb}
              onChange={handleChange}
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

export default RoomForm;
