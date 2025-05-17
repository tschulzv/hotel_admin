import { useState, useEffect } from 'react';
import axios from '../config/axiosConfig';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PaginatedTable from '../components/PaginatedTable.jsx'; // Importar el componente de tabla paginada

function RoomTypes() {
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mostrarTabla, setMostrarTabla] = useState(false); // Estado para alternar entre tabla y tarjetas
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

    const handleEliminarTipo = async (id) => {
        try {
            await axios.delete(`/TiposHabitaciones/${id}`);
            setTipos((prevTipos) => prevTipos.filter((tipo) => tipo.id !== id));
        } catch (error) {
            console.error('Error eliminando tipo de habitación:', error);
        }
    };

    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'descripcion', label: 'Descripción' },
    ];

    const rowActions = [
        {
            icon: 'edit',
            label: 'Editar',
            onClick: (rowData) => navigate(`/roomstype/edit/${rowData.id}`),
        },
        {
            icon: 'delete',
            label: 'Eliminar',
            onClick: (rowData) => handleEliminarTipo(rowData.id),
        },
    ];

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                    &larr; Volver
                </Button>
                <h4>Tipos de Habitación</h4>
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-primary"
                        onClick={() => setMostrarTabla(!mostrarTabla)}
                    >
                        {mostrarTabla ? 'Mostrar Tarjetas' : 'Mostrar Tabla'}
                    </Button>
                    <Button onClick={() => navigate('/roomstype/new')}>Nuevo Tipo de Habitación</Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : tipos.length === 0 ? (
                <p>No hay tipos de habitación registrados.</p>
            ) : mostrarTabla ? (
                <PaginatedTable
                    headers={headers}
                    data={tipos}
                    rowActions={rowActions}
                />
            ) : (
                <Row>
                    {tipos.map((tipo) => {
                        const imageUrl = tipo.imagenes?.[0]?.url
                            ? `${tipo.imagenes[0].url}`
                            : null;

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
                                        <div className="d-flex justify-content-between">
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                onClick={() => navigate(`/roomstype/edit/${tipo.id}`)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => handleEliminarTipo(tipo.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
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
