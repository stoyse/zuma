import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faEye, faVectorSquare, faTools } from '@fortawesome/free-solid-svg-icons';

export default function ModelsPage() {
  const [filter, setFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [featureFilter, setFeatureFilter] = useState('all');

  // Vereinfachte Modell-Daten für bessere Performance
  const sampleModels = [
    { name: "deepseek-r1", free: ["1.5b", "7b", "8b"], pro: ["14b", "32b", "70b"], enterprise: ["671b"], thinking: true, vision: false, embedding: false, tools: false },
    { name: "gemma3", free: ["1b", "4b"], pro: ["12b", "27b"], enterprise: [], thinking: false, vision: true, embedding: false, tools: false },
    { name: "qwen3", free: ["0.6b", "1.7b", "4b", "8b"], pro: ["14b", "30b", "32b"], enterprise: ["235b"], thinking: true, vision: false, embedding: false, tools: true },
    { name: "llama3.1", free: ["8b"], pro: ["70b"], enterprise: ["405b"], thinking: false, vision: false, embedding: false, tools: true },
    { name: "mistral", free: ["7b"], pro: [], enterprise: [], thinking: false, vision: false, embedding: false, tools: true }
  ];

  const filteredModels = sampleModels.filter(model => {
    const matchesName = model.name.toLowerCase().includes(filter.toLowerCase());
    const matchesPlan = planFilter === 'all' || 
      (planFilter === 'free' && model.free.length > 0) ||
      (planFilter === 'pro' && model.pro.length > 0) ||
      (planFilter === 'enterprise' && model.enterprise.length > 0);
    const matchesFeature = featureFilter === 'all' ||
      (featureFilter === 'thinking' && model.thinking) ||
      (featureFilter === 'vision' && model.vision) ||
      (featureFilter === 'embedding' && model.embedding) ||
      (featureFilter === 'tools' && model.tools);
    
    return matchesName && matchesPlan && matchesFeature;
  });

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
        AI Modell-Übersicht
      </h1>

      {/* Filter */}
      <div className="glass-card-advanced mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              Modell suchen
            </label>
            <input
              type="text"
              placeholder="z.B. llama, qwen, gemma..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)"
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              Plan Filter
            </label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)"
              }}
            >
              <option value="all">Alle Pläne</option>
              <option value="free">Free Tier</option>
              <option value="pro">Pro Plan</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              Feature Filter
            </label>
            <select
              value={featureFilter}
              onChange={(e) => setFeatureFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)"
              }}
            >
              <option value="all">Alle Features</option>
              <option value="thinking">Thinking</option>
              <option value="vision">Vision</option>
              <option value="embedding">Embedding</option>
              <option value="tools">Tools</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vereinfachte Modell-Liste */}
      <div className="glass-card-advanced">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Verfügbare Modelle ({filteredModels.length})
        </h3>
        <div className="space-y-4">
          {filteredModels.map((model) => (
            <div key={model.name} className="p-4 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium" style={{ color: "var(--text-primary)" }}>{model.name}</h4>
                <div className="flex gap-2">
                  {/* {model.thinking && <FontAwesomeIcon icon={faBrain} style={{ color: "var(--warning-color)" }} title="Thinking" />} */}
                  {/* {model.vision && <FontAwesomeIcon icon={faEye} style={{ color: "var(--info-color)" }} title="Vision" />} */}
                  {/* {model.embedding && <FontAwesomeIcon icon={faVectorSquare} style={{ color: "var(--success-color)" }} title="Embedding" />} */}
                  {/* {model.tools && <FontAwesomeIcon icon={faTools} style={{ color: "var(--primary-color)" }} title="Tools" />} */}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium" style={{ color: "var(--success-color)" }}>Free: </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {model.free.length > 0 ? model.free.join(', ') : '-'}
                  </span>
                </div>
                <div>
                  <span className="font-medium" style={{ color: "var(--primary-color)" }}>Pro: </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {model.pro.length > 0 ? model.pro.join(', ') : '-'}
                  </span>
                </div>
                <div>
                  <span className="font-medium" style={{ color: "var(--warning-color)" }}>Enterprise: </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {model.enterprise.length > 0 ? model.enterprise.join(', ') : '-'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredModels.length === 0 && (
          <div className="text-center py-8" style={{ color: "var(--text-secondary)" }}>
            Keine Modelle gefunden. Versuchen Sie andere Filter-Einstellungen.
          </div>
        )}
        
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            <strong>Hinweis:</strong> Dies ist eine vereinfachte Ansicht der wichtigsten Modelle. 
            Die vollständige Liste aller verfügbaren Modelle finden Sie in der API-Dokumentation.
          </p>
        </div>
      </div>
    </div>
  );
}