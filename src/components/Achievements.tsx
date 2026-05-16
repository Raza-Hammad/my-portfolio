import React from 'react';
import { PORTFOLIO_DATA } from '../data';

export const Achievements: React.FC = () => {
  return (
    <section id="achievements" className="min-h-screen py-24 px-8 md:px-24 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-mono text-primary mb-16 flex items-center gap-4">
          <span className="opacity-50 text-xl">05.</span> {"> "}MISSION_LOG
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {PORTFOLIO_DATA.achievements.map((ach, i) => (
            <div 
              key={i} 
              className="bg-primary/5 border border-primary/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-primary/10 hover:border-primary/30 transition-all relative overflow-hidden"
            >
              <div className="flex items-center gap-8 w-full md:w-auto">
                <div className="font-mono text-primary/50 text-lg">[{ach.year}]</div>
                <div className="flex-grow">
                  <div className="text-[10px] font-mono text-secondary mb-1">OPERATION:</div>
                  <div className="text-xl font-bold font-mono text-white group-hover:text-primary transition-colors uppercase">
                    {ach.mission}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                <div className="h-[1px] w-12 bg-primary/20 hidden md:block" />
                <div className="px-4 py-2 border border-secondary/50 text-secondary font-mono text-xs uppercase tracking-tighter bg-secondary/5">
                  STATUS: {ach.status}
                </div>
              </div>

              {/* Holographic "Stamp" effect on hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity flex items-center justify-center">
                <div className="text-9xl font-bold font-mono text-primary -rotate-12 select-none">
                  COMPLETED
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
