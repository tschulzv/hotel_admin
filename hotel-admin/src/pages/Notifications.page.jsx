
import React, { useState } from 'react';
import { Container, Row, Col, Dropdown, DropdownButton, Pagination } from 'react-bootstrap';
import { BsCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const todasLasNotificaciones = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    documento: "1234567",
    tipoDocumento: "Cédula",
    Nacionalidad: "Paraguaya",
    email: "juanperez@gmail.com",
    telefono: "+595 981 234 567",
    solicitud: {
      fecha: "2025-04-02",
      tipo: "Reserva",
      estado: "Confirmado",
      comentarios: "Reserva para una conferencia de negocios",
      detalles: {
        checkIn: "2025-04-14",
        checkOut: "2025-04-16",
        habitaciones: {
          tipo: "Suite Presidencial",
          adultos: 1,
          ninos: 0,
        }
      }
    }
  },
  {
    id: 2,
    nombre: "María",
    apellido: "Gómez",
    documento: "2345678",
    tipoDocumento: "Cédula",
    Nacionalidad: "Paraguaya",
    email: "mariagomez@gmail.com",
    telefono: "+595 982 345 678",
    solicitud: {
      fecha: "2025-04-03",
      tipo: "Reserva",
      estado: "Pendiente",
      comentarios: "Celebramos nuestra luna de miel",
      detalles: {
        checkIn: "2025-04-20",
        checkOut: "2025-04-22",
        habitaciones: {
          tipo: "Deluxe",
          adultos: 2,
          ninos: 0,
        },
      },
    },
  },

  {
    id: 3,
    nombre: "Carlos",
    apellido: "Benítez",
    documento: "5538074",
    tipoDocumento: "Cédula",
    Nacionalidad: "Paraguaya",
    email: "carlosbenitez@gmail.com",
    telefono: "+595 982 158 225",
    solicitud: {
      fecha: "2025-04-04",
      tipo: "Cancelación",
      estado: "Pendiente",
      comentarios: "Cancelación por motivos personales",
      detalles: {
        checkIn: "2025-04-20",
        checkOut: "2025-04-22",
        habitaciones: {
          tipo: "Ejecutiva",
          adultos: 1,
          ninos: 0,
        },
      },
    },
  },

];


const estadosDisponibles = ["Todos", "Confirmado", "Pendiente"]; // Estados de las notificaciones
const elementosPorPagina = 5; // Número de elementos por página

const Notifications = () => {
    const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [paginaActual, setPaginaActual] = useState(1);

  // Filtrar las notificaciones según el estado seleccionado
  const notificacionesFiltradas = todasLasNotificaciones.filter(n =>
    filtroEstado === "Todos" ? true : n.solicitud.estado === filtroEstado
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
      color={estado === "Confirmado" ? "#28a745" : "#ff0000"}
    />
  );

  const handleVerNotificacion = (notificacion) => {
    navigate(`/notifications/${notificacion.id}`, {
    state: { notificacion }
    });
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Notificaciones</h4>
        {/* Desplegable de los estados */}
        <DropdownButton
          variant="outline-secondary"
          title={`Estado: ${filtroEstado}`}
          onSelect={(e) => {
            setFiltroEstado(e);
            setPaginaActual(1);
          }}
        >
          {estadosDisponibles.map((estado) => (
            <Dropdown.Item key={estado} eventKey={estado}>
              {estado}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>


        {/* Tabla de notificaciones */}
      <div>
        {notificacionesPaginadas.map((n) => (
          <Row
            key={n.id}
            className="border rounded p-3 mb-2 align-items-center"
            style={{ fontSize: "0.9rem" }}
          >
            <Col xs={4}>
              <strong>Solicitud de {n.solicitud.tipo}</strong>
            </Col>

            <Col xs={8} className="text-end">
                {renderEstadoIcono(n.solicitud.estado)}
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
    </Container>
  );
};

export default Notifications;