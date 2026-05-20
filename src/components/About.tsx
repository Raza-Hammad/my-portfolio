import React from 'react';
import { PORTFOLIO_DATA } from '../data';
import { sound } from '../lib/sound';

export const About: React.FC = () => {
  return (
    <section id="about" className="min-h-screen py-24 px-6 md:px-24 flex flex-col items-center transition-colors duration-500">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-mono text-primary mb-12 flex items-center gap-4">
          <span className="opacity-50 text-base md:text-xl">01.</span> {"> "}OPERATIVE_PROFILE
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        {/* Dossier Card */}
        <div className="bg-primary/5 border border-primary/20 p-6 md:p-8 rounded-sm relative overflow-hidden group border-pulse-glow">
          {/* Diagnostic Grid Gridlines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,212,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,212,255,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />
          
          <div className="absolute top-0 right-0 p-4 font-mono text-[8px] md:text-[10px] text-primary/30 uppercase tracking-widest select-none">
            CLASSIFIED // LEVEL 4 CLEARANCE
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start relative z-10">
            {/* Profile Photo Frame */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
              {/* Spinning high-tech rings */}
              <div className="absolute inset-0 border border-dashed border-primary/40 animate-spin-slow" />
              <div className="absolute -inset-2 border border-dotted border-primary/20 animate-spin-slow [animation-direction:reverse]" style={{ animationDuration: '20s' }} />
              
              <div className="w-full h-full border-2 border-primary bg-[#07090f] flex items-center justify-center relative z-10 overflow-hidden">
                <img 
                  src="/MHR.jpeg" 
                  alt="Muhammad Hammad Raza" 
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                {/* Scanline sweeping photo area */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/15 to-transparent animate-scanline pointer-events-none" />
              </div>
              <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b border-l-2 border-primary" />
              <div className="absolute -top-3 -right-3 w-10 h-10 border-t border-r-2 border-primary" />
            </div>

            {/* Dossier Details */}
            <div className="w-full flex-grow font-mono text-xs md:text-sm space-y-3.5">
              {Object.entries(PORTFOLIO_DATA.about).map(([key, value]) => (
                <div 
                  key={key} 
                  onMouseEnter={() => sound.playTyping()}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-6 border-b border-primary/10 pb-2 group/item hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-secondary font-bold select-none">&gt;</span>
                    <span className="text-primary/50 uppercase text-[10px] md:text-xs tracking-wider">{key.replace('_', ' ')}</span>
                  </div>
                  <span className="text-white group-hover/item:text-primary transition-colors text-right break-words max-w-[280px] sm:max-w-md">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Matrix (Hex Grid) */}
        <div className="mt-24">
          <h3 className="text-lg md:text-xl font-mono text-secondary mb-12 flex items-center gap-4">
            {"> "}SKILLS_MATRIX
          </h3>
          
          <div className="flex flex-wrap justify-center gap-5 md:gap-7">
            {PORTFOLIO_DATA.skills.map((skill, i) => (
              <div 
                key={i} 
                className="relative w-20 h-24 md:w-24 md:h-28 group perspective-1000 clickable"
                onMouseEnter={() => {
                  sound.playTyping();
                }}
                onClick={() => sound.playClick()}
              >
                <div className="absolute inset-0 transition-transform duration-500 preserve-3d group-hover:rotate-y-180">
                  
                  {/* Front Side */}
                  <div className="absolute inset-0 backface-hidden bg-primary/5 border border-primary/20 flex flex-col items-center justify-center p-2 clip-hex transition-all group-hover:border-primary group-hover:bg-primary/10">
                    <div className="text-primary font-bold text-[10px] md:text-xs mb-1 select-none font-mono tracking-widest">{skill.icon}</div>
                    <div className="text-[8px] md:text-[9px] text-center text-accent/80 uppercase tracking-tighter truncate w-full px-1">{skill.name}</div>
                  </div>
                  
                  {/* Back Side */}
                  <div className="absolute inset-0 backface-hidden bg-primary border border-primary flex flex-col items-center justify-center rotate-y-180 clip-hex shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                    <div className="text-background font-bold text-base md:text-lg tracking-tighter">{skill.level}%</div>
                    <div className="text-background font-mono text-[7px] tracking-widest font-bold">READY</div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
