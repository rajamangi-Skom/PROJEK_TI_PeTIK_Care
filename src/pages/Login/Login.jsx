import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Login.css";
import logoPeTIK from "../../assets/logoPeTIK.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(0);


  const redirectByRole = (user) => {
    if (!user) return;


    if (user.role === "admin") navigate("/dashboard/admin");
    else if (user.role === "pengasuhan") navigate("/dashboard/pengasuhan");
    else if (user.role === "santri") navigate("/landing");
    else navigate("/");
  };

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {

      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Email dan password wajib diisi!",
      });
      return;
    }

    if (cooldown > 0) {
      Swal.fire({
        icon: "error",
        title: "Tunggu Dulu",
        text: `Coba lagi dalam ${formatTime(cooldown)}`,
      });

      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", {
        email: email,
        password: password,
      });


      const token =
        res.data.token ||
        res.data.accessToken ||
        res.data.data?.token ||
        res.data.data?.accessToken ||
        res.data.data?.tokens?.accessToken;

      const user = res.data.user || res.data.data?.user;

      if (!token || !user) {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: "Token / user tidak ditemukan",
        });

        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));


      Swal.fire({
        icon: "success",
        title: "Berhasil Login",
        text: "Selamat datang 👋",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        redirectByRole(user);
      }, 1500);
    } catch (error) {
      const msg = error.response?.data?.message || "Login gagal";

      if (
        msg.toLowerCase().includes("too many") ||
        msg.toLowerCase().includes("retry")
      ) {
        setCooldown(300);
      }

      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (token && user) {
        redirectByRole(user);
      }
    } catch {
      localStorage.clear();
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="left-content">
          <div className="logo-box">
            <img src={logoPeTIK} alt="logo" width={200} />
          </div>
          <h2>Your Health, Our Priority</h2>
        </div>
      </div>

      <div className="login-right">
        <div className="form-box">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}


              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}

              />
            </div>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className={cooldown > 0 ? "disabled" : ""}
            >
              {loading
                ? "Loading..."
                : cooldown > 0
                  ? `Tunggu ${formatTime(cooldown)}`
                  : "LOGIN"}

            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
