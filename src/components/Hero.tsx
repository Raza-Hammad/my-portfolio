import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA } from '../data';

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
    }, isDeleting ? 50 : 100);

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
    const particleCount = 60;
    const connectionDistance = 150;
    let mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.1 ? '#00d4ff' : '#ff4d6d'
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Interaction with mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.5;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color === '#ff4d6d' || p2.color === '#ff4d6d' ? '#ff4d6d22' : '#00d4ff22';
            ctx.lineWidth = 1 - dist / connectionDistance;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      
      <div className="relative z-10 text-center px-4">
        {/* HUD Frame Brackets */}
        <div className="absolute -inset-8 pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 animate-pulse" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 animate-pulse" />
        </div>

        <h2 className="text-primary font-mono text-sm tracking-[0.3em] mb-4 opacity-70 animate-fade-in">
          OPERATIVE_CONNECTED // IDENTITY_VERIFIED
        </h2>
        
        <h1 className="text-5xl md:text-8xl font-bold font-mono tracking-tighter text-white mb-6 relative">
          <span className="relative z-10">{PORTFOLIO_DATA.name}</span>
          <span className="absolute inset-0 text-primary/30 blur-sm select-none">{PORTFOLIO_DATA.name}</span>
        </h1>

        <div className="h-12 text-xl md:text-3xl font-mono text-secondary">
          <span className="text-glow-green">{"> "}</span>
          {displayedRole}
          <span className="animate-pulse">_</span>
        </div>

        <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center">
          <button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-primary/10 border border-primary text-primary font-mono text-sm tracking-widest hover:bg-primary hover:text-background transition-all duration-300 clickable"
          >
            [ ./view_projects.sh ]
          </button>
          <a 
            href="/resume.pdf" 
            download="Muhammad_Hammad_Raza_Resume.pdf"
            className="px-8 py-3 bg-transparent border border-accent/30 text-accent font-mono text-sm tracking-widest hover:border-primary hover:text-primary transition-all duration-300 clickable flex items-center justify-center"
          >
            [ ./download_resume.pdf ]
          </a>
        </div>

        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 flex gap-8">
          <div className="flex items-center gap-2 text-[10px] font-mono text-secondary">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            SYSTEMS ONLINE
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-primary">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            THREAT LEVEL: LOW
          </div>
        </div>
      </div>
    </section>
  );
};
