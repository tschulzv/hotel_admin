// src/components/HabitacionCard.jsx
import React from "react";
import { Card } from "react-bootstrap";

const RoomCard = ({ numero, tipo, estado, color, icono }) => {
  return (
    <Card bg={color} text="white" className="text-center">
      <Card.Body>
        <Card.Title>{numero}</Card.Title>
        <Card.Subtitle>{tipo}</Card.Subtitle>
        <div className="my-2">{icono}</div>
        <Card.Text>{estado}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RoomCard;
