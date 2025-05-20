import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from '../config/axiosConfig';
import { format, parseISO, isValid } from 'date-fns';
import { toast } from 'react-toastify';

const habitacionesDisponibles = [201, 202, 318, 345];
//hola
// hiaodiqhvdwbhiwe
const ReservaDetails = ({solicitud}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState({});
  const [reserva, setReserva] = useState();
  const [disponibles, setDisponibles] = useState([]);
  const [parsedCheckin, setParsedCheckin] = useState('');
  const [parsedCheckout, setParsedCheckout] = useState('');
  const [habitacionesSeleccionadas, setHabitacionesSeleccionadas] = useState({});
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    (async () => {
        // parsear checkin y checkout
        let parsedIngreso = parseISO(solicitud?.reserva?.fechaIngreso);
        let parsedSalida = parseISO(solicitud?.reserva?.fechaSalida);
        isValid(parsedIngreso) ? format(parsedIngreso, 'dd/MM/yyyy') : ''

        if (isValid(parsedIngreso)){
            setParsedCheckin(format(parsedIngreso, 'dd/MM/yyyy'))
        } 
        if (isValid(parsedSalida)){
            setParsedCheckout(format(parsedSalida, 'dd/MM/yyyy'))
        } 

        try {
            const response = await axios.get(`/Reservas/${solicitud?.reservaId}`);
            setReserva(response.data);
            // si la reserva no tiene estado 'Pendiente' desactivar botones etc
            if(response.data.estadoId != 1){
                setDisabled(true)
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
        }

        // obtener datos del cliente
        try {
        const response = await axios.get(`/Clientes/${solicitud?.reserva?.clienteId}`);
        setCliente(response.data);
              
        } catch (error) {
            console.error('Error cargando datos:', error);
        }

        // obtener disponibles
        try {
            const response = await axios.get(`/Reservas/disponibles/${solicitud?.reservaId}`);
            console.log(response.data, "dispo", solicitud?.reservaId)
            setDisponibles(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error('Error cargando datos:', error);
            }
        }
        setLoading(false);
        })();
  }, [solicitud])

    const seleccionarHabitacion = (detalleIndex, habitacionId) => {
    setHabitacionesSeleccionadas((prev) => ({
        ...prev,
        [detalleIndex]: habitacionId,
    }));
    };

    const handleConfirmar = async () => {
        try {
            const detallesOriginales = solicitud.reserva.detalles;

            // Verificamos que cada habitación esté asignada
            const faltanHabitaciones = detallesOriginales.some((_, idx) => {
                const habitacionId = habitacionesSeleccionadas[idx];
                return habitacionId == null || habitacionId === "";
            });

            if (faltanHabitaciones) {
                toast.error("Debe asignar una habitación a cada detalle de reserva antes de confirmar.");
                return;
            }

            // Clonamos la reserva original
            const reservaActualizada = { ...solicitud.reserva };

            // Actualizamos los habitacionId de los detalles
            reservaActualizada.detalles = detallesOriginales.map((detalle, idx) => ({
                ...detalle,
                habitacionId: habitacionesSeleccionadas[idx]
            }));

            await axios.put(`/Reservas/${solicitud.reservaId}/confirm`, reservaActualizada);
            toast.success("Reserva confirmada correctamente.", {
                onClose: () => { navigate('/notifications'); // Navega después que el toast desaparece
            },
            autoClose: 3000 });
        } catch (error) {
            console.error("Error al confirmar la reserva:", error.response?.data || error.message);
            toast.error("Ocurrió un error al confirmar la reserva.");
        }
    };

    const handleReject = async () => {
        try {
            await axios.put(`/Reservas/${solicitud.reservaId}/reject`);
            toast.success("Reserva rechazada correctamente.", {
                onClose: () => { navigate('/notifications'); // Navega después que el toast desaparece
            },
            autoClose: 3000 });
        } catch(error){
            console.error("Error al confirmar la reserva:", error.response?.data || error.message);
            toast.error("Ocurrió un error al rechazar la reserva.");
        }
    }

    return (
        reserva &&
    <>
    <Row>
        <Col md={6}>   
        {/* Se muestran los datos del cliente */}
        <div className="mb-2 p-3 border rounded">
          <h5>Datos del Solicitante</h5>
          <p><strong>Nombre:</strong> {cliente.nombre}</p>
          <p><strong>Apellido:</strong> {cliente.apellido}</p>
          <p><strong>N° de Documento:</strong> {cliente.numDocumento}</p>
          <p><strong>Tipo de Documento:</strong> {cliente.tipoDocumento}</p>
          <p><strong>País:</strong> {cliente.nacionalidad}</p>
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
        </div>
        </Col>
        <Col md={6}>
        
        <div className="mb-3 p-3 border rounded">
            <h5>Solicitud</h5>
            <p><strong>Check-In:</strong> {parsedCheckin}</p>
            <p><strong>Check-Out:</strong> {parsedCheckout}</p>
            <p><strong>Hora de Llegada Estimada:</strong> {reserva.llegadaEstimada}</p>
            <p><strong>Comentarios:</strong> {reserva.comentarios}</p>
            <p><strong>Habitaciones:</strong></p>
            <ul>
            { reserva?.detalles?.map((d, idx) => (
                 <li key={idx}>
                {d.tipoHabitacion} - {d.cantidadAdultos} adulto(s){' '}
                {d.cantidadNinhos > 0 && `- ${d.cantidadNinhos} niño(s)`} 
                </li>
            ))
            }

            </ul>
        </div>
        </Col>
      </Row>


      {!disabled && reserva?.detalles?.map((detalle, idx) => (
        <div key={idx} className="mb-3">
            <h6>Habitación {detalle.tipoHabitacion}</h6>
            {disponibles.length > 0 ? disponibles.filter((h) => h.tipoHabitacionId === detalle.tipoHabitacionId)
            .map((h) => (
                <div
                key={h.numeroHabitacion}
                className="border rounded mb-2"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.5rem 1rem",
                    width: "fit-content",
                    backgroundColor:
                    habitacionesSeleccionadas[idx] === h.id ? "#d1e7dd" : "white",
                }}
                >
                <span className="me-2">{h.numeroHabitacion}</span>
                <Button
                    size="sm"
                    variant={
                    habitacionesSeleccionadas[idx] === h.id ? "success" : "primary"
                    }
                    onClick={() => seleccionarHabitacion(idx, h.id)}
                >
                    {habitacionesSeleccionadas[idx] === h.id ? "Seleccionada" : "Seleccionar"}
                </Button>
                </div>
            )) : <p>No hay habitaciones disponibles para esta solicitud</p>}
        </div>
        ))}


      {/* Botones para confirmar o rechazar la solicitud */}
      <div className="mt-4 d-flex justify-content-center gap-2">
        <Button disabled={disabled} variant="primary" onClick={handleConfirmar}>Confirmar</Button>
        <Button disabled={disabled} variant="secondary">Rechazar</Button> {/*agregar funcion*/}
      </div>
      </>
)}
export default ReservaDetails;