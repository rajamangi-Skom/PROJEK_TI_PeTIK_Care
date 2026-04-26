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

    </div>
  );
};

export default Profile;
