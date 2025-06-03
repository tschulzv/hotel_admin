import React, { useState, useEffect} from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import DayCard from '../components/DayCard.jsx';
import '../Calendar.css';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig';

const meses = [
  { nombre: "Enero", dias: 31 },
  { nombre: "Febrero", dias: 28 },
  { nombre: "Marzo", dias: 31 },
  { nombre: "Abril", dias: 30 },
  { nombre: "Mayo", dias: 31 },
  { nombre: "Junio", dias: 30 },
  { nombre: "Julio", dias: 31 },
  { nombre: "Agosto", dias: 31 },
  { nombre: "Septiembre", dias: 30 },
  { nombre: "Octubre", dias: 31 },
  { nombre: "Noviembre", dias: 30 },
  { nombre: "Diciembre", dias: 31 },
];

const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const anhos = ["2023", "2024", "2025"];

const Calendar = () => {
  const mesActual = meses[new Date().getMonth()].nombre;
  const [mesSeleccionado, setMesSeleccionado] = useState(mesActual); // Mayo por defecto
  const [anhoSeleccionado, setAnhoSeleccionado] = useState(anhos[2]); // 2025 por defecto
  const [reservas, setReservas] = useState([]);
  const [habitaciones, sethabitaciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try{
        const [responseReservas, responseHabitaciones] = await Promise.all([
          axios.get('/Reservas'),
          axios.get('/Habitacions'),
        ]);

        setReservas(responseReservas.data);
        sethabitaciones(responseHabitaciones.data.filter(h => h.activo));
      } catch (err){
        console.error('Error al cargar datos: ', err);
      }
    };
    fetchData();
  }, []);


  const getDiasDelMes = (mesNombre, anho) => {
    const mesIndex = meses.findIndex(m => m.nombre === mesNombre);
    let dias = meses[mesIndex].dias;

    // Año bisiesto para febrero
    if (mesNombre === "Febrero") {
      const esBisiesto = (anho % 4 === 0 && (anho % 100 !== 0 || anho % 400 === 0));
      if (esBisiesto) dias = 29;
    }

    const fechaInicio = new Date(anho, mesIndex, 1);
    const primerDiaSemana = fechaInicio.getDay(); // 0 = domingo

    const totalCeldas = Math.ceil((dias + primerDiaSemana) / 7) * 7;

    const celdas = [];

    for (let i = 0; i < totalCeldas; i++) {
      const dia = i - primerDiaSemana + 1;

      if (i < primerDiaSemana || dia > dias) {
        celdas.push(null); // celda vacía
      } else {
        const fechaActual = new Date(anho, mesIndex, dia);

        const ocupadas = reservas.filter(reserva => [1, 2, 4, 5].includes(reserva.estadoId))
        .reduce((count, reserva) => {
          const ingreso = new Date(reserva.fechaIngreso);
          const salida = new Date(reserva.fechaSalida);
          
          console.log("Comparando:", fechaActual.toISOString().split('T')[0], "con", ingreso.toISOString().split('T')[0], "hasta", salida.toISOString().split('T')[0]);


          if (fechaActual >= ingreso && fechaActual <= salida)
            return count + reserva.detalles.length;
          return count;
        }, 0);

        const totalHabitaciones = habitaciones.length;
        const porcentaje = totalHabitaciones > 0 
          ? Math.round((ocupadas / totalHabitaciones) * 100)
          : 0;

        

        celdas.push({ dia, porcentaje });
      }
    }

    return celdas;
  };
  // Simulación de los días del mes seleccionado
  const diasDelMes = getDiasDelMes(mesSeleccionado, parseInt(anhoSeleccionado));

  const handleDiaClick = (dia) => {
    const mesIndex = meses.findIndex(m => m.nombre === mesSeleccionado) + 1;
    const mes = mesIndex.toString().padStart(2, '0'); // mes con dos dígitos
    const diaStr = dia.toString().padStart(2, '0'); // día con dos dígitos
    const fecha = `${anhoSeleccionado}-${mes}-${diaStr}`;
    navigate(`/reservations?fecha=${fecha}`);
  };


  return (
    <Container fluid className="p-4">
      <h4 className="mb-4 text-center">CALENDARIO DE OCUPACIÓN</h4>

      {/* Desplegable de los meses */}
      <div className="d-flex gap-4 mb-4">
        <div>
          <p>Mes</p>
          <Dropdown onSelect={(seleccionado) => setMesSeleccionado(seleccionado)}>
            <Dropdown.Toggle variant="outline-secondary">
              {mesSeleccionado}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {meses.map((mes, idx) => (
                <Dropdown.Item key={idx} eventKey={mes.nombre}>
                  {mes.nombre}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>


        {/* Desplegable de los años */}
        <div>
          <p>Año</p>
          <Dropdown onSelect={(seleccionado) => setAnhoSeleccionado(seleccionado)}>
            <Dropdown.Toggle variant="outline-secondary">
              {anhoSeleccionado}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {anhos.map((anho, idx) => (
                <Dropdown.Item key={idx} eventKey={anho}>
                  {anho}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="calendar-grid-header">
        {diasSemana.map((dia, idx) => (
          <div className="days-of-week" key={idx}>{dia}</div>
        ))}
      </div>

      {/* Tarjetas del calendario */}
      <div className="calendar-grid">
        {diasDelMes.map((diaObj, idx) => (
          <div key={idx} className = "calendar-cell">
            {diaObj ? (
              <DayCard 
                dia={diaObj.dia} 
                porcentaje={diaObj.porcentaje} 
                onClick={() => handleDiaClick(diaObj.dia)} // al hacer click en la tarjeta, se redirige a la pagina de reservas
              />
            ) : (
              <div className = "empty-cell"/> // celda vacía
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Calendar;