import React from "react";

const companyName = "Sintra Platforms";
const companyEmail = "julian@stoyse.eu";

export default function ContactCard() {
  return (
    <div
      className="glass-card"
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: "2rem 2.5rem",
        borderRadius: "20px",
        background: "var(--card-bg)",
        border: "1px solid var(--glass-border)",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "1.5rem",
          color: "var(--text-primary)",
        }}
      >
        Kontakt
      </h2>
      <div style={{ marginBottom: "1.2rem" }}>
        <span style={{ fontWeight: 600, color: "var(--primary-color)", fontSize: "1.2rem" }}>
          {companyName}
        </span>
      </div>
      <div>
        <a
          href={`mailto:${companyEmail}`}
          style={{
            color: "var(--primary-color)",
            fontWeight: 500,
            fontSize: "1.1rem",
            textDecoration: "none",
            borderBottom: "1px dotted var(--primary-color)",
            transition: "color 0.2s",
          }}
        >
          {companyEmail}
        </a>
      </div>
    </div>
  );
}