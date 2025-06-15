"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (auth.currentUser) {
        try {
          const idToken = await auth.currentUser.getIdToken();
          setToken(idToken);
          setUserData({
            email: auth.currentUser.email,
            uid: auth.currentUser.uid,
            emailVerified: auth.currentUser.emailVerified
          });
        } catch (err: any) {
          setError("Fehler beim Laden des Tokens: " + err.message);
        }
      } else {
        setError("Kein Benutzer angemeldet.");
      }
      setLoading(false);
    };
    fetchToken();
  }, []);

  const copyToClipboard = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      alert("Token in die Zwischenablage kopiert!");
    }
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ maxWidth: "800px", margin: "40px auto" }}>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ 
            width: "50px", 
            height: "50px", 
            borderRadius: "50%", 
            border: "3px solid rgba(114, 137, 254, 0.3)",
            borderTopColor: "var(--primary-color)",
            margin: "0 auto 20px",
            animation: "spin 1s linear infinite"
          }}></div>
          <p>Lade Dashboard...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ maxWidth: "800px", margin: "40px auto" }}>
        <h1>Dashboard</h1>
        <div className="message-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h1>Dashboard</h1>
      
      {userData && (
        <div style={{ marginBottom: "30px" }}>
          <h2>Benutzerinformationen</h2>
          <div style={{ 
            background: "rgba(30, 35, 50, 0.6)",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "20px"
          }}>
            <p><strong>E-Mail:</strong> {userData.email}</p>
            <p><strong>Benutzer-ID:</strong> {userData.uid}</p>
            <p><strong>E-Mail verifiziert:</strong> {userData.emailVerified ? "Ja" : "Nein"}</p>
          </div>
        </div>
      )}
      
      <h2>Dein Firebase ID Token:</h2>
      <div style={{ position: "relative" }}>
        <pre style={{ 
          maxHeight: "200px",
          overflowY: "auto",
          padding: "15px"
        }}>{token}</pre>
        <button 
          onClick={copyToClipboard}
          style={{ 
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "5px 10px",
            fontSize: "0.8rem",
            background: "rgba(114, 137, 254, 0.7)"
          }}
        >
          Kopieren
        </button>
      </div>
    </div>
  );
}
