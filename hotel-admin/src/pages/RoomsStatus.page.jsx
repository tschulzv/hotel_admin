import { useState, useEffect } from 'react';
import axios from '../config/axiosConfig';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PaginatedTable from '../components/PaginatedTable.jsx'; // Importar el componente de tabla paginada

function RoomStatus() {
    const [estados, setEstados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEstados = async () => {
            try {
                console.log('>>> Haciendo GET /EstadoHabitacions');
                const response = await axios.get('/EstadoHabitacions');
                console.log('>>> Respuesta backend:', response.data);
                setEstados(response.data);
            } catch (err) {
                console.error('>>> Error al obtener estados:', err);
                setError('Error al cargar los estados de habitación');
            } finally {
                setLoading(false);
            }
        };

        fetchEstados();
    }, []);

    const handleEliminarEstado = async (id) => {
        try {
            await axios.delete(`/EstadoHabitacions/${id}`);
            setEstados((prevEstados) => prevEstados.filter((estado) => estado.id !== id));
        } catch (error) {
            console.error('Error eliminando estado de habitación:', error);
        }
    };

    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
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
            onClick: (rowData) => handleEliminarEstado(rowData.id),
        },
    ];

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                    &larr; Volver
                </Button>
                <h4>Estados de Habitación</h4>
                <div className="d-flex gap-2">
                    <Button onClick={() => navigate('/roomstype/new')}>Nuevo estado</Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : estados.length === 0 ? (
                <p>No hay estados de habitación registrados.</p>
            ) : (
                <PaginatedTable headers={headers} data={estados} rowActions={rowActions}/>
            )}
            
        </Container>
    );
}

export default RoomStatus;
