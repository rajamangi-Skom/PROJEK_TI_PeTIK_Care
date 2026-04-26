import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import "./UserDashboard-resp.css";
import { TiArrowBack } from "react-icons/ti";
import AxiosInstance from "../utils/AxiosInstance";
import {
  FiSave,
  FiX,
  FiHome,
  FiPaperclip,
  FiSettings,
  FiCalendar,
  FiLogOut,
} from "react-icons/fi";

const TambahKeluhan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    keluhan: "",
    keterangan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("deletedComplaints");
      localStorage.removeItem("editedComplaints");

      window.location.href = "/";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!formData.keluhan || formData.keluhan.trim().length < 3) {
        alert("Judul keluhan minimal 3 karakter!");
        return;
      }

      if (!formData.keterangan || formData.keterangan.trim().length < 10) {
        alert("Keterangan minimal 10 karakter!");
        return;
      }

      if (!token) {
        alert("Anda belum login! Silakan login kembali.");
        return;
      }

      const requestData = {
        keluhan: formData.keluhan.trim(),
        keterangan: formData.keterangan.trim(),
      };

      try {
        const response = await AxiosInstance.post(
          `/complaints/create`,
          requestData,
        );

        alert("Keluhan berhasil dikirim!");
      } catch (error) {
        throw error;
      }

      setFormData({
        keluhan: "",
        keterangan: "",
      });

      navigate("/dashboard/history");
    } catch (error) {
      console.error("Error detail:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Gagal mengirim keluhan!";
      alert(errorMessage);
    }
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
          <NavLink to="/dashboard/profile" className="sidebar-btn">
            <FiSettings />
            <span>Profile</span>
          </NavLink>
          <button
            className="sidebar-btn logout-btn"
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "#dc3545",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              fontSize: "14px",
              fontWeight: "500",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#dc3545";
              e.target.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#dc3545";
            }}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
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
              <label htmlFor="keluhan">Apa Keluhan Anda</label>
              <input
                type="text"
                id="keluhan"
                name="keluhan"
                value={formData.keluhan}
                onChange={handleChange}
                placeholder="Cantumkan keluhan anda"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="keterangan">Keterangan</label>
              <textarea
                id="keterangan"
                name="keterangan"
                value={formData.keterangan}
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
              <button
                type="button"
                className="cancel-btn"
                onClick={() => window.history.back()}
              >
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
