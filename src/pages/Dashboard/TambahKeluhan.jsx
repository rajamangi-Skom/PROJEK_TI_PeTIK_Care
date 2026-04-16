import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./UserDashboard.css";
import "./UserDashboard-resp.css";
import { TiArrowBack } from "react-icons/ti";
import {
  FiSave,
  FiX,
  FiHome,
  FiPaperclip,
  FiSettings,
  FiCalendar,
} from "react-icons/fi";

const TambahKeluhan = () => {
  const [formData, setFormData] = useState({
    keterangan: '',
    keluhan: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Keluhan berhasil dikirim!');
    setFormData({
      keterangan: '',
      keluhan: ''
    });
  };

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
          <h1>Tambah Keluhan Kesehatan</h1>
        </div>

        <div className="form-container">
          <h3>Form Pengajuan Keluhan</h3>
          <form className="complaint-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="keterangan">Keterangan</label>
              <input
                type="text"
                id="keterangan"
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                placeholder="Masukkan keterangan singkat"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="keluhan">Keluhan</label>
              <textarea
                id="keluhan"
                name="keluhan"
                value={formData.keluhan}
                onChange={handleChange}
                placeholder="Jelaskan keluhan kesehatan yang Anda alami secara detail..."
                rows="5"
                required
              />
              <small>
                * Mohon jelaskan keluhan dengan sejelas-jelasnya untuk membantu
                tim medis dalam penanganan
              </small>
            </div>

            <div className="form-buttons">
              <button type="button" className="cancel-btn" onClick={() => window.history.back()}>
                <FiX /> Batal
              </button>
              <button type="submit" className="submit-btn">
                <FiSave /> Kirim Keluhan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TambahKeluhan;
