import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import ReservaDetails from '../components/ReservaDetails';
import CancelacionDetails from '../components/CancelacionDetails';
import ConsultaDetails from '../components/ConsultaDetails';
import axios from '../config/axiosConfig';

const NotificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState({});
  const [solicitud, setSolicitud] = useState({});

  const tipoComponentes = {
    Reserva: ReservaDetails,
    CancelacionReserva: CancelacionDetails,
    CancelacionHabitacion: CancelacionDetails,
    Consulta: ConsultaDetails
  };
  const TipoComponente = tipoComponentes[solicitud.tipo];

  // Definición del título de forma dinámica según el tipo de solicitud
  let titulo = "";
  if (solicitud.tipo === "Consulta") {
    titulo = "Consulta";
  } else if (solicitud.tipo === "CancelacionReserva") {
    titulo = "Solicitud de Cancelación de Reserva";
  } else if (solicitud.tipo === "CancelacionHabitacion") {
    titulo = "Solicitud de Cancelación de Habitación";
  } else if (solicitud.tipo === "Reserva") {
    titulo = "Solicitud de Reserva";
  } else {
    titulo = `Solicitud de ${solicitud.tipo}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/Solicitudes/${id}`);
        const solicitudData = response.data;
        setSolicitud(solicitudData);

        if (!solicitudData.esLeida) {
          await axios.put(`/Solicitudes/${id}/read`);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Container>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="d-flex align-items-center mb-4">
            <span
              className="material-icons me-2"
              role="button"
              onClick={() => navigate(-1)}
              style={{ cursor: 'pointer' }}
              title="Volver"
            >
              arrow_back
            </span>
            <h2 className="mb-0" style={{ color: '#2c3e50' }}>
              {titulo}
            </h2>
          </div>

          {TipoComponente ? (
            <TipoComponente solicitud={solicitud} />
          ) : (
            <p>Tipo desconocido</p>
          )}
        </>
      )}
    </Container>
  );
};

export default NotificationDetails;
