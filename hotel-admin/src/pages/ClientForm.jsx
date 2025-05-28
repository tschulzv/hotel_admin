import React, { useState, useMemo, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import axios from '../config/axiosConfig';
import { toast } from 'react-toastify';

const ClientForm = () => {

  let { id } = useParams();
   // si existe un id como parametro, es modo edicion
  let isEditMode = id !== undefined;
  const navigate = useNavigate();
  const [client, setClient] = useState({});
  const [documentTypes, setDocumentTypes] = useState([]);
  const countries = useMemo(() => countryList().getData(), []);
  const [clientData, setClientData] = useState({});
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        if (isEditMode) {
          const response = await axios.get(`/Clientes/${id}`);
          setClientData(response.data);
        }
  
        const tipos = await axios.get('/TiposDocumentos');
        setDocumentTypes(tipos.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    })();
  }, [isEditMode, id]);

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
      if (isEditMode) {
        await axios.put(`/Clientes/${id}`, {//La solictud put solo funciona pasandole todos los parametros
          id: Number(id),
          nombre: clientData.nombre,
          apellido: clientData.apellido,
          email: clientData.email,
          telefono: clientData.telefono,
          numDocumento: clientData.numDocumento,
          ruc: clientData.ruc,
          tipoDocumentoId: clientData.tipoDocumentoId,
          nacionalidad: clientData.nacionalidad,
          comentarios: clientData.comentarios,
          activo: true
        });
      } else {
        await axios.post('/Clientes', {
          nombre: clientData.nombre,
          apellido: clientData.apellido, 
          email: clientData.email,
          telefono: clientData.telefono,
          numDocumento: clientData.numDocumento,
          tipoDocumentoId: clientData.tipoDocumentoId,
          nacionalidad: clientData.nacionalidad,
          comentarios: clientData.comentarios,
          activo: true
        });
      }
      toast.success(`Cliente ${isEditMode ? "editado" : "creado"} con éxito`, {
      onClose: () => {
        navigate('/clients'); // Navega después que el toast desaparece
      },
      autoClose: 3000, 
    });
      
    } catch (error) {
      toast.error(`Error al guardar los cambios.`)
    }
  };
  

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">{isEditMode ? "Editar Cliente" : "Nuevo Cliente"}</h4>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={clientData.nombre}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Ingrese el nombre del cliente.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido *</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={clientData.apellido}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Ingrese el apellido del cliente.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={clientData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Número de Teléfono *</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={clientData.telefono}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Ingrese el teléfono del cliente.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Label>País *</Form.Label>
                <Form.Select
                name="nacionalidad"
                value={clientData.nacionalidad || ''}
                onChange={handleChange}
                required
                >
                <option value="">Seleccione</option>
                {countries.map((country) => (
                <option key={country.value} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                  Seleccione el país del cliente.
              </Form.Control.Feedback>
            </Col>
          </Row>

          <Row>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label>Número de Documento *</Form.Label>
                <Form.Control
                  type="text"
                  name="numDocumento"
                  value={clientData.numDocumento}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Ingrese el número de documento del cliente.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Documento *</Form.Label>
                <Form.Select
                name="tipoDocumentoId"
                value={clientData.tipoDocumentoId || ''}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                {documentTypes.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Seleccione el tipo de documento del cliente.
              </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label>RUC</Form.Label>
                <Form.Control
                  type="text"
                  name="ruc"
                  value={clientData.ruc}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>


          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comentarios"
              value={clientData.comentarios}
              onChange={handleChange}
            />
          </Form.Group>


          <div className="d-flex justify-content-end gap-2">
            <Button variant="primary" type="submit">
              Guardar
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
export default ClientForm;
