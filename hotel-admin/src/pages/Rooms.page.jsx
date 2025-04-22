import { useState } from 'react';
import RoomCard from '../components/RoomCard.jsx';
import PaginatedTable from '../components/PaginatedTable.jsx'; // Asegúrate de la ruta correcta
import { Container, Dropdown, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

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

const getEstado = (estado) => {
    switch (estado) {
        case "DISPONIBLE":
            return { color: "success", icono: "disponible" };
        case "OCUPADO":
            return { color: "danger", icono: "ocupado" };
        case "EN LIMPIEZA":
            return { color: "primary", icono: "en limpieza" };
        case "LATE CHECKOUT":
            return { color: "danger", icono: "late checkout" };
        default:
            return { color: "secondary", icono: "kuek" };
    }
};

function Rooms() {
    const navigate = useNavigate();
    const [mostrarTabla, setMostrarTabla] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');

    const habitacionesFiltradas = habitaciones.filter(hab => {
        return (
            (estadoFiltro === '' || hab.estado === estadoFiltro) &&
            (tipoFiltro === '' || hab.tipo === tipoFiltro)
        );
    });

    return (
        <Container fluid>
            <h4 className="text-center my-4">VISTA GENERAL DE HABITACIONES</h4>

            <div className="d-flex justify-content-between mb-3">
                <div className="d-flex gap-2">
                    <Dropdown onSelect={(selected) => setEstadoFiltro(selected)}>
                        <Dropdown.Toggle variant="outline-secondary">
                            {estadoFiltro || "Estado"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="">Todos</Dropdown.Item>
                            <Dropdown.Item eventKey="DISPONIBLE">Disponible</Dropdown.Item>
                            <Dropdown.Item eventKey="OCUPADO">Ocupado</Dropdown.Item>
                            <Dropdown.Item eventKey="EN LIMPIEZA">En Limpieza</Dropdown.Item>
                            <Dropdown.Item eventKey="LATE CHECKOUT">Late Checkout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown onSelect={(selected) => setTipoFiltro(selected)}>
                        <Dropdown.Toggle variant="outline-secondary">
                            {tipoFiltro || "Tipo Habitación"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="">Todos</Dropdown.Item>
                            <Dropdown.Item eventKey="ESTÁNDAR">Estándar</Dropdown.Item>
                            <Dropdown.Item eventKey="DELUXE">Deluxe</Dropdown.Item>
                            <Dropdown.Item eventKey="EJECUTIVA">Ejecutiva</Dropdown.Item>
                            <Dropdown.Item eventKey="PRESIDENCIAL">Presidencial</Dropdown.Item>
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

            {mostrarTabla ? (
                <PaginatedTable
                    data={habitacionesFiltradas}
                    rowActions={[
                        {
                            icon: 'visibility',
                            label: 'Ver',
                            onClick: (rowData) => navigate(`/rooms/edit/${rowData.numero}`),
                        },
                    ]}
                />
            ) : (
                <Row>
                    {habitacionesFiltradas.map((hab, idx) => {
                        const { color, icono } = getEstado(hab.estado);
                        return (
                            <Col xs={6} sm={4} md={4} lg={3} key={idx} className="mb-3">
                                <Link to={`/rooms/edit/${hab.numero}`} style={{ textDecoration: 'none' }}>
                                    <RoomCard
                                        numero={hab.numero}
                                        tipo={hab.tipo}
                                        estado={hab.estado}
                                        color={color}
                                        icono={icono}
                                    />
                                </Link>
                            </Col>
                        );
                    })}
                    {habitacionesFiltradas.length === 0 && (
                        <p className="text-center mt-4">No hay habitaciones que coincidan con los filtros.</p>
                    )}
                </Row>
            )}
        </Container>
    );
}

export default Rooms;