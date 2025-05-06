import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../config/axiosConfig';

const RoomForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [estados, setEstados] = useState([]);
  const [tipos, setTipos] = useState([]);

  let { id } = useParams();
  // si existe un id como parametro, es modo edicion
  let isEditMode = id !== undefined;

  const [roomData, setRoomData] = useState({
    numero: '',
    tipoHabitacionId: '',
    maxOcupacion: '',
    tamaño: '',
    estadoHabitacionId: '',
    camas: [],
    observaciones: '',
    mostrarEnWeb: false,
  });
  useEffect(() => {
    const fetchFiltros = async () => {
      try {
        const [estadosRes, tiposRes] = await Promise.all([
          axios.get("EstadoHabitacions"),
          axios.get("TiposHabitaciones")
        ]);
        // Establecer valores iniciales para IDs
        setRoomData(prev => ({
          ...prev,
          tipoHabitacionId: tiposRes.data[0]?.id || '', // 🟡 Primer ID como default
          estadoHabitacionId: estadosRes.data[0]?.id || '',
        }));

        setEstados(estadosRes.data);  // Estado de habitaciones
        setTipos(tiposRes.data);      // Tipos de habitaciones
      } catch (err) {
        console.error("Error cargando filtros:", err);
      }
    };

    fetchFiltros();
  }, []); // El array vacío asegura que esto se ejecute solo una vez al cargar el componente.

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      NumeroHabitacion: parseInt(roomData.numero),
      TipoHabitacionId: roomData.tipoHabitacionId,
      EstadoHabitacionId: roomData.estadoHabitacionId,
      Observaciones: roomData.observaciones,
      Activo: roomData.activo,
    };
    
    try {
      if (isEditMode) {
        await axios.put(`Habitacions/${id}`, payload);
      } else {
        await axios.post("Habitacions", payload);
      }
      navigate('/rooms');
    } catch (error) {
      console.error("Error al guardar la habitación:", error);
    }

    onSubmit && onSubmit(roomData);
    navigate('/rooms'); // Redirige a la lista de habitaciones después de guardar
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">{isEditMode ? 'Editar Habitación' : 'Nueva Habitación'}</h4>
        {console.log(roomData)}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4}>
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Select name="tipoHabitacionId" value={roomData.tipoHabitacionId} onChange={handleChange}>
                  {tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select name="estadoHabitacionId" value={roomData.estadoHabitacionId} onChange={handleChange}>
                  {estados.map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.nombre}
                    </option>
                  ))}
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
