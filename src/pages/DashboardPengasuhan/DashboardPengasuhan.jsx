import React, { useEffect, useState } from "react";
import AxiosInstance from "../utils/AxiosInstance";
import "./DashboardPengasuhan.css";
import Swal from "sweetalert2";

import {
  FiClipboard,
  FiBox,
  FiLogOut,
  FiCheckCircle,
  FiRotateCcw,
  FiEdit,
  FiTrash,
  FiEye,
  FiSearch,
} from "react-icons/fi";

const DashboardPengasuhan = () => {
  const [menu, setMenu] = useState("complaints");
  const [admin, setAdmin] = useState(null);

  const [complaints, setComplaints] = useState([]);
  const [loadingComplaint, setLoadingComplaint] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [medicines, setMedicines] = useState([]);

  const [formObat, setFormObat] = useState({
    name: "",
    description: "",
    stock: "",
  });

  const [formEditObat, setFormEditObat] = useState(null);

  const [searchComplaint, setSearchComplaint] = useState("");
  const [searchMedicine, setSearchMedicine] = useState("");

  useEffect(() => {
    fetchAdmin();
    fetchComplaints();
    fetchMedicines();
  }, []);

  const fetchAdmin = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setAdmin({
        nama:
          user?.nama ||
          user?.name ||
          user?.username ||
          user?.email?.split("@")[0] ||
          "Pengasuhan",
      });
    } catch {
      setAdmin({ nama: "Pengasuhan" });
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await AxiosInstance.get("/complaints/lookall");
      setComplaints(res.data.data || []);
    } catch {
      Swal.fire("Gagal", "Tidak bisa mengambil data keluhan", "error");
    } finally {
      setLoadingComplaint(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await AxiosInstance.get("/medicines/lookup");
      setMedicines(res.data.data || []);
    } catch {
      Swal.fire("Gagal", "Tidak bisa mengambil data obat", "error");
    }
  };

  const handleStatus = async (id, status, catatan) => {
    try {
      await AxiosInstance.post(`/complaints/respond/${id}`, {
        status,
        catatan,
      });

      fetchComplaints();
      setSelectedComplaint(null);

      Swal.fire("Berhasil", "Status berhasil diupdate", "success");
    } catch {
      Swal.fire("Gagal", "Update status gagal", "error");
    }
  };

  const approveComplaint = (id) => {
    handleStatus(id, "SELESAI", "Keluhan sudah ditangani");
  };

  const revertComplaint = async (id) => {
    try {
      await AxiosInstance.post(`/complaints/revert/${id}`);
      fetchComplaints();

      Swal.fire("Berhasil", "Keluhan dikembalikan", "success");
    } catch {
      Swal.fire("Gagal", "Revert gagal", "error");
    }
  };

  const handleCreateMedicine = async () => {
    if (!formObat.name || !formObat.description || !formObat.stock) {
      Swal.fire("Oops!", "Isi semua field!", "warning");
      return;
    }

    try {
      await AxiosInstance.post("/medicines/create", {
        nama_obat: formObat.name,
        deskripsi: formObat.description,
        stok: Number(formObat.stock),
        sediaan: formObat.sediaan || "tablet",
      });

      setFormObat({
        name: "",
        description: "",
        stock: "",
        sediaan: "tablet",
      });

      fetchMedicines();

      Swal.fire("Berhasil!", "Obat berhasil ditambahkan", "success");
    } catch (err) {
      console.log(err.response?.data);

      Swal.fire(
        "Gagal!",
        err.response?.data?.message || "Obat gagal ditambahkan",
        "error",
      );
    }
  };

  const handleEditMedicine = (m) => {
    setFormEditObat({
      id: m.id,
      name: m.nama_obat || m.name || "",
      description: m.deskripsi || m.description || "",
      stock: m.stok ?? m.stock ?? "",
    });
  };

  const handleUpdateMedicine = async () => {
    if (!formEditObat?.id) return;

    try {
      await AxiosInstance.patch(`/medicines/edit/${formEditObat.id}`, {
        nama_obat: formEditObat.name,
        deskripsi: formEditObat.description,
        stok: Number(formEditObat.stock),
      });

      setFormEditObat(null);
      fetchMedicines();

      Swal.fire("Berhasil", "Obat berhasil diupdate", "success");
    } catch {
      Swal.fire("Gagal", "Update obat gagal", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Obat?",
      text: "Data akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonText: "Batal",
      confirmButtonText: "Ya, hapus",
    });

    if (!result.isConfirmed) return;

    try {
      await AxiosInstance.delete(`/medicines/drop/${id}`);
      fetchMedicines();

      Swal.fire("Berhasil", "Obat dihapus", "success");
    } catch {
      Swal.fire("Gagal", "Hapus gagal", "error");
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Kamu akan keluar dari dashboard",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#018c7e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    localStorage.clear();
    window.location.href = "/";
  };

  const filteredComplaints = complaints.filter((item) =>
    (item.title || item.keluhan || "")
      .toLowerCase()
      .includes(searchComplaint.toLowerCase()),
  );

  const filteredMedicines = medicines.filter((item) =>
    (item.nama_obat || item.name || "")
      .toLowerCase()
      .includes(searchMedicine.toLowerCase()),
  );

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "pg-badge pg-badge-yellow";
      case "SELESAI":
        return "pg-badge pg-badge-green";
      default:
        return "pg-badge pg-badge-gray";
    }
  };

  return (
    <div className="pg-wrap">
      <div className="pg-sidebar">
        <h3 className="pg-logo">Dashboard Pengasuhan</h3>

        <button
          className={`pg-menu-btn ${menu === "complaints" ? "pg-active" : ""}`}
          onClick={() => setMenu("complaints")}
        >
          <FiClipboard />
          <span>Keluhan</span>
        </button>

        <button
          className={`pg-menu-btn ${menu === "medicine" ? "pg-active" : ""}`}
          onClick={() => setMenu("medicine")}
        >
          <FiBox />
          <span>Obat</span>
        </button>

        <button className="pg-menu-btn" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>

      <div className="pg-main">
        <h1 className="pg-title">
          Selamat Datang, {admin?.nama || "Pengasuhan"} 👋
        </h1>

        {menu === "complaints" && (
          <>
            <div className="pg-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Cari keluhan..."
                value={searchComplaint}
                onChange={(e) => setSearchComplaint(e.target.value)}
              />
            </div>

            <div className="pg-table-wrap">
              <table className="pg-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Keluhan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingComplaint ? (
                    <tr>
                      <td colSpan="4">Loading...</td>
                    </tr>
                  ) : (
                    filteredComplaints.map((c, i) => (
                      <tr key={c.id}>
                        <td>{i + 1}</td>
                        <td>{c.title || c.keluhan}</td>
                        <td>
                          <span className={getStatusClass(c.status)}>
                            {c.status}
                          </span>
                        </td>

                        <td>
                          <div className="pg-action">
                            <button
                              className="pg-btn pg-blue"
                              onClick={() => setSelectedComplaint(c)}
                            >
                              <FiEye />
                            </button>

                            <button
                              className="pg-btn pg-green"
                              onClick={() => approveComplaint(c.id)}
                            >
                              <FiCheckCircle />
                            </button>

                            <button
                              className="pg-btn pg-yellow"
                              onClick={() => revertComplaint(c.id)}
                            >
                              <FiRotateCcw />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {selectedComplaint && (
          <div
            className="pg-modal-overlay"
            onClick={() => setSelectedComplaint(null)}
          >
            <div className="pg-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Detail Keluhan</h2>

              <div>
                <strong>Keluhan</strong>
                <p>{selectedComplaint.title || selectedComplaint.keluhan}</p>
              </div>

              <div>
                <strong>Deskripsi</strong>
                <p>
                  {selectedComplaint.description ||
                    selectedComplaint.deskripsi ||
                    "-"}
                </p>
              </div>

              <div>
                <strong>Tanggal</strong>
                <p>
                  {selectedComplaint.createdAt || selectedComplaint.tanggal
                    ? new Date(
                        selectedComplaint.createdAt ||
                          selectedComplaint.tanggal,
                      ).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>

              <div>
                <strong>Status</strong>
                <p>{selectedComplaint.status}</p>
              </div>

              <button
                className="pg-btn pg-red"
                onClick={() => setSelectedComplaint(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {menu === "medicine" && (
          <>
            <div className="pg-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Cari obat..."
                value={searchMedicine}
                onChange={(e) => setSearchMedicine(e.target.value)}
              />
            </div>

            <div className="pg-card pg-form">
              <input
                className="pg-input"
                placeholder="Nama"
                value={formObat.name}
                onChange={(e) =>
                  setFormObat({ ...formObat, name: e.target.value })
                }
              />

              <input
                className="pg-input"
                placeholder="Deskripsi"
                value={formObat.description}
                onChange={(e) =>
                  setFormObat({ ...formObat, description: e.target.value })
                }
              />

              <input
                className="pg-input"
                type="number"
                placeholder="Stock"
                value={formObat.stock}
                onChange={(e) =>
                  setFormObat({ ...formObat, stock: e.target.value })
                }
              />

              <button className="pg-btn pg-blue" onClick={handleCreateMedicine}>
                Tambah
              </button>
            </div>

            <div className="pg-table-wrap">
              <table className="pg-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                    <th>Stock</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMedicines.map((m) => (
                    <tr key={m.id}>
                      <td>{m.nama_obat || m.name}</td>
                      <td>{m.deskripsi || m.description}</td>
                      <td>{m.stok || m.stock}</td>

                      <td>
                        <div className="pg-action">
                          <button
                            className="pg-btn pg-yellow"
                            onClick={() => handleEditMedicine(m)}
                          >
                            <FiEdit />
                          </button>

                          <button
                            className="pg-btn pg-red"
                            onClick={() => handleDelete(m.id)}
                          >
                            <FiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

         
            {formEditObat && (
              <div className="pg-card pg-form">
                <h3>Edit Obat</h3>

                <input
                  className="pg-input"
                  value={formEditObat.name}
                  onChange={(e) =>
                    setFormEditObat({ ...formEditObat, name: e.target.value })
                  }
                />

                <input
                  className="pg-input"
                  value={formEditObat.description}
                  onChange={(e) =>
                    setFormEditObat({
                      ...formEditObat,
                      description: e.target.value,
                    })
                  }
                />

                <input
                  className="pg-input"
                  type="number"
                  value={formEditObat.stock}
                  onChange={(e) =>
                    setFormEditObat({ ...formEditObat, stock: e.target.value })
                  }
                />

                <div className="pg-action">
                  <button
                    className="pg-btn pg-blue"
                    onClick={handleUpdateMedicine}
                  >
                    Update
                  </button>

                  <button
                    className="pg-btn pg-red"
                    onClick={() => setFormEditObat(null)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPengasuhan;
