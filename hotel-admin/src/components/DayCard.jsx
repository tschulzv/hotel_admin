
import React from "react";
import { Card, ProgressBar } from "react-bootstrap";
import '../Calendar.css';

const getVariant = (porcentaje) => {
    if (porcentaje >= 80) return "danger";
    if(porcentaje >= 50) return "warning";
    return "success";
};

const DayCard = ({ dia,  porcentaje, onClick }) => {
  return (
    <Card className="day-card" onClick={onClick} role="button">
      <Card.Body className = "day-card-body">
        <div className="day-number mb-2">{dia}</div>
        <div className="text-sm text-muted-foreground mt-1">{porcentaje}%</div>
        <ProgressBar 
            now={porcentaje} 
            variant={getVariant(porcentaje)}
            style={{ width: "100%"}}
        />
      </Card.Body>
    </Card>
  );
};

export default DayCard;