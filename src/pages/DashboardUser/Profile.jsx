import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./UserDashboard.css";
import "./UserDashboard-resp.css";
import "./Profile.css";
import axios from "axios";
import { TiArrowBack } from "react-icons/ti";
import {
  FiHome,
  FiPaperclip,
  FiSettings,
  FiCalendar,
  FiLogOut,
  FiUser,
  FiMail,
} from "react-icons/fi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Kamu belum login");
        setLoading(false);
        return;
      }

      const endpoints = [
        "/api/users/search",
        "/api/user/profile",
        "/api/users/me",
        "/api/auth/me",
        "/api/me",
      ];

      let userData = null;

      for (const endpoint of endpoints) {
        try {
          let url = endpoint;

          if (endpoint === "/api/users/search") {
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

            url = `/api/users/search/${userId}`;
            console.log("Using API endpoint:", url);
          }

          const res = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.data.success && res.data.data) {
            userData = res.data.data;
          } else {
            userData = res.data;
          }

          console.log("API Response:", userData);

          if (userData.nama) {
            userData.name = userData.nama;
          }
          break;
        } catch (err) {
          console.log(
            `Failed with endpoint ${endpoint}:`,
            err.response?.status,
          );
        }
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
            phone: "-",
          };
        }
      }

      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
      });
    } catch (error) {
      setError("Gagal memuat data profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);

      alert("Profile berhasil diperbarui!");
    } catch (error) {
      alert("Gagal memperbarui profile. Silakan coba lagi.");
    }
  };

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

  if (loading) {
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
            <h1>Profile</h1>
          </div>

          <div className="content-wrapper">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Memuat data profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
            <h1>Profile</h1>
          </div>

          <div className="content-wrapper">
            <div className="error-container">
              <p>{error}</p>
              <button onClick={fetchUserData} className="retry-btn">
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h1>Profile</h1>
        </div>

        <div className="content-wrapper">
          <div className="profile-page">
            <div className="profile-card">
              <div className="profile-header-section">
                <div className="avatar-section">
                  <div className="avatar-container">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "user"}`}
                      alt="Profile Avatar"
                      className="avatar-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="avatar-fallback"
                      style={{ display: "none" }}
                    >
                      <FiUser size={48} />
                    </div>
                  </div>
                </div>
                <div className="profile-title">
                  <h2>{user?.name || "User"}</h2>
                  <p className="profile-subtitle">Student Profile</p>
                </div>
              </div>
            </div>

            <div className="profile-body">
              {editing ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label className="form-label">
                      <FiUser /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FiMail /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="form-input"
                    />
                  </div>

                  <div className="form-actions">
                    <button className="btn-cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className="btn-save" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-info">
                  <div className="info-item">
                    <div className="info-icon">
                      <FiUser />
                    </div>
                    <div className="info-content">
                      <h3>Full Name</h3>
                      <p>{user?.name || "-"}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FiMail />
                    </div>
                    <div className="info-content">
                      <h3>Email Address</h3>
                      <p>{user?.email || "-"}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FiCalendar />
                    </div>
                    <div className="info-content">
                      <h3>Member Since</h3>
                      <p>
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          background: #f3f4f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          overflow: hidden;
          border: 2px solid #e5e7eb;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .fallback-avatar {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          color: #6b7280;
        }

        .profile-info h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
        }

        .profile-info p {
          margin: 5px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .edit-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          margin-left: auto;
          transition: background 0.3s ease;
        }

        .edit-profile-btn:hover {
          background: #2563eb;
        }

        .profile-form {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .cancel-btn {
          padding: 12px 24px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        .cancel-btn:hover {
          background: #f9fafb;
        }

        .save-btn {
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        .save-btn:hover {
          background: #2563eb;
        }

        .profile-details {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-icon {
          width: 40px;
          height: 40px;
          background: #f3f4f6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .detail-content h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .detail-content p {
          margin: 4px 0 0;
          font-size: 16px;
          color: #1f2937;
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .retry-btn {
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          margin-top: 16px;
        }

        .retry-btn:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default Profile;
