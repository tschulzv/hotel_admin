import React, { useState, useMemo } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select'
import countryList from 'react-select-country-list'

const ClientForm = () => {
  // CLIENTE DE EJEMPLO, BORRAR CUANDO FUNCIONE LA API!!
  // useEffect y obtener datos del cliente de la db si se le pasa un id
  let client = {id: 1,
  nombre: "Ana Martínez",
  documento: "4567890",
  tipoDocumento: "CI",
  ruc: "4567890-1",
  telefono: "+595 21 123 4567",
  email: "ana.martinez@example.com",
  nacionalidad: "Paraguaya"
}
  // 
  const navigate = useNavigate();
  const countries = useMemo(() => countryList().getData(), []);
  const tiposDocumento = [
    { value: 'ci', label: 'C.I.' },
    { value: 'dni', label: 'DNI' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'licenciaConducir', label: 'Lic. de Conducir' },
  ];
  let { id } = useParams();
  // si existe un id como parametro, es modo edicion
  let isEditMode = id !== undefined;

  const [clientData, setClientData] = useState({
    nombre: isEditMode ? client.nombre : '',
    apellido: isEditMode ? client.apellido : '',
    email: isEditMode ? client.email : '',
    telefono: isEditMode ? client.telefono : '',
    observaciones: isEditMode ? client.observaciones : '',
    pais: isEditMode ? client.pais : '',
    documento: isEditMode ? client.documento : '',
    tipoDocumento: isEditMode ? client.tipoDocumento : '',
    ruc: isEditMode ? client.ruc : '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nuevo cliente:', clientData);
    if (isEditMode){
      // hacer put a la api
    } else {
      // hacer post a la api
    }
    navigate('/clients');  // redirigir de vuelta después de guardar.
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">{isEditMode ? "Editar Cliente" : "Nuevo Cliente"}</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={clientData.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={clientData.apellido}
                  onChange={handleChange}
                  required
                />
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
                <Form.Label>Número de Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={clientData.telefono}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Label>País</Form.Label>
                <Select options={countries} value={clientData.pais} onChange={handleChange} />
            </Col>
          </Row>

          <Row>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label>Número de Documento</Form.Label>
                <Form.Control
                  type="text"
                  name="documento"
                  value={clientData.documento}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
                <Form.Label>Tipo</Form.Label>
                <Select options={tiposDocumento} value={clientData.tipoDocumento} onChange={handleChange} />
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
              name="observaciones"
              value={clientData.observaciones}
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
};

export default ClientForm;
