import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logoPeTIK from "../../assets/logoPeTIK.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectByRole = (user) => {
    if (!user) return;

    if (user.role === "admin" || user.role === "pengasuhan") {
      navigate("/dashboard/admin");
    } else if (user.role === "santri") {
      navigate("/landing");
    } else {
      navigate("/");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", {
        email: email,
        password: password,
      });

      console.log("FULL LOGIN RESPONSE:", res.data); 

  
      const token =
        res.data.token ||
        res.data.accessToken ||
        res.data.data?.token ||
        res.data.data?.accessToken ||
        res.data.data?.tokens?.accessToken;

      const user = res.data.user || res.data.data?.user;

      console.log("TOKEN:", token);
      console.log("USER:", user);

      if (!token || !user) {
        alert("Login gagal: token/user tidak ditemukan");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      redirectByRole(user);
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data);
      console.log("STATUS:", error.response?.status);

      alert(error.response?.data?.message || "Login gagal, cek email/password");
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
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
