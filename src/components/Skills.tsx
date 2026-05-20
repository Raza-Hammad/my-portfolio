import React, { useEffect, useRef } from 'react';
import { sound } from '../lib/sound';

const SKILL_CATEGORIES = [
  { name: "Frontend", level: 0.85 },
  { name: "Backend", level: 0.9 },
  { name: "AI/ML", level: 0.75 },
  { name: "Mobile", level: 0.65 },
  { name: "Security", level: 0.8 },
  { name: "Databases", level: 0.8 }
];

export const Skills: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const resize = () => {
      // Dynamic padding & sizing to prevent label clipping on mobile
      const size = Math.min(window.innerWidth - 32, 450);
      canvas.width = size;
      canvas.height = size;
    };

    const drawRadar = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      // Responsive padding: wider margin on small screens to fit labels
      const isSmall = canvas.width < 380;
      const padding = isSmall ? 65 : 48;
      const radius = canvas.width / 2 - padding;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Read CSS variable dynamically so canvas changes color with themes!
      const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#00ff88';

      // Background concentric circles
      ctx.strokeStyle = `color-mix(in srgb, ${secondaryColor} 12%, transparent)`;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Spoke Lines (Crosshairs)
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Draw spoke axes & labels with smart alignment to avoid borders
      SKILL_CATEGORIES.forEach((cat, i) => {
        const theta = (i / SKILL_CATEGORIES.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(theta) * radius;
        const y = cy + Math.sin(theta) * radius;

        // Axis line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `color-mix(in srgb, ${secondaryColor} 15%, transparent)`;
        ctx.stroke();

        // Label Alignment logic to prevent outer edge clipping
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        let labelX = cx + cos * (radius + (isSmall ? 10 : 15));
        let labelY = cy + sin * (radius + (isSmall ? 10 : 15));

        ctx.fillStyle = secondaryColor;
        ctx.font = 'bold 10px JetBrains Mono';
        
        // Smart horizontal alignment based on quadrant
        if (Math.abs(cos) < 0.1) {
          ctx.textAlign = 'center';
        } else if (cos > 0) {
          ctx.textAlign = 'left';
        } else {
          ctx.textAlign = 'right';
        }

        // Smart vertical alignment
        if (Math.abs(sin) < 0.1) {
          ctx.textBaseline = 'middle';
        } else if (sin > 0) {
          ctx.textBaseline = 'top';
        } else {
          ctx.textBaseline = 'bottom';
        }

        ctx.fillText(cat.name.toUpperCase(), labelX, labelY);
      });

      // Draw the core data shape representing proficiencies
      ctx.beginPath();
      SKILL_CATEGORIES.forEach((cat, i) => {
        const theta = (i / SKILL_CATEGORIES.length) * Math.PI * 2 - Math.PI / 2;
        const r = radius * cat.level;
        const x = cx + Math.cos(theta) * r;
        const y = cy + Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      
      // Semi-transparent overlay fill
      ctx.fillStyle = `color-mix(in srgb, ${secondaryColor} 20%, transparent)`;
      ctx.fill();
      
      // Solid outer bounding line
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sweeping radar scanning line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const sweepX = cx + Math.cos(angle) * radius;
      const sweepY = cy + Math.sin(angle) * radius;
      
      const gradient = ctx.createLinearGradient(cx, cy, sweepX, sweepY);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(1, `color-mix(in srgb, ${secondaryColor} 70%, transparent)`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      angle += 0.015; // smooth slow speed sweep
      animationFrameId = requestAnimationFrame(drawRadar);
    };

    window.addEventListener('resize', resize);
    resize();
    drawRadar();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="skills" className="min-h-screen py-24 px-6 md:px-24 flex flex-col items-center transition-colors duration-500">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-mono text-primary mb-16 flex items-center gap-4">
          <span className="opacity-50 text-base md:text-xl">03.</span> {"> "}ARSENAL_DETECTION
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 w-full">
          {/* Sweeping Radar Chart */}
          <div className="relative group shrink-0 flex items-center justify-center w-full lg:w-auto">
            <canvas ref={canvasRef} className="relative z-10" />
            <div className="absolute inset-8 bg-secondary/5 blur-3xl rounded-full -z-10 animate-pulse pointer-events-none" />
          </div>

          {/* Detailed Skill categories */}
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {SKILL_CATEGORIES.map((cat, i) => (
              <div 
                key={i} 
                className="bg-primary/5 border border-primary/20 p-5 md:p-6 relative overflow-hidden group border-pulse-glow"
                onMouseEnter={() => sound.playTyping()}
                onClick={() => sound.playClick()}
              >
                {/* Micro bracket decoration on corners */}
                <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-secondary/20 transition-all group-hover:border-secondary" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-secondary/20 transition-all group-hover:border-secondary" />

                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-secondary font-bold tracking-widest text-xs md:text-sm uppercase">
                    {cat.name}
                  </span>
                  <span className="font-mono text-[9px] md:text-xs text-primary/60 tracking-wider">
                    PROXIMITY: {(cat.level * 100).toFixed(0)}%
                  </span>
                </div>
                
                {/* high tech loading bar */}
                <div className="h-1.5 bg-primary/10 w-full relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-secondary transition-all duration-1000 ease-out"
                    style={{ width: `${cat.level * 100}%` }}
                  />
                  {/* pulse effect on progress loading */}
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_30%,rgba(255,255,255,0.25)_50%,transparent_70%)] animate-scanline pointer-events-none" style={{ animationDuration: '2.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
