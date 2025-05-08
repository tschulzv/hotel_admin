import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig';

const RoomTypeNewPage = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [roomTypeData, setRoomTypeData] = useState({
    nombre: '',
    descripcion: '',
    precioBase: 0,
    cantidadDisponible: 0,
    maximaOcupacion: 0,
    tamanho: 0,
    servicios: [],
    activo: true
  });

  // Cargar servicios disponibles
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get('Servicios');
        setServicios(response.data);
      } catch (error) {
        console.error('Error cargando servicios:', error);
      }
    };
    fetchServicios();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomTypeData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServicioChange = (servicioId) => {
    setRoomTypeData(prev => {
      const nuevosServicios = prev.servicios.includes(servicioId)
        ? prev.servicios.filter(id => id !== servicioId)
        : [...prev.servicios, servicioId];
      
      return { ...prev, servicios: nuevosServicios };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      Nombre: roomTypeData.nombre,
      Descripcion: roomTypeData.descripcion,
      PrecioBase: parseFloat(roomTypeData.precioBase),
      CantidadDisponible: parseInt(roomTypeData.cantidadDisponible),
      MaximaOcupacion: parseInt(roomTypeData.maximaOcupacion),
      Tamanho: parseInt(roomTypeData.tamanho),
      Servicios: roomTypeData.servicios.map(id => ({
        Id: id,
        Nombre: servicios.find(s => s.id === id)?.nombre,  // Agregar el nombre del servicio
        IconName: servicios.find(s => s.id === id)?.iconName  // Agregar el icono del servicio
      }))
    };
  
    try {
      await axios.post('TiposHabitaciones', payload);
      navigate('/rooms');
    } catch (error) {
      if (error.response) {
        console.error('Detalles del error 400:', error.response.data);
      } else {
        console.error('Error creando el tipo de habitación:', error);
      }
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
                  name="maximaOcupacion"
                  value={roomTypeData.maximaOcupacion}
                  onChange={handleChange}
                  min="1"
                  max="6"
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
                  type="number"
                  name="tamanho"
                  value={roomTypeData.tamanho}
                  onChange={handleChange}
                  min="10"
                  max="500"
                  required
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
                  step="0.01"
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
                  min="0"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Servicios</Form.Label>
            <Row>
              {servicios.map(servicio => (
                <Col md={4} key={servicio.id}>
                  <Form.Check 
                    type="checkbox"
                    id={`servicio-${servicio.id}`}
                    label={servicio.nombre}
                    checked={roomTypeData.servicios.includes(servicio.id)}
                    onChange={() => handleServicioChange(servicio.id)}
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={roomTypeData.descripcion}
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

export default RoomTypeNewPage;