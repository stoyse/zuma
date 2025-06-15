"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PublicNavbar() {
  useEffect(() => {
    const navbar = document.getElementById('public-navbar');
    if (!navbar) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg" id="public-navbar" style={{
      background: "rgba(20, 25, 39, 0.7)",
      backdropFilter: "var(--blur-effect)",
      WebkitBackdropFilter: "var(--blur-effect)",
      borderBottom: "1px solid var(--glass-border)",
      padding: "1rem 2rem",
      position: "fixed",
      width: "100%",
      zIndex: 1000,
      transition: "all 0.3s"
    }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <Link href="/" className="navbar-brand" style={{
          fontWeight: 700,
          fontSize: "1.8rem",
          background: "linear-gradient(to right, var(--primary-color), var(--info-color))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textDecoration: "none"
        }}>
          zuma
        </Link>
        {/* Mobile Toggler (optional, requires Bootstrap JS or custom logic) */}
        {/* <button className="navbar-toggler" type="button">
          <i className="fas fa-bars" style={{ color: "var(--text-primary)" }}></i>
        </button> */}
        <div className="navbar-collapse" style={{ flexGrow: 0 }}> {/* Adjusted for simplicity */}
          <ul className="navbar-nav" style={{ flexDirection: "row", listStyle: "none", paddingLeft: 0, margin: 0 }}>
            {/* Removed list items for Features and Demo */}
            {/* Add other public links as needed */}
            <li className="nav-item" style={{ marginLeft: "1rem" }}>
              <Link href="/pricing" className="nav-link" style={{ color: "var(--text-secondary)", fontWeight: 500, textDecoration: "none" }}>
                Pricing
              </Link>
            </li>
          </ul>
        </div>
        <div style={{ display: "flex" }}>
          <Link href="/login" className="btn-outline" style={{
            background: "transparent",
            border: "1px solid var(--glass-border)",
            borderRadius: "100px",
            padding: "0.7rem 2rem",
            color: "var(--text-primary)",
            fontWeight: 600,
            textDecoration: "none",
            marginRight: "1rem"
          }}>
            Sign In
          </Link>
          <Link href="/create-organisation" className="btn-primary" style={{
            background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
            border: "none",
            borderRadius: "100px",
            padding: "0.7rem 2rem",
            fontWeight: 600,
            color: "#fff",
            boxShadow: "var(--glow-primary)",
            textDecoration: "none"
          }}>
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
