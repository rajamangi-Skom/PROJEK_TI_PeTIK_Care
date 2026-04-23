import { Routes, Route } from "react-router-dom";
import React from "react";
import Dashboard from "./pages/Dashboard/UserDashboard";
import TambahKeluhan from "./pages/Dashboard/TambahKeluhan";
import RiwayatKeluhan from "./pages/Dashboard/RiwayatKeluhan";
import Profile from "./pages/Dashboard/Profile";
import Layout from "./pages/Layout/Layout";
import Landing from "./pages/LandingPage/Landing";
import Login from "./pages/Login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/add" element={<TambahKeluhan />} />
      <Route path="/dashboard/history" element={<RiwayatKeluhan />} />
      <Route path="/dashboard/profile" element={<Profile />} />
      <Route path="/layout" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
