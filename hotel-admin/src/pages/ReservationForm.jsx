import React, { useState, useMemo, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Modal, CloseButton } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import countryList from 'react-select-country-list';
import axios from '../config/axiosConfig';
import { toast } from 'react-toastify';
//THE ORIGINAL RESERVA
const ReservationForm = () => {
  const navigate = useNavigate();
  const countries = useMemo(() => countryList().getData(), []);
  let { id } = useParams();
  let isEditMode = id !== undefined;
  const [newRooms, setNewRooms] = useState([
    {
      tipoHabitacionId: 1,
      habitacionId: 0,
      cantidadAdultos: 1,
      cantidadNinhos: 0,
      pensionId: 1
    }
  ]);
  const [reservationData, setReservationData] = useState({
    nombre: '',
    codigo: '',
    fechaIngreso: '',
    fechaSalida: '',
    llegadaEstimada: '',
    observaciones: '',
    tipoDocumentoId: 0,
    tipoDocumento: '',
    numDocumento: '',
    detalles: []
  });

  const [showDetalleModal, setShowDetalleModal] = useState(false);

  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);
  const [tiposHabitaciones, setTiposHabitaciones] = useState([]);
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
      .catch(error => {
        console.error('Error cargando datos:', error);
        toast.error("Error cargando datos")
      });

    axios.get('/Pensiones')
      .then(response => {
        setPensiones(response.data);
      }).catch(error => {
        console.error('Error cargando datos:', error);
        toast.error("Error cargando datos");
      })

    axios.get('/TiposHabitaciones')
      .then(response => {
        setTiposHabitaciones(response.data);
      }).catch(err => {
        console.error('Error cargando datos:', error);
        toast.error("Error cargando datos");
      })
   

  }, [])

  useEffect(() => {
    if (isEditMode) {
      axios.get(`/Reservas/${id}`)
        .then(response => {
          const resData = response.data;
          setReservationData({
            ...resData,
            fechaIngreso: resData.fechaIngreso ? resData.fechaIngreso.split('T')[0] : '',
            fechaSalida: resData.fechaSalida ? resData.fechaSalida.split('T')[0] : '',
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
  /*
  const handleDetalleChange = (e) => {
    const { name, value } = e.target;
    setNewDetalle(prev => ({
      ...prev,
      [name]: value
    }));
  };*/

  const handleTypeChange = (index) => {
    (e) => handleNewRoomChange(index, "tipoHabitacionId", parseInt(tipo.id))
  };

  const addNewRoom = () => {
    setNewRooms([...newRooms, { cantidadAdultos: 1, cantidadNinhos: 0, tipoHabitacionId: 1, pensionId: 1}]);
  };

  const removeNewRoom = (index) => {
    if (newRooms.length > 1) {
      setNewRooms(newRooms.filter((_, i) => i !== index));
    }
  };

  const handleNewRoomChange = (index, type, value) => {
    const rooms = [...newRooms];
    rooms[index][type] = value;
    setNewRooms(rooms);
  };


  const searchAvailable = async (idx) => {
      try {
        const req = {
            checkIn: reservationData.checkIn,   // formulario: fechaIngreso
            checkOut:reservationData.fechaSalida, 
            habitacionesSolicitadas: [
              ...newRooms
            ], 
            isRequestRoomData: true
          };
          //console.log("request", req)
          const res = await axios.post("Habitacions/disponibles", req);
          console.log(res.data);

          setHabitacionesDisponibles(res.data);
        } catch(err) {
            console.log(err)
            //setError("Error al cargar los tipos de habitación disponibles.");
        } finally {
            //setLoading(false);
        }
    };

  const onSearch = async () => {
    if (!reservationData.tipoDocumentoId || !reservationData.numDocumento) {
      return toast.error('Debe seleccionar un tipo y completar el número de documento.');
    }
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
    const detallesValidos = newRooms.filter(r =>
      r.habitacionId && r.tipoHabitacionId && r.pensionId
    );

    if (detallesValidos.length === 0) return toast.error("Complete los datos de habitación");

    setReservationData(prev => ({
      ...prev,
      detalles: [...prev.detalles, ...detallesValidos] 
    }));

    setNewRooms([{
      tipoHabitacionId: "",
      habitacionId: "",
      cantidadAdultos: 1,
      cantidadNinhos: 0,
      pensionId: ""
    }]);

    setShowDetalleModal(false);
  };

  const handleDeleteDetalle = (indexToRemove) => {
    setReservationData(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, index) => index !== indexToRemove)
    }));
    toast.info("Detalle de habitación eliminado.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cliente || !cliente.id) {
      return toast.error("Por favor, busque y seleccione un cliente válido.");
    }
    if (!reservationData.fechaIngreso || !reservationData.fechaSalida) {
      return toast.error("Las fechas de Check-In y Check-Out son obligatorias.");
    }
    if (new Date(reservationData.fechaIngreso) >= new Date(reservationData.fechaSalida)) {
      return toast.error("La fecha de Check-Out debe ser posterior a la de Check-In.");
    }
    if (reservationData.detalles.length === 0) {
      return toast.error("Debe agregar al menos un detalle de habitación.");
      // hola prueba
    }

    const payload = {
      clienteId: cliente.id,
      //codigo: reservationData.codigo,
      fechaIngreso: reservationData.fechaIngreso,   // formulario: checkIn
      fechaSalida: reservationData.fechaSalida,     // formulario: fechaSalida
      llegadaEstimada: reservationData.llegadaEstimada,                 // podrías obtener este dato del formulario si lo requieres
      comentarios: reservationData.observaciones,  // observaciones → comentarios
      estadoId: 2,                               
      detalles: reservationData.detalles.map(det => ({
        tipoHabitacionId: parseInt(det.tipoHabitacionId),
        habitacionId: parseInt(det.habitacionId),
        cantidadAdultos: parseInt(det.cantidadAdultos),
        cantidadNinhos: parseInt(det.cantidadNinhos),
        pensionId: parseInt(det.pensionId),
        activo: true
      }))
    };

    console.log('Nueva reserva a enviar:', payload);

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

  const habitacionesParaSeleccionarEnModal = habitacionesDisponibles.filter(
    h => !reservationData.detalles.some(d => d.habitacionId === h.id.toString())
  );

  const seleccionarHabitacion = (index, habitacionId) => {
    const updatedRooms = [...newRooms];
    updatedRooms[index].habitacionId = habitacionId;
    setNewRooms(updatedRooms);
  };


  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">{isEditMode ? "Editar reserva" : "Nueva reserva"}</h4>
        <Form onSubmit={handleSubmit}>
            { !isEditMode ? <>
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
            </> 
            : 
            <>
              <Row>
                <Col md={12}>
                <Form.Group className="mb-3">
                <Form.Label>Cliente</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  name="nombreCliente"
                  value={reservationData.nombreCliente}
                />
              </Form.Group>
            </Col>
              </Row>
            </>}
          
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Check-In</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaIngreso"
                  value={reservationData.fechaIngreso}
                  onChange={handleChange}
                  required
                  min={!isEditMode ? new Date().toISOString().split('T')[0] : undefined}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Check-Out</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaSalida"
                  value={reservationData.fechaSalida}
                  onChange={handleChange}
                  required
                  min={reservationData.fechaIngreso || (!isEditMode ? new Date().toISOString().split('T')[0] : undefined)}
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
            <Button variant="primary" onClick={() => setShowDetalleModal(true)}>
              Agregar Habitaciones
            </Button>
          </div>

          {/* Mostrar resumen de Habitaciones agregadas */}
          {reservationData.detalles.length > 0 && (
            <div className="mb-3 p-3 border rounded">
              <h6>Habitaciones Agregadas:</h6>
              <ul className="list-unstyled">
                {reservationData.detalles.map((detalle, index) => {
                  console.log(detalle)
                  const pension = pensiones.find(
                    p => p.id === detalle.pensionId
                  );
                  return (
                    <li key={index} className="d-flex justify-content-between align-items-center p-2 mb-2 border-bottom">
                      <div>
                        <strong>Habitación:</strong> {detalle.numeroHabitacion} - {detalle.tipoHabitacion}<br />
                        <strong>Huéspedes:</strong> {detalle.cantidadAdultos} Adulto(s)
                        {detalle.cantidadNinhos && parseInt(detalle.cantidadNinhos) > 0 ? `, ${detalle.cantidadNinhos} Niño(s)` : ''}<br />
                        <strong>Pensión:</strong> {pension ? pension.nombre : `ID ${detalle.pensionId}`}
                      </div>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteDetalle(index)}>
                        Eliminar
                      </Button>
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
      <Modal className='modal-lg' show={showDetalleModal} onHide={() => setShowDetalleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Habitaciones</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {newRooms?.map((room, index) => (
            <div key={index} className="border-bottom pb-3 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Habitación {index + 1}</h6>
                {newRooms.length > 1 && (
                  <CloseButton variant="dark" onClick={() => removeNewRoom(index)} />
                )}
              </div>
                  <Row className="mt-3">
                    <Col xs={12} md={3}>
                      <Form.Group controlId={`adults-${index}`}>
                        <Form.Label>Adultos</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          value={room.adultos}
                          onChange={(e) => handleNewRoomChange(index, "cantidadAdultos", Number(e.target.value))}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={3}>
                      <Form.Group controlId={`children-${index}`}>
                        <Form.Label>Niños</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={room.ninos}
                          onChange={(e) => handleNewRoomChange(index, "cantidadNinhos", Number(e.target.value))}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={3}>
                      <Form.Group controlId={`type-${index}`}>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select name="tipoHabitacionId" value={room.tipoHabitacionId} onChange={(e) => handleNewRoomChange(index, "tipoHabitacionId", Number(e.target.value))}>
                            {tiposHabitaciones?.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                            </option>
                            ))}
                          </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={3}>
                      <Form.Group controlId={`type-${index}`}>
                        <Form.Label>Pensión</Form.Label>
                        <Form.Select name="pensionId" value={room.pensionId} onChange={(e) => handleNewRoomChange(index, "pensionId", Number(e.target.value))}>
                            {pensiones?.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                            </option>
                            ))}
                          </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              ))}
          <div className="d-flex">
            <Button variant="outline-secondary" onClick={addNewRoom}>
              + Agregar Habitación
            </Button>
            <Button  variant="outline-primary" onClick={searchAvailable}>
              Buscar disponibles
            </Button>
          </div>
          
          {/* BUSCAR DISPONIBILIDAD */}
        {habitacionesDisponibles && (
        <Row className="g-4">
          {newRooms?.map((room, idx) => (
            <Col key={idx} md={12 / (newRooms.length || 1)}>
              <h6 className="mb-3">Habitación {idx + 1}</h6>
              <div className="d-flex flex-column gap-2">
                { habitacionesDisponibles?.filter((h) => h.tipoHabitacionId == room.tipoHabitacionId)
                    .map((h) => {
                      const yaSeleccionada = newRooms.some((r, i) => r.habitacionId === h.id && i !== idx);
                      const seleccionadaEnEstaPos = newRooms[idx]?.habitacionId === h.id;
                      
                      return (
                        <div
                          key={h.numeroHabitacion}
                          className="border rounded"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.5rem 1rem",
                            backgroundColor: seleccionadaEnEstaPos 
                              ? "#d1e7dd" 
                              : yaSeleccionada 
                                ? "#f8d7da"
                                : "white",
                          }}
                        >
                          <span className="me-2">N° {h.numeroHabitacion}</span>
                          <Button
                            size="sm"
                            variant={
                              seleccionadaEnEstaPos 
                                ? "success"
                                : yaSeleccionada
                                  ? "danger"
                                  : "primary"
                            }
                            onClick={() => seleccionarHabitacion(idx, h.id)}
                            disabled={yaSeleccionada && !seleccionadaEnEstaPos}
                          >
                            {seleccionadaEnEstaPos 
                              ? "Seleccionada"
                              : yaSeleccionada
                                ? "No disponible"
                                : "Seleccionar"
                            }
                          </Button>
                        </div>
                      );
                    })
                }
              </div>
            </Col>
          ))}
        </Row>)}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={addDetalle}>
            Agregar Habitaciones
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReservationForm;
