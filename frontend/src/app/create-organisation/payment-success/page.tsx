"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

// Hilfsfunktion, um die Komponente in Suspense zu wrappen, da useSearchParams Client-Komponenten benötigt
function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>("Processing your payment and creating organisation...");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orgCreationSuccessful, setOrgCreationSuccessful] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const pendingDataString = localStorage.getItem('pendingOrganisationData');

    if (!sessionId) {
      setError("Stripe session ID not found. Your payment might not have been processed correctly or the URL is incomplete.");
      setIsLoading(false);
      localStorage.removeItem('pendingOrganisationData'); // Sicherstellen, dass alte Daten entfernt werden
      return;
    }

    if (!pendingDataString) {
      setError("Could not retrieve organisation data. Please try creating the organisation again or contact support if payment was made.");
      setIsLoading(false);
      return;
    }

    const pendingData = JSON.parse(pendingDataString);

    const verifyAndCreate = async () => {
      try {
        // 1. (Optional aber empfohlen) Verifiziere die Checkout-Session beim Backend
        const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stripe/checkout-session/${sessionId}`);
        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok || verifyData.payment_status !== 'paid') {
          let errMsg = "Payment verification failed.";
          if (verifyData.detail) errMsg = verifyData.detail;
          else if (verifyData.payment_status) errMsg = `Payment status: ${verifyData.payment_status}. Expected 'paid'.`;
          
          console.error("Stripe session verification failed:", verifyData);
          setError(`${errMsg} Please contact support if you believe payment was successful.`);
          setIsLoading(false);
          localStorage.removeItem('pendingOrganisationData');
          return;
        }
        
        setMessage("Payment verified. Creating your organisation...");

        // 2. Erstelle die Organisation
        const organisationData = {
          name: pendingData.orgName,
          email: pendingData.email,
          phone: pendingData.phone || undefined,
          address: pendingData.address || undefined,
          website: pendingData.website || undefined,
          plan: pendingData.planId,
          payment_method: sessionId, // Stripe Session ID als payment_method
        };

        const createOrgResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/create/organisation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(organisationData),
        });

        const createOrgData = await createOrgResponse.json();

        if (createOrgResponse.ok && createOrgData.status === "success") {
          setSuccessMessage(`Organisation "${pendingData.orgName}" created successfully! You can now log in.`);
          setOrgCreationSuccessful(true);
          setError(null);
        } else {
          let detailedError = "Failed to create organisation after successful payment.";
          if (createOrgData && createOrgData.message) {
            detailedError = createOrgData.message;
          } else if (!createOrgResponse.ok) {
             detailedError = `API request failed with status: ${createOrgResponse.status}.`;
             try {
                const errorText = await createOrgResponse.text();
                detailedError += ` Response: ${errorText}`;
             } catch (e) { /* ignore */ }
          }
          console.error("Organisation creation failed after payment:", createOrgData);
          setError(`${detailedError} Please contact support with your payment details (Session ID: ${sessionId}).`);
        }
      } catch (err) {
        console.error("Error in payment success page:", err);
        setError("An unexpected error occurred. Please contact support.");
      } finally {
        setIsLoading(false);
        localStorage.removeItem('pendingOrganisationData');
      }
    };

    verifyAndCreate();
  }, [searchParams, router]);
  
  // Lokale setSuccessMessage Funktion, um den State zu aktualisieren
  const setSuccessMessage = (msg: string) => {
    setMessage(msg); // Nutze den bestehenden Message-State für Erfolgsmeldungen
  };

  const cardStyle: React.CSSProperties = {
    padding: "2rem 2.5rem",
    borderRadius: "20px",
    background: "var(--card-bg)",
    border: "1px solid var(--glass-border)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center" as "center", // Explizite Typisierung für textAlign
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.9rem 1.5rem",
    borderRadius: "100px",
    border: "none",
    background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    marginTop: "1.5rem"
  };

  return (
    <div style={cardStyle}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        {isLoading ? "Processing Payment..." : orgCreationSuccessful ? "Setup Complete!" : "Payment Status"}
      </h1>
      {isLoading && (
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>{message || "Please wait..."}</p>
      )}
      {error && (
        <div style={{ background: "rgba(255, 99, 99, 0.1)", border: "1px solid var(--danger-color)", color: "var(--danger-color)", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}
      {!isLoading && !error && orgCreationSuccessful && (
        <div style={{ background: "rgba(36, 204, 146, 0.1)", border: "1px solid var(--success-color)", color: "var(--success-color)", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
           <p style={{ margin: 0 }}>{message}</p>
        </div>
      )}
      {!isLoading && (orgCreationSuccessful || error) && (
         <Link href={orgCreationSuccessful ? "/login" : "/create-organisation"} style={buttonStyle}>
          {orgCreationSuccessful ? "Proceed to Login" : "Try Again"}
        </Link>
      )}
       {!isLoading && !orgCreationSuccessful && !error && (
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            Still processing or an unknown issue occurred. If you have been charged, please contact support.
        </p>
      )}
    </div>
  );
}


export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-primary)'}}>Loading payment details...</div>}>
      <div>
        <PublicNavbar />
        <main style={{
          paddingTop: "120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "calc(100vh - 80px)", // 80px ist eine Annahme für die Navbar-Höhe
          paddingBottom: "2rem"
        }}>
          <PaymentSuccessContent />
        </main>
      </div>
    </Suspense>
  );
}
