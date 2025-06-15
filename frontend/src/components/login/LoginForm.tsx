"use client";

import { useState } from 'react';
import { auth } from '../../lib/firebase';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleEmailLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setEmailSent(false);

    const actionCodeSettings = {
      url: `${window.location.origin}/finishLogin`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: "450px", margin: "40px auto" }}>
      <h1 style={{ textAlign: "center" }}>Login mit E-Mail Link</h1>
      
      {emailSent ? (
        <div className="message-success">
          Ein Anmeldelink wurde an Ihre E-Mail-Adresse gesendet. Bitte überprüfen Sie Ihr Postfach.
        </div>
      ) : (
        <form onSubmit={handleEmailLinkLogin}>
          <div>
            <label htmlFor="email">E-Mail:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Ihre E-Mail-Adresse"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? 'Link senden...' : 'Anmeldelink senden'}
          </button>
        </form>
      )}
      
      {error && <p className="message-error">{error}</p>}
    </div>
  );
};

export default LoginForm;
