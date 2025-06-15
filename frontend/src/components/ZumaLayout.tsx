"use client";

import Link from "next/link";
import { ReactNode } from "react";

type NavbarProps = {
  children: ReactNode;
};

export default function ZumaLayout({ children }: NavbarProps) {
  return (
    <div>
      {/* Hintergrund */}
      <div className="bg-gradient"></div>
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" className="navbar-brand">zuma</Link>
          <div>
            <Link href="/login" style={{ 
              color: 'var(--text-secondary)', 
              marginRight: '20px',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}>
              Login
            </Link>
            <Link href="/dashboard" style={{ 
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}>
              Dashboard
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hauptinhalt */}
      <div className="content-container">
        <div className="container">
          {children}
        </div>
      </div>
    </div>
  );
}
