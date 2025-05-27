// src/pages/RoomsType.page.jsx

import React, { useState, useEffect } from 'react';
import axios from '../config/axiosConfig';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaginatedTable from '../components/PaginatedTable.jsx';

function RoomTypes() {
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const response = await axios.get('/TiposHabitaciones');
                setTipos(response.data);
            } catch (err) {
                console.error('>>> Error al obtener tipos:', err);
                setError('Error al cargar los tipos de habitación');
                toast.error('No se pudo cargar los tipos de habitación.');
            } finally {
                setLoading(false);
            }
        };

        fetchTipos();
    }, []);

    const handleEliminarTipo = async (id) => {
        try {
            await axios.delete(`/TiposHabitaciones/${id}`);
            setTipos(prev => prev.filter(tipo => tipo.id !== id));
            toast.success('Tipo de habitación eliminado correctamente.');
        } catch (err) {
            console.error('Error eliminando tipo de habitación:', err);
            const msg = err.response?.data || 'Error al eliminar el tipo de habitación.';
            toast.error(msg);
        }
    };

    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'descripcion', label: 'Descripción' },
    ];

    const rowActions = [
        { icon: 'edit', label: 'Editar', onClick: rowData => navigate(`/roomstype/edit/${rowData.id}`) },
        { icon: 'delete', label: 'Eliminar', onClick: rowData => handleEliminarTipo(rowData.id) }
    ];

    return (
        <Container className="mt-4">
            <ToastContainer />

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
                <PaginatedTable headers={headers} data={tipos} rowActions={rowActions} />
            ) : (
                <Row>
                    {tipos.map(tipo => (
                        <Col xs={12} sm={6} md={4} lg={3} key={tipo.id} className="mb-4">
                            <Card>
                                {tipo.imagenes?.[0]?.url ? (
                                    <Card.Img
                                        variant="top"
                                        src={tipo.imagenes[0].url}
                                        style={{ height: '180px', objectFit: 'cover' }}
                                        alt={`Imagen de ${tipo.nombre}`} />
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
                                    <Card.Text>
                                        {tipo.descripcion && tipo.descripcion.length > 100
                                            ? tipo.descripcion.slice(0, 100) + '...'
                                            : tipo.descripcion}
                                    </Card.Text>
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
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default RoomTypes;
