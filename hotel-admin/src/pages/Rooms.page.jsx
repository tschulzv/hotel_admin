import React from 'react'
import RoomCard from '../components/RoomCard.jsx'
import { Container, Dropdown, Button, Row, Col } from 'react-bootstrap'
import PensionChart from '../components/PensionChart.jsx';


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
    return (
        <Container fluid>
            <h4 className="text-center my-4">VISTA GENERAL DE HABITACIONES</h4>

            <div className="d-flex justify-content-between mb-3">
                <div className="d-flex gap-2">
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary">Estado</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Disponible</Dropdown.Item>
                            <Dropdown.Item>Ocupado</Dropdown.Item>
                            <Dropdown.Item>En Limpieza</Dropdown.Item>
                            <Dropdown.Item>Late Checkout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary">Tipo Habitación</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Estándar</Dropdown.Item>
                            <Dropdown.Item>Deluxe</Dropdown.Item>
                            <Dropdown.Item>Ejecutiva</Dropdown.Item>
                            <Dropdown.Item>Presidencial</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <Button variant="primary">
                    Nueva Habitación
                </Button>
            </div>

            <Row>
                {habitaciones.map((hab, idx) => {
                    const { color, icono } = getEstado(hab.estado);
                    return (
                        <Col xs={6} sm={4} md={4} lg={3} key={idx} className="mb-3">
                            <RoomCard
                                numero={hab.numero}
                                tipo={hab.tipo}
                                estado={hab.estado}
                                color={color}
                                icono={icono}
                            />
                        </Col>
                        
                    );
                })}
                <PensionChart className="mb-3" />
            </Row>
        </Container>
    )
}

export default Rooms