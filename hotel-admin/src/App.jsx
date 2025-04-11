import React, { useState } from 'react'
import Home from "./pages/Home.page"
import Rooms from "./pages/Rooms.page"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

function App() {

  return (
    <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
      </Routes>
    </Layout>
  </Router>
  )
}

export default App
