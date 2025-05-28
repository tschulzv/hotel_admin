import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from '../config/axiosConfig';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ReservasChart = ({ selectedYear, selectedMonth }) => {
  const [ocupacionData, setOcupacionData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener el último día del mes seleccionado
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  useEffect(() => {
    const fetchOcupacionData = async () => {
      try {
        setLoading(true);
        const year = parseInt(selectedYear);
        const month = selectedMonth ? parseInt(selectedMonth) : new Date().getMonth() + 1;
        const daysInMonth = getDaysInMonth(year, month);

        // Crear un array de promesas para todas las fechas del mes
        const promises = Array.from({ length: daysInMonth }, (_, i) => {
          const fecha = new Date(year, month - 1, i + 1).toISOString().split('T')[0];
          return axios.get('/Reservas/estadisticas-ocupacion', { params: { fecha } });
        });

        // Ejecutar todas las promesas en paralelo
        const responses = await Promise.all(promises);
        const datos = responses.map(response => response.data);
        setOcupacionData(datos);
      } catch (error) {
        console.error('Error al obtener estadísticas de ocupación:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOcupacionData();
  }, [selectedYear, selectedMonth]);
  // Calcular la media de habitaciones ocupadas
  const mediaOcupacion = ocupacionData.length > 0
    ? (ocupacionData.reduce((acc, curr) => acc + curr.porcentajeOcupacion, 0) / ocupacionData.length)
    : 0;

  const data = {
    labels: Array.from({ length: ocupacionData.length }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Porcentaje de Ocupación',
        data: ocupacionData.map(d => d.porcentajeOcupacion),
        borderColor: 'rgb(13, 110, 253)',
        backgroundColor: 'rgba(13, 110, 253, 0.2)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Media de Ocupación',
        data: Array(ocupacionData.length).fill(mediaOcupacion),
        borderColor: 'rgb(220, 53, 69)',
        borderDash: [5, 5],
        fill: false,
        tension: 0
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Estadísticas de Ocupación por Día'
      },      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.datasetIndex === 0) {
              const data = ocupacionData[context.dataIndex];
              return [
                `Ocupación: ${context.raw.toFixed(1)}%`,
                `Habitaciones: ${data.cantidadOcupadas} de ${data.cantidadTotal}`
              ];
            } else {
              return `Media: ${context.raw.toFixed(1)}%`;
            }
          }
        }
      }
    },    scales: {
      y: {
        type: 'linear',
        display: true,
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Porcentaje de Ocupación'
        },
        ticks: {
          callback: value => `${value}%`
        }
      }
    }
  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default ReservasChart;
