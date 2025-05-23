
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Dropdown, DropdownButton, Pagination, Spinner } from 'react-bootstrap';
import { BsCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig';

// prueba commit
const Notifications = () => {
  const estadosDisponibles = [{ key: "Todos", value: "todos" }, { key: "Leído", value: 1 }, {key: "No leído", value: 0 }]; // Estados de las notificaciones
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState(estadosDisponibles[0]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5; 

  useEffect(() => {
    (async () => {
      try {
          const response = await axios.get(`/Solicitudes`);
          setNotificaciones(response.data);
          //console.log(response.data)
          setLoading(false);
      } catch (error) {
          console.error('Error cargando datos:', error);
      }
  })();
  }, []);

  // Filtrar las notificaciones según el estado seleccionado
  const notificacionesFiltradas = notificaciones.filter(n =>
    filtroEstado.value === "todos" ? true : n.esLeida == filtroEstado.value
  );

  // Paginación
  const totalPaginas = Math.ceil(notificacionesFiltradas.length / elementosPorPagina);
  const inicio = (paginaActual - 1) * elementosPorPagina;
  const fin = inicio + elementosPorPagina;
  const notificacionesPaginadas = notificacionesFiltradas.slice(inicio, fin);

  // Cambiar de página
  const cambiarPagina = (nro) => setPaginaActual(nro);

  // Renderizar icono de estado
  const renderEstadoIcono = (estado) => (
    <BsCircleFill
      style={{ fontSize: "0.75rem", marginRight: 6 }}
      color="#28a745" 
    />
  );

  const handleVerNotificacion = (notificacion) => {
    navigate(`/notifications/${notificacion.id}`, {
    state: { notificacion }
    });
  };

  const truncarTexto = (texto, maxLongitud) => {
    return texto.length > maxLongitud ? texto.slice(0, maxLongitud - 3) + "..." : texto;
  };

  const getResumen = (n) => {
    let resumen = "";

    if (n.tipo === "Cancelación") {
      resumen = `${n.reserva.nombreCliente ? n.reserva.nombreCliente : "Cliente"} desea cancelar su reserva`;
    } else if (n.tipo === "Reserva") {
      resumen = `${n.reserva.nombreCliente ? n.reserva.nombreCliente : "Cliente"} solicita reserva de ${n.reserva.detalles[0].tipoHabitacion}`;
    } else if (n.tipo === "Consulta") {
      resumen = `${n.consulta.nombre} desea saber "${n.consulta.mensaje}"`;
    }

    return truncarTexto(resumen, 100); 
  };


  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Notificaciones</h4>
        {/* Desplegable de los estados */}
        <DropdownButton
          variant="outline-secondary"
          title={`Estado: ${filtroEstado.key || filtroEstado}`}
        >
          {estadosDisponibles.map((estado, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => {
                setFiltroEstado(estado);
                setPaginaActual(1);
              }}
            >
              {estado.key || estado}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>

      {/* Tabla de notificaciones */}
      {
        loading ? <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          </div> : 
      <>
      
      <div>
        {notificacionesPaginadas.map((n) => (
          <Row
            key={n.id}
            className="border rounded p-3 mb-2 align-items-center"
            style={{ fontSize: "0.9rem" }}
          >
            <Col xs={8}>
            <p>
              <strong>{n.tipo === "Consulta" ? "Consulta: " : `Solicitud de ${n.tipo}: `}</strong>
              {getResumen(n)}
            </p>
            </Col>

            <Col xs={4} className="text-end">
              {
                !n.esLeida && <BsCircleFill
                  style={{ fontSize: "0.75rem", marginRight: 6 }}
                  color="#28a745" 
                />
              }
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleVerNotificacion(n)}
              >
                Ver
              </button>
            </Col>
          </Row>
        ))}
      </div>

      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          {[...Array(totalPaginas)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === paginaActual}
              onClick={() => cambiarPagina(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
      </>
    }
    </Container>
  );
};

export default Notifications;