import React, { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig';
import { toast } from 'react-toastify';

function ConsultaDetails({solicitud}) {
  const navigate = useNavigate();
  const [texto, setTexto] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(true);
    try {
      const response = await axios.post("/Consultas/answer", {
        consultaId: solicitud?.consulta?.id,
        texto: texto
      })
      
      toast.success(`Respuesta enviada con éxito`, {
        onClose: () => {
        navigate('/notifications'); // Navega después que el toast desaparece
      },
      autoClose: 3000, 
      });
    } catch (err) {
      toast.error("Error al enviar la respuesta")
    }
  }
  
  return (
    <>
      <div className="mb-3 p-3 border rounded">
            <p><strong>Nombre:</strong> {solicitud.consulta.nombre}</p>
            <p><strong>Email:</strong> {solicitud.consulta.email}</p>
            <p><strong>Teléfono:</strong> {solicitud.consulta.telefono}</p>
            <p><strong>Mensaje:</strong> {solicitud.consulta.mensaje}</p>
      </div>
      {
        solicitud.consulta.esContestada ? 
        <Alert variant='info'>
          Esta consulta ya fue respondida.
        </Alert> : 
        <>
          <h4>Enviar Email de Respuesta</h4>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Cuerpo del Email</Form.Label>
              <Form.Control as="textarea" rows={5} name="texto" value={texto} onChange={(e) => setTexto(e.target.value)} required/>
              <Form.Control.Feedback type="invalid">
                La respuesta no puede estar vacía.
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
                <Button variant="primary" type="submit">Enviar</Button>
                <Button variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
            </div>
        </Form>
        </>
      }
    </>
  )
}

export default ConsultaDetails