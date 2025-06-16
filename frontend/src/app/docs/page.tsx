'use client';

import { useState } from 'react';
import GettingStartedPage from '@/components/docs/general/geting-started';
import ModelsPage from '@/components/docs/ai/models';

interface DocSection {
  id: string;
  title: string;
  icon: string;
  color: string;
  component: React.ComponentType;
  category: string;
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Erste Schritte',
    icon: 'fa-play-circle',
    color: 'var(--primary-color)',
    component: GettingStartedPage,
    category: 'Allgemein'
  },
  {
    id: 'ai-models',
    title: 'AI Modelle',
    icon: 'fa-robot',
    color: 'var(--info-color)',
    component: ModelsPage,
    category: 'AI & Modelle'
  },
  {
    id: 'api-reference',
    title: 'API Referenz',
    icon: 'fa-code',
    color: 'var(--success-color)',
    component: () => <div className="glass-card-advanced"><h2 style={{ color: "var(--text-primary)" }}>API Referenz - Coming Soon</h2></div>,
    category: 'API'
  },
  {
    id: 'workflows',
    title: 'Workflows',
    icon: 'fa-sitemap',
    color: 'var(--warning-color)',
    component: () => <div className="glass-card-advanced"><h2 style={{ color: "var(--text-primary)" }}>Workflows - Coming Soon</h2></div>,
    category: 'Automatisierung'
  },
  {
    id: 'examples',
    title: 'Beispiele',
    icon: 'fa-lightbulb',
    color: 'var(--danger-color)',
    component: () => <div className="glass-card-advanced"><h2 style={{ color: "var(--text-primary)" }}>Beispiele - Coming Soon</h2></div>,
    category: 'Beispiele'
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: 'fa-question-circle',
    color: 'var(--info-color)',
    component: () => <div className="glass-card-advanced"><h2 style={{ color: "var(--text-primary)" }}>FAQ - Coming Soon</h2></div>,
    category: 'Hilfe'
  }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Rendere Komponenten explizit basierend auf activeSection
  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return <GettingStartedPage />;
      case 'ai-models':
        return <ModelsPage />;
      case 'api-reference':
        return (
          <div className="glass-card-advanced">
            <h2 style={{ color: "var(--text-primary)" }}>API Referenz - Coming Soon</h2>
          </div>
        );
      case 'workflows':
        return (
          <div className="glass-card-advanced">
            <h2 style={{ color: "var(--text-primary)" }}>Workflows - Coming Soon</h2>
          </div>
        );
      case 'examples':
        return (
          <div className="glass-card-advanced">
            <h2 style={{ color: "var(--text-primary)" }}>Beispiele - Coming Soon</h2>
          </div>
        );
      case 'faq':
        return (
          <div className="glass-card-advanced">
            <h2 style={{ color: "var(--text-primary)" }}>FAQ - Coming Soon</h2>
          </div>
        );
      default:
        return <GettingStartedPage />;
    }
  };

  // Gruppiere Sections nach Kategorie
  const groupedSections = docSections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {} as Record<string, DocSection[]>);

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar */}
      <div 
        className={`${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 flex-shrink-0`}
        style={{ 
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid var(--glass-border)"
        }}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {!sidebarCollapsed && (
              <h2 className="text-xl font-bold" style={{ 
                color: "var(--text-primary)",
                backgroundImage: "linear-gradient(-45deg, rgba(114, 137, 254, 0.9) 0%, rgba(70, 194, 255, 0.9) 25%, rgba(36, 204, 146, 0.9) 50%, rgba(70, 194, 255, 0.9) 75%, rgba(114, 137, 254, 0.9) 100%)",
                backgroundSize: "300% 300%",
                animation: "animateGradient 6s ease infinite",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Dokumentation
              </h2>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-opacity-20 transition-all"
              style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "var(--text-primary)" 
              }}
            >
              <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-4">
            {Object.entries(groupedSections).map(([category, sections]) => (
              <div key={category}>
                {!sidebarCollapsed && (
                  <h3 
                    className="text-sm font-semibold mb-2 px-2 uppercase tracking-wide"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {category}
                  </h3>
                )}
                <div className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                        activeSection === section.id ? 'bg-opacity-20' : 'hover:bg-opacity-10'
                      }`}
                      style={{
                        backgroundColor: activeSection === section.id ? section.color : 'transparent',
                        border: activeSection === section.id ? `1px solid ${section.color}` : '1px solid transparent'
                      }}
                      title={sidebarCollapsed ? section.title : undefined}
                    >
                      <i 
                        className={`fas ${section.icon} ${sidebarCollapsed ? 'text-lg' : ''}`}
                        style={{ 
                          color: activeSection === section.id ? section.color : 'var(--text-secondary)',
                          minWidth: '16px'
                        }}
                      />
                      {!sidebarCollapsed && (
                        <div className="flex-1">
                          <div 
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {section.title}
                          </div>
                        </div>
                      )}
                      {!sidebarCollapsed && activeSection === section.id && (
                        <i 
                          className="fas fa-chevron-right text-sm"
                          style={{ color: section.color }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          {!sidebarCollapsed && (
            <div className="mt-8 pt-4 border-t" style={{ borderColor: "var(--glass-border)" }}>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-info-circle"></i>
                  <span>Weitere Hilfe benötigt?</span>
                </div>
                <div className="space-y-1">
                  <a 
                    href="#" 
                    className="block hover:text-primary transition-colors"
                    style={{ color: "var(--primary-color)" }}
                  >
                    → Community Support
                  </a>
                  <a 
                    href="#" 
                    className="block hover:text-primary transition-colors"
                    style={{ color: "var(--primary-color)" }}
                  >
                    → Kontakt
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
