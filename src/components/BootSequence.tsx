import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../lib/sound';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [ramTested, setRamTested] = useState(0);
  const [decryptionStage, setDecryptionStage] = useState<'pending' | 'running' | 'done'>('pending');
  const [decryptionHex, setDecryptionHex] = useState<string>('');
  const [progressVal, setProgressVal] = useState(0);
  const [isDissolving, setIsDissolving] = useState(false);
  const [phase, setPhase] = useState<'header' | 'diagnostics' | 'decryption' | 'progress' | 'complete'>('header');

  const timersRef = useRef<number[]>([]);

  const addTimer = (callback: () => void, delay: number) => {
    const t = window.setTimeout(callback, delay);
    timersRef.current.push(t);
  };

  useEffect(() => {
    // Phase 1: BIOS Header & RAM Test
    let currentRam = 0;
    const ramInterval = setInterval(() => {
      currentRam += 2048;
      if (currentRam >= 32768) {
        currentRam = 32768;
        clearInterval(ramInterval);
        setPhase('diagnostics');
      }
      setRamTested(currentRam);
      sound.playClick();
    }, 50);

    return () => {
      clearInterval(ramInterval);
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Phase 2: Diagnostics Logs printing one by one
  useEffect(() => {
    if (phase !== 'diagnostics') return;

    const diagnosticLines = [
      "HOST DIAGNOSTIC: PORTFOLIO_DISK_01 ACTIVE [SATA_SSD]",
      "ESTABLISHING SECURE SSH TUNNEL ON PORT 22...",
      "LOAD CORE PORTFOLIO PROFILE: MUHAMMAD HAMMAD RAZA...",
      "VERIFY LEVEL 4 CLASS SECURITY CLEARANCE LEVEL...",
      "SECURITY ALARM BYPASS STATUS: ENABLED",
      "WARNING: ANOMALY MONITOR ONLINE [IPS ACTIVE]"
    ];

    let lineIdx = 0;
    const printLine = () => {
      if (lineIdx < diagnosticLines.length) {
        setLines(prev => [...prev, diagnosticLines[lineIdx]]);
        sound.playClick();
        lineIdx++;
        addTimer(printLine, 250);
      } else {
        addTimer(() => {
          setPhase('decryption');
          setDecryptionStage('running');
        }, 300);
      }
    };

    printLine();
  }, [phase]);

  // Phase 3: Matrix Hex Key Decryption screen
  useEffect(() => {
    if (phase !== 'decryption') return;

    let iterations = 0;
    const maxIterations = 20;

    const hexInterval = setInterval(() => {
      // Generate block of random HEX codes
      const hexChars = "0123456789ABCDEF";
      let hexBlock = "";
      for (let r = 0; r < 3; r++) {
        let row = "";
        for (let c = 0; c < 8; c++) {
          row += hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)] + " ";
        }
        hexBlock += `0x00${r}F080: ${row.trim()}\n`;
      }
      setDecryptionHex(hexBlock);
      sound.playTyping();
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(hexInterval);
        setDecryptionHex(
          "0x000F080: B4 F8 90 AE 7A DD 2C 19\n" +
          "0x001F080: D2 AA E0 5D C2 33 8F 9C\n" +
          "0x002F080: FF EE BB 00 A1 B2 C3 F2 [VERIFIED]"
        );
        setDecryptionStage('done');
        sound.playClick();
        addTimer(() => {
          setPhase('progress');
        }, 400);
      }
    }, 80);

    return () => clearInterval(hexInterval);
  }, [phase]);

  // Phase 4: Final loading progress bar
  useEffect(() => {
    if (phase !== 'progress') return;

    let p = 0;
    const progInterval = setInterval(() => {
      p += 5;
      if (p >= 100) {
        p = 100;
        clearInterval(progInterval);
        sound.playChime();
        addTimer(() => {
          setIsDissolving(true);
          addTimer(onComplete, 800);
        }, 1000);
      } else {
        sound.playClick();
      }
      setProgressVal(p);
    }, 60);

    return () => clearInterval(progInterval);
  }, [phase, onComplete]);

  // Progress Bar Character Renderer
  const getProgressBarText = () => {
    const barsCount = Math.floor(progressVal / 5);
    const bars = "=".repeat(barsCount);
    const spaces = " ".repeat(20 - barsCount);
    const pointer = progressVal < 100 ? ">" : "";
    return `[${bars}${pointer}${spaces.slice(pointer ? 1 : 0)}] ${progressVal}%`;
  };

  return (
    <div className={`fixed inset-0 z-[10000] bg-[#03050a] flex flex-col items-start justify-start p-8 md:p-16 font-mono text-xs md:text-sm select-none transition-all duration-700 ${
      isDissolving ? 'opacity-0 scale-105 blur-xl pointer-events-none' : 'opacity-100'
    }`}>
      
      {/* Glow Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scanline" />
      </div>

      <div className="w-full max-w-4xl space-y-6">
        
        {/* Row 1: BIOS System Header */}
        <div className="border-b border-primary/20 pb-4 text-primary/80">
          <div className="flex justify-between font-bold text-glow-cyan text-sm md:text-base">
            <span>MHR_OPERATING_SYSTEM_BIOS v4.22</span>
            <span>2026-05-20</span>
          </div>
          <div>(C) RAZA_HAMMAD CODERZ CLASH SYSTEMS, INC.</div>
        </div>

        {/* Row 2: CPU Info & RAM Tester */}
        <div className="space-y-1 text-white">
          <div className="flex gap-2">
            <span className="text-primary">&gt; CPU:</span>
            <span>NEURAL_LINK_COGNITIVE_CORE @ 4.80GHz</span>
          </div>
          <div className="flex gap-2">
            <span className="text-primary">&gt; L2 CACHE:</span>
            <span>4096KB SHADOW_BUFFER</span>
          </div>
          <div className="flex gap-2">
            <span className="text-primary">&gt; TESTING SYSTEM MEMORY:</span>
            <span className="text-secondary font-bold text-glow-secondary">{ramTested}MB OK</span>
          </div>
        </div>

        {/* Row 3: Diagnostics Stack */}
        {(phase === 'diagnostics' || phase === 'decryption' || phase === 'progress') && (
          <div className="space-y-1 text-primary/70 border-t border-primary/10 pt-4">
            {lines.map((line, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-primary/30">[{new Date().toLocaleTimeString()}]</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        )}

        {/* Row 4: Hex Decryptor Box */}
        {(phase === 'decryption' || phase === 'progress') && (
          <div className="border border-primary/20 bg-[#07090f]/80 p-4 rounded-sm space-y-2 mt-2">
            <div className="text-secondary font-bold flex justify-between">
              <span>&gt; DECRYPTING SECURE SECURITY CODES</span>
              <span className="animate-pulse">{decryptionStage === 'running' ? 'DECRYPTING...' : 'DECRYPTED'}</span>
            </div>
            <pre className="text-white text-[10px] md:text-xs leading-relaxed font-mono whitespace-pre">{decryptionHex}</pre>
          </div>
        )}

        {/* Row 5: Loading Progress Bar */}
        {(phase === 'progress') && (
          <div className="border-t border-primary/15 pt-4 space-y-2 text-white">
            <div className="flex justify-between text-secondary font-bold">
              <span>&gt; LOADING DIRECTORY CREDENTIALS</span>
              <span>READY</span>
            </div>
            <div className="text-glow-cyan text-sm md:text-base font-bold">
              {getProgressBarText()}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
