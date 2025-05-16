import { useState, useEffect } from 'react';
import axios from '../config/axiosConfig';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function RoomTypes() {
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                console.log('>>> Haciendo GET /TiposHabitaciones');
                const response = await axios.get('/TiposHabitaciones');
                console.log('>>> Respuesta backend:', response.data);
                setTipos(response.data);
            } catch (err) {
                console.error('>>> Error al obtener tipos:', err);
                setError('Error al cargar los tipos de habitación');
            } finally {
                setLoading(false);
            }
        };

        fetchTipos();
    }, []);

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Tipos de Habitación</h4>
                <Button onClick={() => navigate('/roomstype/new')}>Nuevo Tipo de Habitación</Button>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : tipos.length === 0 ? (
                <p>No hay tipos de habitación registrados.</p>
            ) : (
                <Row>
                    {tipos.map((tipo) => {
                        const imageUrl = tipo.imagenes?.[0]?.url
                            ? `${tipo.imagenes[0].url}`
                            : null;
                        console.log('>>> tipo.imagenes:', tipo.imagenes);

                        console.log('>>> URL de la imagen:', imageUrl);

                        return (
                            <Col xs={12} sm={6} md={4} lg={3} key={tipo.id} className="mb-4">
                                <Card>
                                    {imageUrl ? (
                                        <Card.Img
                                            variant="top"
                                            src={imageUrl}
                                            style={{ height: '180px', objectFit: 'cover' }}
                                            alt={`Imagen de ${tipo.nombre}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '';
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{ height: '180px', backgroundColor: '#ddd' }}
                                            className="d-flex align-items-center justify-content-center"
                                        >
                                            <span>Sin imagen</span>
                                        </div>
                                    )}
                                    <Card.Body>
                                        <Card.Title>{tipo.nombre}</Card.Title>
                                        <Card.Text>{tipo.descripcion}</Card.Text>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() => navigate(`/roomstype/edit/${tipo.id}`)}
                                        >
                                            Editar
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
}

export default RoomTypes;
