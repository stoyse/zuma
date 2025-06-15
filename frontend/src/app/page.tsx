"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Immer zum Seitenanfang scrollen (auch bei Reload)
    window.scrollTo(0, 0);

    // Animation beim Laden aktivieren
    setIsLoaded(true);
    
    // Mausposition für Paralax-Effekte verfolgen
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    
    // Scroll-basierte Animationen
    const handleScroll = () => {
      const animatedElements = document.querySelectorAll(
        '.reveal-on-scroll, .stagger-list, .scroll-fade-in, .scroll-scale-in'
      );
      
      animatedElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
          el.classList.add('active');
        }
      });
      
      // Parallax-Scroll-Effekt für Hero-Elemente
      const heroElements = document.querySelectorAll('.parallax-scroll');
      heroElements.forEach((el) => {
        const scrollPos = window.scrollY;
        const speed = parseFloat((el as HTMLElement).dataset.speed || "0.1");
        (el as HTMLElement).style.transform = `translateY(${scrollPos * speed}px)`;
      });
    };
    
    // Magnetischer Effekt für Buttons
    const handleMagneticEffect = (e: MouseEvent) => {
      document.querySelectorAll('.btn-magnetic').forEach((button) => {
        const rect = (button as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const distance = Math.sqrt(x * x + y * y);
        
        if (distance < 100) {
          const strength = 15;
          (button as HTMLElement).style.transform = 
            `translate(${x / (rect.width / strength)}px, ${y / (rect.height / strength)}px)`;
        } else {
          (button as HTMLElement).style.transform = 'translate(0, 0)';
        }
      });
    };
    
    // Text-Splitting-Animation initialisieren
    const initTextSplitting = () => {
      document.querySelectorAll('.split-text').forEach(textElement => {
        const text = textElement.textContent || '';
        textElement.innerHTML = '';
        
        text.split('').forEach((char, index) => {
          const charSpan = document.createElement('span');
          charSpan.classList.add('char');
          charSpan.style.transitionDelay = `${index * 0.05}s`;
          charSpan.textContent = char === ' ' ? '\u00A0' : char;
          textElement.appendChild(charSpan);
        });
        
        setTimeout(() => {
          textElement.classList.add('reveal');
        }, 100);
      });
    };
    
    // Partikel-Animation initialisieren
    const initParticles = () => {
      const containers = document.querySelectorAll('.particle-container');
      containers.forEach(container => {
        for (let i = 0; i < 30; i++) {
          createParticle(container as HTMLElement);
        }
      });
    };
    
    const createParticle = (container: HTMLElement) => {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 10 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(particle);
    };
    
    // Event-Listener hinzufügen
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleMagneticEffect);
    window.addEventListener('scroll', handleScroll);
    
    // Initial ausführen
    handleScroll();
    initTextSplitting();
    initParticles();
    
    // Bereinigen
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleMagneticEffect);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`landing-page ${isLoaded ? 'loaded' : ''}`}>
      {/* Transparenter Header am Hero-Bereich */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 100 }}>
        <PublicNavbar transparent={true} />
      </div>
      
      {/* Particle container für dynamischen Hintergrund */}
      <div className="particle-container"></div>
      
      {/* Hero Section mit verbesserten Animationen */}
      <section className="hero-enhanced" style={{ 
        minHeight: '100vh',
        paddingTop: '80px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animierte Hintergrundkreise */}
        <div className="hero-circles">
          <div className="hero-circle" style={{
            width: '500px',
            height: '500px',
            top: '-150px',
            left: '-100px',
            animation: 'pulseScale 8s infinite',
          }}></div>
          <div className="hero-circle" style={{
            width: '400px',
            height: '400px',
            bottom: '-100px',
            right: '-50px',
            animation: 'pulseScale 8s infinite 2s',
          }}></div>
          <div className="hero-circle" style={{
            width: '300px',
            height: '300px',
            bottom: '20%',
            left: '15%',
            animation: 'pulseScale 8s infinite 4s',
          }}></div>
        </div>
        
        {/* Hintergrund-Muster mit Bewegungseffekt */}
        <div className="bg-pattern"></div>
        
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`${isLoaded ? 'animate-in active' : 'animate-in'}`} style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease'
            }}>
              {/* Hier ist die geänderte Überschrift mit korrigiertem Gradienten */}
              <h1 
                className="split-text" 
                style={{ 
                  fontSize: "3.5rem", 
                  fontWeight: "700", 
                  marginBottom: "1.5rem", 
                  lineHeight: "1.2",
                  backgroundImage: "linear-gradient(-45deg, rgba(114, 137, 254, 0.9) 0%, rgba(70, 194, 255, 0.9) 25%, rgba(36, 204, 146, 0.9) 50%, rgba(70, 194, 255, 0.9) 75%, rgba(114, 137, 254, 0.9) 100%)",
                  backgroundSize: "300% 300%",
                  animation: "animateGradient 6s ease infinite",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "white",
                  display: "inline-block"
                }}
              >
                Zuma: <span>Next Generation</span> AI Agents
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 stagger-list active" style={{ 
                fontSize: "1.25rem", 
                marginBottom: "2rem", 
                color: "var(--text-secondary)" 
              }}>
                <span>The intelligent platform for AI-powered</span>
                <span>automation and data analysis.</span>
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8 stagger-list active">
                <Link href="/login" className="btn-primary text-lg px-8 py-3 btn-magnetic" style={{
                  background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                  border: "none",
                  borderRadius: "100px",
                  padding: "0.7rem 2rem",
                  fontWeight: "600",
                  color: "#fff",
                  boxShadow: "var(--glow-primary)",
                  textDecoration: "none",
                  display: "inline-block"
                }}>
                  Sign In
                </Link>
                
                <Link href="/create-organisation" className="btn-outline text-lg px-8 py-3 btn-magnetic" style={{
                  background: "transparent",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "100px",
                  padding: "0.7rem 2rem",
                  color: "var(--text-primary)",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "inline-block"
                }}>
                  Start Your Journey
                </Link>
              </div>
            </div>
            
            <div className={`${isLoaded ? 'animate-in active' : 'animate-in'}`} style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0) rotate(0)' : 'translateY(30px) rotate(2deg)',
              transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s'
            }}>
              <div className="gradient-border card-3d">
                <div className="gradient-border-content">
                  <div className="relative" style={{
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${-mousePosition.x * 5}deg)`,
                    transition: 'transform 0.5s ease-out'
                  }}>
                    <div className="floating-element">
                      <Image 
                        src="/demo.png"
                        alt="Platform Demo"
                        width={600}
                        height={400}
                        style={{
                          borderRadius: "15px",
                          width: "100%",
                          height: "auto",
                          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
                          border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}
                      />
                    </div>
                    
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 floating-element-slow">
                      <div className="glass-card-advanced p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                            <i className="fas fa-check"></i>
                          </div>
                          <div>
                            <p className="font-medium">Task completed</p>
                            <p className="text-xs text-gray-400">5 mins ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-10 left-0 -ml-4 floating-element">
                      <div className="glass-card-advanced p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <i className="fas fa-robot"></i>
                          </div>
                          <div>
                            <p className="font-medium">Agent active</p>
                            <div className="w-20 bg-gray-700 h-1 rounded-full mt-1">
                              <div className="bg-blue-400 h-1 rounded-full" style={{width: '60%'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wellenform am unteren Rand */}
        <div className="wave" style={{position: 'absolute', bottom: 0, left: 0, width: '100%'}}>
        </div>
      </section>

      {/* Feature Section mit Animationen */}
      <section className="py-24 relative overflow-hidden" id="features">
        <div className="bg-pattern"></div>
        
        <div className="hero-circles">
          <div className="hero-circle" style={{
            width: '400px',
            height: '400px',
            top: '10%',
            right: '-100px',
            opacity: 0.3
          }}></div>
          <div className="hero-circle" style={{
            width: '300px',
            height: '300px',
            bottom: '5%',
            left: '-50px',
            opacity: 0.2
          }}></div>
        </div>
        
        <div className="container">
          <div className="text-center mb-16 reveal-on-scroll">
            <h6 className="text-sm uppercase tracking-wider text-blue-400 mb-3">Features</h6>
            <h2 
              className="text-4xl font-bold mb-6" 
              style={{ 
                backgroundImage: "linear-gradient(-45deg, rgba(114, 137, 254, 0.9) 0%, rgba(70, 194, 255, 0.9) 25%, rgba(36, 204, 146, 0.9) 50%, rgba(70, 194, 255, 0.9) 75%, rgba(114, 137, 254, 0.9) 100%)",
                backgroundSize: "300% 300%",
                animation: "animateGradient 6s ease infinite",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block"
              }}
            >
              Revolutionize Your Workflows
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform offers powerful tools and features that help you increase your productivity and optimize workflows.
            </p>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "30px" 
          }}>
            {[
              {
                icon: "fa-robot",
                title: "Quick Start",
                description: "Login with email link, no complicated passwords.",
                color: "primary",
                delay: 1
              },
              {
                icon: "fa-brain",
                title: "AI Automation",
                description: "Use intelligent agents to automate your work.",
                color: "success",
                delay: 2
              },
              {
                icon: "fa-chart-line",
                title: "Data Analysis",
                description: "Get more out of your data with our AI-powered analytics tools.",
                color: "info",
                delay: 3
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`glass-card-advanced scroll-fade-in reveal-delay-${feature.delay}`}
                style={{transition: `all 0.4s ease ${index * 0.1}s`}}
              >
                <div className={`feature-icon ${feature.color}`} style={{
                  fontSize: "2.5rem",
                  marginBottom: "1.5rem",
                  width: "70px",
                  height: "70px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "20px",
                  background: "rgba(30, 35, 50, 0.6)",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
                }}>
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
                
                <div className="mt-6 relative overflow-hidden">
                  <div
                    className="h-1 rounded-full bg-gray-700"
                    style={{width: '100%'}}
                  >
                    <div
                      className="h-1 rounded-full bg-blue-500"
                      style={{
                        width: '60%',
                        animation: 'progressAnimation 2s ease-out forwards',
                        animationDelay: `${0.5 + index * 0.2}s`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo section mit Parallax und 3D Effekten */}
      <section className="demo-section relative overflow-hidden py-24">
        <div className="particle-container"></div>
        
        <div className="container">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0 reveal-on-scroll">
              <h2 
                className="text-4xl font-bold mb-6" 
                style={{ 
                  backgroundImage: "linear-gradient(-45deg, rgba(114, 137, 254, 0.9) 0%, rgba(70, 194, 255, 0.9) 25%, rgba(36, 204, 146, 0.9) 50%, rgba(70, 194, 255, 0.9) 75%, rgba(114, 137, 254, 0.9) 100%)",
                  backgroundSize: "300% 300%",
                  animation: "animateGradient 6s ease infinite",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block"
                }}
              >
                See Zuma in Action
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Watch how easy it is to build and deploy AI agents that can transform your business operations and customer experiences.
              </p>
              
              <div className="mb-8 stagger-list">
                {[
                  "No coding required - build agents visually",
                  "Deploy agents in minutes, not months",
                  "Scale automatically as your needs grow"
                ].map((item, index) => (
                  <div key={index} className="flex items-center mb-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-green-400 flex items-center justify-center mr-3">
                      <i className="fas fa-check text-xs text-white"></i>
                    </div>
                    <div className="text-gray-200">{item}</div>
                  </div>
                ))}
              </div>
              
              <Link href="/create-agent" className="btn-primary text-lg px-8 py-3 btn-magnetic">
                Try It Yourself
              </Link>
            </div>
            
            <div className="w-full lg:w-1/2 px-4 scroll-fade-in">
              <div className="card-3d gradient-border">
                <div className="gradient-border-content">
                  <div className="relative" style={{
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${-mousePosition.x * 5}deg)`,
                    transition: 'transform 0.5s ease-out'
                  }}>
                    <Image 
                      src="/demo.png"
                      alt="Platform Demo"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-2xl border border-gray-700"
                      style={{
                        width: "100%",
                        height: "auto"
                      }}
                    />
                    
                    {/* Floating UI elements */}
                    <div className="absolute top-1/4 right-0 transform translate-x-1/2 -translate-y-1/2 floating-element-slow">
                      <div className="glass-card-advanced p-3 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <i className="fas fa-brain text-xs"></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium">AI Training</p>
                            <div className="w-16 bg-gray-700 h-1 rounded-full mt-1">
                              <div className="bg-blue-400 h-1 rounded-full animate-pulse" style={{width: '80%'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section mit Animation */}
      <section className="py-24 relative overflow-hidden bg-blur-backdrop">
        <div className="backdrop-blur-lg absolute inset-0 bg-gray-900/50"></div>
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Businesses Empowered" },
              { number: "1000+", label: "AI Agents Created" },
              { number: "50k+", label: "Tasks Automated" },
              { number: "99%", label: "Customer Satisfaction" }
            ].map((stat, index) => (
              <div key={index} className="scroll-fade-in text-center" style={{
                transitionDelay: `${index * 0.1}s`
              }}>
                <div className="stat-number gradient-text text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Wellenform am unteren Rand */}
        <div className="wave" style={{position: 'absolute', bottom: 0, left: 0, width: '100%'}}>
        </div>
      </section>

      {/* CTA section mit verbesserten Effekten */}
      <section className="py-24 relative overflow-hidden">
        <div className="particle-container"></div>
        <div className="bg-pattern"></div>
        
        <div className="container">
          <div className="cta-card relative overflow-hidden reveal-on-scroll">
            <div className="hero-circles">
              <div className="hero-circle" style={{ width: '400px', height: '400px', top: '-200px', right: '-200px', opacity: 0.2 }}></div>
              <div className="hero-circle" style={{ width: '300px', height: '300px', bottom: '-150px', left: '-150px', opacity: 0.2 }}></div>
            </div>
            
            <h2 
              className="text-4xl font-bold mb-6" 
              style={{ 
                backgroundImage: "linear-gradient(-45deg, rgba(114, 137, 254, 0.9) 0%, rgba(70, 194, 255, 0.9) 25%, rgba(36, 204, 146, 0.9) 50%, rgba(70, 194, 255, 0.9) 75%, rgba(114, 137, 254, 0.9) 100%)",
                backgroundSize: "300% 300%",
                animation: "animateGradient 6s ease infinite",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block"
              }}
            >
              Ready to Build Your First AI Agent?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of forward-thinking businesses already using zuma to transform their operations with AI. Get started today with our free tier and scale as you grow.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-3 btn-magnetic">
                Get Started Free
              </Link>
              <Link href="#" className="btn-outline text-lg px-8 py-3 btn-magnetic">
                Schedule a Demo
              </Link>
            </div>
            
            {/* Floating badges */}
            <div className="absolute bottom-4 right-4 floating-element">
              {/* <div className="glass-card-advanced p-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <svg ...>...</svg>
                  <span className="text-xs text-gray-300">GDPR Compliant</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
