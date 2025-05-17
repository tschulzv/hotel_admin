import React from 'react'
import { Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

function ConsultaDetails({solicitud}) {
  const navigate = useNavigate();
  
  return (
    <>
    <div className="mb-2 p-3 border rounded">
          <p><strong>Nombre:</strong> {solicitud.consulta.nombre}</p>
          <p><strong>Email:</strong> {solicitud.consulta.email}</p>
          <p><strong>Teléfono:</strong> {solicitud.consulta.telefono}</p>
          <p><strong>Mensaje:</strong> {solicitud.consulta.mensaje}</p>
    </div>
    <div className="mt-4 d-flex justify-content-center gap-2">
        <Button variant="primary" onClick={() => navigate(-1)}>Volver</Button> 
    </div>
    </>
  )
}

export default ConsultaDetails