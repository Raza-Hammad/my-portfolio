import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { sound } from '../lib/sound';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    // Play retro dialup/datastream synthesizer sound during simulated encryption
    sound.playDataStream();
    
    setTimeout(() => {
      setStatus('sent');
      // Play satisfying success chime
      sound.playChime();
      
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 2000);
  };

  return (
    <section id="contact" className="min-h-screen py-24 px-6 md:px-24 flex flex-col items-center bg-[#07090f]/40 transition-colors duration-500">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-mono text-primary mb-16 flex items-center gap-4">
          <span className="opacity-50 text-base md:text-xl">06.</span> {"> "}ESTABLISH_CONNECTION/
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Social Channels panel */}
          <div className="w-full lg:w-1/3 flex flex-col gap-5 md:gap-6">
            <a 
              href={PORTFOLIO_DATA.socials.github} 
              target="_blank" 
              rel="noopener noreferrer"
              onMouseEnter={() => sound.playTyping()}
              onClick={() => sound.playClick()}
              className="p-5 md:p-6 bg-primary/5 border border-primary/20 hover:border-primary transition-all flex items-center justify-between group clickable border-pulse-glow"
            >
              <span className="font-mono text-xs md:text-sm font-bold tracking-widest text-white group-hover:text-primary">GITHUB</span>
              <span className="text-primary group-hover:translate-x-2 transition-transform duration-300">→</span>
            </a>
            <a 
              href={PORTFOLIO_DATA.socials.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              onMouseEnter={() => sound.playTyping()}
              onClick={() => sound.playClick()}
              className="p-5 md:p-6 bg-primary/5 border border-primary/20 hover:border-primary transition-all flex items-center justify-between group clickable border-pulse-glow"
              style={{ animationDelay: '0.7s' }}
            >
              <span className="font-mono text-xs md:text-sm font-bold tracking-widest text-white group-hover:text-primary">LINKEDIN</span>
              <span className="text-primary group-hover:translate-x-2 transition-transform duration-300">→</span>
            </a>
            <a 
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${PORTFOLIO_DATA.socials.email}`}
              target="_blank" 
              rel="noopener noreferrer"
              onMouseEnter={() => sound.playTyping()}
              onClick={() => sound.playClick()}
              className="p-5 md:p-6 bg-primary/5 border border-primary/20 hover:border-primary transition-all flex items-center justify-between group clickable border-pulse-glow"
              style={{ animationDelay: '1.4s' }}
            >
              <span className="font-mono text-xs md:text-sm font-bold tracking-widest text-white group-hover:text-primary">EMAIL</span>
              <span className="text-primary group-hover:translate-x-2 transition-transform duration-300">→</span>
            </a>
          </div>

          {/* Secure Terminal Contact Form */}
          <div className="flex-grow bg-[#0c0e14] border border-primary/20 p-6 md:p-8 relative border-pulse-glow">
            {/* Gridlines back */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,212,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,212,255,0.005)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

            <div className="absolute top-0 left-0 w-full h-1 bg-primary/25" />
            <div className="flex items-center gap-2 mb-8 font-mono text-[9px] md:text-xs text-primary/60 relative z-10 select-none">
              <div className="w-2.5 h-2.5 rounded-full bg-warning cursor-pointer" onClick={() => sound.playBeep()} />
              <div className="w-2.5 h-2.5 rounded-full bg-secondary/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
              <span className="ml-4 uppercase tracking-widest font-semibold">Secure Terminal v3.2.0</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block font-mono text-[10px] md:text-xs text-secondary uppercase tracking-widest font-bold">Enter Name :</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => {
                    setFormData({ ...formData, name: e.target.value });
                    sound.playTyping();
                  }}
                  className="w-full bg-transparent border-b border-primary/30 py-2 font-mono text-primary focus:outline-none focus:border-primary transition-all text-xs"
                  placeholder="..."
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-mono text-[10px] md:text-xs text-secondary uppercase tracking-widest font-bold">Enter Email :</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => {
                    setFormData({ ...formData, email: e.target.value });
                    sound.playTyping();
                  }}
                  className="w-full bg-transparent border-b border-primary/30 py-2 font-mono text-primary focus:outline-none focus:border-primary transition-all text-xs"
                  placeholder="..."
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-mono text-[10px] md:text-xs text-secondary uppercase tracking-widest font-bold">Enter Message :</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={e => {
                    setFormData({ ...formData, message: e.target.value });
                    sound.playTyping();
                  }}
                  rows={4}
                  className="w-full bg-transparent border-b border-primary/30 py-2 font-mono text-primary focus:outline-none focus:border-primary transition-all resize-none text-xs leading-relaxed"
                  placeholder="..."
                />
              </div>

              <button 
                type="submit" 
                disabled={status !== 'idle'}
                onMouseEnter={() => sound.playTyping()}
                className="w-full py-4 bg-primary/10 border border-primary text-primary font-mono text-xs uppercase tracking-widest hover:bg-primary hover:text-background transition-all disabled:opacity-50 clickable font-bold rounded-sm border-pulse-glow"
              >
                {status === 'idle' ? '[ TRANSMIT_MESSAGE.sh ]' : 
                 status === 'sending' ? 'ENCRYPTING & SENDING...' : '✓ MESSAGE TRANSMITTED'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
