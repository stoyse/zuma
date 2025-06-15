import PublicNavbar from "@/components/PublicNavbar";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Free Tier",
      price: "$0",
      frequency: "/ month",
      features: [
        "1 AI Agent",
        "100 Tasks/month",
        "Basic AI Models", // Hinzugefügt
        "Basic Analytics",
        "Community Support",
      ],
      buttonText: "Get Started Free",
      buttonLink: "/dashboard",
      featured: false,
    },
    {
      name: "Pro Plan",
      price: "$49",
      frequency: "/ month",
      features: [
        "10 AI Agents",
        "5,000 Tasks/month",
        "Advanced AI Models", // Hinzugefügt
        "Advanced Analytics",
        "Priority Email Support",
        "API Access",
      ],
      buttonText: "Choose Pro",
      buttonLink: "/signup?plan=pro", // Beispiel-Link
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      frequency: "",
      features: [
        "Unlimited AI Agents",
        "Unlimited Tasks",
        "Custom AI Models & Fine-tuning", // Hinzugefügt
        "Custom Analytics & Reporting",
        "Dedicated Support Manager",
        "On-premise Deployment Option",
        "SLA & Security Reviews",
      ],
      buttonText: "Contact Sales",
      buttonLink: "/contact-sales",
      featured: false,
    },
  ];

  return (
    <div>
      <PublicNavbar />
      <main style={{ paddingTop: "100px", paddingBottom: "4rem" }}>
        <section className="pricing-hero" style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "1rem" }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
            Choose the plan that’s right for your needs. No hidden fees, ever.
          </p>
        </section>

        <section className="pricing-plans" style={{ padding: "2rem 0" }}>
          <div className="container">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              alignItems: "stretch", // Wichtig für gleiche Höhe
            }}>
              {plans.map((plan, index) => (
                <div key={index} className="pricing-card glass-card" style={{
                  background: plan.featured ? "rgba(30, 35, 50, 0.8)" : "var(--card-bg)",
                  border: plan.featured ? "2px solid var(--primary-color)" : "1px solid var(--glass-border)",
                  borderRadius: "20px",
                  padding: "2.5rem 2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: plan.featured ? "0 0 25px rgba(114, 137, 254, 0.3)" : "0 5px 15px rgba(0, 0, 0, 0.15)",
                  transform: plan.featured ? "scale(1.05)" : "none",
                  zIndex: plan.featured ? 1 : 0,
                }}>
                  <div>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                      {plan.name}
                    </h2>
                    <div style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.25rem", color: plan.featured ? "var(--primary-color)" : "var(--text-primary)" }}>
                      {plan.price}
                      {plan.frequency && <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-secondary)" }}>{plan.frequency}</span>}
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "2rem 0" }}>
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center" }}>
                          <i className="fas fa-check-circle" style={{ color: "var(--success-color)", marginRight: "0.75rem" }}></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={plan.buttonLink} style={{
                    display: "block",
                    textAlign: "center",
                    background: plan.featured ? "linear-gradient(135deg, var(--primary-color), var(--secondary-color))" : "transparent",
                    border: plan.featured ? "none" : "1px solid var(--glass-border)",
                    borderRadius: "100px",
                    padding: "0.9rem 1.5rem",
                    fontWeight: 600,
                    color: plan.featured ? "#fff" : "var(--text-primary)",
                    textDecoration: "none",
                    boxShadow: plan.featured ? "var(--glow-primary)" : "none",
                    marginTop: "1rem",
                  }}>
                    {plan.buttonText}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ textAlign: "center", padding: "4rem 1rem", marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
                Frequently Asked Questions
            </h3>
            <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "left" }}>
                <details style={{ marginBottom: "1rem", background: "var(--card-bg)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--glass-border)"}}>
                    <summary style={{ fontWeight: 500, cursor: "pointer" }}>Can I change my plan later?</summary>
                    <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)"}}>Yes, you can upgrade or downgrade your plan at any time from your account settings.</p>
                </details>
                <details style={{ marginBottom: "1rem", background: "var(--card-bg)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--glass-border)"}}>
                    <summary style={{ fontWeight: 500, cursor: "pointer" }}>What payment methods do you accept?</summary>
                    <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)"}}>We accept all major credit cards. For Enterprise plans, we also support invoicing.</p>
                </details>
                 <details style={{ background: "var(--card-bg)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--glass-border)"}}>
                    <summary style={{ fontWeight: 500, cursor: "pointer" }}>Is there a discount for annual billing?</summary>
                    <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)"}}>Yes, we offer a discount equivalent to two months free if you choose to pay annually for the Pro plan.</p>
                </details>
            </div>
        </section>
      </main>
    </div>
  );
}
