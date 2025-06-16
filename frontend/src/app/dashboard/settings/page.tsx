"use client";

import React, { useState, useEffect } from 'react'; // Import useEffect
import ModelsListPopup from '@/components/models-list-popup';

const SettingsPage = () => {
  const [showModelsPopup, setShowModelsPopup] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: '',
    name: '',
    organisation: '',
    userid: '',
    token: ''
  });

  useEffect(() => {
    // Retrieve user info from localStorage
    const email = localStorage.getItem('zuma_email');
    const name = localStorage.getItem('zuma_name');
    const organisation = localStorage.getItem('zuma_organisation');
    const userid = localStorage.getItem('zuma_userid');
    const token = localStorage.getItem('zuma_token');

    setUserInfo({
      email: email || 'N/A',
      name: name || 'N/A',
      organisation: organisation || 'N/A',
      userid: userid || 'N/A',
      token: token || 'N/A' 
    });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>Settings</h1>
      <p style={{ color: 'var(--text-secondary)' }}>This is the settings page. You can manage your account and organisation settings here.</p>

      <div style={{ marginTop: '2rem', marginBottom: '2rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>User Information</h2>
        <div style={{ color: 'var(--text-secondary)' }}>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Organisation:</strong> {userInfo.organisation}</p>
          <p><strong>User ID:</strong> {userInfo.userid}</p>
          {/* Avoid displaying the token for security reasons, or display it partially if absolutely necessary and understood by the user */}
          {/* <p><strong>Token:</strong> {userInfo.token}</p> */}
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>AI Models</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>View and manage available AI models for your organisation.</p>
        
        <button
          style={{ 
            padding: '0.75rem 1.5rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            color: '#fff',
            border: 'none',
            borderRadius: '100px',
            cursor: 'pointer',
            boxShadow: 'var(--glow-primary)',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setShowModelsPopup(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(114, 137, 254, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--glow-primary)';
          }}
        >
          <i className="fas fa-robot" style={{ marginRight: '0.5rem' }}></i>
          Show Available AI Models
        </button>
      </div>

      <ModelsListPopup 
        isOpen={showModelsPopup}
        onClose={() => setShowModelsPopup(false)}
      />
    </div>
  );
};

export default SettingsPage;
