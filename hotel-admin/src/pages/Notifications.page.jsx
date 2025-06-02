
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Dropdown, DropdownButton, Pagination, Spinner, Modal, Button} from 'react-bootstrap';
import { BsCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { parseISO, isToday, formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale'; 

// prueba commit
const Notifications = () => {
  const estadosDisponibles = [{ key: "Todos", value: "todos" }, { key: "Leído", value: 1 }, {key: "No leído", value: 0 }]; // Estados de las notificaciones
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState(estadosDisponibles[0]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [show, setShow] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const elementosPorPagina = 10; 

  useEffect(() => {
    (async () => {
      try {
          const response = await axios.get(`/Solicitudes`);
          const ordenadas = response.data
          .sort((a, b) => new Date(b.creacion) - new Date(a.creacion))
          .map(notificacion => {
            const parsedCreacion = parseISO(notificacion.creacion);
            let formatCreacion = '';
            if (isToday(parsedCreacion)) { // si es hoy, mostrar ej 'hace 2 horas'
              formatCreacion = formatDistanceToNow(parsedCreacion, { addSuffix: true, locale: es }); 
            } else { // si no es hoy  mostrar la fecha
              formatCreacion = format(parsedCreacion, 'dd/MM/yyyy', { locale: es });
            }

            return { ...notificacion, creacion: formatCreacion };
          });

          setNotificaciones(ordenadas);
          console.log(ordenadas);
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

  const handleOpen = () => {
    setShow(true);
  }
  const handleClose = () => {
    setShow(false);
  }

  const handleVerNotificacion = (notificacion) => {
    navigate(`/notifications/${notificacion.id}`, {
    state: { notificacion }
    });
  };

  const handleEliminar = async () => {
    if (selectedNotification){
      try {
        await axios.delete(`/Solicitudes/${selectedNotification.id}`);
        setNotificaciones(prev => prev.filter(n => n.id !== selectedNotification.id));
        setSelectedNotification(null);
      } catch (error) {
        toast.error("Error eliminando la notificación");
      }
      handleClose();
    }
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
    <>
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
        className="border rounded p-3 mb-2 align-items-center justify-content-between notification-row"
        style={{ fontSize: "0.9rem", cursor: 'pointer' }}
        onClick={() => handleVerNotificacion(n)}
      >
        <Col xs={9}>
          <p className="mb-0">
            <strong>{n.tipo === "Consulta" ? "Consulta: " : `Solicitud de ${n.tipo}: `}</strong>
            {getResumen(n)}
          </p>
        </Col>

        <Col xs={3} className="d-flex justify-content-end align-items-center gap-2">
          <span style={{ color: '#6c757d' }}>{n.creacion}</span>
          {/* Icono de estado (no leído) */}
          {!n.esLeida && (
            <BsCircleFill
              style={{ fontSize: "0.75rem" }}
              color="#28a745"
              title="No leído"
            />
          )}

          {/* Botón eliminar (evita propagar el evento hacia el Row) */}
          <span
            className="material-icons"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation(); // evita que el clic llegue al Row
              setSelectedNotification(n);
              handleOpen();
            }}
            title="Eliminar"
          >
            close
          </span>

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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotification && (
            <>
              <p> ¿Estás seguro de que deseas eliminar esta notificación?</p>
              { !selectedNotification.esLeida &&
                <p><strong>Esta notificación aún no fue leída </strong></p>
              }
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Volver
          </Button>
          <Button variant="danger" onClick={handleEliminar}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Notifications;