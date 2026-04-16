import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <div className="nav-wrapper">
            <div className="logo">
              <span className="logo-text">PETIK Care</span>
            </div>
            <nav className="nav-menu">
              <ul>
                <li>
                  <a href="#beranda">Beranda</a>
                </li>
                <li>
                  <a href="#layanan">Layanan</a>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <a href="#tentang">Kontak</a>
                </li>
              </ul>
            </nav>
            <Link to="/login" className="about-btn">
              Masuk
            </Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Sehat Bersama PETIK</h1>
              <p>
                Ikhtiar menjaga kesehatan santri melalui layanan yang mudah
                diakses dan terpercaya..
              </p>
              <Link to="/dashboard" className="cta-button">
                Mulai Sekarang
              </Link>
            </div>
            <div className="hero-image"></div>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Layanan Kesehatan Santri</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="25" fill="#E8F5E8" />
                  <path
                    d="M30 20C32.7614 20 35 22.2386 35 25C35 27.7614 32.7614 30 30 30C27.2386 30 25 27.7614 25 25C25 22.2386 27.2386 20 30 20Z"
                    fill="#018C7E"
                  />
                  <path
                    d="M22 38C23.5 35 26.5 33 30 33C33.5 33 36.5 35 38 38"
                    stroke="#018C7E"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Konsultasi Kesehatan</h3>
              <p>
                Santri dapat berkonsultasi dengan pengurus atau tenaga kesehatan
                secara mudah tanpa harus menunggu lama.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="25" fill="#E8F5E8" />
                  <rect
                    x="20"
                    y="15"
                    width="20"
                    height="25"
                    rx="2"
                    fill="#018C7E"
                  />
                  <path
                    d="M25 20H35M25 25H35M25 30H30"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Pemeriksaan Umum</h3>
              <p>
                Pemeriksaan kesehatan dilakukan secara berkala untuk memastikan
                kondisi santri tetap terpantau dengan baik.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="25" fill="#E8F5E8" />
                  <path
                    d="M20 25H40M20 30H40M20 35H35"
                    stroke="#018C7E"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Izin Sakit</h3>
              <p>
                Pengajuan izin sakit menjadi lebih praktis dan langsung
                terhubung dengan pengurus pesantren.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <circle cx="25" cy="25" r="20" fill="white" />
                  <path
                    d="M18 25L22 29L32 19"
                    stroke="#018C7E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Mudah Digunakan</h3>
              <p>Antarmuka sederhana untuk santri dan pengurus.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <circle cx="25" cy="25" r="20" fill="white" />
                  <path
                    d="M25 15V35M15 25H35"
                    stroke="#018C7E"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Akses Cepat</h3>
              <p>Layanan kesehatan bisa diakses kapan saja.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <circle cx="25" cy="25" r="20" fill="white" />
                  <path
                    d="M25 20C27.2091 20 29 21.7909 29 24C29 26.2091 27.2091 28 25 28C22.7909 28 21 26.2091 21 24C21 21.7909 22.7909 20 25 20Z"
                    fill="#018C7E"
                  />
                  <path
                    d="M18 32C19.5 30 22 28 25 28C28 28 30.5 30 32 32"
                    stroke="#018C7E"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Data Aman</h3>
              <p>Informasi kesehatan tersimpan dengan aman.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <circle cx="25" cy="25" r="20" fill="white" />
                  <path
                    d="M20 25L23 28L30 21"
                    stroke="#018C7E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Terintegrasi Pesantren</h3>
              <p>Terhubung langsung dengan sistem dan pengurus.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="container">
          <h2 className="section-title">Kenapa PETIK Care</h2>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="25" fill="#FFE5E5" />
                  <path
                    d="M30 20C32.7614 20 35 22.2386 35 25C35 27.7614 32.7614 30 30 30C27.2386 30 25 27.7614 25 25C25 22.2386 27.2386 20 30 20Z"
                    fill="#FF6B6B"
                  />
                  <path
                    d="M22 38C23.5 35 26.5 33 30 33C33.5 33 36.5 35 38 38"
                    stroke="#FF6B6B"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Fokus pada Santri</h3>
              <p>
                Dirancang khusus untuk memenuhi kebutuhan kesehatan santri dalam
                lingkungan pesantren.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="25" fill="#FFE5E5" />
                  <path
                    d="M25 20L35 20M25 25L35 25M25 30L30 30"
                    stroke="#FF6B6B"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>Mudah & Praktis</h3>
              <p>
                Akses layanan kesehatan tanpa proses yang rumit, sehingga lebih
                efisien digunakan sehari-hari.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="25" fill="#FFE5E5" />
                  <path
                    d="M30 20L35 25L30 30M25 20L30 25L25 30"
                    stroke="#FF6B6B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Mendukung Kesehatan Harian</h3>
              <p>
                Membantu menjaga kondisi santri agar tetap sehat dan siap
                menjalani aktivitas belajar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Layanan</h4>
              <ul>
                <li>Konsultasi Kesehatan</li>
                <li>Pemeriksaan Umum</li>
                <li>Izin Sakit</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Navigasi</h4>
              <ul>
                <li>
                  <a href="#">Layanan</a>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <a href="#">Kontak</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Hubungi Kami</h4>
              <ul>
                <li>
                  <a href="#">Email: info@info@petik.or.id</a>
                </li>
                <li>
                  <a href="#">Telepon: (021) 1234-5678</a>
                </li>
                <li>
                  <a href="#">WhatsApp: +62 812-3456-7890</a>
                </li>
                <li>
                  <a href="#">
                    Alamat: Jl. Mandor Basar No.54, Rangkapan Jaya, Kec.
                    Pancoran Mas, Kota Depok, Jawa Barat 16434
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Lokasi Kami</h4>
              <div className="map-placeholder">
                <iframe
                  src="https://www.google.com/maps?q=-6.3868693,106.7774704&z=15&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: "10px" }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>

                <a
                  href="https://www.google.com/maps/place/PeTIK+(Pesantren+Teknologi+Informasi+dan+Komunikasi)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-map"
                >
                  📍 Lihat di Google Maps
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 PETIK Care. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
