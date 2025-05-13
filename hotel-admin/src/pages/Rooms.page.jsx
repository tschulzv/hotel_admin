import { useState, useEffect } from 'react';
import axios from '../config/axiosConfig';
import RoomCard from '../components/RoomCard.jsx';
import PaginatedTable from '../components/PaginatedTable.jsx';
import { Container, Dropdown, Button, Row, Col, Spinner, Alert, Modal } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const getEstado = (estado) => {
    if (!estado) return { color: "secondary", icono: "desconocido" };
    switch (estado.toUpperCase()) {
        case "DISPONIBLE":
            return { color: "success", icono: "disponible" };
        case "OCUPADO":
            return { color: "danger", icono: "ocupado" };
        case "EN LIMPIEZA":
            return { color: "primary", icono: "en limpieza" };
        case "LATE CHECKOUT":
            return { color: "danger", icono: "late checkout" };
        default:
            return { color: "secondary", icono: "desconocido" };
    }
};

function Rooms() {
    const navigate = useNavigate();
    const [habitaciones, setHabitaciones] = useState([]);
    const [estados, setEstados] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [showModalEliminar, setShowModalEliminar] = useState(false);
    const [habitacionAEliminar, setHabitacionAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);
    const [errorEliminar, setErrorEliminar] = useState('');

    const headers = [{ key: "id", label: "ID" }, { key: "numeroHabitacion", label: "Numero" }, { key: "tipoHabitacionNombre", label: "Tipo" }, { key: "estadoNombre", label: "Estado" },
    { key: "observaciones", label: "Observaciones" },]

    // array de acciones para la tabla
    const actions = [
        {
            icon: <i className="material-icons">visibility</i>,
            label: "Ver",
            onClick: (rowData) => {
                navigate(`/reservations/${rowData.id}`);
            },
        },
        {
            icon: <i className="material-icons">edit</i>,
            label: "Editar",
            onClick: (rowData) => {
                navigate(`/rooms/edit/${rowData.id}`);
            },
        },
        {
            icon: <i className="material-icons">delete</i>,
            label: "Eliminar",
            onClick: (rowData) => {
                setHabitacionAEliminar(rowData);
                setShowModalEliminar(true);
            },
        }
    ];

    useEffect(() => {
        const fetchHabitaciones = async () => {
            try {
                const response = await axios.get('/Habitacions');
                setHabitaciones(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Error al cargar las habitaciones');
                setLoading(false);
            }
        };

        fetchHabitaciones();
    }, []);

    useEffect(() => {
        const fetchFiltros = async () => {
            try {
                const [estadosRes, tiposRes] = await Promise.all([
                    axios.get("EstadoHabitacions"),
                    axios.get("TiposHabitaciones")
                ]);
                setEstados(estadosRes.data);
                setTipos(tiposRes.data);
            } catch (err) {
                console.error("Error cargando filtros:", err);
            }
        };

        fetchFiltros();
    }, []);

    const habitacionesFiltradas = habitaciones.filter(hab => {
        return (
            (estadoFiltro === '' || hab.estadoNombre === estadoFiltro) &&
            (tipoFiltro === '' || hab.tipoHabitacionNombre === tipoFiltro)
        );
    });

    const handleCerrarModalEliminar = () => setShowModalEliminar(false);

    const handleEliminarHabitacion = async () => {
        if (!habitacionAEliminar) return;

        setEliminando(true);
        setErrorEliminar('');

        try {
            await axios.delete(`/Habitacions/${habitacionAEliminar.id}`);
            // Actualizar la lista de habitaciones después de la eliminación exitosa
            const nuevasHabitaciones = habitaciones.filter(hab => hab.id !== habitacionAEliminar.id);
            setHabitaciones(nuevasHabitaciones);
            setShowModalEliminar(false);
        } catch (error) {
            console.error("Error al eliminar la habitación:", error);
            setErrorEliminar('Error al eliminar la habitación.');
        } finally {
            setEliminando(false);
        }
    };

    return (
        <Container fluid>
            <h4 className="text-center my-4">VISTA GENERAL DE HABITACIONES</h4>

            <div className="d-flex justify-content-between mb-3">
                <div className="d-flex gap-2">
                    {/* Filtro de Estado de Habitación */}
                    <Dropdown onSelect={setEstadoFiltro}>
                        <Dropdown.Toggle variant="outline-secondary">
                            {estadoFiltro || "Estado Habitación"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="">Todos</Dropdown.Item>
                            {estados.map((estado) => (
                                <Dropdown.Item key={estado.id} eventKey={estado.nombre}>
                                    {estado.nombre}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* Filtro de Tipo de Habitación */}
                    <Dropdown onSelect={setTipoFiltro}>
                        <Dropdown.Toggle variant="outline-secondary">
                            {tipoFiltro || "Tipo Habitación"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="">Todos</Dropdown.Item>
                            {tipos.map((tipo) => (
                                <Dropdown.Item key={tipo.id} eventKey={tipo.nombre}>
                                    {tipo.nombre}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" onClick={() => setMostrarTabla(!mostrarTabla)}>
                        {mostrarTabla ? 'Mostrar Tarjetas' : 'Mostrar Tabla'}
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/rooms/new')}>
                        Nueva Habitación
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/roomstype/new')}>
                        Nuevo Tipo Habitación
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger" className="text-center">{error}</Alert>
            ) : mostrarTabla ? (
                <PaginatedTable
                    headers={headers}
                    data={habitacionesFiltradas}
                    rowActions={actions}
                />
            ) : (
                <>
                    {habitacionesFiltradas.length === 0 ? (
                        <p className="text-center mt-4">No hay habitaciones que coincidan con los filtros.</p>
                    ) : (
                        Object.entries(
                            habitacionesFiltradas.reduce((grupos, hab) => {
                                const numero = parseInt(hab.numeroHabitacion, 10);
                                const piso = Math.floor(numero / 100);
                                if (!grupos[piso]) grupos[piso] = [];
                                grupos[piso].push(hab);
                                return grupos;
                            }, {})
                        )
                            .sort(([a], [b]) => b - a) // Ordenar pisos de mayor a menor
                            .map(([piso, habitaciones]) => (
                                <div key={piso} className="mb-4">
                                    <h5 className="mb-3">
                                        Piso {piso} <span className="text-muted">({habitaciones.length} habitaciones)</span>
                                    </h5>
                                    <Row>
                                        {[...habitaciones]
                                            .sort((a, b) => parseInt(a.numeroHabitacion) - parseInt(b.numeroHabitacion)) // Ordenar habitaciones dentro del piso
                                            .map(hab => {
                                                const { color, icono } = getEstado(hab.estadoNombre);
                                                return (
                                                    <Col xs={6} sm={4} md={4} lg={3} key={hab.id} className="mb-3">
                                                        <Link to={`/rooms/edit/${hab.id}`} style={{ textDecoration: 'none' }}>
                                                            <RoomCard
                                                                numero={hab.numeroHabitacion}
                                                                tipo={hab.tipoHabitacionNombre}
                                                                estado={hab.estadoNombre}
                                                                color={color}
                                                                icono={icono}
                                                            />
                                                        </Link>
                                                    </Col>
                                                );
                                            })}
                                    </Row>
                                </div>
                            ))
                    )}
                </>
            )}

            {/* Modal de Confirmación de Eliminación */}
            <Modal show={showModalEliminar} onHide={handleCerrarModalEliminar}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {habitacionAEliminar && (
                        <p>¿Estás seguro de que deseas eliminar la habitación número <strong>{habitacionAEliminar.numeroHabitacion}</strong>?</p>
                    )}
                    {errorEliminar && <Alert variant="danger">{errorEliminar}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCerrarModalEliminar}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleEliminarHabitacion} disabled={eliminando}>
                        {eliminando ? <Spinner animation="border" size="sm" /> : 'Eliminar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Rooms;