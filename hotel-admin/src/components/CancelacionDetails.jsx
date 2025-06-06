import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from '../config/axiosConfig';
import { format, parseISO, isValid } from 'date-fns';
import { toast } from 'react-toastify';

const CancelacionDetails = ({ solicitud }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState({});
  const [reserva, setReserva] = useState({});
  const [parsedCheckin, setParsedCheckin] = useState('');
  const [parsedCheckout, setParsedCheckout] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelacionConfirmada, setCancelacionConfirmada] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Se determina el Id de reserva y cliente a partir de la solicitud.
        const reservaId = solicitud?.reserva?.id || solicitud?.cancelacion?.reservaId;
        const clienteId = solicitud?.reserva?.clienteId || solicitud?.cancelacion?.clienteId;

        // Se parsean las fechas
        if (solicitud?.reserva) {
          const parsedIngreso = parseISO(solicitud.reserva.fechaIngreso);
          const parsedSalida = parseISO(solicitud.reserva.fechaSalida);
          if (isValid(parsedIngreso)) {
            setParsedCheckin(format(parsedIngreso, 'dd/MM/yyyy'));
          }
          if (isValid(parsedSalida)) {
            setParsedCheckout(format(parsedSalida, 'dd/MM/yyyy'));
          }
        }

        // Obtener la reserva 
        if (reservaId) {
          const responseReserva = await axios.get(`/Reservas/${reservaId}`);
          setReserva(responseReserva.data);
        }

        // Obtener los datos del cliente 
        if (clienteId) {
          const responseCliente = await axios.get(`/Clientes/${clienteId}`);
          setCliente(responseCliente.data);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [solicitud]);

  // Determinar las habitaciones a cancelar según el tipo de solicitud.
  let habitacionesACancelar = [];
  if (solicitud && reserva.detalles) {
    if (solicitud.tipo === "CancelacionReserva") {
      habitacionesACancelar = reserva.detalles;
    } else if (solicitud.tipo === "CancelacionHabitacion") {
      if (solicitud.detalleReservaIds && solicitud.detalleReservaIds.length > 0) {
        habitacionesACancelar = reserva.detalles.filter(det =>
          solicitud.detalleReservaIds.includes(det.id)
        );
      } else if (solicitud.detalleReservaId) {
        habitacionesACancelar = reserva.detalles.filter(det =>
          det.id === solicitud.detalleReservaId
        );
      }
    }
  }

  // Función para confirmar la cancelación, arma el objeto "data" para enviar al backend.
  const handleConfirmarCancelacion = async () => {
    const detalleIds =
      solicitud.detalleReservaIds?.length > 0
        ? solicitud.detalleReservaIds
        : solicitud.detalleReservaId
        ? [solicitud.detalleReservaId]
        : [];

    const data = {
      ReservaId: solicitud?.reserva?.id || solicitud?.cancelacion?.reservaId,
      Motivo: solicitud.motivo || solicitud.cancelacion?.motivo,
      DetalleReservaIds: detalleIds
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post('/Cancelacions', data);
      //console.log("Cancelación creada exitosamente", response.data);
      toast.success("Cancelación confirmada");
      // Deshabilitamos el botón para evitar reenvío
      setCancelacionConfirmada(true);
    } catch (error) {
      console.error(error);
      toast.error("Error al confirmar la cancelación");
    } finally {
      setIsSubmitting(false);
      navigate('/notifications');
    }
  };


  // Si aún se están cargando los datos, mostrar un spinner.
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container>
      {/* Datos del solicitante */}
      <Row>
        <Col md={6}>
          <div className="mb-2 p-3 border rounded">
            <h5>Datos del Solicitante</h5>
            <p><strong>Nombre:</strong> {cliente.nombre}</p>
            <p><strong>Apellido:</strong> {cliente.apellido}</p>
            <p><strong>N° de Documento:</strong> {cliente.numDocumento}</p>
            <p><strong>Email:</strong> {cliente.email}</p>
            <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          </div>
        </Col>
        {/* Datos de la reserva */}
        <Col md={6}>
          <div className="mb-3 p-3 border rounded">
            <h5>Reserva</h5>
            <p><strong>Check-In:</strong> {parsedCheckin}</p>
            <p><strong>Check-Out:</strong> {parsedCheckout}</p>
            <p><strong>Hora de Llegada Estimada:</strong> {reserva.llegadaEstimada}</p>
            <p><strong>Comentarios:</strong> {reserva.comentarios}</p>
            <p><strong>Habitaciones de la reserva:</strong></p>
            <ul>
              {reserva?.detalles?.map((d, idx) => (
                <li key={idx}>
                  {d.tipoHabitacion} - {d.cantidadAdultos} adulto(s)
                  {d.cantidadNinhos > 0 && ` - ${d.cantidadNinhos} niño(s)`}
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
      {/* Motivo y habitaciones a cancelar */}
      <Row className="mt-3">
        <Col>
          <div className="p-3 border rounded">
            <h5>Detalles de Cancelación</h5>
            <p>
              <strong>Motivo:</strong>{" "}
              {solicitud.motivo || solicitud.cancelacion?.motivo}
            </p>
            <p>
              <strong>Habitaciones a cancelar:</strong>
            </p>
            <ul>
              {habitacionesACancelar.length > 0 ? (
                habitacionesACancelar.map((d, idx) => (
                  <li key={idx}>
                    {d.tipoHabitacion} - {d.cantidadAdultos} adulto(s)
                    {d.cantidadNinhos > 0 && ` - ${d.cantidadNinhos} niño(s)`}
                  </li>
                ))
              ) : (
                <li>No hay habitaciones para mostrar</li>
              )}
            </ul>
          </div>
        </Col>
      </Row>
      {/* Botón de Confirmar */}
      <Row className="mt-4">
        <Col className="d-flex justify-content-center">
          <Button 
            variant="primary" 
            onClick={handleConfirmarCancelacion} 
            disabled={isSubmitting || cancelacionConfirmada}
          >
            {isSubmitting ? "Procesando..." : "Confirmar"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CancelacionDetails;
