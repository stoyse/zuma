"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { isSignInWithEmailLink, signInWithEmailLink, getIdToken } from "firebase/auth";

export default function FinishLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const processLogin = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");
        if (!email) {
          email = window.prompt("Bitte gib deine E-Mail-Adresse zur Bestätigung ein:");
        }
        if (email) {
          try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem("emailForSignIn");
            // Nach erfolgreichem Login: UID und Email an API senden
            const user = result.user;
            const idToken = await getIdToken(user);
            // Sende Request an Backend
            await fetch(`${apiBaseUrl}/user/validate`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // Optional: Token für Authentifizierung
                Authorization: `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                userid: user.uid,
                email: user.email,
              }),
            });
            router.push("/dashboard");
          } catch (err: any) {
            setError("Fehler beim Anmelden: " + err.message);
            setLoading(false);
          }
        } else {
          setError("E-Mail nicht gefunden. Bitte versuche es erneut.");
          setLoading(false);
        }
      } else {
        setError("Ungültiger oder abgelaufener Anmeldelink.");
        setLoading(false);
      }
    };
    processLogin();
  }, [router]);

  return (
    <div className="glass-card" style={{ maxWidth: "450px", margin: "40px auto" }}>
      <h1 style={{ textAlign: "center" }}>Login abschließen</h1>
      
      {loading ? (
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
          <p>Anmeldung wird verarbeitet...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : error ? (
        <div className="message-error">{error}</div>
      ) : (
        <div className="message-success">Login erfolgreich! Du wirst weitergeleitet...</div>
      )}
    </div>
  );
}
