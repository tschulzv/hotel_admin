import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Carousel, Image, Dropdown, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../config/axiosConfig';
import Select from 'react-select';
import IconPickerGrid from '../components/IconPickerGrid';
import { toast } from 'react-toastify';


const RoomTypeNewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [showCreateServiceModal, setShowCreateServiceModal] = useState(false);
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
  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: '', 
    iconName: ''
  })

  const [imagenes, setImagenes] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const fetchServicios = async () => {
      try {
        const response = await axios.get('Servicios');
        setServicios(response.data);
      } catch (error) {
        console.error('Error cargando servicios:', error);
      }
  };

  useEffect(() => {
    
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

  // MODAL DE CREACION DE SERVICIO
  const handleOpenModal = () => {
    setShowCreateServiceModal(true);
  }

  const handleCloseModal = () => {
    setShowCreateServiceModal(false);
  }


  const handleNuevoServicioChange = (e) => {
    const { name, value } = e.target;
    setNuevoServicio(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  // Para cada opción, renderizamos un icono + nombre
  const customSingleValue = ({ data }) => (
    <div className="d-flex align-items-center">
      <span className="material-icons me-2">{data.value}</span>
      {data.label}
    </div>
  );

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} className="d-flex align-items-center p-2">
        <span className="material-icons me-2">{data.value}</span>
        {data.label}
      </div>
    );
  };

  const handleCrearServicio = async () => {
    const { nombre, iconName } = nuevoServicio;

    if (nombre.length < 3 || iconName.length < 3) {
      toast.error("Campos inválidos");
      return;
    }

    const payload = {
      nombre,
      iconName,
    };

    try {
      const response = await axios.post("/Servicios", payload);
      toast.success("Servicio creado correctamente");
      
      await fetchServicios();

      // Limpiar campos
      setNuevoServicio({ nombre: "", iconName: "" });

      handleCloseModal();
    } catch (error) {
      console.error("Error al crear servicio:", error);
      toast.error("Error al crear el servicio");
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
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={roomTypeData.descripcion}
              onChange={handleChange}
            />
          </Form.Group>

          <Row className="align-items-end">
            {/* Dropdown de servicios */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Servicios</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-servicios">
                    Seleccionar servicios
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {servicios.map(servicio => (
                      <Form.Check
                        key={servicio.id}
                        type="checkbox"
                        id={`servicio-${servicio.id}`}
                        label={servicio.nombre}
                        className="mx-3"
                        checked={roomTypeData.servicios.includes(servicio.id)}
                        onChange={() => handleServicioChange(servicio.id)}
                      />
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Col>

            {/* Lista de servicios seleccionados */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Seleccionados</Form.Label>
                <div className="border rounded p-2 bg-light" style={{ minHeight: '38px' }}>
                  {roomTypeData.servicios.length > 0 ? (
                    roomTypeData.servicios
                      .map(id => servicios.find(s => s.id === id)?.nombre)
                      .filter(Boolean)
                      .join(', ')
                  ) : (
                    <span className="text-muted">Ninguno</span>
                  )}
                </div>
              </Form.Group>
            </Col>

            {/* Botón de crear servicio */}
            <Col md={2} className="mb-3">
              <Button variant="primary" onClick={handleOpenModal}>
                Crear servicio
              </Button>
            </Col>
          </Row>

           
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

        {/*MODAL CREACION DE SERVICIOS*/ }
         <Modal show={showCreateServiceModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Crear Servicio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={nuevoServicio.nombre}
                onChange={handleNuevoServicioChange}
                placeholder="Ingrese el nombre del servicio"
                required
              />
            </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ícono</Form.Label>
            <IconPickerGrid
              selected={nuevoServicio.iconName}
              onSelect={(iconName) =>
                setNuevoServicio(prev => ({ ...prev, iconName }))
              }
            />
          </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCrearServicio}>
              Crear
            </Button>
          </Modal.Footer>
        </Modal>

      </Card>
    </Container>
  );
};

export default RoomTypeNewPage;
