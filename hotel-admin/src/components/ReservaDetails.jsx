import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from '../config/axiosConfig';
import { format, parseISO, isValid } from 'date-fns';

const habitacionesDisponibles = [201, 202, 318, 345];

const ReservaDetails = ({solicitud}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState({});
  const [reserva, setReserva] = useState();
  const [disponibles, setDisponibles] = useState();
  const [parsedCheckin, setParsedCheckin] = useState('');
  const [parsedCheckout, setParsedCheckout] = useState('');
  const [habitacionesSeleccionadas, setHabitacionesSeleccionadas] = useState({});


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
            console.error('Error cargando datos:', error);
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
        
        {/* Se muestran los detalles de la solicitud (cambiar esta parte despues)*/}
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


      {reserva?.detalles?.map((detalle, idx) => (
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
        <Button variant="primary">Confirmar</Button> {/* Agregarle su funcion despues */}
        <Button variant="secondary">Rechazar</Button> {/* Agregarle su funcion despues */}
      </div>
      </>
)}
export default ReservaDetails;