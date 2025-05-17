import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Carousel, Image } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../config/axiosConfig';

const RoomTypeNewPage = () => {
  const { id } = useParams();
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

  const [imagenes, setImagenes] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get('Servicios');
        setServicios(response.data);
      } catch (error) {
        console.error('Error cargando servicios:', error);
      }
    };

    const fetchRoomType = async () => {
      if (id && id.trim() !== '') {
        try {
          const response = await axios.get(`TiposHabitaciones/${id}`);
          const roomType = response.data;
          setRoomTypeData({
            nombre: roomType.nombre,
            descripcion: roomType.descripcion,
            precioBase: roomType.precioBase,
            cantidadDisponible: roomType.cantidadDisponible,
            maximaOcupacion: roomType.maximaOcupacion,
            tamanho: roomType.tamanho,
            servicios: roomType.servicios.map(s => s.id),
            activo: roomType.activo
          });
          setPreviewUrls(roomType.imagenes.map(img => ({ url: img.url, id: img.id })));
        } catch (error) {
          console.error('Error cargando el tipo de habitación:', error);
        }
      }
    };

    fetchServicios();
    fetchRoomType();
  }, [id]);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenes(files);

    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...urls.map(url => ({ url, id: null }))]);
  };

  const handleRemoveImage = (imageId) => {
    if (imageId) {
      // Eliminar imagen existente del backend
      console.log(imageId);
      axios.delete(`ImagenHabitacions/${imageId}`)
        .then(() => {
          setPreviewUrls(prev => prev.filter(img => img.id !== imageId));
        })
        .catch(error => console.error('Error eliminando imagen:', error));
    } else {
      // Eliminar imagen recién cargada
      setPreviewUrls(prev => prev.filter(img => img.id !== imageId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (id) {
      formData.append("Id", id); // Solo incluir el Id si es una actualización
    }
    formData.append('Nombre', roomTypeData.nombre);
    formData.append('Descripcion', roomTypeData.descripcion);
    formData.append('PrecioBase', parseFloat(roomTypeData.precioBase));
    formData.append('CantidadDisponible', parseInt(roomTypeData.cantidadDisponible));
    formData.append('MaximaOcupacion', parseInt(roomTypeData.maximaOcupacion));
    formData.append('Tamanho', parseInt(roomTypeData.tamanho));

    roomTypeData.servicios.forEach(id => {
      formData.append('Servicios', id);
    });

    imagenes.forEach((imagen) => {
      formData.append('Imagenes', imagen);
    });
    try {
      for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
      if (id && id.trim() !== '') {
        await axios.put(`TiposHabitaciones/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('TiposHabitaciones/ConImagenes', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/roomstype');
    } catch (error) {
      if (error.response) {
        console.error('Detalles del error 400:', error.response.data);
      } else {
        console.error('Error creando o actualizando el tipo de habitación:', error);
      }
    }
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">{id ? 'Editar Tipo de Habitación' : 'Crear Nuevo Tipo de Habitación'}</h4>
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

          <Form.Group className="mb-3">
            <Form.Label>Imágenes</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>

          {previewUrls.length > 0 && (
            <Row className="mb-3">
              {previewUrls.map((img, idx) => (
                <Col md={3} key={idx} className="position-relative">
                  <Image
                    src={img.url}
                    alt={`Imagen ${idx + 1}`}
                    thumbnail
                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0"
                    onClick={() => handleRemoveImage(img.id)}
                  >
                    &times;
                  </Button>
                </Col>
              ))}
            </Row>
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
    </Container>
  );
};

export default RoomTypeNewPage;
