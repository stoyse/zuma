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
              The intelligent platform for AI-powered automation and data analysis.
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
                Sign In
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
              Features
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
                  {item === 1 ? 'Quick Start' : item === 2 ? 'AI Automation' : 'Data Analysis'}
                </h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
                  {item === 1 
                    ? 'Login with email link, no complicated passwords.' 
                    : item === 2 
                      ? 'Use intelligent agents to automate your work.' 
                      : 'Get more out of your data with our AI-powered analytics tools.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo section */}
      <section className="demo-section" style={{ padding: "6rem 0", position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: "1 1 50%", padding: "0 15px", marginBottom: "30px" }}>
              <h2 style={{ marginBottom: "1.5rem" }}>See Zuma in Action</h2>
              <p style={{ marginBottom: "1.5rem" }}>Watch how easy it is to build and deploy AI agents that can transform your business operations and customer experiences.</p>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div style={{ marginRight: "1rem", color: "var(--success-color)" }}>✓</div>
                  <div>No coding required - build agents visually</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div style={{ marginRight: "1rem", color: "var(--success-color)" }}>✓</div>
                  <div>Deploy agents in minutes, not months</div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ marginRight: "1rem", color: "var(--success-color)" }}>✓</div>
                  <div>Scale automatically as your needs grow</div>
                </div>
              </div>
              <Link href="/create-agent" style={{
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
                Try It Yourself
              </Link>
            </div>
            <div style={{ flex: "1 1 50%", padding: "0 15px" }}>
              <div style={{
                background: "rgba(20, 25, 39, 0.7)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "25px",
                padding: "3rem",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
              }}>
                <Image 
                  src="/demo.png"
                  alt="Platform Demo"
                  width={600}
                  height={400}
                  style={{
                    borderRadius: "15px",
                    width: "100%",
                    height: "auto",
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section style={{ 
        padding: "6rem 0",
        background: "rgba(15, 20, 30, 0.5)",
        position: "relative"
      }}>
        <div className="container">
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap",
            justifyContent: "space-between"
          }}>
            {[
              { number: "500", label: "Businesses Empowered" },
              { number: "1000", label: "AI Agents Created" },
              { number: "50000", label: "Tasks Automated" },
              { number: "99", label: "Customer Satisfaction" }
            ].map((stat, index) => (
              <div key={index} style={{ 
                flex: "1 1 25%", 
                textAlign: "center",
                padding: "2rem"
              }}>
                <div style={{
                  fontSize: "3rem",
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                  background: "linear-gradient(to right, var(--primary-color), var(--info-color))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  {stat.number}
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: "8rem 0", position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div style={{
            background: "linear-gradient(135deg, rgba(20, 25, 39, 0.8), rgba(30, 35, 50, 0.8))",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "30px",
            padding: "4rem",
            textAlign: "center",
            position: "relative",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
            overflow: "hidden"
          }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1.5rem" }}>
              Ready to Build Your First AI Agent?
            </h2>
            <p style={{ 
              color: "var(--text-secondary)",
              fontSize: "1.2rem",
              marginBottom: "2rem",
              maxWidth: "700px",
              marginLeft: "auto",
              marginRight: "auto"
            }}>
              Join thousands of forward-thinking businesses already using zuma to transform their operations with AI. Get started today with our free tier and scale as you grow.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
              <Link href="/dashboard" style={{
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
                Get Started Free
              </Link>
              <Link href="#" style={{
                background: "transparent",
                border: "1px solid var(--glass-border)",
                borderRadius: "100px",
                padding: "0.7rem 2rem",
                color: "var(--text-primary)",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-block"
              }}>
                Schedule a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
