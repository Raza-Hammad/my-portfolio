import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { sound } from '../lib/sound';

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const role = PORTFOLIO_DATA.roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedRole(role.substring(0, displayedRole.length + 1));
        if (displayedRole === role) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayedRole(role.substring(0, displayedRole.length - 1));
        if (displayedRole === "") {
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % PORTFOLIO_DATA.roles.length);
        }
      }
    }, isDeleting ? 30 : 80);

    return () => clearTimeout(timeout);
  }, [displayedRole, isDeleting, roleIndex]);

  // Network Graph Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number, y: number, vx: number, vy: number, size: number, color: string }[] = [];
    
    // Dynamic particle counts for mobile optimization
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 65;
    const connectionDistance = isMobile ? 95 : 145;
    let mouse = { x: -1000, y: -1000, isDown: false, radius: isMobile ? 120 : 180 };
    
    // Click Ripple circles
    let ripples: { x: number, y: number, r: number, maxR: number, opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        // Random placement with margin to avoid sticking on borders
        particles.push({
          x: Math.random() * (canvas.width - 20) + 10,
          y: Math.random() * (canvas.height - 20) + 10,
          vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.6),
          vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.6),
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.12 ? 'var(--primary)' : 'var(--warning)'
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw ripples
      ripples = ripples.filter(r => {
        r.r += 4;
        r.opacity -= 0.02;
        if (r.opacity <= 0) return false;
        
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `color-mix(in srgb, var(--primary) ${Math.round(r.opacity * 100)}%, transparent)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return true;
      });

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Interaction with mouse/finger
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          // Repel nodes smoothly
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 2.5;
          p.y -= (dy / dist) * force * 2.5;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.45;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Adapt connecting line color depending on nodes
            const isAlertNode = p.color === 'var(--warning)' || p2.color === 'var(--warning)';
            ctx.strokeStyle = isAlertNode 
              ? `color-mix(in srgb, var(--warning) ${Math.round((1 - dist2 / connectionDistance) * 15)}%, transparent)`
              : `color-mix(in srgb, var(--primary) ${Math.round((1 - dist2 / connectionDistance) * 15)}%, transparent)`;
              
            ctx.lineWidth = 0.8 - dist2 / connectionDistance;
            ctx.stroke();
          }
        }
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleCanvasClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 10,
        maxR: 150,
        opacity: 0.8
      });
      // Stun-repel particles nearby
      particles.forEach(p => {
        const dx = e.clientX - p.x;
        const dy = e.clientY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx -= (dx / dist) * 1.5;
          p.vy -= (dy / dist) * 1.5;
        }
      });
      sound.playClick();
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('click', handleCanvasClick);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleResumeDownload = () => {
    sound.playDataStream();
  };

  return (
    <section id="hero" className="relative w-full h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden transition-colors duration-500">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      
      {/* Visual Overlay Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.006)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.006)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* HUD Frame Brackets */}
        <div className="absolute -inset-x-4 -inset-y-6 md:-inset-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 border-t border-l border-primary/50" />
          <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 border-t border-r border-primary/50" />
          <div className="absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 border-b border-l border-primary/50" />
          <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 border-b border-r border-primary/50" />
        </div>

        <h2 className="text-primary font-mono text-[10px] md:text-xs tracking-[0.3em] mb-4 uppercase opacity-80 animate-fade-in">
          OPERATIVE_CONNECTED // SYSTEM_DECRYPTED
        </h2>
        
        <h1 
          className="text-4xl sm:text-6xl md:text-8xl font-bold font-mono tracking-tighter text-white mb-6 relative animate-glitch" 
          data-text={PORTFOLIO_DATA.name}
          onMouseEnter={() => sound.playTyping()}
        >
          <span className="relative z-10">{PORTFOLIO_DATA.name}</span>
          <span className="absolute inset-0 text-primary/15 blur-[3px] select-none">{PORTFOLIO_DATA.name}</span>
        </h1>

        <div className="h-10 sm:h-12 text-lg sm:text-2xl md:text-3xl font-mono text-secondary">
          <span className="text-glow-secondary font-bold mr-1">&gt;</span>
          {displayedRole}
          <span className="animate-pulse font-bold text-glow-secondary">_</span>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-sm sm:max-w-none mx-auto">
          <button 
            onClick={() => {
              sound.playClick();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onMouseEnter={() => sound.playTyping()}
            className="px-8 py-3.5 bg-primary/10 border border-primary/45 hover:border-primary text-primary font-mono text-xs tracking-widest hover:bg-primary hover:text-background transition-all duration-300 clickable font-bold uppercase rounded-sm border-pulse-glow"
          >
            [ ./view_projects.sh ]
          </button>
          
          <a 
            href="/resume.pdf" 
            download="Muhammad_Hammad_Raza_Resume.pdf"
            onClick={handleResumeDownload}
            onMouseEnter={() => sound.playTyping()}
            className="px-8 py-3.5 bg-secondary/5 border border-secondary/45 hover:border-secondary text-secondary font-mono text-xs tracking-widest hover:bg-secondary/15 transition-all duration-300 clickable flex items-center justify-center font-bold uppercase rounded-sm border-pulse-glow"
            style={{ animationDelay: '1.5s' }}
          >
            [ ./download_resume.pdf ]
          </a>
        </div>

        <div className="absolute bottom-[-110px] left-1/2 -translate-x-1/2 flex gap-6 sm:gap-12 whitespace-nowrap px-4 py-1.5 border-x border-primary/10 w-full max-w-[280px] sm:max-w-none justify-center">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            SECURE SYSTEMS ACTIVE
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            CLEARANCE LEVEL: 4
          </div>
        </div>
      </div>
    </section>
  );
};
