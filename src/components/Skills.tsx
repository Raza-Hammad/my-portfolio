import React, { useEffect, useRef } from 'react';

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
      const size = Math.min(window.innerWidth - 48, 500);
      canvas.width = size;
      canvas.height = size;
    };

    const drawRadar = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = canvas.width / 2 - 40;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grid
      ctx.strokeStyle = '#00ff8822';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Axis & Labels
      SKILL_CATEGORIES.forEach((cat, i) => {
        const theta = (i / SKILL_CATEGORIES.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(theta) * radius;
        const y = cy + Math.sin(theta) * radius;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = '#00ff88';
        ctx.font = '10px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(cat.name, cx + Math.cos(theta) * (radius + 20), cy + Math.sin(theta) * (radius + 20));
      });

      // Data Shape
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
      ctx.fillStyle = '#00ff8833';
      ctx.fill();
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sweeping line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const sweepX = cx + Math.cos(angle) * radius;
      const sweepY = cy + Math.sin(angle) * radius;
      const gradient = ctx.createLinearGradient(cx, cy, sweepX, sweepY);
      gradient.addColorStop(0, '#00ff8800');
      gradient.addColorStop(1, '#00ff88aa');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      angle += 0.02;
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
    <section id="skills" className="min-h-screen py-24 px-8 md:px-24 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-mono text-primary mb-16 flex items-center gap-4">
          <span className="opacity-50 text-xl">03.</span> {"> "}ARSENAL_DETECTION
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="relative group">
            <canvas ref={canvasRef} className="relative z-10" />
            <div className="absolute inset-0 bg-secondary/5 blur-3xl rounded-full -z-10 animate-pulse" />
          </div>

          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {SKILL_CATEGORIES.map((cat, i) => (
              <div key={i} className="bg-primary/5 border border-primary/20 p-6 relative overflow-hidden group">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-secondary">{cat.name}</span>
                  <span className="font-mono text-xs opacity-50">PROXIMITY: {(cat.level * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1 bg-primary/10 w-full relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-secondary transition-all duration-1000 ease-out"
                    style={{ width: `${cat.level * 100}%` }}
                  />
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-secondary/20 transition-all group-hover:border-secondary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
