import React from 'react';
import { PORTFOLIO_DATA } from '../data';

export const Education: React.FC = () => {
  return (
    <section id="education" className="min-h-screen py-24 px-8 md:px-24 flex flex-col items-center bg-background/50">
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-mono text-primary mb-16 flex items-center gap-4">
          <span className="opacity-50 text-xl">04.</span> {"> "}CLEARANCE_RECORDS
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        <div className="space-y-12">
          {PORTFOLIO_DATA.education.map((edu, i) => (
            <div key={i} className="relative pl-12 border-l-2 border-primary/20 py-4 group">
              <div className="absolute left-[-9px] top-6 w-4 h-4 bg-background border-2 border-primary rounded-full group-hover:scale-125 transition-transform" />
              
              <div className="bg-primary/5 border border-primary/10 p-8 rounded-sm hover:border-primary/40 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-mono text-white group-hover:text-primary transition-colors">
                      {edu.institution}
                    </h3>
                    <p className="text-primary font-mono text-sm">{edu.degree}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-primary/20 text-primary px-3 py-1 text-xs font-mono rounded-full">
                      {edu.period}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <div className="flex-grow h-2 bg-primary/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary animate-pulse" 
                      style={{ width: `${(parseFloat(edu.cgpa) / 4) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-primary">CGPA: {edu.cgpa}/4.0</span>
                </div>

                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  <div className="border-2 border-secondary text-secondary font-bold px-4 py-1 rotate-12 uppercase text-xs tracking-widest">
                    Verified
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
