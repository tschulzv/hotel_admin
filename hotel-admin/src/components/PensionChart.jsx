import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

function PensionChart() {
    const data = {
        labels: ['Sólo Desayuno', 'Media Pensión', 'Pensión Completa'],
        datasets: [{
            label: 'Cantidad',
            data: [12, 20, 4],
            backgroundColor: ['#007bff', '#17a2b8', '#28a745']
        }]
    };

    const options = {
        indexAxis: 'y',
        plugins: { 
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Cantidad: ${context.raw}`;
                    }
                }
            }
        },
        scales: { 
            x: { beginAtZero: true }
        }
    };

    return (
        <div style={{ width: '400px', height: '200px' }}>
            <Bar data={data} options={options} />
        </div>
    );
}

export default PensionChart;
