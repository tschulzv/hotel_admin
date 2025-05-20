import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../config/axiosConfig';

const RoomStatusForm = () => {
  const navigate = useNavigate();
  let { id } = useParams();

  // si existe un id como parametro, es modo edicion
  let isEditMode = id !== undefined;

  const [estado, setEstado] = useState({
    nombre: ''
  });

  useEffect(() => { 
    if (isEditMode) {
      axios.get(`EstadoHabitacions/${id}`)
        .then(res => {
          setEstado({ nombre: res.data.nombre });
        })
        .catch(err => {
          console.error("Error al cargar estado:", err);
        });
    }
  }, [id, isEditMode]);
  

const handleChange = (e) => {
    const { value} = e.target;
    setEstado({nombre: value})
};

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await axios.put(`EstadoHabitacions/${id}`, {
          id: parseInt(id),
          nombre: estado.nombre
        });
      } else {
        await axios.post("EstadoHabitacions", {
          nombre: estado.nombre
        });
      }

      navigate(-1); // Regresa atras despues de guardar
    } catch (error) {
      console.error("Error al guardar estado:", error);
    }
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">{isEditMode ? 'Editar Estado' : 'Nuevo Estado'}</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Estado</Form.Label>
                <Form.Control
                  type="text"
                  name="numero"
                  value={estado.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

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

export default RoomStatusForm;
