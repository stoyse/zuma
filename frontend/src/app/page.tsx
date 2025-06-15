import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-content" style={{ maxWidth: "700px" }}>
            <h1 style={{ 
              fontSize: "3.5rem", 
              fontWeight: "700", 
              marginBottom: "1.5rem", 
              lineHeight: "1.2" 
            }}>
              Zuma: <span style={{
                background: "linear-gradient(to right, var(--info-color), var(--success-color))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Next Generation</span> AI Agents
            </h1>
            
            <p style={{ 
              fontSize: "1.25rem", 
              marginBottom: "2rem", 
              color: "var(--text-secondary)" 
            }}>
              Die intelligente Plattform für AI-gesteuerte Automatisierung und Datenanalyse.
            </p>
            
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <Link href="/login" style={{
                background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                border: "none",
                borderRadius: "100px",
                padding: "0.7rem 2rem",
                fontWeight: "600",
                color: "#fff",
                boxShadow: "var(--glow-primary)",
                textDecoration: "none",
                display: "inline-block"
              }}>
                Anmelden
              </Link>
              
              <Link href="/dashboard" style={{
                background: "transparent",
                border: "1px solid var(--glass-border)",
                borderRadius: "100px",
                padding: "0.7rem 2rem",
                color: "var(--text-primary)",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-block"
              }}>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features" style={{ padding: "6rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ 
              fontSize: "2.5rem", 
              fontWeight: "700", 
              marginBottom: "1rem", 
              position: "relative", 
              display: "inline-block" 
            }}>
              Funktionen
            </h2>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "30px" 
          }}>
            {[1, 2, 3].map((item) => (
              <div key={item} className="feature-card glass-card">
                <div className="feature-icon primary" style={{
                  fontSize: "2.5rem",
                  marginBottom: "1.5rem",
                  width: "70px",
                  height: "70px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "20px",
                  background: "rgba(30, 35, 50, 0.6)",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
                }}>
                  {item === 1 ? '🚀' : item === 2 ? '🤖' : '📊'}
                </div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", fontWeight: "600" }}>
                  {item === 1 ? 'Schneller Einstieg' : item === 2 ? 'AI-Automatisierung' : 'Datenanalyse'}
                </h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
                  {item === 1 
                    ? 'Login mit E-Mail-Link ohne komplizierte Passwörter.' 
                    : item === 2 
                      ? 'Nutze intelligente Agenten für die Automatisierung deiner Arbeit.' 
                      : 'Hole mehr aus deinen Daten mit unseren KI-gestützten Analysetools.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
