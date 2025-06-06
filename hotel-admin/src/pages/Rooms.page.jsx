// src/pages/Rooms.page.jsx

import React, { useState, useEffect } from 'react';
import axios from '../config/axiosConfig';
import RoomCard from '../components/RoomCard.jsx';
import PaginatedTable from '../components/PaginatedTable.jsx';
import {
    Container, Dropdown, Button, Row, Col,
    Spinner, Alert, Modal
} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBars, FaThLarge, FaTrash } from 'react-icons/fa';

const getEstado = estado => {
    if (!estado) return { color: 'secondary', icono: 'desconocido' };
    switch (estado.toUpperCase()) {
        case 'DISPONIBLE': return { color: '#388E3C', icono: 'bed', accent: '#1B5E20'};
        case 'OCUPADO': return { color: '#d43131', icono: 'hotel', accent: '#B71C1C' };
        case 'EN LIMPIEZA': return { color: '#1976D2', icono: 'cleaning_services', accent: '#115293'};
        case 'FUERA DE SERVICIO': return { color: '#546E7A', icono: 'cancel', accent: '#37474F' };
        default: return { color: 'secondary', icono: 'question_mark',  accent: '#555' };
    }
};

function Rooms() {
    const navigate = useNavigate();
    const [habitaciones, setHabitaciones] = useState([]);
    const [estados, setEstados] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isListView, setIsListView] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [showModalEliminar, setShowModalEliminar] = useState(false);
    const [habitacionAEliminar, setHabitacionAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);
    const [paginasPorPiso, setPaginasPorPiso] = useState({});

    const HABITACIONES_POR_PAGINA = 4;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [habRes, estRes, tipoRes] = await Promise.all([
                    axios.get('/Habitacions'),
                    axios.get('/EstadoHabitacions'),
                    axios.get('/TiposHabitaciones')
                ]);
                setHabitaciones(habRes.data);
                setEstados(estRes.data);
                setTipos(tipoRes.data);
            } catch (err) {
                console.error(err);
                setError('Error cargando datos.');
                toast.error('No se pudieron cargar los datos.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const habitacionesFiltradas = habitaciones.filter(hab =>
        (estadoFiltro === '' || hab.estadoNombre === estadoFiltro) &&
        (tipoFiltro === '' || hab.tipoHabitacionNombre === tipoFiltro)
    );

    const abrirEliminar = hab => {
        setHabitacionAEliminar(hab);
        setShowModalEliminar(true);
    };

    const handleEliminar = async () => {
        if (!habitacionAEliminar) return;
        setEliminando(true);
        try {
            await axios.delete(`/Habitacions/${habitacionAEliminar.id}`);
            setHabitaciones(prev => prev.filter(h => h.id !== habitacionAEliminar.id));
            toast.success('Habitación eliminada correctamente');
            setShowModalEliminar(false);
            setHabitacionAEliminar(null);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data || 'Error al eliminar habitación';
            toast.error(msg);
        } finally {
            setEliminando(false);
        }
    };

    if (loading) return (
        <Container fluid className="text-center my-5">
            <Spinner animation="border" />
        </Container>
    );

    return (
        <Container fluid>
            <ToastContainer />
            <h4 className="text-center my-4">VISTA GENERAL DE HABITACIONES</h4>

            <div className="d-flex justify-content-between mb-3">
                <div className="d-flex gap-2">
                    <Dropdown onSelect={setEstadoFiltro}>
                        <Dropdown.Toggle variant="outline-secondary">
                            {estadoFiltro || 'Estado'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="">Todos</Dropdown.Item>
                            {estados.map(e => (
                                <Dropdown.Item key={e.id} eventKey={e.nombre}>
                                    {e.nombre}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown onSelect={setTipoFiltro}>
                        <Dropdown.Toggle variant="outline-secondary">
                            {tipoFiltro || 'Tipo'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="">Todos</Dropdown.Item>
                            {tipos.map(t => (
                                <Dropdown.Item key={t.id} eventKey={t.nombre}>
                                    {t.nombre}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" onClick={() => setIsListView(v => !v)}>
                        {isListView ? <FaThLarge /> : <FaBars />}
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/rooms/new')}>
                        Nueva Habitación
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/roomstype')}>
                        Tipos Habitación
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/roomsstatus')}>
                        Ver Estados de Habitación
                    </Button>
                </div>
            </div>

            {error && <Alert variant="danger" className="text-center">{error}</Alert>}

            {isListView ? (
                <PaginatedTable
                    headers={[
                        { key: 'id', label: 'ID' },
                        { key: 'numeroHabitacion', label: 'Número' },
                        { key: 'tipoHabitacionNombre', label: 'Tipo' },
                        { key: 'estadoNombre', label: 'Estado' },
                        { key: 'observaciones', label: 'Observaciones' }
                    ]}
                    data={habitacionesFiltradas}
                    rowActions={[
                        { icon: <i className="material-icons">edit</i>, label: 'Editar', onClick: row => navigate(`/rooms/edit/${row.id}`) },
                        { icon: <i className="material-icons">delete</i>, label: 'Eliminar', onClick: row => abrirEliminar(row) }
                    ]}
                />
            ) : (
                habitacionesFiltradas.length === 0 ? (
                    <p className="text-center mt-4">No hay habitaciones con esos filtros.</p>
                ) : (
                    Object.entries(
                        habitacionesFiltradas.reduce((grupos, hab) => {
                            const piso = Math.floor(parseInt(hab.numeroHabitacion, 10) / 100);
                            grupos[piso] = grupos[piso] || [];
                            grupos[piso].push(hab);
                            return grupos;
                        }, {})
                    )
                        .sort(([a], [b]) => a - b)
                        .map(([piso, habs]) => {
                            const totalPaginas = Math.ceil(habs.length / HABITACIONES_POR_PAGINA);
                            const paginaActual = paginasPorPiso[piso] || 0;
                            const inicio = paginaActual * HABITACIONES_POR_PAGINA;
                            const habitacionesMostradas = habs
                                .sort((a, b) => parseInt(a.numeroHabitacion) - parseInt(b.numeroHabitacion))
                                .slice(inicio, inicio + HABITACIONES_POR_PAGINA);

                            return (
                                <div key={piso} className="mb-4">
                                    <h5 className="mb-3">
                                        Piso {piso} <span className="text-muted">({habs.length} habitaciones)</span>
                                    </h5>
                                    <div className="position-relative">
                                        <div className="d-flex align-items-center">
                                            {paginaActual > 0 && (
                                                <Button
                                                    variant="light"
                                                    className="me-3 rounded-circle"
                                                    style={{ width: '40px', height: '40px', padding: 0 }}
                                                    onClick={() => setPaginasPorPiso(prev => ({
                                                        ...prev,
                                                        [piso]: prev[piso] - 1
                                                    }))}
                                                >
                                                    <i className="material-icons">chevron_left</i>
                                                </Button>
                                            )}
                                            <div className="d-flex gap-3">
                                                {habitacionesMostradas.map(hab => {
                                                    const { color, icono, accent } = getEstado(hab.estadoNombre);
                                                    return (
                                                        <div key={hab.id} style={{ width: '250px' }}>
                                                            <div style={{ position: 'relative' }}>
                                                                <Link to={`/rooms/edit/${hab.id}`} style={{ textDecoration: 'none' }}>
                                                                    <RoomCard
                                                                        numero={hab.numeroHabitacion}
                                                                        tipo={hab.tipoHabitacionNombre}
                                                                        estado={hab.estadoNombre}
                                                                        color={color}
                                                                        icono={icono}
                                                                        accent={accent}
                                                                    />
                                                                </Link>
                                                                <Button
                                                                    size="sm"
                                                                    style={{
                                                                        backgroundColor: '#B71C1C',
                                                                        position: 'absolute',
                                                                        top: '8px',
                                                                        right: '8px',
                                                                        borderRadius: '50%',
                                                                        borderColor: '#B71C1C',
                                                                        padding: '4px 6px'
                                                                    }}
                                                                    onClick={() => abrirEliminar(hab)}
                                                                >
                                                                    <FaTrash />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {paginaActual < totalPaginas - 1 && (
                                                <Button
                                                    variant="light"
                                                    className="ms-3 rounded-circle"
                                                    style={{ width: '40px', height: '40px', padding: 0 }}
                                                    onClick={() => setPaginasPorPiso(prev => ({
                                                        ...prev,
                                                        [piso]: (prev[piso] || 0) + 1
                                                    }))}
                                                >
                                                    <i className="material-icons">chevron_right</i>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                )
            )}

            <Modal show={showModalEliminar} onHide={() => { setShowModalEliminar(false); setHabitacionAEliminar(null); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Está seguro de que desea eliminar la habitación <strong>{habitacionAEliminar?.numeroHabitacion}</strong>?</p>
                    <p className="text-danger">Esta acción no se puede deshacer</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowModalEliminar(false); setHabitacionAEliminar(null); }}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleEliminar} disabled={eliminando}>
                        {eliminando ? <Spinner animation="border" size="sm" /> : 'Eliminar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Rooms;
