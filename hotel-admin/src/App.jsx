import React, { useState } from "react";
import Home from "./pages/Home.page";
import Rooms from "./pages/Rooms.page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Reservations from "./pages/Reservations.page";
import Clients from "./pages/Clients.page";
import RoomForm from "./pages/RoomForm";
import RoomTypeForm from "./pages/RoomTypeForm";
import ClientForm from "./pages/ClientForm";
import ClientDetails from "./pages/ClientDetails";
import ClientHistory from "./pages/ClientHistory";
import ReservationForm from "./pages/ReservationForm";
import ReservationDetails from "./pages/ReservationDetails";
import Calendar from "./pages/Calendar.page";
import ReservationCheckIn from "./pages/ReservationCheckIn.page";
import ReservationCheckOut from "./pages/ReservationCheckOut.page";
import LoginPage from "./pages/Login.page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservations/:id" element={<ReservationDetails />} />
          <Route path="/reservations/new" element={<ReservationForm />} />
          <Route path="/reservations/edit/:id" element={<ReservationForm />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/clients/:id/history" element={<ClientHistory />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/edit/:id" element={<ClientForm />} />
          <Route path="/rooms/new" element={<RoomForm />} />
          <Route path="/rooms/edit/:id" element={<RoomForm />} />
          <Route path="/roomstype/new" element={<RoomTypeForm />} />
          <Route path="/calendar" element={<Calendar />} />{" "}
          <Route path="/checkin" element={<ReservationCheckIn />} />
          <Route path="/checkin" element={<ReservationCheckIn />} />
          <Route path="/checkout" element={<ReservationCheckOut />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
