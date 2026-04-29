import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./UserDashboard.css";
import "./UserDashboard-resp.css";
import AxiosInstance from "../utils/AxiosInstance";
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

        const res = await AxiosInstance.get(`/complaints/mycomplaints`);

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

        console.log(
          "Complaints with status:",
          filteredComplaints.map((c) => ({
            id: c.id,
            title: c.keluhan || c.title,
            status: c.status,
            statusType: typeof c.status,
          })),
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
        "/users/search",
        "/user/profile",
        "/users/me",
        "/auth/me",
        "/me",
      ];

      let userData = null;

      for (const endpoint of endpoints) {
        try {
          let url = endpoint;

          if (endpoint === "/users/search") {
            let userId = null;

            try {
              const tokenPayload = JSON.parse(atob(token.split(".")[1]));
              userId =
                tokenPayload.id || tokenPayload.userId || tokenPayload.sub;
              console.log("Decoded user ID from token:", userId);
            } catch (e) {
              console.log("Failed to decode token:", e);
            }

            if (!userId) {
              userId = localStorage.getItem("userId");
            }

            if (!userId) {
              const storedUser = JSON.parse(
                localStorage.getItem("user") || "{}",
              );
              userId = storedUser.id;
            }

            if (!userId) {
              console.log("Using fallback user ID");
              userId = "current-user";
            }

            url = `/users/search/${userId}`;
          }

          const res = await AxiosInstance.get(url);
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
  const pending = complaints.filter(
    (c) =>
      c.status?.toLowerCase() === "pending" ||
      c.status?.toLowerCase() === "menunggu",
  ).length;
  const selesai = complaints.filter(
    (c) =>
      c.status?.toLowerCase() === "completed" ||
      c.status?.toLowerCase() === "selesai",
  ).length;

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
          <NavLink to="/dashboard" className="sidebar-btn">
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
            <Link to="/landing" className="back-btn">
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
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid #eee" }}>
              <h2>Detail Keluhan</h2>
            </div>

            <div style={{ padding: "24px" }}>
              <div
                className="user-avatar"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f3f4f6",
                }}
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "user"}`}
                  alt="User Avatar"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              <p
                style={{
                  backgroundColor: getStatusColor(selectedComplaint.status),
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  display: "inline-block",
                  marginTop: "10px",
                }}
              >
                {getStatusText(selectedComplaint.status)}
              </p>

              <div style={{ marginTop: "20px" }}>
                <h3>Judul</h3>
                <p>
                  {selectedComplaint.title ||
                    selectedComplaint.keluhan ||
                    "Tidak ada judul"}
                </p>

                <h3>Keterangan</h3>
                <p>
                  {selectedComplaint.description ||
                    selectedComplaint.keterangan ||
                    "Tidak ada keterangan"}
                </p>

                <h3>Tanggal</h3>
                <p>
                  {formatDate(
                    selectedComplaint.createdAt || selectedComplaint.created_at,
                  )}
                </p>
              </div>
            </div>

            <div style={{ padding: "16px", textAlign: "right" }}>
              <button onClick={closeModal}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
