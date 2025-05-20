import React, { useState } from "react";
import Home from "./pages/Home.page";
import Rooms from "./pages/Rooms.page";
import LoginPage from "./pages/Login.page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Reservations from "./pages/Reservations.page";
import ReservationCheckIn from "./pages/ReservationCheckIn.page";
import ReservationCheckOut from "./pages/ReservationCheckOut.page";
import Clients from "./pages/Clients.page";
import RoomForm from "./pages/RoomForm";
import RoomTypeForm from "./pages/RoomTypeForm";
import ClientForm from "./pages/ClientForm";
import ClientDetails from "./pages/ClientDetails";
import ClientHistory from "./pages/ClientHistory";
import ReservationForm from "./pages/ReservationForm";
import ReservationDetails from "./pages/ReservationDetails";
import Calendar from "./pages/Calendar.page";
import Notifications from "./pages/Notifications.page";
import NotificationDetails from "./pages/NotificationDetails";
import RoomTypes from "./pages/RoomsType.page";
import RoomsStatus from "./pages/RoomsStatus.page";
import RoomStatusForm from "./pages/RoomStatusForm";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <Router>
      <ToastContainer 
        position="top-right"
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/roomstype" element={<RoomTypes />} />
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
          <Route path="/roomstype/edit/:id" element={<RoomTypeForm />} />
          <Route path="/calendar" element={<Calendar />} />{" "}
          <Route path="/checkin" element={<ReservationCheckIn />} />
          <Route path="/checkin" element={<ReservationCheckIn />} />
          <Route path="/checkout" element={<ReservationCheckOut />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/:id" element={<NotificationDetails />} />
          <Route path="/roomsstatus" element={<RoomsStatus />} />
          <Route path="/roomsstatus/new" element={<RoomStatusForm />} />
          <Route path="/roomsstatus/edit/:id" element={<RoomStatusForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
