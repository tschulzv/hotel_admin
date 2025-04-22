import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';


const habitacionesDisponibles = [201, 202, 318, 345];

const NotificationDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.notificacion) {
    return <p>No hay datos para mostrar.</p>;
  }

  const { nombre, apellido, documento, tipoDocumento, Nacionalidad, email, telefono, solicitud } = state.notificacion;

  return (
    <Container >
      <div className="d-flex align-items-center mb-4">
          <span className="material-icons me-2" role="button" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} title="Volver">
            arrow_back
          </span>
          <h2 className="mb-0" style={{ color: '#2c3e50' }}>Solicitud de {solicitud.tipo}</h2>
        </div>

      {/* Se muestran los datos del cliente */}
      <h5>Datos del Solicitante</h5>
      <div className="mb-2 p-3 border rounded">
        <p><strong>Nombre:</strong> {nombre}</p>
        <p><strong>Apellido:</strong> {apellido}</p>
        <p><strong>N° de Documento:</strong> {documento}</p>
        <p><strong>Tipo de Documento:</strong> {tipoDocumento}</p>
        <p><strong>Nacionalidad:</strong> {Nacionalidad}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Teléfono:</strong> {telefono}</p>
      </div>

      {/* Se muestran los detalles de la solicitud (cambiar esta parte despues)*/}
      <div className="mb-3 p-3 border rounded">
        <h5>Solicitud</h5>
        <p>
          1 {solicitud.detalles.habitaciones.tipo} - {solicitud.detalles.habitaciones.adultos} adultos{' '}
          {solicitud.detalles.habitaciones.ninos > 0 && `- ${solicitud.detalles.habitaciones.ninos} niños`} - Pensión Completa
          </p>
        <p><strong>Check-In:</strong> {solicitud.detalles.checkIn}</p>
        <p><strong>Check-Out:</strong> {solicitud.detalles.checkOut}</p>
        <p><strong>Hora de Llegada:</strong> 15:00</p>
        <p><strong>Comentarios:</strong> {solicitud.comentarios}</p>
      </div>

      {/* Se muestran las habitaciones disponibles en caso de que sea una reserva (cambiar esta parte despues)*/}
      {solicitud.tipo === "Reserva" && (
      <div>
        <h6>Habitaciones disponibles para esta solicitud</h6>
        <div className="mt-2">
          {habitacionesDisponibles.map((habitacion) => (
            <div
            key={habitacion}
            className="border rounded mb-2"
            style={{
              display: "flex", // hace que el borde solo abarque el contenido
              alignItems: "center",
              gap: "1rem",
              padding: "0.5rem 1rem",
              width: "fit-content",
            }}
          >
              <span className="me-2">{habitacion}</span>
              <Button size="sm" variant="primary">Seleccionar</Button>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Botones para confirmar o rechazar la solicitud */}
      <div className="mt-4 d-flex justify-content-center gap-2">
        <Button variant="primary">Confirmar</Button> {/* Agregarle su funcion despues */}
        <Button variant="secondary">Rechazar</Button> {/* Agregarle su funcion despues */}
      </div>
    </Container>
  );
};

export default NotificationDetails;
