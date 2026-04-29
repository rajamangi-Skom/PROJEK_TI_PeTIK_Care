import { Routes, Route } from "react-router-dom";
import React from "react";
import Dashboard from "./pages/DashboardUser/UserDashboard";
import TambahKeluhan from "./pages/DashboardUser/TambahKeluhan";
import RiwayatKeluhan from "./pages/DashboardUser/RiwayatKeluhan";
import Profile from "./pages/DashboardUser/Profile";
import Landing from "./pages/LandingPage/Landing";
import Login from "./pages/Login/Login";
import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin";
import DashboardPengasuhan from "./pages/DashboardPengasuhan/DashboardPengasuhan";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/add" element={<TambahKeluhan />} />
      <Route path="/dashboard/history" element={<RiwayatKeluhan />} />
      <Route path="/dashboard/profile" element={<Profile />} />
      <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      <Route path="/dashboard/pengasuhan" element={<DashboardPengasuhan />} />
    </Routes>
  );
}

export default App;
