import { useState } from 'react';
import { BootSequence } from './components/BootSequence';
import { CustomCursor } from './components/CustomCursor';
import { StatusBar } from './components/StatusBar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { Achievements } from './components/Achievements';
import { Contact } from './components/Contact';

function App() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <div className="min-h-screen bg-background text-accent relative">
      {!bootComplete && (
        <BootSequence onComplete={() => setBootComplete(true)} />
      )}

      {bootComplete && (
        <>
          <CustomCursor />
          <StatusBar />
          
          {/* Global Overlays */}
          <div className="scanline" />
          <div className="crt-overlay" />
          
          <main className="relative z-10">
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Education />
            <Achievements />
            <Contact />
            
            <footer className="py-12 text-center font-mono text-[10px] text-primary/30 uppercase tracking-[0.5em]">
              © 2026 Operative Hammad Raza // All Rights Reserved
            </footer>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
