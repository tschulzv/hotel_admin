import { useState, useEffect } from 'react';
import axios from '../config/axiosConfig';
import RoomCard from '../components/RoomCard.jsx';
import PaginatedTable from '../components/PaginatedTable.jsx';
import { Container, Dropdown, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
/*
const habitaciones = [
    { numero: 101, tipo: "ESTÁNDAR", estado: "EN LIMPIEZA" },
    { numero: 102, tipo: "ESTÁNDAR", estado: "DISPONIBLE" },
    { numero: 103, tipo: "ESTÁNDAR", estado: "OCUPADO" },
    { numero: 104, tipo: "DELUXE", estado: "DISPONIBLE" },
    { numero: 200, tipo: "PRESIDENCIAL", estado: "DISPONIBLE" },
    { numero: 201, tipo: "DELUXE", estado: "OCUPADO" },
    { numero: 202, tipo: "ESTÁNDAR", estado: "DISPONIBLE" },
    { numero: 203, tipo: "EJECUTIVA", estado: "OCUPADO" },
    { numero: 300, tipo: "ESTÁNDAR", estado: "DISPONIBLE" },
    { numero: 301, tipo: "EJECUTIVA", estado: "DISPONIBLE" },
    { numero: 302, tipo: "PRESIDENCIAL", estado: "OCUPADO" },
    { numero: 303, tipo: "ESTÁNDAR", estado: "DISPONIBLE" },
    { numero: 400, tipo: "DELUXE", estado: "OCUPADO" },
    { numero: 401, tipo: "EJECUTIVA", estado: "DISPONIBLE" },
    { numero: 402, tipo: "DELUXE", estado: "EN LIMPIEZA" },
    { numero: 403, tipo: "EJECUTIVA", estado: "DISPONIBLE" },
    { numero: 501, tipo: "ESTÁNDAR", estado: "LATE CHECKOUT" },
    { numero: 502, tipo: "DELUXE", estado: "DISPONIBLE" },
    { numero: 503, tipo: "PRESIDENCIAL", estado: "EN LIMPIEZA" },
    { numero: 504, tipo: "PRESIDENCIAL", estado: "DISPONIBLE" },
    // ...otras habitaciones
];
*/
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
                setEstados(estadosRes.data);  // Estado de habitaciones
                setTipos(tiposRes.data);      // Tipos de habitaciones
            } catch (err) {
                console.error("Error cargando filtros:", err);
            }
        };

        fetchFiltros();
    }, []); // El array vacío asegura que esto se ejecute solo una vez al cargar el componente.

    const habitacionesFiltradas = habitaciones.filter(hab => {
        return (
            (estadoFiltro === '' || hab.estadoNombre === estadoFiltro) &&
            (tipoFiltro === '' || hab.tipoHabitacionNombre === tipoFiltro)
        );
    });

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
                    data={habitacionesFiltradas}
                    rowActions={[
                        {
                            icon: 'visibility',
                            label: 'Ver',
                            onClick: (rowData) => navigate(`/rooms/edit/${rowData.id}`),
                        },
                    ]}
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
                                            .sort((a, b) => parseInt(a.numeroHabitacion) - parseInt(b.numeroHabitacion)) // Ordenar habitaciones dentro del piso de mayor a menor
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
        </Container>
    );
}

export default Rooms;
