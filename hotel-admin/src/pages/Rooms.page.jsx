import React from 'react'
import RoomCard from '../components/RoomCard.jsx'
import { Container, Dropdown, Button, Row, Col } from 'react-bootstrap'


const habitaciones = [
    { numero: 101, tipo: "ESTÁNDAR", estado: "EN LIMPIEZA" },
    { numero: 102, tipo: "ESTÁNDAR", estado: "DISPONIBLE" },
    { numero: 103, tipo: "ESTÁNDAR", estado: "OCUPADO" },
    { numero: 501, tipo: "ESTÁNDAR", estado: "LATE CHECKOUT" },
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
                        <Col xs={6} sm={4} md={3} lg={2} key={idx} className="mb-3">
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
            </Row>
        </Container>
    )
}

export default Rooms