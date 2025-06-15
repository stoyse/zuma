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
          email = window.prompt("Please enter your email address for confirmation:");
        }
        if (email) {
          try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem("emailForSignIn");
            // After successful login: send UID and Email to API
            const user = result.user;
            const idToken = await getIdToken(user);
            // Send request to backend
            await fetch(`${apiBaseUrl}/user/validate`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // Optional: Token for authentication
                Authorization: `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                userid: user.uid,
                email: user.email,
              }),
            });
            router.push("/dashboard");
          } catch (err: any) {
            setError("Login error: " + err.message);
            setLoading(false);
          }
        } else {
          setError("Email not found. Please try again.");
          setLoading(false);
        }
      } else {
        setError("Invalid or expired login link.");
        setLoading(false);
      }
    };
    processLogin();
  }, [router]);

  return (
    <div className="glass-card" style={{ maxWidth: "450px", margin: "40px auto" }}>
      <h1 style={{ textAlign: "center" }}>Complete Login</h1>
      
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
          <p>Processing your login...</p>
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
        <div className="message-success">Login successful! You are being redirected...</div>
      )}
    </div>
  );
}
