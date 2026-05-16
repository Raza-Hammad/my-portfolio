import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data';

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="min-h-screen py-24 px-8 md:px-24 flex flex-col items-center bg-background/50">
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-mono text-primary mb-16 flex items-center gap-4">
          <span className="opacity-50 text-xl">02.</span> {"> "}ACTIVE_MODULES/
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div 
      className="group relative h-80 perspective-1000 clickable"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="relative w-full h-full bg-primary/5 border border-primary/20 p-6 transition-all duration-200 ease-out preserve-3d group-hover:border-primary group-hover:bg-primary/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        style={{ transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
      >
        {/* Holographic lines */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 pointer-events-none overflow-hidden transition-opacity">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-primary animate-scanline" />
          <div className="w-full h-full grid grid-cols-8 grid-rows-8 border-primary/20 border-t border-l">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border-r border-b border-primary/20" />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono text-primary/50 tracking-widest bg-primary/10 px-2 py-1">
              [{project.id}]
            </span>
            <div className={`text-[10px] font-mono px-2 py-1 ${
              project.complexity === 'CRITICAL' ? 'text-warning border border-warning/50' : 
              project.complexity === 'HIGH' ? 'text-primary border border-primary/50' : 'text-secondary border border-secondary/50'
            }`}>
              COMPLEXITY: {project.complexity}
            </div>
          </div>

          <h3 className="text-xl font-bold font-mono text-white mb-2 group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          
          <p className="text-sm text-accent/70 font-sans mb-6 line-clamp-3">
            {project.description}
          </p>

          <div className="mt-auto flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <span key={tag} className="text-[10px] font-mono text-secondary">
                --{tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <a href={project.link} className="text-xs font-mono text-primary flex items-center gap-2 group/link">
              {"> "}VIEW_SOURCE
              <span className="w-0 group-hover/link:w-4 h-[1px] bg-primary transition-all" />
            </a>
          </div>
        </div>

        {/* 3D Glow effect */}
        <div 
          className="absolute -inset-1 opacity-0 group-hover:opacity-100 blur-xl transition-opacity pointer-events-none"
          style={{ 
            background: `radial-gradient(circle at ${50 + rotate.y * 2}% ${50 - rotate.x * 2}%, rgba(0,212,255,0.2) 0%, transparent 70%)` 
          }}
        />
      </div>
    </div>
  );
};
