import React from 'react';
import { PORTFOLIO_DATA } from '../data';

export const About: React.FC = () => {
  return (
    <section id="about" className="min-h-screen py-24 px-8 md:px-24 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-mono text-primary mb-12 flex items-center gap-4">
          <span className="opacity-50 text-xl">01.</span> {"> "}OPERATIVE_PROFILE
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        {/* Dossier Card */}
        <div className="bg-primary/5 border border-primary/20 p-8 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-primary/30 uppercase tracking-widest">
            Classified // Level 4 Clearance
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            {/* Profile Frame */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <div className="absolute inset-0 border border-primary/50 animate-spin-slow" />
              <div className="absolute -inset-2 border border-primary/20 animate-spin-slow [animation-direction:reverse]" />
              <div className="w-full h-full border-2 border-primary bg-background flex items-center justify-center text-5xl font-bold text-primary relative z-10">
                HR
                {/* Scanline overlay on photo area */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-scanline pointer-events-none" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-primary" />
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-primary" />
            </div>

            {/* Dossier Details */}
            <div className="flex-grow font-mono text-sm md:text-base space-y-4">
              {Object.entries(PORTFOLIO_DATA.about).map(([key, value]) => (
                <div key={key} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 border-b border-primary/10 pb-2 group/item">
                  <span className="text-primary/50 w-32 uppercase text-xs md:text-sm">{key}</span>
                  <span className="text-white group-hover/item:text-primary transition-colors">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Matrix (Hex Grid) */}
        <div className="mt-24">
          <h3 className="text-xl font-mono text-secondary mb-12 flex items-center gap-4">
            {"> "}SKILLS_MATRIX
          </h3>
          
          <div className="flex flex-wrap justify-center gap-6">
            {PORTFOLIO_DATA.skills.map((skill, i) => (
              <div 
                key={i} 
                className="relative w-24 h-28 group perspective-1000 clickable"
              >
                <div className="absolute inset-0 transition-transform duration-500 preserve-3d group-hover:rotate-y-180">
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-primary/5 border border-primary/20 flex flex-col items-center justify-center p-2 clip-hex transition-all group-hover:border-primary">
                    <div className="text-primary font-bold text-xs mb-1">{skill.icon}</div>
                    <div className="text-[10px] text-center uppercase tracking-tighter">{skill.name}</div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden bg-primary border border-primary flex items-center justify-center rotate-y-180 clip-hex">
                    <div className="text-background font-bold text-lg">{skill.level}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .clip-hex {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </section>
  );
};
