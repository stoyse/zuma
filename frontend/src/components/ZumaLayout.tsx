"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

type NavbarProps = {
  children: ReactNode;
};

export default function ZumaLayout({ children }: NavbarProps) {
  const [name, setName] = useState<string | null>(null);
  const [organisation, setOrganisation] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [iconsLoaded, setIconsLoaded] = useState(false);

  const navbarHeight = "50px";
  const sidebarPaddingTop = "75px";

  useEffect(() => {
    // Überprüfen, ob FontAwesome JS geladen ist (optional, wenn Fallback-Text gewünscht)
    if (typeof window !== 'undefined' && (window as any).FontAwesome) {
      setIconsLoaded(true);
    }
    // Diese Logik wird immer ausgeführt, da ZumaLayout nur auf Dashboard-Seiten verwendet wird
    setName(localStorage.getItem('zuma_name'));
    setOrganisation(localStorage.getItem('zuma_organisation'));
    
    const currentPath = window.location.pathname;
    if (currentPath.includes('/dashboard')) setActivePage('dashboard');
    else if (currentPath.includes('/agents')) setActivePage('agents');
    else if (currentPath.includes('/tasks')) setActivePage('tasks');
    else if (currentPath.includes('/training')) setActivePage('training');
    else if (currentPath.includes('/analytics')) setActivePage('analytics');
    else if (currentPath.includes('/settings')) setActivePage('settings');
    
  }, []);

  // Sidebar styles
  const sidebarStyles = {
    width: "4rem",
    height: "100vh",
    position: "fixed" as const,
    left: 0,
    top: 0,
    zIndex: 100,
    background: "rgba(20, 25, 39, 0.7)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    boxShadow: "5px 0 10px rgba(0,0,0,0.12)",
    paddingTop: sidebarPaddingTop // Padding-Top hinzufügen, damit Elemente unter der Navbar beginnen
  };

  // Neue Style für die interne Navigation innerhalb der Sidebar
  const sidebarNavStyles = {
    display: "flex",
    flexDirection: "column" as const,
    flex: "1 1 auto"
  };

  const iconBtnStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "2.5rem",
    height: "2.5rem",
    margin: "0.5rem auto",
    borderRadius: "0.75rem",
    color: "rgba(255, 255, 255, 0.6)",
    background: "none",
    border: "none",
    transition: "background 0.2s, color 0.2s",
    position: "relative" as const,
    cursor: "pointer"
  };

  const activeIconBtnStyles = {
    ...iconBtnStyles,
    background: "linear-gradient(135deg, rgba(114, 137, 254, 0.9), rgba(80, 110, 228, 0.9))",
    color: "#fff",
    boxShadow: "0 0 10px rgba(114, 137, 254, 0.4)"
  };

  const tooltipStyles = {
    visibility: "hidden" as const,
    opacity: 0,
    position: "absolute" as const,
    left: "110%",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(30,35,50,0.95)",
    color: "#fff",
    padding: "0.25rem 0.7rem",
    borderRadius: "0.4rem",
    fontSize: "0.85rem",
    whiteSpace: "nowrap" as const,
    pointerEvents: "none" as const,
    transition: "opacity 0.2s",
    zIndex: 999
  };

  const logoStyles = {
    margin: "1rem auto 1.5rem auto", // Oberrand angepasst
    width: "2.5rem",
    height: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "0.75rem",
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "rgba(114, 137, 254, 0.9)",
    letterSpacing: "0.05em",
    boxShadow: "0 2px 8px rgba(114,137,254,0.08)"
  };

  const sidebarBottomStyles = {
    marginBottom: "1rem"
  };

  // Content Container Styles sind jetzt statisch für das Dashboard-Layout
  const contentContainerStyles = {
    marginLeft: "4rem",
    minHeight: "100vh",
    paddingTop: navbarHeight // Immer Padding für die Dashboard-Navbar
  };

  return (
    <>
      {/* FontAwesome Script und Link werden aus RootLayout geladen */}
      {/* <Script ... /> */}
      {/* <link ... /> */}

      {/* Background Gradient wird aus RootLayout geladen */}
      {/* <div className="bg-gradient"></div> */}

      {/* Sidebar (wird immer gerendert, wenn ZumaLayout verwendet wird) */}
      <nav style={sidebarStyles}>
        <div style={sidebarNavStyles}>
          <Link href="/" style={logoStyles}>Z</Link>
          <Link 
            href="/dashboard" 
            style={activePage === "dashboard" ? activeIconBtnStyles : iconBtnStyles}
            onMouseOver={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'visible';
              if (tooltip) tooltip.style.opacity = '1';
            }}
            onMouseOut={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'hidden';
              if (tooltip) tooltip.style.opacity = '0';
            }}
          >
            {/* Icon mit Fallback Text */}
            {iconsLoaded ? <i className="fas fa-gauge-high"></i> : "D"}
            <span className="tooltip" style={tooltipStyles}>Dashboard</span>
          </Link>
          <Link 
            href="/agents" 
            style={activePage === "agents" ? activeIconBtnStyles : iconBtnStyles}
            onMouseOver={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'visible';
              if (tooltip) tooltip.style.opacity = '1';
            }}
            onMouseOut={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'hidden';
              if (tooltip) tooltip.style.opacity = '0';
            }}
          >
            {iconsLoaded ? <i className="fas fa-robot"></i> : "A"}
            <span className="tooltip" style={tooltipStyles}>My Agents</span>
          </Link>
          <Link 
            href="/tasks" 
            style={activePage === "tasks" ? activeIconBtnStyles : iconBtnStyles}
            onMouseOver={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'visible';
              if (tooltip) tooltip.style.opacity = '1';
            }}
            onMouseOut={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'hidden';
              if (tooltip) tooltip.style.opacity = '0';
            }}
          >
            {iconsLoaded ? <i className="fas fa-tasks"></i> : "T"}
            <span className="tooltip" style={tooltipStyles}>Tasks</span>
          </Link>
          <Link 
            href="/training" 
            style={activePage === "training" ? activeIconBtnStyles : iconBtnStyles}
            onMouseOver={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'visible';
              if (tooltip) tooltip.style.opacity = '1';
            }}
            onMouseOut={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'hidden';
              if (tooltip) tooltip.style.opacity = '0';
            }}
          >
            {iconsLoaded ? <i className="fas fa-brain"></i> : "L"}
            <span className="tooltip" style={tooltipStyles}>Training</span>
          </Link>
          <Link 
            href="/analytics" 
            style={activePage === "analytics" ? activeIconBtnStyles : iconBtnStyles}
            onMouseOver={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'visible';
              if (tooltip) tooltip.style.opacity = '1';
            }}
            onMouseOut={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'hidden';
              if (tooltip) tooltip.style.opacity = '0';
            }}
          >
            {iconsLoaded ? <i className="fas fa-chart-line"></i> : "C"}
            <span className="tooltip" style={tooltipStyles}>Analytics</span>
          </Link>
          <Link 
            href="/settings" 
            style={activePage === "settings" ? activeIconBtnStyles : iconBtnStyles}
            onMouseOver={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'visible';
              if (tooltip) tooltip.style.opacity = '1';
            }}
            onMouseOut={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'hidden';
              if (tooltip) tooltip.style.opacity = '0';
            }}
          >
            {iconsLoaded ? <i className="fas fa-cog"></i> : "S"}
            <span className="tooltip" style={tooltipStyles}>Settings</span>
          </Link>
        </div>
        <div style={sidebarBottomStyles}>
          <Link 
            href="/logout" 
            style={iconBtnStyles}
            onMouseOver={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'visible';
              if (tooltip) tooltip.style.opacity = '1';
            }}
            onMouseOut={(e) => {
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) tooltip.style.visibility = 'hidden';
              if (tooltip) tooltip.style.opacity = '0';
            }}
          >
            {iconsLoaded ? <i className="fas fa-sign-out-alt"></i> : "L"}
            <span className="tooltip" style={tooltipStyles}>Logout</span>
          </Link>
        </div>
      </nav>

      {/* Dashboard-spezifische Navbar (wird immer gerendert) */}
      <nav className="navbar"> {/* Diese Klasse bezieht sich auf die Dashboard-Navbar-Stile */}
        <div className="container" style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          height: navbarHeight 
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/" className="navbar-brand" style={{ fontWeight: 700, fontSize: 28, color: "#7289fc", letterSpacing: 2 }}>zuma</Link>
            {organisation && (
              <span style={{ color: "#fff", fontSize: 18, opacity: 0.7, marginLeft: 12 }}>
                {organisation}
              </span>
            )}
          </div>
          {name && (
            <div style={{ color: "#fff", fontWeight: 500, fontSize: 18, opacity: 0.85 }}>
              {name}
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div className="content-container" style={contentContainerStyles}>
        <div className="container">
          {children}
        </div>
      </div>
    </>
  );
}
