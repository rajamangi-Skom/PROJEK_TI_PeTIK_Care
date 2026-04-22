import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./UserDashboard.css";
import "./UserDashboard-resp.css";
import axios from "axios";
import { TiArrowBack } from "react-icons/ti";
import { FaBookMedical } from "react-icons/fa";
import {
  FiHome,
  FiPaperclip,
  FiSettings,
  FiCalendar,
  FiEye,
  FiLogOut,
} from "react-icons/fi";

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Kamu belum login");
          return;
        }

        await fetchUserData();

        const res = await axios.get(`/api/complaints/mycomplaints`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let allComplaints = res.data.data || res.data || [];

        const editedData = JSON.parse(
          localStorage.getItem("editedComplaints") || "{}",
        );
        const mergedComplaints = allComplaints.map((complaint) => {
          if (editedData[complaint.id]) {
            return { ...complaint, ...editedData[complaint.id] };
          }
          return complaint;
        });

        const deletedIds = JSON.parse(
          localStorage.getItem("deletedComplaints") || "[]",
        );
        const filteredComplaints = mergedComplaints.filter(
          (complaint) => !deletedIds.includes(complaint.id),
        );

        setComplaints(filteredComplaints);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Token expired. Silakan login kembali.");

          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          setError(
            "Tidak bisa terhubung ke server API. Silakan cek koneksi dan coba lagi.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");

      const endpoints = [
        "/api/user/profile",
        "/api/users/me",
        "/api/auth/me",
        "/api/me",
      ];

      let userData = null;

      for (const endpoint of endpoints) {
        try {
          const res = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          userData = res.data;
          if (userData.nama) {
            userData.name = userData.nama;
          }
          break;
        } catch (err) {}
      }

      if (!userData) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          userData = JSON.parse(storedUser);
          if (userData.nama && !userData.name) {
            userData.name = userData.nama;
          }
        } else {
          const userName = localStorage.getItem("userName") || "User";
          userData = {
            id: "user-id",
            name: userName,
            email: "user@example.com",
          };
        }
      }

      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);

      setUser({ name: "User", email: "user@example.com" });
    }
  };

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "pending").length;
  const selesai = complaints.filter((c) => c.status === "completed").length;

  const handleViewDetail = (item) => {
    setSelectedComplaint(item);
    setShowModal(true);
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("deletedComplaints");
      localStorage.removeItem("editedComplaints");

      window.location.href = "/";
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "#ffc107",
      completed: "#28a745",
      "in-progress": "#17a2b8",
      rejected: "#dc3545",
    };
    return statusColors[status?.toLowerCase()] || "#6c757d";
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Menunggu",
      completed: "Selesai",
      "in-progress": "Diproses",
      rejected: "Ditolak",
    };
    return statusTexts[status?.toLowerCase()] || status;
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
            <Link to="/" className="back-btn">
              <TiArrowBack /> Kembali ke Beranda
            </Link>
          </div>
          <h1>Dashboard Santri</h1>
          <div className="user-info">
            <div className="welcome-card">
              <h2>
                {loading ? (
                  <>
                    <span style={{ opacity: 0.7 }}>Memuat...</span>
                  </>
                ) : (
                  <>
                    Selamat Datang, {user?.name || "User"}!
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        marginLeft: "10px",
                      }}
                    >
                      {user?.email && `(${user.email})`}
                    </span>
                  </>
                )}
              </h2>
              <p>Kelola kesehatan Anda dengan mudah</p>
            </div>
          </div>
        </div>

        <div className="complaints-section">
          <div className="section-header">
            <h2>Riwayat Keluhan Saya</h2>
            <div className="complaint-stats">
              <div className="stat-item">
                <span className="stat-value">{loading ? "..." : total}</span>
                <span className="stat-label">Total Keluhan</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{loading ? "..." : pending}</span>
                <span className="stat-label">Menunggu</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{loading ? "..." : selesai}</span>
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
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          className="loading-spinner"
                          style={{
                            width: "20px",
                            height: "20px",
                            border: "2px solid #f3f3f3",
                            borderTop: "2px solid #007bff",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        ></div>
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <div style={{ color: "#dc3545" }}>
                        <p> {error}</p>
                        <button
                          onClick={() => window.location.reload()}
                          style={{
                            marginTop: "10px",
                            padding: "8px 16px",
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Coba Lagi
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : complaints.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <div>
                        <p style={{ fontSize: "16px", marginBottom: "15px" }}>
                          Belum ada data keluhan
                        </p>
                        <NavLink
                          to="/dashboard/add"
                          style={{
                            display: "inline-block",
                            padding: "10px 20px",
                            background: "#28a745",
                            color: "white",
                            textDecoration: "none",
                            borderRadius: "6px",
                          }}
                        >
                          Ajukan Keluhan Baru
                        </NavLink>
                      </div>
                    </td>
                  </tr>
                ) : (
                  complaints.slice(0, 5).map((item) => (
                    <tr key={item.id}>
                      <td>No. {complaints.indexOf(item) + 1}</td>
                      <td>
                        <div style={{ maxWidth: "200px" }}>
                          {item.title || item.keluhan || "Tidak ada judul"}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${item.status?.toLowerCase()}`}
                        >
                          {item.status?.toLowerCase() === "pending"
                            ? "Menunggu"
                            : item.status?.toLowerCase() === "completed"
                              ? "Selesai"
                              : item.status?.toLowerCase() === "in-progress"
                                ? "Diproses"
                                : item.status?.toLowerCase() === "rejected"
                                  ? "Ditolak"
                                  : item.status}
                        </span>
                      </td>
                      <td>{formatDate(item.createdAt || item.created_at)}</td>
                      <td>
                        <button
                          className="btn-view"
                          onClick={() => handleViewDetail(item)}
                          style={{
                            padding: "6px 12px",
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          <FiEye /> Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="action-section">
          <NavLink to={"/dashboard/add"} className="add-complaint-btn">
            <FaBookMedical />
            Ajukan Keluhan
          </NavLink>
        </div>
      </div>

      {/* Modal Detail Keluhan */}
      {showModal && selectedComplaint && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-header"
              style={{
                padding: "24px 24px 16px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1f2937",
                }}
              >
                Detail Keluhan
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "0",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                ×
              </button>
            </div>

            <div className="modal-body" style={{ padding: "24px" }}>
              {/* ID Section */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "14px",
                        color: "#64748b",
                        fontWeight: "500",
                      }}
                    >
                      ID Keluhan
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#1e293b",
                      }}
                    >
                      No. {complaints.indexOf(selectedComplaint) + 1}
                    </p>
                  </div>
                  <div
                    style={{
                      backgroundColor: getStatusColor(selectedComplaint.status),
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {getStatusText(selectedComplaint.status)}
                  </div>
                </div>
              </div>

              {/* Informasi Keluhan */}
              <div style={{ marginBottom: "24px" }}>
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  Informasi Keluhan
                </h3>

                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "4px",
                        fontWeight: "500",
                      }}
                    >
                      Judul Keluhan
                    </label>
                    <div
                      style={{
                        backgroundColor: "#f9fafb",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                        fontSize: "14px",
                        color: "#1f2937",
                      }}
                    >
                      {selectedComplaint.title ||
                        selectedComplaint.keluhan ||
                        "Tidak ada judul"}
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "4px",
                        fontWeight: "500",
                      }}
                    >
                      Keterangan
                    </label>
                    <div
                      style={{
                        backgroundColor: "#f9fafb",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                        fontSize: "14px",
                        color: "#1f2937",
                        minHeight: "80px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {selectedComplaint.description ||
                        selectedComplaint.keterangan ||
                        "Tidak ada keterangan"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informasi Waktu */}
              <div style={{ marginBottom: "24px" }}>
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  Informasi Waktu
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "4px",
                        fontWeight: "500",
                      }}
                    >
                      Tanggal Pengajuan
                    </label>
                    <div
                      style={{
                        backgroundColor: "#f9fafb",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                        fontSize: "14px",
                        color: "#1f2937",
                      }}
                    >
                      {formatDate(
                        selectedComplaint.createdAt ||
                          selectedComplaint.created_at,
                      )}
                    </div>
                  </div>

                  {selectedComplaint.updatedAt && (
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#6b7280",
                          marginBottom: "4px",
                          fontWeight: "500",
                        }}
                      >
                        Terakhir Update
                      </label>
                      <div
                        style={{
                          backgroundColor: "#f9fafb",
                          padding: "12px",
                          borderRadius: "6px",
                          border: "1px solid #e5e7eb",
                          fontSize: "14px",
                          color: "#1f2937",
                        }}
                      >
                        {formatDate(selectedComplaint.updatedAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className="modal-footer"
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#4b5563")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#6b7280")}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
