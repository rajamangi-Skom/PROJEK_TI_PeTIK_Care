import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./UserDashboard.css";
import "./UserDashboard-resp.css";
import { TiArrowBack } from "react-icons/ti";
import { MdOutlineRefresh } from "react-icons/md";
import { FaBookMedical } from "react-icons/fa";
import {
  FiHome,
  FiUsers,
  FiPaperclip,
  FiSettings,
  FiCalendar,
} from "react-icons/fi";

const UserDashboard = () => {
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
            <Link to="/" className="back-btn">
              <TiArrowBack /> Kembali ke Beranda
            </Link>
          </div>
          <h1>Dashboard Santri</h1>
          <div className="user-info">
            <div className="welcome-card">
              <h2>Selamat Datang, Ahmad Santri!</h2>
              <p>Kelola kesehatan Anda dengan mudah</p>
            </div>
          </div>
        </div>

        <div className="complaints-section">
          <div className="section-header">
            <h2>Riwayat Keluhan Saya</h2>
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
          </div>
          <div className="table-container">
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Keluhan</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    <p>Belum ada data keluhan</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="action-section">
          <NavLink to={"/dashboard/add"} className="add-complaint-btn">
            <FaBookMedical />
            Ajukan Keluhan
          </NavLink>
          <button className="refresh-btn">
            <MdOutlineRefresh />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
