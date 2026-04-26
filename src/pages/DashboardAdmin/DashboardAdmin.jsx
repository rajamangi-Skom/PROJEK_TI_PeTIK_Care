import React, { useEffect, useState } from "react";
import AxiosInstance from "../utils/AxiosInstance";
import "./DashboardAdmin.css";

import {
  FiUsers,
  FiBox,
  FiLogOut,
  FiEdit,
  FiTrash,
  FiHome,
} from "react-icons/fi";

const DashboardAdmin = () => {
  const [menu, setMenu] = useState("dashboard");
  const [loading, setLoading] = useState(true);


  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState(null);

  const [formUser, setFormUser] = useState({
    nama: "",
    email: "",
    password: "",
    role: "",
  });

  const [editUserId, setEditUserId] = useState(null);

 
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const [formObat, setFormObat] = useState({
    name: "",
    description: "",
    stock: "",
    sediaan: "tablet",
  });


  useEffect(() => {
    const init = async () => {
      setLoading(true);
      fetchAdmin();
      await fetchUsers();
      await fetchMedicines();
      setLoading(false);
    };
    init();
  }, []);


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
      setUsers(res.data.data || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    if (
      !formUser.nama ||
      !formUser.email ||
      (!editUserId && !formUser.password) ||
      !formUser.role
    ) {
      alert("Isi semua field!");
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

      setFormUser({ nama: "", email: "", password: "", role: "" });
      setEditUserId(null);
      fetchUsers();
    } catch {
      alert("Gagal user!");
    }
  };

  const handleEditUser = (u) => {
    setFormUser({
      nama: u.nama || u.name,
      email: u.email,
      role: u.role,
      password: "",
    });
    setEditUserId(u.id);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Hapus user?")) return;

    await AxiosInstance.delete(`/users/drop/${id}`);
    fetchUsers();
  };


  const normalizeMedicine = (m) => ({
    id: m.id,
    name: m.name || m.nama_obat || "",
    description: m.description || m.deskripsi || "",
    stock: m.stock || m.stok || 0,
    sediaan: m.sediaan || "tablet",
  });

  const mapPayload = (m) => ({
    nama_obat: m.name?.trim() || "",
    deskripsi: m.description?.trim() || "",
    stok: Number(m.stock) || 0,
    sediaan: m.sediaan || "tablet",

    // backup
    name: m.name?.trim() || "",
    description: m.description?.trim() || "",
    stock: Number(m.stock) || 0,
  });

  const fetchMedicines = async () => {
    try {
      const res = await AxiosInstance.get("/medicines/lookup");
      const data = res.data.data || res.data;
      setMedicines(data.map(normalizeMedicine));
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateMedicine = async () => {
    if (
      !formObat.name ||
      !formObat.description ||
      !formObat.stock ||
      !formObat.sediaan
    ) {
      alert("Isi semua field!");
      return;
    }

    try {
      await AxiosInstance.post("/medicines/create", mapPayload(formObat));

      setFormObat({
        name: "",
        description: "",
        stock: "",
        sediaan: "tablet",
      });

      fetchMedicines();
      alert("Berhasil tambah obat");
    } catch (err) {
      console.log("CREATE ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Gagal tambah obat");
    }
  };

  const handleUpdateMedicine = async () => {
    if (
      !selectedMedicine?.name ||
      !selectedMedicine?.description ||
      !selectedMedicine?.stock ||
      !selectedMedicine?.sediaan
    ) {
      alert("Data belum lengkap!");
      return;
    }

    try {
      await AxiosInstance.patch(
        `/medicines/edit/${selectedMedicine.id}`,
        mapPayload(selectedMedicine),
      );

      fetchMedicines();
      setSelectedMedicine(null);
      alert("Berhasil update");
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Gagal update");
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm("Hapus obat?")) return;

    try {
      await AxiosInstance.delete(`/medicines/drop/${id}`);
      fetchMedicines();
    } catch {
      alert("Gagal hapus");
    }
  };


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const totalStock = medicines.reduce(
    (acc, item) => acc + Number(item.stock || 0),
    0,
  );


  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h3>Admin Dashboard</h3>

        <button onClick={() => setMenu("dashboard")}>
          <FiHome /> Dashboard
        </button>

        <button onClick={() => setMenu("users")}>
          <FiUsers /> Users
        </button>

        <button onClick={() => setMenu("medicine")}>
          <FiBox /> Obat
        </button>

        <button onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>

      <div className="main-content">
        <h1>
          {loading
            ? "Loading..."
            : `Selamat Datang, ${admin?.nama || "Admin"} 👋`}
        </h1>

             {menu === "dashboard" && (
          <div className="stats">
            <div className="card">
              <h2>{users.length}</h2>
              <p>Total Users</p>
            </div>

            <div className="card">
              <h2>{totalStock}</h2>
              <p>Total Stock Obat</p>
            </div>
          </div>
        )}

        {menu === "users" && (
          <>
            <h2>Manajemen User</h2>

            <form onSubmit={handleSubmitUser}>
              <input
                placeholder="Nama"
                value={formUser.nama}
                onChange={(e) =>
                  setFormUser({ ...formUser, nama: e.target.value })
                }
              />

              <input
                placeholder="Email"
                value={formUser.email}
                onChange={(e) =>
                  setFormUser({ ...formUser, email: e.target.value })
                }
              />

              {!editUserId && (
                <input
                  type="password"
                  placeholder="Password"
                  value={formUser.password}
                  onChange={(e) =>
                    setFormUser({
                      ...formUser,
                      password: e.target.value,
                    })
                  }
                />
              )}

              <select
                value={formUser.role}
                onChange={(e) =>
                  setFormUser({ ...formUser, role: e.target.value })
                }
              >
                <option value="">Role</option>
                <option value="admin">Admin</option>
                <option value="pengasuhan">Pengasuhan</option>
                <option value="santri">Santri</option>
              </select>

              <button type="submit">{editUserId ? "Update" : "Tambah"}</button>
            </form>

            <table>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nama || u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <button onClick={() => handleEditUser(u)}>
                        <FiEdit />
                      </button>
                      <button onClick={() => handleDeleteUser(u.id)}>
                        <FiTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {menu === "medicine" && (
          <>
            <h2>Kelola Obat</h2>

            {/* CREATE */}
            <div className="section-card">
              <h3>Tambah Obat</h3>

              <input
                placeholder="Nama Obat"
                value={formObat.name}
                onChange={(e) =>
                  setFormObat({ ...formObat, name: e.target.value })
                }
              />

              <input
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
                placeholder="Stock"
                type="number"
                value={formObat.stock}
                onChange={(e) =>
                  setFormObat({ ...formObat, stock: e.target.value })
                }
              />

              <select
                value={formObat.sediaan}
                onChange={(e) =>
                  setFormObat({ ...formObat, sediaan: e.target.value })
                }
              >
                <option value="tablet">Tablet</option>
                <option value="kapsul">Kapsul</option>
                <option value="sirup">Sirup</option>
              </select>

              <button onClick={handleCreateMedicine}>Tambah</button>
            </div>

            <div className="section-card">
              <h3>List Obat</h3>

              <table className="table-obat">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                    <th>Stock</th>
                    <th>Sediaan</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {medicines.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        Tidak ada data obat
                      </td>
                    </tr>
                  ) : (
                    medicines.map((m) => (
                      <tr key={m.id}>
                        <td>{m.name}</td>
                        <td>{m.description}</td>
                        <td>{m.stock}</td>
                        <td>{m.sediaan}</td>
                        <td>
                          <button onClick={() => setSelectedMedicine(m)}>
                            <FiEdit />
                          </button>

                          <button onClick={() => handleDeleteMedicine(m.id)}>
                            <FiTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

   
            {selectedMedicine && (
              <div className="section-card">
                <h3>Edit Obat</h3>

                <input
                  value={selectedMedicine.name}
                  onChange={(e) =>
                    setSelectedMedicine({
                      ...selectedMedicine,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  value={selectedMedicine.description}
                  onChange={(e) =>
                    setSelectedMedicine({
                      ...selectedMedicine,
                      description: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  value={selectedMedicine.stock}
                  onChange={(e) =>
                    setSelectedMedicine({
                      ...selectedMedicine,
                      stock: e.target.value,
                    })
                  }
                />

                <select
                  value={selectedMedicine.sediaan}
                  onChange={(e) =>
                    setSelectedMedicine({
                      ...selectedMedicine,
                      sediaan: e.target.value,
                    })
                  }
                >
                  <option value="tablet">Tablet</option>
                  <option value="kapsul">Kapsul</option>
                  <option value="sirup">Sirup</option>
                </select>

                <div style={{ marginTop: "10px" }}>
                  <button onClick={handleUpdateMedicine}>Update</button>
                  <button
                    onClick={() => setSelectedMedicine(null)}
                    style={{  background: "gray" }}
                  >
                    Cancel
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
