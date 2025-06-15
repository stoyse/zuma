"use client";

import React, { useState } from 'react';

interface ModelInfo {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

interface ModelsListPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModelsListPopup: React.FC<ModelsListPopupProps> = ({ isOpen, onClose }) => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/models`);
      if (!res.ok) throw new Error("Error loading models");
      const data = await res.json();
      setModels(data.models || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && models.length === 0) {
      fetchModels();
    }
  }, [isOpen]);

  const showModelDetails = (model: ModelInfo) => {
    setSelectedModel(model);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '900px',
        maxHeight: '85vh',
        overflowY: 'auto',
        width: '90%',
        backdropFilter: 'var(--blur-effect)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 'bold', 
            color: 'var(--text-primary)',
            background: 'linear-gradient(135deg, var(--primary-color), var(--info-color))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Available AI Models
          </h2>
          <button
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--glass-border)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--danger-color)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'var(--danger-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
          >
            ×
          </button>
        </div>

        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: 'var(--text-secondary)'
          }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}></i>
            <p>Loading models...</p>
          </div>
        )}

        {error && (
          <div style={{ 
            color: 'var(--danger-color)', 
            background: 'rgba(255, 99, 99, 0.1)',
            border: '1px solid var(--danger-color)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
            <button 
              onClick={fetchModels}
              style={{
                display: 'block',
                margin: '1rem auto 0',
                padding: '0.5rem 1rem',
                background: 'var(--danger-color)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && models.length > 0 && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {models.map((model, idx) => {
              const key = model.name || idx;
              const isSelected = selectedModel?.name === model.name;
              return (
                <div
                  key={key}
                  style={{
                    border: isSelected ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    background: isSelected 
                      ? 'rgba(114, 137, 254, 0.1)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => showModelDetails(model)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--glow-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <h3 style={{ 
                    fontWeight: 'bold', 
                    marginBottom: '0.5rem', 
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem'
                  }}>
                    {model.name}
                  </h3>
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '0.9rem',
                    margin: 0
                  }}>
                    <span style={{ color: 'var(--info-color)' }}>Size:</span> {formatBytes(model.size)} | 
                    <span style={{ color: 'var(--warning-color)' }}> Modified:</span> {new Date(model.modified_at).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && models.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: 'var(--text-secondary)'
          }}>
            <i className="fas fa-robot" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}></i>
            <p>No models found</p>
          </div>
        )}

        {/* Model Details */}
        {selectedModel && (
          <div style={{
            marginTop: '2rem',
            padding: '2rem',
            background: 'rgba(20, 25, 39, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--primary-color)',
            borderRadius: '16px',
            boxShadow: 'var(--glow-primary)'
          }}>
            <h3 style={{ 
              fontSize: '1.4rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: 'var(--text-primary)',
              borderBottom: '2px solid var(--primary-color)',
              paddingBottom: '0.5rem'
            }}>
              <i className="fas fa-microchip" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
              Model Details: {selectedModel.name}
            </h3>
            <div style={{ 
              display: 'grid', 
              gap: '1rem', 
              fontSize: '0.95rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
            }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)'
              }}>
                <strong style={{ color: 'var(--success-color)' }}>Name:</strong> 
                <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>{selectedModel.name}</span>
              </div>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)'
              }}>
                <strong style={{ color: 'var(--info-color)' }}>Size:</strong> 
                <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>{formatBytes(selectedModel.size)}</span>
              </div>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)'
              }}>
                <strong style={{ color: 'var(--warning-color)' }}>Modified:</strong> 
                <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>{new Date(selectedModel.modified_at).toLocaleString()}</span>
              </div>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                gridColumn: '1 / -1'
              }}>
                <strong style={{ color: 'var(--primary-color)' }}>Digest:</strong> 
                <span style={{ 
                  color: 'var(--text-secondary)', 
                  marginLeft: '0.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  wordBreak: 'break-all'
                }}>
                  {selectedModel.digest}
                </span>
              </div>
              {selectedModel.details && (
                <>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <strong style={{ color: 'var(--success-color)' }}>Format:</strong> 
                    <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>{selectedModel.details.format}</span>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <strong style={{ color: 'var(--info-color)' }}>Family:</strong> 
                    <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>{selectedModel.details.family}</span>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <strong style={{ color: 'var(--warning-color)' }}>Parameters:</strong> 
                    <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>{selectedModel.details.parameter_size}</span>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <strong style={{ color: 'var(--primary-color)' }}>Quantization:</strong> 
                    <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>{selectedModel.details.quantization_level}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsListPopup;
