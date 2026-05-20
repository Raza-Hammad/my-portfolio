import React from 'react';
import { PORTFOLIO_DATA } from '../data';
import { sound } from '../lib/sound';

export const Achievements: React.FC = () => {
  return (
    <section id="achievements" className="min-h-screen py-24 px-6 md:px-24 flex flex-col items-center transition-colors duration-500">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-mono text-primary mb-16 flex items-center gap-4">
          <span className="opacity-50 text-base md:text-xl">06.</span> {"> "}MISSION_LOG
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {PORTFOLIO_DATA.achievements.map((ach, i) => (
            <div 
              key={i} 
              onMouseEnter={() => sound.playTyping()}
              onClick={() => sound.playClick()}
              className="bg-primary/5 border border-primary/10 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:bg-primary/10 hover:border-primary/35 transition-all relative overflow-hidden select-none border-pulse-glow"
            >
              {/* Graphic scanlines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,212,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,212,255,0.005)_1px,transparent_1px)] bg-[size:1rem_1rem] pointer-events-none" />

              <div className="flex items-center gap-6 md:gap-8 w-full md:w-auto relative z-10">
                <div className="font-mono text-primary/50 text-base md:text-lg font-bold shrink-0">[{ach.year}]</div>
                <div className="flex-grow">
                  <div className="text-[8px] font-mono text-secondary mb-1 tracking-widest font-bold">OPERATION:</div>
                  <div className="text-lg md:text-xl font-bold font-mono text-white group-hover:text-primary transition-colors uppercase leading-tight">
                    {ach.mission}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-end relative z-10">
                <div className="h-[1px] w-12 bg-primary/20 hidden md:block" />
                <div className="px-4 py-2 border border-secondary/50 text-secondary font-mono text-[10px] md:text-xs uppercase tracking-widest bg-secondary/5 font-bold rounded-sm shadow-[0_0_10px_rgba(0,255,136,0.05)]">
                  STATUS: {ach.status}
                </div>
              </div>

              {/* Holographic Watermark on card hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.035] transition-opacity duration-300 flex items-center justify-center select-none z-0">
                <div className="text-6xl md:text-8xl font-black font-mono text-primary -rotate-12 select-none tracking-widest">
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
