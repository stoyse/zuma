import { useState } from 'react';

export default function GettingStartedPage() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Account erstellen",
      description: "Registrieren Sie sich für einen Zuma Account",
      icon: "fa-user-plus",
      color: "var(--primary-color)"
    },
    {
      id: 2,
      title: "Ersten AI Agent erstellen",
      description: "Konfigurieren Sie Ihren ersten intelligenten Agenten",
      icon: "fa-robot",
      color: "var(--success-color)"
    },
    {
      id: 3,
      title: "API Integration",
      description: "Verbinden Sie Zuma mit Ihren bestehenden Systemen",
      icon: "fa-code",
      color: "var(--info-color)"
    }
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8" style={{ 
        color: "var(--text-primary)",
        backgroundImage: "linear-gradient(-45deg, rgba(114, 137, 254, 0.9) 0%, rgba(70, 194, 255, 0.9) 25%, rgba(36, 204, 146, 0.9) 50%, rgba(70, 194, 255, 0.9) 75%, rgba(114, 137, 254, 0.9) 100%)",
        backgroundSize: "300% 300%",
        animation: "animateGradient 6s ease infinite",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block"
      }}>
        Erste Schritte mit Zuma
      </h1>

      <div className="glass-card-advanced mb-6">
        <p className="text-lg mb-4" style={{ color: "var(--text-secondary)" }}>
          Willkommen bei Zuma! Diese Anleitung führt Sie durch die ersten Schritte, um Ihre AI-Automatisierung erfolgreich zu starten.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.id} className="glass-card-advanced">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: step.color, color: '#fff' }}
              >
                <i className={`fas ${step.icon}`}></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {step.title}
                </h2>
                <p style={{ color: "var(--text-secondary)" }}>
                  {step.description}
                </p>
              </div>
            </div>
            
            <div className="pl-16">
              <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Detaillierte Anweisungen für {step.title.toLowerCase()} werden hier angezeigt. 
                Diese Sektion wird schrittweise mit vollständigen Anleitungen erweitert.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
