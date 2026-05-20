import React from 'react';
import { PORTFOLIO_DATA } from '../data';
import { sound } from '../lib/sound';

export const Education: React.FC = () => {
  return (
    <section id="education" className="min-h-screen py-24 px-6 md:px-24 flex flex-col items-center bg-[#07090f]/40 transition-colors duration-500">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-mono text-primary mb-16 flex items-center gap-4">
          <span className="opacity-50 text-base md:text-xl">05.</span> {"> "}CLEARANCE_RECORDS
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        <div className="space-y-12">
          {PORTFOLIO_DATA.education.map((edu, i) => (
            <div key={i} className="relative pl-8 md:pl-12 border-l-2 border-primary/20 py-4 group select-none">
              {/* Dynamic blinking timeline node */}
              <div className="absolute left-[-9px] top-6 w-4 h-4 bg-[#07090f] border-2 border-primary rounded-full group-hover:scale-125 group-hover:border-secondary transition-all" />
              
              <div 
                className="bg-primary/5 border border-primary/10 p-6 md:p-8 rounded-sm hover:border-primary/45 hover:bg-primary/10 transition-all border-pulse-glow"
                onMouseEnter={() => sound.playTyping()}
                onClick={() => sound.playClick()}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold font-mono text-white group-hover:text-primary transition-colors leading-tight">
                      {edu.institution}
                    </h3>
                    <p className="text-primary font-mono text-xs md:text-sm mt-1">{edu.degree}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="bg-primary/20 text-primary px-3.5 py-1 text-[10px] md:text-xs font-mono rounded-full border border-primary/10">
                      {edu.period}
                    </span>
                  </div>
                </div>

                {/* Progress bar tracking CGPA completion ratio */}
                {('cgpa' in edu) && edu.cgpa && (
                  <div className="flex items-center gap-4 mt-6">
                    <div className="flex-grow h-2 bg-primary/10 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-primary animate-pulse" 
                        style={{ width: `${(parseFloat(edu.cgpa as string) / 4) * 100}%` }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)] animate-scanline pointer-events-none" style={{ animationDuration: '3s' }} />
                    </div>
                    <span className="font-mono text-xs text-primary font-bold">CGPA: {edu.cgpa}/4.0</span>
                  </div>
                )}

                {/* Grade display stamp for school board metrics */}
                {('grade' in edu) && edu.grade && (
                  <div className="flex items-center gap-4 mt-6 font-mono text-xs w-full">
                    <div className="flex-grow h-[1px] bg-primary/15" />
                    <span className="text-secondary font-bold uppercase tracking-widest bg-secondary/5 border border-secondary/20 px-3 py-1 rounded-sm shadow-[0_0_8px_rgba(0,255,136,0.1)]">
                      RECORD_GRADE: {edu.grade}
                    </span>
                    <div className="flex-grow h-[1px] bg-primary/15" />
                  </div>
                )}

                {/* Cyber badge stamp on card hover */}
                <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-100 transition-all duration-500 scale-75 md:scale-100 select-none pointer-events-none">
                  <div className="border border-dashed border-secondary text-secondary font-bold px-4 py-1 rotate-12 uppercase text-[9px] tracking-[0.25em]">
                    VERIFIED // OK
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
