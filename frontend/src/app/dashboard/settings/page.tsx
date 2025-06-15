"use client";

import React, { useState } from 'react';
import ModelsListPopup from '@/components/models-list-popup';

const SettingsPage = () => {
  const [showModelsPopup, setShowModelsPopup] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>Settings</h1>
      <p style={{ color: 'var(--text-secondary)' }}>This is the settings page. You can manage your account and organisation settings here.</p>
      
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
