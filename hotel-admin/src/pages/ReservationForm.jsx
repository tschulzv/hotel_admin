import React, { useState, useMemo, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Modal } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import countryList from 'react-select-country-list';
import axios from '../config/axiosConfig';
import { toast } from 'react-toastify';

const ReservationForm = () => {
  const navigate = useNavigate();
  const countries = useMemo(() => countryList().getData(), []);
  let { id } = useParams();
  let isEditMode = id !== undefined;

  const [reservationData, setReservationData] = useState({
    nombre: '',
    codigo: '',
    checkIn: '',
    checkOut: '',
    llegadaEstimada : '',
    observaciones: '',
    tipoDocumentoId: 0,
    tipoDocumento: '',
    numDocumento: '',
    detalles: []
  });

  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [newDetalle, setNewDetalle] = useState({
    habitacionId: "",
    tipoHabitacionId: "",
    cantidadAdultos: 0,
    cantidadNinhos: 0,
    pensionId: ''
  });

  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);
  const [pensiones, setPensiones] = useState([]);
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [cliente, setCliente] = useState({});
  const [clienteNoEncontrado, setClienteNoEncontrado] = useState(false);
  const [afterSearchText, setAfterSearchText] = useState("");

  useEffect(() => {
    axios.get('/TiposDocumentos')
    .then(response => {
      setTiposDocumentos(response.data);
      console.log(response.data)
    })
    .catch( error => {
      console.error('Error cargando datos:', error);
    });
     
    axios.get('/Pensiones')
    .then(response => {
      setPensiones(response.data);
    }).catch(error => {
      console.error('Error cargando datos:', error);
    })

    axios.get('/Habitacions')
    .then(response => {
      const disponibles = response.data.filter(h => h.estadoNombre === "DISPONIBLE");
      setHabitacionesDisponibles(disponibles);
    }).catch(error => {
      console.error('Error cargando datos:', error);
    })

    }, [])

  useEffect(() => {
    if (isEditMode) {
      axios.get(`/Reservas/${id}`)
        .then(response => {
          const resData = response.data;
          setReservationData({
            ...resData,
            observaciones: resData.comentarios || ''
          });
        })
        .catch(error => console.error("Error al obtener la reserva:", error));
    }
  }, [id, isEditMode]);

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

  const onSearch = async () => {
    try {
      const response = await axios.get(`/Clientes/document/${reservationData.tipoDocumentoId}/${reservationData.numDocumento}`);
      setCliente(response.data);
      setAfterSearchText(`Cliente: ${response.data.nombre} ${response.data.apellido}`);
      setClienteNoEncontrado(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAfterSearchText("No se encontró el cliente.");
        setCliente(null);
        setClienteNoEncontrado(true);
      } else {
        setAfterSearchText("Ocurrió un error al buscar el cliente.");
        setClienteNoEncontrado(false);
        console.error(error);
      }
    }
  };


  const addDetalle = () => {
     const { habitacionId, cantidadAdultos, cantidadNinhos, pensionId } = newDetalle;

      if (!habitacionId || !pensionId || cantidadAdultos === '' || cantidadNinhos === '') {
        toast.error("Por favor, complete todos los campos del detalle.");
        return;
      }


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

    const payload = {
      clienteId: cliente.id, 
      fechaIngreso: reservationData.checkIn,   // formulario: checkIn
      fechaSalida: reservationData.checkOut,     // formulario: checkOut
      llegadaEstimada: reservationData.llegadaEstimada,  
      comentarios: reservationData.observaciones,  // observaciones → comentarios
      estadoId: isEditMode ? reservationData.estadoId : 2, // confirmada por defecto, pues fue hecha por recepcion                              
      detalles: reservationData.detalles.map(det => ({
        habitacionId: parseInt(det.habitacionId),
        cantidadAdultos: parseInt(det.cantidadAdultos),
        cantidadNinhos: parseInt(det.cantidadNinhos),
        pensionId: parseInt(det.pensionId),
        activo: true
      }))
    };

    //console.log('Nueva reserva a enviar:', payload);

    try {
      if (isEditMode) {
        await axios.put(`/Reservas/${id}`, payload);
      } else {
        await axios.post("/Reservas", payload);
      }
      toast.success(`Reserva ${isEditMode ? "editada" : "creada"} con éxito`, {
        onClose: () => {
        navigate('/reservations'); // Navega después que el toast desaparece
        },
        autoClose: 3000, 
      });
      navigate('/reservations');  // redirigir después de guardar
    } catch (error) {
      toast.error("Error al guardar los cambios");
    }
  };

  const handleEliminarDetalle = (index) => {
    setReservationData(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index)
    }));
  };


  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">{isEditMode ? "Editar reserva" : "Nueva reserva"}</h4>
        <Form onSubmit={handleSubmit}>
          <Row className='d-flex align-items-end'>
            <p class="fs-5">Buscar Cliente</p>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>N° Documento</Form.Label>
                <Form.Control
                  type="text"
                  name="numDocumento"
                  value={reservationData.numDocumento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Documento</Form.Label>
                <Form.Select
                name="tipoDocumentoId"
                value={reservationData.tipoDocumentoId || ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                {tiposDocumentos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
                </option>
                ))}
              </Form.Select>            
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex align-items-end mb-3">
                <Button variant="primary" onClick={onSearch}>
                  <i className="material-icons align-middle">search</i>
                </Button>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <p>{afterSearchText}</p>
            </Col>
            <Col md={4}>
              {clienteNoEncontrado && (
              <p>
                <Link to="/clientes/nuevo">¿Crear nuevo cliente?</Link>
              </p>)}
            </Col>
          </Row>

          <Row>
            <Col md={4}>
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
            <Col md={4}>
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Llegada Estimada</Form.Label>
                <Form.Control
                  type="time"
                  name="llegadaEstimada"
                  value={reservationData.llegadaEstimada}
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
            <Button variant="outline-primary" onClick={() => setShowDetalleModal(true)}>
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
                    <li key={index} className="d-flex justify-content-between align-items-center">
                    <span>
                      Habitación: {habitacion ? `#${habitacion.numeroHabitacion} - ${habitacion.tipoHabitacionNombre}` : detalle.habitacionId}, 
                      Adultos: {detalle.cantidadAdultos}, Niños: {detalle.cantidadNinhos}, 
                      Pensión: {pension ? pension.nombre : detalle.pensionId}
                    </span>
                    <span
                        className="material-icons"
                        style={{ cursor: 'pointer', marginRight: '10px', color:"red" }}
                        onClick={() => handleEliminarDetalle(index)}
                        title="Eliminar detalle"
                      >
                      <i className="material-icons">cancel</i>
                    </span>
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
                value={newDetalle.cantidadAdultos ?? 0}
                onChange={handleDetalleChange}
                min="0"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad de Niños</Form.Label>
              <Form.Control
                type="number"
                name="cantidadNinhos"
                value={newDetalle.cantidadNinhos ?? 0}
                onChange={handleDetalleChange}
                min="0"
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
