import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./HistoryDashboard.css";
import { TiArrowBack } from "react-icons/ti";
import { MdOutlineRefresh, MdSearch, MdFilterList } from "react-icons/md";
import {
  FiHome,
  FiUsers,
  FiPaperclip,
  FiSettings,
  FiCalendar,
} from "react-icons/fi";

const HistoryDashboard = () => {
  return (
    <div className="history-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-btn">
            <FiHome />
            <span>Home</span>
          </NavLink>
          <NavLink to="/dashboard/add" className="sidebar-btn">
            <FiPaperclip />
            <span>Tambah Keluhan</span>
          </NavLink>
          <NavLink to="/dashboard/history" className="sidebar-btn active">
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
        <div className="history-header">
          <div className="header-top">
            <Link to="/dashboard" className="back-btn">
              <TiArrowBack /> Kembali ke Dashboard
            </Link>
          </div>
          <h1>Riwayat Pengajuan Keluhan</h1>
          <div className="user-info">
            <div className="welcome-card">
              <h2>Ahmad Santri</h2>
              <p>Lihat semua riwayat keluhan kesehatan Anda</p>
            </div>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon total">
              <FiCalendar />
            </div>
            <div className="stat-content">
              <h3>0</h3>
              <p>Total Keluhan</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">
              <MdOutlineRefresh />
            </div>
            <div className="stat-content">
              <h3>0</h3>
              <p>Menunggu</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon progress">
              <MdOutlineRefresh />
            </div>
            <div className="stat-content">
              <h3>0</h3>
              <p>Diproses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">
              <MdOutlineRefresh />
            </div>
            <div className="stat-content">
              <h3>0</h3>
              <p>Selesai</p>
            </div>
          </div>
        </div>

        <div className="search-filter-section">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <MdSearch className="search-icon" />
              <input
                type="text"
                placeholder="Cari keluhan, gejala, atau masa sakit..."
                className="search-input"
              />
            </div>
            <button className="filter-toggle-btn">
              <MdFilterList />
              Filter
            </button>
          </div>
        </div>

        <div className="history-table-container">
          <div className="table-header">
            <h2>Daftar Riwayat Keluhan</h2>
            <div className="table-info">
              <span>Menampilkan 0 dari 0 data</span>
            </div>
          </div>

          <div className="no-data">
            <div className="no-data-icon">?</div>
            <h3>Tidak Ada Data</h3>
            <p>Belum ada riwayat keluhan yang diajukan.</p>
          </div>
        </div>

        <div className="action-section">
          <Link to="/dashboard/add" className="add-complaint-btn">
            Ajukan Keluhan Baru
          </Link>
          <button className="refresh-btn">
            <MdOutlineRefresh />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryDashboard;
