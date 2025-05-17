import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from '../config/axiosConfig';
import { format, parseISO, isValid } from 'date-fns';

const habitacionesDisponibles = [201, 202, 318, 345];

const CancelacionDetails = ({solicitud}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState({});
  const [cancelacion, setCancelacion] = useState();
  const [disponibles, setDisponibles] = useState([]);
  const [parsedCheckin, setParsedCheckin] = useState('');
  const [parsedCheckout, setParsedCheckout] = useState('');

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
            const response = await axios.get(`/Reservas/${solicitud?.cancelacion?.reservaId}`);
            setReserva(response.data);
        } catch (error) {
            console.error('Error cargando datos:', error);
        }

        // obtener datos del cliente
        try {
        const response = await axios.get(`/Clientes/${solicitud?.cancelacion?.clienteId}`);
        setCliente(response.data);
              
        } catch (error) {
            console.error('Error cargando datos:', error);
        }

        setLoading(false);
        })();
  }, [solicitud])


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
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          <p><strong>Motivo:</strong>{solicitud.cancelacion?.motivo}</p>
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

      <div className="mt-4 d-flex justify-content-center gap-2">
        <Button variant="primary" onClick={() => navigate(-1)}>Volver</Button> 
      </div>
      </>
)}
export default CancelacionDetails;