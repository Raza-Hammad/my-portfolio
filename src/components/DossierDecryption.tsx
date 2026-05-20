import React, { useState, useEffect } from 'react';
import { sound } from '../lib/sound';

interface DossierDecryptionProps {
  isOpen: boolean;
  onClose: () => void;
}

const HEX_POOL = ['0xAE', '0x5D', '0xF2', '0x8B', '0x1C', '0xC4', '0x7E', '0x3D', '0x9A', '0x6F', '0x2B', '0xE0'];

export const DossierDecryption: React.FC<DossierDecryptionProps> = ({ isOpen, onClose }) => {
  const [grid, setGrid] = useState<string[]>([]);
  const [targetSequence, setTargetSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'hacking' | 'success' | 'failed'>('idle');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [securityLevel, setSecurityLevel] = useState(10);

  // Initialize mini-game
  const initGame = () => {
    // Generate a 4x3 grid of random hex codes
    const newGrid: string[] = [];
    for (let i = 0; i < 12; i++) {
      const randomHex = HEX_POOL[Math.floor(Math.random() * HEX_POOL.length)];
      newGrid.push(randomHex);
    }
    setGrid(newGrid);

    // Pick 3 unique targets for sequence
    const uniqueHexes = Array.from(new Set(newGrid));
    const newTarget: string[] = [];
    while (newTarget.length < 3 && uniqueHexes.length >= 3) {
      const candidate = uniqueHexes[Math.floor(Math.random() * uniqueHexes.length)];
      if (!newTarget.includes(candidate)) {
        newTarget.push(candidate);
      }
    }
    // Fallback in case unique hex count is low
    if (newTarget.length < 3) {
      newTarget.push('0xAE', '0x5D', '0xF2');
    }

    setTargetSequence(newTarget);
    setPlayerSequence([]);
    setGameState('hacking');
    setAttemptsLeft(3);
    setSecurityLevel(10);
    sound.playBeep();
  };

  useEffect(() => {
    if (isOpen) {
      initGame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleHexClick = (hex: string) => {
    if (gameState !== 'hacking') return;

    sound.playClick();
    const nextPlayerSeq = [...playerSequence, hex];
    setPlayerSequence(nextPlayerSeq);

    // Check if player click matches the next target
    const currentStep = playerSequence.length;
    if (hex !== targetSequence[currentStep]) {
      // Failed attempt
      sound.playBeep(); // Alert sound
      setAttemptsLeft(prev => {
        const nextAttempts = prev - 1;
        if (nextAttempts <= 0) {
          setGameState('failed');
          sound.playBeep();
        } else {
          // Reset current sequence progression on error
          setPlayerSequence([]);
          setSecurityLevel(prevSec => Math.min(100, prevSec + 30));
        }
        return nextAttempts;
      });
      return;
    }

    // Check if game won
    if (nextPlayerSeq.length === targetSequence.length) {
      setGameState('success');
      sound.playChime();
      triggerDownload();
    }
  };

  const triggerDownload = () => {
    sound.playDataStream();
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Muhammad_Hammad_Raza_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBypass = () => {
    sound.playClick();
    triggerDownload();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10005] bg-[#07090f]/98 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-mono text-xs">
      {/* HUD Scanner lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scanline pointer-events-none" />
      
      {/* Main Terminal Frame */}
      <div className="w-full max-w-lg bg-[#0d121f]/95 border border-primary/45 p-6 md:p-8 rounded-sm relative shadow-[0_0_50px_rgba(0,212,255,0.25)] border-pulse-glow">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-primary/20 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-warning animate-pulse" />
            <span className="text-[10px] uppercase text-primary/70 tracking-widest font-semibold">
              MAINFRAME // DOSSIER_BYPASS
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="text-primary/60 hover:text-primary border border-primary/20 px-2 py-0.5 bg-primary/5 transition-colors clickable"
          >
            [ ESC_TERMINATE ]
          </button>
        </div>

        {gameState === 'hacking' && (
          <div>
            {/* Decryption Instructions */}
            <div className="mb-6 bg-primary/5 border border-primary/10 p-4 leading-relaxed text-accent/80">
              <span className="text-secondary font-bold mr-1">&gt;</span> WARNING: Hammad's master dossier is encrypted under a security firewall.
              To extract the resume, execute a matrix override sequence matching the target keys below, or initialize a direct secure bypass.
            </div>

            {/* Stats display */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-[10px] tracking-wider text-primary/70 border-y border-primary/10 py-3">
              <div>ATTEMPTS REMAINING: <span className="text-warning font-bold">{attemptsLeft}</span></div>
              <div className="text-right">FIREWALL THREAT LEVEL: <span className="text-secondary font-bold">{securityLevel}%</span></div>
            </div>

            {/* Target Code Sequence */}
            <div className="mb-6 text-center">
              <div className="text-[10px] text-accent/50 mb-2 tracking-widest uppercase">Target Decryption Keys (Click in Order):</div>
              <div className="flex justify-center gap-3">
                {targetSequence.map((seq, idx) => {
                  const isUnlocked = playerSequence.length > idx;
                  const isCurrent = playerSequence.length === idx;
                  return (
                    <div 
                      key={idx}
                      className={`px-4 py-2 border rounded-sm transition-all duration-300 ${
                        isUnlocked 
                          ? 'bg-secondary/25 border-secondary text-secondary shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                          : isCurrent 
                          ? 'bg-primary/20 border-primary text-primary animate-pulse'
                          : 'bg-primary/5 border-primary/10 text-primary/40'
                      } font-bold`}
                    >
                      {seq}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid of Options */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {grid.map((hex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleHexClick(hex)}
                  className="py-3 border border-primary/20 bg-primary/5 text-center text-white hover:bg-primary/15 hover:border-primary transition-all duration-200 cursor-none clickable font-bold uppercase rounded-sm hover:scale-105 active:scale-95"
                >
                  {hex}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'success' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full border border-secondary flex items-center justify-center mx-auto mb-6 bg-secondary/10 shadow-[0_0_20px_rgba(0,255,136,0.2)]">
              <span className="text-2xl text-secondary">✓</span>
            </div>
            <h3 className="text-lg font-bold text-secondary mb-2 tracking-widest">DECRYPTION SUCCESSFUL</h3>
            <p className="text-accent/70 leading-relaxed mb-6">
              Security locks bypassed. Muhammad Hammad Raza's master resume PDF is downloading to your system.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={triggerDownload} 
                className="px-6 py-2.5 bg-secondary/15 border border-secondary text-secondary hover:bg-secondary hover:text-background transition-all clickable"
              >
                [ DOWNLOAD_AGAIN ]
              </button>
              <button 
                onClick={onClose} 
                className="px-6 py-2.5 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all clickable"
              >
                [ RETURN_TO_SITE ]
              </button>
            </div>
          </div>
        )}

        {gameState === 'failed' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full border border-warning flex items-center justify-center mx-auto mb-6 bg-warning/10 shadow-[0_0_20px_rgba(255,77,109,0.2)]">
              <span className="text-2xl text-warning">!</span>
            </div>
            <h3 className="text-lg font-bold text-warning mb-2 tracking-widest">SYSTEM LOCKDOWN</h3>
            <p className="text-accent/70 leading-relaxed mb-6">
              Firewall alert triggered. Access denied due to key sequence mismatch.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={initGame} 
                className="px-6 py-2.5 bg-warning/10 border border-warning text-warning hover:bg-warning/20 transition-all clickable"
              >
                [ REBOOT_TERMINAL ]
              </button>
              <button 
                onClick={handleBypass} 
                className="px-6 py-2.5 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all clickable"
              >
                [ BYPASS_OVERRIDE ]
              </button>
            </div>
          </div>
        )}

        {/* Action Panel Bottom */}
        <div className="border-t border-primary/25 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-[9px] text-primary/45 uppercase tracking-widest text-center sm:text-left">
            SECURE DECRYPTION INTERFACE // CLIENT_V4
          </div>
          {gameState === 'hacking' && (
            <button 
              onClick={handleBypass}
              className="text-secondary/70 hover:text-secondary border border-secondary/20 hover:border-secondary px-3 py-1 bg-secondary/5 transition-all text-[10px] tracking-wider clickable font-bold uppercase"
            >
              [ SKIP_MINIGAME / DIRECT_DOWNLOAD ]
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
