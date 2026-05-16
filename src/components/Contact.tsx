import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 2000);
  };

  return (
    <section id="contact" className="min-h-screen py-24 px-8 md:px-24 flex flex-col items-center bg-background/50">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-mono text-primary mb-16 flex items-center gap-4">
          <span className="opacity-50 text-xl">06.</span> {"> "}ESTABLISH_CONNECTION/
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Social Links */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <a href="#" className="p-6 bg-primary/5 border border-primary/20 hover:border-primary transition-all flex items-center justify-between group clickable">
              <span className="font-mono text-sm">GITHUB</span>
              <span className="text-primary group-hover:translate-x-2 transition-transform">→</span>
            </a>
            <a href="#" className="p-6 bg-primary/5 border border-primary/20 hover:border-primary transition-all flex items-center justify-between group clickable">
              <span className="font-mono text-sm">LINKEDIN</span>
              <span className="text-primary group-hover:translate-x-2 transition-transform">→</span>
            </a>
            <a href="#" className="p-6 bg-primary/5 border border-primary/20 hover:border-primary transition-all flex items-center justify-between group clickable">
              <span className="font-mono text-sm">EMAIL</span>
              <span className="text-primary group-hover:translate-x-2 transition-transform">→</span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="flex-grow bg-[#0c0e14] border border-primary/20 p-8 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
            <div className="flex items-center gap-2 mb-8 font-mono text-xs text-primary/50">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <div className="w-2 h-2 rounded-full bg-secondary/50" />
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              <span className="ml-4 uppercase">Secure Terminal v2.4.0</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-mono text-xs text-secondary uppercase">Enter Name :</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-primary/30 py-2 font-mono text-primary focus:outline-none focus:border-primary transition-all"
                  placeholder="..."
                />
              </div>
              <div className="space-y-2">
                <label className="block font-mono text-xs text-secondary uppercase">Enter Email :</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-primary/30 py-2 font-mono text-primary focus:outline-none focus:border-primary transition-all"
                  placeholder="..."
                />
              </div>
              <div className="space-y-2">
                <label className="block font-mono text-xs text-secondary uppercase">Enter Message :</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-transparent border-b border-primary/30 py-2 font-mono text-primary focus:outline-none focus:border-primary transition-all resize-none"
                  placeholder="..."
                />
              </div>

              <button 
                type="submit" 
                disabled={status !== 'idle'}
                className="w-full py-4 bg-primary/10 border border-primary text-primary font-mono text-sm uppercase tracking-widest hover:bg-primary hover:text-background transition-all disabled:opacity-50 clickable"
              >
                {status === 'idle' ? '[ TRANSMIT_MESSAGE.sh ]' : 
                 status === 'sending' ? 'ENCRYPTING & SENDING...' : '✓ MESSAGE DELIVERED'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
