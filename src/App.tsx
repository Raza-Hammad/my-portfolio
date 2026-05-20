import { useState, useEffect } from 'react';
import { BootSequence } from './components/BootSequence';
import { CustomCursor } from './components/CustomCursor';
import { StatusBar } from './components/StatusBar';
import { Navbar } from './components/Navbar';
import { Terminal } from './components/Terminal';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { ThreatSimulator } from './components/ThreatSimulator';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { Achievements } from './components/Achievements';
import { Contact } from './components/Contact';
import { DossierDecryption } from './components/DossierDecryption';
import { sound } from './lib/sound';

function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [glitchEnabled, setGlitchEnabled] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [decryptionOpen, setDecryptionOpen] = useState(false);


  // Intercept all resume download clicks to show Dossier Decryption game
  useEffect(() => {
    const handleDownloadClick = (e: MouseEvent) => {
      if (!e.isTrusted) return; // Allow programmatic trigger downloads
      
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href') === '/resume.pdf') {
        e.preventDefault();
        sound.playClick();
        setDecryptionOpen(true);
      }
    };
    window.addEventListener('click', handleDownloadClick);
    return () => window.removeEventListener('click', handleDownloadClick);
  }, []);

  // Keyboard shortcut to open/close terminal (Esc or `)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === 'Escape') {
        if (bootComplete) {
          e.preventDefault();
          sound.playClick();
          setTerminalOpen(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bootComplete]);

  // Adjust body classes for visual effects
  useEffect(() => {
    const body = document.body;
    if (glitchEnabled) {
      body.classList.remove('no-glitch');
    } else {
      body.classList.add('no-glitch');
    }
  }, [glitchEnabled]);

  return (
    <div className="min-h-screen bg-background text-accent relative transition-colors duration-500 overflow-x-hidden">
      {!bootComplete && (
        <BootSequence 
          onComplete={() => {
            setBootComplete(true);
            sound.playChime(); // Play high-fidelity access chime
          }} 
        />
      )}

      {bootComplete && (
        <>
          <CustomCursor />
          
          <Navbar 
            crtEnabled={crtEnabled}
            setCrtEnabled={setCrtEnabled}
            glitchEnabled={glitchEnabled}
            setGlitchEnabled={setGlitchEnabled}
            onOpenTerminal={() => setTerminalOpen(true)}
          />

          <Terminal 
            isOpen={terminalOpen}
            onClose={() => setTerminalOpen(false)}
          />

          <DossierDecryption 
            isOpen={decryptionOpen}
            onClose={() => setDecryptionOpen(false)}
          />

          <StatusBar />
          
          {/* Dynamic Global Scanline & CRT overlays */}
          {crtEnabled && (
            <>
              <div className="scanline" />
              <div className="crt-overlay" />
            </>
          )}
          
          <main className="relative z-10 pt-14">
            <Hero />
            <About />
            <Projects />
            <ThreatSimulator />
            <Skills />
            <Education />
            <Achievements />
            <Contact />
            
            <footer className="py-12 text-center font-mono text-[9px] text-primary/30 uppercase tracking-[0.5em] px-4 leading-loose border-t border-primary/5 max-w-5xl mx-auto">
              © 2026 Operative Hammad Raza // SECURE SECTOR // ALL RIGHTS RESERVED
            </footer>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
