import React, { useState, useEffect } from 'react';

const BOOT_LINES = [
  "INITIALIZING SECURE CONNECTION...",
  "LOADING OPERATIVE PROFILE: HAMMAD RAZA...",
  "SKILL MODULES DETECTED: FULL-STACK, AI, CYBERSECURITY...",
  "BYPASSING FIREWALLS...",
  "DECRYPTING DATABASE...",
  "ACCESS GRANTED ██████████ 100%"
];

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isDissolving, setIsDissolving] = useState(false);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsDissolving(true);
          setTimeout(onComplete, 800);
        }, 1000);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[10000] bg-background flex flex-col items-start justify-center p-8 md:p-24 font-mono transition-all duration-700 ${isDissolving ? 'opacity-0 scale-110 blur-xl pointer-events-none' : 'opacity-100'}`}>
      <div className="max-w-3xl">
        {lines.map((line, i) => (
          <div key={i} className={`text-primary text-sm md:text-lg mb-2 ${i === lines.length - 1 ? 'text-glow-cyan' : ''}`}>
            <span className="mr-4 opacity-50">[{new Date().toLocaleTimeString()}]</span>
            {line}
          </div>
        ))}
        <div className="w-full h-1 bg-primary/10 mt-8 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
            style={{ width: `${(lines.length / BOOT_LINES.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Glitch Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scanline" />
      </div>
    </div>
  );
};
