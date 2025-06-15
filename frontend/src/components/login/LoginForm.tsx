"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [loginToken, setLoginToken] = useState<string | null>(null);
  const [tokenSent, setTokenSent] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [userid, setUserid] = useState<string | null>(null);
  const [organisation, setOrganisation] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Hilfsfunktion, um die API-Basis-URL aus der ENV zu holen (nur clientseitig als Beispiel)
  function getApiBaseUrl() {
    // Versuche, die URL aus einer ENV-Variable zu lesen (z.B. NEXT_PUBLIC_API_BASE_URL)
    // Fallback: Standardwert
    return process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  const handleEmailLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setEmailSent(false);

    try {
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}/auth/user/login`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        let data;
        try {
          data = await response.json();
        } catch {
          setError('Fehler beim Verarbeiten der Serverantwort.');
          setLoading(false);
          return;
        }
        if (data && data.login_token && data.userid) {
          setTokenSent(data.login_token);
          setLoginToken(data.login_token);
          setUserid(data.userid);
          setOrganisation(data.organisation || null);
          setName(data.name || null);
          setToken(data.token || null);
          setEmailSent(true);
          setError(null);
        } else {
          setError('Unerwartete Serverantwort.');
        }
      } else {
        let data;
        try {
          data = await response.json();
        } catch {
          setError('Server returned an unexpected response. Bitte versuchen Sie es später erneut.');
          return;
        }
        setError(data?.detail || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (tokenInput === loginToken) {
      // Userdaten in localStorage speichern (Session), inkl. token aber nicht login_token
      if (userid && email) {
        localStorage.setItem('zuma_userid', userid);
        localStorage.setItem('zuma_email', email);
        if (organisation) localStorage.setItem('zuma_organisation', organisation);
        if (name) localStorage.setItem('zuma_name', name);
        if (token) localStorage.setItem('zuma_token', token);
      }
      router.push('/dashboard');
    } else {
      setError('Der eingegebene Code ist falsch.');
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: "450px", margin: "40px auto" }}>
      <h1 style={{ textAlign: "center" }}>Login with Email Link</h1>
      {emailSent && tokenSent ? (
        <form onSubmit={handleTokenSubmit}>
          <div>
            <label htmlFor="token">Verification code:</label>
            <input
              type="text"
              id="token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              required
              placeholder="Code from the email"
              autoFocus
            />
          </div>
          <button type="submit" style={{ width: "100%" }}>
            Log in
          </button>
        </form>
      ) : (
        <form onSubmit={handleEmailLinkLogin}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Your email address"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? 'Sending link...' : 'Send login link'}
          </button>
        </form>
      )}
      {error && <p className="message-error">{error}</p>}
    </div>
  );
};

export default LoginForm;
