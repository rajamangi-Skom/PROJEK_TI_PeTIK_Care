import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./UserDashboard.css";
import "./UserDashboard-resp.css";
import { TiArrowBack } from "react-icons/ti";
import { FiHome, FiPaperclip, FiSettings, FiCalendar } from "react-icons/fi";

const RiwayatKeluhan = () => {
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-btn" end>
            <FiHome />
            <span>Home</span>
          </NavLink>
          <NavLink to="/dashboard/add" className="sidebar-btn">
            <FiPaperclip />
            <span>Tambah Keluhan</span>
          </NavLink>
          <NavLink to="/dashboard/history" className="sidebar-btn">
            <FiCalendar />
            <span>Riwayat Keluhan</span>
          </NavLink>
          <NavLink to="/dashboard/settings" className="sidebar-btn">
            <FiSettings />
            <span>Pengaturan</span>
          </NavLink>
        </nav>
      </div>

      <div className="main-content">
        <div className="dashboard-header">
          <div className="header-top">
            <Link to="/dashboard" className="back-btn">
              <TiArrowBack /> Kembali ke Dashboard
            </Link>
          </div>
          <h1>Riwayat Keluhan Kesehatan</h1>
        </div>

        <div className="complaints-section">
          <div className="section-header">
            <h2>Daftar Keluhan Saya</h2>
          </div>

          <div className="complaint-stats">
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Total Keluhan</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Menunggu</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Selesai</span>
            </div>
          </div>

          <div className="table-container">
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tanggal</th>
                  <th>Keluhan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Belum ada data keluhan</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiwayatKeluhan;
