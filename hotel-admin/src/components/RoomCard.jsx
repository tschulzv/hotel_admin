// src/components/HabitacionCard.jsx
import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const RoomCard = ({ numero, tipo, estado, color, icono, accent }) => {
  return (
    <Card className="text-center" style={{ color: 'white', backgroundColor: `${color}`, transition: "transform 0.6s, box-shadow 0.6s" }}>
      <Card.Body>
        <Row>
          <Col md={6} style={{textAlign: 'left', fontSize: '50px'}}>
            <Card.Title>{numero}</Card.Title>
            <Card.Subtitle>{tipo}</Card.Subtitle>
          </Col>
          <Col md={6}>
            <span className="material-icons" style={{ fontSize: '80px', color: `${accent}` }}>{icono}</span>
          </Col>
        </Row>
        <Card.Text>{estado}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RoomCard;
