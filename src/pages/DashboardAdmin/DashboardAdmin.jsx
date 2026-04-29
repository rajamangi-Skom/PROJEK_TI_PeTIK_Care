import React, { useEffect, useState } from "react";
import AxiosInstance from "../utils/AxiosInstance";
import "./DashboardAdmin.css";

import Swal from "sweetalert2";

import {
  FiUsers,
  FiBox,
  FiLogOut,
  FiEdit,
  FiTrash,
  FiHome,
  FiX,
  FiSearch,
} from "react-icons/fi";

const DashboardAdmin = () => {
  const [menu, setMenu] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [admin, setAdmin] = useState(null);

  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  const [formUser, setFormUser] = useState({
    nama: "",
    email: "",
    password: "",
    role: "",
  });

  const [editUserId, setEditUserId] = useState(null);

  const [medicines, setMedicines] = useState([]);
  const [searchMedicine, setSearchMedicine] = useState("");

  const [formObat, setFormObat] = useState({
    name: "",
    description: "",
    stock: "",
  });

  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    fetchAdmin();
    await fetchUsers();
    await fetchMedicines();
    setLoading(false);
  };

  const fetchAdmin = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setAdmin(user || { nama: "Admin" });
    } catch {
      setAdmin({ nama: "Admin" });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await AxiosInstance.get("/users/lookup");

      setUsers(res.data.data || []);
    } catch {
      setUsers([]);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await AxiosInstance.get("/medicines/lookup");
      setMedicines(res.data.data || []);
    } catch {
      setMedicines([]);
    }
  };

  const cancelEditUser = () => {
    setEditUserId(null);
    setFormUser({
      nama: "",
      email: "",
      password: "",
      role: "",
    });
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    if (
      !formUser.nama ||
      !formUser.email ||
      !formUser.role ||
      (!editUserId && !formUser.password)
    ) {
      Swal.fire("Oops!", "Isi semua field!", "warning");

      return;
    }

    try {
      if (editUserId) {
        await AxiosInstance.patch(`/users/edit/${editUserId}`, {
          nama: formUser.nama,
          email: formUser.email,
          role: formUser.role,
        });
      } else {
        await AxiosInstance.post("/users/create", formUser);
      }

      Swal.fire("Berhasil!", "Data user berhasil disimpan", "success");
      cancelEditUser();
      fetchUsers();
    } catch {
      Swal.fire("Gagal!", "User gagal disimpan", "error");
    }
  };

  const handleEditUser = (u) => {
    setFormUser({
      nama: u.nama || u.name,
      email: u.email,

      password: "",
      role: u.role,
    });

    setEditUserId(u.id);
  };

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Hapus User?",
      text: "Data akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonText: "Batal",
      confirmButtonText: "Ya, hapus",
    });

    if (!result.isConfirmed) return;

    try {
      await AxiosInstance.delete(`/users/drop/${id}`);
      fetchUsers();
      Swal.fire("Berhasil!", "User berhasil dihapus", "success");
    } catch {
      Swal.fire("Gagal!", "User gagal dihapus", "error");
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

  const handleDeleteMedicine = async (id) => {
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
      Swal.fire("Berhasil!", "Obat berhasil dihapus", "success");
    } catch {
      Swal.fire("Gagal!", "Obat gagal dihapus", "error");
    }
  };

  const handleUpdateMedicine = async () => {
    const stok = Number(selectedMedicine.stock);

    if (isNaN(stok) || stok < 0) {
      return Swal.fire("Error", "Stok harus angka positif", "warning");
    }

    try {
      await AxiosInstance.patch(`/medicines/edit/${selectedMedicine.id}`, {
        nama_obat: selectedMedicine.name,
        deskripsi: selectedMedicine.description,
        stok: stok,
      });

      setSelectedMedicine(null);
      fetchMedicines();

      Swal.fire("Berhasil!", "Obat berhasil diupdate", "success");
    } catch (err) {
      console.log(err.response?.data);

      Swal.fire(
        "Gagal!",
        err.response?.data?.message || "Obat gagal diupdate",
        "error",
      );
    }
  };

  const totalStock = medicines.reduce(
    (acc, item) => acc + Number(item.stock || 0),
    0,
  );

  const filteredUsers = users.filter((u) =>
    `${u.nama} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(searchUser.toLowerCase()),
  );

  const filteredMedicines = medicines.filter((m) =>
    `${m.nama_obat} ${m.deskripsi} ${m.sediaan}`
      .toLowerCase()
      .includes(searchMedicine.toLowerCase()),
  );

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

  return (
    <div className="adm-wrap">
      <div className="adm-sidebar">
        <h3 className="adm-title">Admin Dashboard</h3>

        <button className="adm-menu-btn" onClick={() => setMenu("dashboard")}>
          <FiHome /> Dashboard
        </button>

        <button className="adm-menu-btn" onClick={() => setMenu("users")}>
          <FiUsers /> Users
        </button>

        <button className="adm-menu-btn" onClick={() => setMenu("medicine")}>
          <FiBox /> Obat
        </button>

        <button className="adm-menu-btn" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>

      <div className="adm-main">
        <h1 className="adm-heading">
          {loading
            ? "Loading..."
            : `Selamat Datang, ${admin?.nama || "Admin"} 👋`}
        </h1>

        {menu === "dashboard" && (
          <div className="adm-stats">
            <div className="adm-card">
              <h2>{users.length}</h2>
              <p>Total User</p>
            </div>

            <div className="adm-card">
              <h2>{medicines.length}</h2>
              <p>Total Obat</p>
            </div>

            <div className="adm-card">
              <h2>{totalStock}</h2>
              <p>Total Stock</p>
            </div>
          </div>
        )}

        {menu === "users" && (
          <>
            <h2 className="adm-subtitle">Kelola User</h2>

            <form className="adm-form" onSubmit={handleSubmitUser}>
              <input
                className="adm-input"
                placeholder="Nama"
                value={formUser.nama}
                onChange={(e) =>
                  setFormUser({ ...formUser, nama: e.target.value })
                }
              />

              <input
                className="adm-input"
                placeholder="Email"
                value={formUser.email}
                onChange={(e) =>
                  setFormUser({ ...formUser, email: e.target.value })
                }
              />

              {!editUserId && (
                <input
                  className="adm-input"
                  type="password"
                  placeholder="Password"
                  value={formUser.password}
                  onChange={(e) =>
                    setFormUser({ ...formUser, password: e.target.value })
                  }
                />
              )}

              <select
                className="adm-select"
                value={formUser.role}
                onChange={(e) =>
                  setFormUser({ ...formUser, role: e.target.value })
                }
              >
                <option value="">Pilih Role</option>

                <option value="admin">Admin</option>
                <option value="pengasuhan">Pengasuhan</option>
                <option value="santri">Santri</option>
              </select>

              <button className="adm-btn adm-btn-primary" type="submit">
                {editUserId ? "Update" : "Tambah"}
              </button>

              {editUserId && (
                <button
                  type="button"
                  className="adm-btn adm-btn-danger"
                  onClick={cancelEditUser}
                >
                  <FiX /> Cancel
                </button>
              )}
            </form>

            <div className="adm-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Cari user..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>

            <div className="adm-box">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.nama || u.name}</td>

                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <div className="adm-action">
                          <button
                            className="adm-icon-btn adm-btn-warning"
                            onClick={() => handleEditUser(u)}
                          >
                            <FiEdit />
                          </button>

                          <button
                            className="adm-icon-btn adm-btn-danger"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            <FiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4">Data user tidak ditemukan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {menu === "medicine" && (
          <>
            <h2 className="adm-subtitle">Kelola Obat</h2>

            <div className="adm-form">
              <input
                className="adm-input"
                placeholder="Nama Obat"
                value={formObat.name}
                onChange={(e) =>
                  setFormObat({ ...formObat, name: e.target.value })
                }
              />

              <input
                className="adm-input"
                placeholder="Deskripsi"
                value={formObat.description}
                onChange={(e) =>
                  setFormObat({
                    ...formObat,
                    description: e.target.value,
                  })
                }
              />

              <input
                className="adm-input"
                type="number"
                placeholder="Stock"
                value={formObat.stock}
                onChange={(e) =>
                  setFormObat({
                    ...formObat,
                    stock: e.target.value,
                  })
                }
              />

              <button
                className="adm-btn adm-btn-primary"
                onClick={handleCreateMedicine}
              >
                Tambah
              </button>
            </div>

            <div className="adm-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Cari obat..."
                value={searchMedicine}
                onChange={(e) => setSearchMedicine(e.target.value)}
              />
            </div>

            <div className="adm-box">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                    <th>Stock</th>

                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMedicines.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>{item.stock}</td>

                      <td>
                        <div className="adm-action">
                          <button
                            className="adm-icon-btn adm-btn-warning"
                            onClick={() => setSelectedMedicine(item)}
                          >
                            <FiEdit />
                          </button>

                          <button
                            className="adm-icon-btn adm-btn-danger"
                            onClick={() => handleDeleteMedicine(item.id)}
                          >
                            <FiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredMedicines.length === 0 && (
                    <tr>
                      <td colSpan="5">Data obat tidak ditemukan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {selectedMedicine && (
              <div className="adm-box">
                <div className="adm-form">
                  <input
                    className="adm-input"
                    value={selectedMedicine.name}
                    onChange={(e) =>
                      setSelectedMedicine({
                        ...selectedMedicine,
                        name: e.target.value,
                      })
                    }
                  />

                  <input
                    className="adm-input"
                    value={selectedMedicine.description}
                    onChange={(e) =>
                      setSelectedMedicine({
                        ...selectedMedicine,
                        description: e.target.value,
                      })
                    }
                  />

                  <input
                    className="adm-input"
                    type="number"
                    value={selectedMedicine.stock}
                    onChange={(e) =>
                      setSelectedMedicine({
                        ...selectedMedicine,
                        stock: e.target.value,
                      })
                    }
                  />

                  <button
                    className="adm-btn adm-btn-primary"
                    onClick={handleUpdateMedicine}
                  >
                    Update
                  </button>

                  <button
                    className="adm-btn adm-btn-danger"
                    onClick={() => setSelectedMedicine(null)}
                  >
                    <FiX /> Cancel
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

export default DashboardAdmin;
