import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import axios from '../config/axiosConfig';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function PensionChart({ selectedYear, selectedMonth }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        const fetchPensionData = async () => {
            try {
                const params = {};
                if (selectedYear) params.anho = selectedYear;
                if (selectedMonth) params.mes = selectedMonth;

                const response = await axios.get('/Reservas/estadisticas-pensiones', { params });
                const data = response.data;

                setChartData({
                    labels: data.map(item => item.nombrePension),
                    datasets: [
                        {
                            label: 'Adultos',
                            data: data.map(item => item.cantidadAdultos),
                            backgroundColor: '#007bff'
                        },
                        {
                            label: 'Niños',
                            data: data.map(item => item.cantidadNinhos),
                            backgroundColor: '#17a2b8'
                        }
                    ]
                });
            } catch (error) {
                console.error('Error al obtener datos de pensiones:', error);
            }
        };

        fetchPensionData();
    }, [selectedYear, selectedMonth]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: { 
                display: true,
                position: 'top'
            },
            title: {
                display: true,
                text: 'Distribución de Huéspedes por Tipo de Pensión'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        return `${label}: ${context.raw}`;
                    }
                }
            }
        },
        scales: {
            x: { 
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            },
            y: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <Bar data={chartData} options={options} />
        </div>
    );
}

export default PensionChart;
