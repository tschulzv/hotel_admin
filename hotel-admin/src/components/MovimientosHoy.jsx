import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig';

const MovimientosHoy = () => {
    const navigate = useNavigate();
    const [checkIns, setCheckIns] = useState([]);
    const [checkOuts, setCheckOuts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [checkInsRes, checkOutsRes] = await Promise.all([
                    axios.get('/Reservas/checkins-pendientes'),
                    axios.get('/Reservas/checkouts-pendientes')
                ]);

                setCheckIns(checkInsRes.data);
                setCheckOuts(checkOutsRes.data);
            } catch (error) {
                console.error('Error al cargar movimientos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Actualizar cada 5 minutos
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, []);    const handleCheckInClick = (reserva) => {
        navigate(`/checkin/${reserva.codigo}`);
    };

    const handleCheckOutClick = (reserva) => {
        navigate(`/checkout/${reserva.codigo}`);
    };

    const formatTime = (timeString) => {
        return new Date('1970-01-01T' + timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="row g-4">
            <div className="col-md-6">
                <Card>
                    <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Check-ins Pendientes</h5>
                        <Badge bg="light" text="dark">{checkIns.length}</Badge>
                    </Card.Header>
                    <Card.Body>
                        <div className="table-responsive">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Cliente</th>
                                        <th>Llegada</th>
                                        <th>Habitaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkIns.map(checkin => (
                                        <tr 
                                            key={checkin.id} 
                                            onClick={() => handleCheckInClick(checkin)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td>{checkin.codigo}</td>
                                            <td>{checkin.nombreCliente}</td>
                                            <td>{formatTime(checkin.llegadaEstimada)}</td>
                                            <td>
                                                {checkin.habitaciones.map(h => 
                                                    `${h.numeroHabitacion}`
                                                ).join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                    {checkIns.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center">No hay check-ins pendientes para hoy</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <div className="col-md-6">
                <Card>
                    <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Check-outs Pendientes</h5>
                        <Badge bg="light" text="dark">{checkOuts.length}</Badge>
                    </Card.Header>
                    <Card.Body>
                        <div className="table-responsive">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Cliente</th>
                                        <th>Habitaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkOuts.map(checkout => (
                                        <tr 
                                            key={checkout.id}
                                            onClick={() => handleCheckOutClick(checkout)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td>{checkout.codigo}</td>
                                            <td>{checkout.nombreCliente}</td>
                                            <td>
                                                {checkout.habitaciones.map(h => 
                                                    `${h.numeroHabitacion}`
                                                ).join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                    {checkOuts.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center">No hay check-outs pendientes para hoy</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default MovimientosHoy;
