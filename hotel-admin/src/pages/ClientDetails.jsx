import React, { useState, useEffect } from 'react' 
import { Container, Row, Col, Button, Card, ListGroup } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';

import axios from '../config/axiosConfig';

function ClientDetails() {

  let { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState({});
  const [lastBook, setLastBook] = useState();
  
  const editClient = () => {
    navigate(`/clients/edit/${id}`)
  }

  const clientHistory = () => {
    navigate(`/clients/${id}/history`);
  }

  useEffect(() => {
      (async () => {
        try {
            const response = await axios.get(`/Clientes/${id}`);
            const parsedCreacion = parseISO(response.data.creacion);
            //console.log(response.data)
            setClient({creacion: parsedCreacion, ...response.data});
  
          } catch (error) {
          console.error('Error cargando cliente:', error);
          }
          try {
            const last = await axios.get(`/Reservas/cliente/${id}/ultima`);
            console.log(response.data)
            if(last){
              setLastBook(last)
            }
          } catch (error) {
          console.error('Error cargando reserva:', error);
          }
      })();
    }, [id]);

    // FUNCION PARA FORMATEAR FECHAS
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      if (isNaN(date)) return dateString; // Si la fecha no es válida, devuelve la cadena original
      return date.toLocaleDateString('es-Es');
    }

  return (
    <Container className="py-4">
        <div className="d-flex align-items-center mb-4">
          <span className="material-icons me-2" role="button" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} title="Volver">
            arrow_back
          </span>
          <h2 className="mb-0" style={{ color: '#2c3e50' }}>Información del Cliente</h2>
        </div>

        <Row className="gy-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm rounded-3 p-2">
              <Card.Body>
                <h4 className="mb-3">Datos personales</h4>
                <ListGroup variant="flush no-borders">
                  <ListGroup.Item><strong>Nombre:</strong> {client.nombre}</ListGroup.Item>
                  <ListGroup.Item><strong>Apellido:</strong> {client.apellido}</ListGroup.Item>
                  <ListGroup.Item><strong>Documento:</strong> {client.numDocumento}</ListGroup.Item>
                  <ListGroup.Item><strong>Teléfono:</strong> {client.telefono}</ListGroup.Item>
                  <ListGroup.Item><strong>Email:</strong> {client.email}</ListGroup.Item>
                  <ListGroup.Item><strong>Nacionalidad:</strong> {client.nacionalidad}</ListGroup.Item>
                  <ListGroup.Item><strong>Fecha de Registro:</strong> {formatDate(client.creacion)}</ListGroup.Item>
                  <ListGroup.Item><strong>Observaciones:</strong> {client.comentarios ?? " - "}</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="d-flex flex-column justify-content-between h-100">
            <Card className="border-0 shadow-sm rounded-3 mb-5 p-2">
              <Card.Body>
                <h4 className="mb-3">Última reserva</h4>

                { lastBook ? 
                  <> 
                  <ListGroup variant="flush no-borders">
                    <ListGroup.Item><strong>Código:</strong>{lastBook.codigo}</ListGroup.Item>
                    <ListGroup.Item><strong>Habitación(es):</strong></ListGroup.Item>
                    <ListGroup.Item><strong>Check-In:</strong>{lastBook.fechaIngreso}</ListGroup.Item>
                    <ListGroup.Item><strong>Check-Out:</strong>{lastBook.fechaSalida}</ListGroup.Item>
                    <ListGroup.Item><strong>Estado:</strong></ListGroup.Item>
                  </ListGroup>
                  </> : <p>El cliente aún no hizo reservas.</p>
                }
              </Card.Body>
            </Card>
            <div className="d-flex  align-items-center justify-content-center gap-2">
              <Button variant="primary" disabled={!lastBook} onClick={clientHistory}>Ver Historial</Button>
              <Button variant="secondary" onClick={editClient}>Editar Cliente</Button>
            </div>
          </Col>
        </Row>
    </Container>
  )
}

export default ClientDetails
