import React, { useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { sound } from '../lib/sound';

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="min-h-screen py-24 px-6 md:px-24 flex flex-col items-center bg-[#07090f]/40 transition-colors duration-500">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-mono text-primary mb-16 flex items-center gap-4">
          <span className="opacity-50 text-base md:text-xl">03.</span> {"> "}ACTIVE_MODULES/
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {PORTFOLIO_DATA.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard: React.FC<{ project: any }> = ({ project }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Check if coarse pointer (touch screen) to safely disable tilt stuck bugs
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches || ('ontouchstart' in window);
    setIsTouchDevice(isTouch);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return; // Do not apply 3D tilt on touch devices
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 8; // enhanced tilt responsiveness
    const rotateY = (centerX - x) / 8;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const getComplexityClass = (complexity: string) => {
    switch (complexity) {
      case 'CRITICAL':
        return 'text-warning border border-warning/40 bg-warning/5 shadow-[0_0_10px_rgba(255,77,109,0.15)]';
      case 'HIGH':
        return 'text-primary border border-primary/40 bg-primary/5 shadow-[0_0_10px_rgba(0,212,255,0.15)]';
      default:
        return 'text-secondary border border-secondary/40 bg-secondary/5 shadow-[0_0_10px_rgba(0,255,136,0.15)]';
    }
  };

  return (
    <div 
      className="group relative h-80 perspective-1000 clickable select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => {
        sound.playTyping();
      }}
    >
      <div 
        className="relative w-full h-full bg-primary/5 border border-primary/20 p-6 transition-all duration-300 ease-out preserve-3d group-hover:border-primary/50 group-hover:bg-primary/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-pulse-glow"
        style={{ transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
      >
        {/* Holographic matrix background lines on card hover */}
        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] pointer-events-none overflow-hidden transition-opacity duration-300 z-0">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-primary animate-scanline" />
          <div className="w-full h-full grid grid-cols-6 grid-rows-6 border-primary/20 border-t border-l">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border-r border-b border-primary/20" />
            ))}
          </div>
        </div>

        {/* Content panel */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[9px] font-mono text-primary/50 tracking-wider bg-primary/10 px-2 py-0.5 border border-primary/10 rounded-sm">
              [{project.id}]
            </span>
            <div className={`text-[8px] font-mono px-2 py-0.5 rounded-sm tracking-wider font-bold ${getComplexityClass(project.complexity)}`}>
              COMPLEXITY: {project.complexity}
            </div>
          </div>

          <h3 className="text-lg md:text-xl font-bold font-mono text-white mb-2.5 group-hover:text-primary transition-colors duration-300 leading-tight">
            {project.name}
          </h3>
          
          <p className="text-xs md:text-sm text-accent/70 font-sans mb-6 line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1">
            {project.tags.map((tag: string) => (
              <span key={tag} className="text-[9px] font-mono text-secondary tracking-widest font-semibold uppercase">
                --{tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              onMouseEnter={() => sound.playBeep()}
              className="text-[10px] font-mono text-primary flex items-center gap-1.5 group/link tracking-widest font-bold"
            >
              {"> "}VIEW_SOURCE
              <span className="w-0 group-hover/link:w-4 h-[1px] bg-primary transition-all duration-300" />
            </a>
          </div>
        </div>

        {/* 3D dynamic radial glow backing */}
        {!isTouchDevice && (
          <div 
            className="absolute -inset-1 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 pointer-events-none"
            style={{ 
              background: `radial-gradient(circle at ${50 + rotate.y * 2}% ${50 - rotate.x * 2}%, color-mix(in srgb, var(--primary) 20%, transparent) 0%, transparent 65%)` 
            }}
          />
        )}
      </div>
    </div>
  );
};
