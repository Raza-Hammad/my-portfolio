import React, { useState, useEffect } from 'react';

const STATUS_MESSAGES: Record<string, string> = {
  hero: "OPERATIVE ONLINE",
  about: "PROFILE LOADING...",
  projects: "THREAT MODULES ACTIVE",
  skills: "ARSENAL DETECTED",
  education: "BACKGROUND CHECK...",
  achievements: "MISSION LOG UPDATING...",
  contact: "SECURE CHANNEL OPEN"
};

export const StatusBar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollY / height);

      const sections = ['hero', 'about', 'projects', 'skills', 'education', 'achievements', 'contact'];
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el && el.offsetTop <= scrollY + 200) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center select-none pointer-events-none">
      <div className="text-[9px] font-mono text-primary rotate-90 mb-12 w-48 text-center uppercase tracking-widest whitespace-nowrap">
        {STATUS_MESSAGES[activeSection] || "SYSTEM IDLE"}
      </div>
      
      <div className="h-64 w-[1px] bg-primary/20 relative">
        <div 
          className="absolute w-2 h-2 bg-primary top-0 -left-[3.5px] rounded-full shadow-[0_0_10px_rgba(0,212,255,1)] transition-all duration-300 ease-out"
          style={{ top: `${scrollProgress * 100}%` }}
        />
      </div>
      
      <div className="mt-8 flex flex-col gap-4">
        {Object.keys(STATUS_MESSAGES).map((id) => (
          <div 
            key={id}
            className={`w-1.5 h-1.5 rounded-full border border-primary/50 transition-all duration-300 ${activeSection === id ? 'bg-primary scale-125 shadow-[0_0_5px_rgba(0,212,255,1)]' : 'bg-transparent'}`}
          />
        ))}
      </div>
    </div>
  );
};
