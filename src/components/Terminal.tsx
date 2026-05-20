import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../lib/sound';
import { PORTFOLIO_DATA } from '../data';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
}

export const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<LogLine[]>([
    { text: "MHR CORE OPERATIVE TERMINAL v3.2.0", type: 'system' },
    { text: "CONNECTION SECURE. TYPE 'help' FOR LIST OF EXECUTIVE TOOLS.", type: 'system' },
    { text: "", type: 'output' }
  ]);
  
  const [matrixActive, setMatrixActive] = useState(false);
  const [isHacking, setIsHacking] = useState(false);
  
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Scroll to bottom on log updates locally
  useEffect(() => {
    const container = terminalContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  // Matrix Digital Rain Logic
  useEffect(() => {
    if (!matrixActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 500;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabet = katakana.split("");

    const fontSize = 11;
    const columns = Math.floor(canvas.width / fontSize);

    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.random() * -100; // stagger drops
    }

    let animId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(7, 9, 15, 0.05)'; // slight fade to create trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff88'; // Matrix Green
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 500;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [matrixActive]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    sound.playTyping();
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    sound.playBeep();
    const args = trimmed.split(' ');
    const command = args[0].toLowerCase();

    // Update terminal log with the command entered
    const newLogs = [...logs, { text: `guest@mhr-terminal:~$ ${trimmed}`, type: 'input' as const }];
    
    // Command history
    const updatedHistory = [...history, trimmed];
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length);

    switch (command) {
      case 'help':
        setLogs([
          ...newLogs,
          { text: "AVAILABLE MODULE COMMANDS:", type: 'system' },
          { text: "  about            - Display core dossier profile", type: 'output' },
          { text: "  projects         - List developed repositories and applications", type: 'output' },
          { text: "  skills           - Chart tech stack proficiencies in terminal bars", type: 'output' },
          { text: "  download-resume  - Retrieve Hammad Raza's master PDF resume", type: 'output' },
          { text: "  matrix           - Toggles digital code cascade overlay", type: 'output' },
          { text: "  hack             - Execute secure mainframe bypass simulation", type: 'output' },
          { text: "  clear            - Purge screen buffer logs", type: 'output' },
          { text: "  exit             - Terminate terminal connection", type: 'output' }
        ]);
        break;

      case 'about':
        setLogs([
          ...newLogs,
          { text: "--------------------------------------------------", type: 'output' },
          { text: `IDENTITY  : ${PORTFOLIO_DATA.name}`, type: 'success' },
          { text: `ROLE      : ${PORTFOLIO_DATA.about.designation}`, type: 'output' },
          { text: `BASE CAMP : ${PORTFOLIO_DATA.about.institution}`, type: 'output' },
          { text: `CGPA      : ${PORTFOLIO_DATA.about.cgpa} (Semester 7)`, type: 'output' },
          { text: `SECURITY  : ${PORTFOLIO_DATA.about.clearance}`, type: 'output' },
          { text: `MISSION   : ${PORTFOLIO_DATA.about.mission}`, type: 'system' },
          { text: "--------------------------------------------------", type: 'output' }
        ]);
        break;

      case 'projects':
        const projLines = PORTFOLIO_DATA.projects.map(p => ({
          text: `[${p.id}] ${p.name.padEnd(20)} | COMP: ${p.complexity.padEnd(8)} | ${p.description}`,
          type: 'output' as const
        }));
        setLogs([
          ...newLogs,
          { text: "ACTIVE REPOSITORY ARCHIVE:", type: 'system' },
          ...projLines
        ]);
        break;

      case 'skills':
        const skillLines = PORTFOLIO_DATA.skills.map(s => {
          const filled = Math.round(s.level / 10);
          const bar = `[${"█".repeat(filled)}${"░".repeat(10 - filled)}]`;
          return {
            text: `${s.name.padEnd(14)} ${bar} ${s.level}%`,
            type: 'output' as const
          };
        });
        setLogs([
          ...newLogs,
          { text: "OPERATIVE WEAPONS ARSENAL:", type: 'system' },
          ...skillLines
        ]);
        break;

      case 'download-resume':
        setLogs([
          ...newLogs,
          { text: "[*] INITIALIZING RETRIEVAL PROTOCOL...", type: 'system' },
          { text: "[*] PINGING MAIN SERVER FRAME...", type: 'system' },
          { text: "[*] BUFFERING STREAM: [████████████████████] 100%", type: 'success' },
          { text: "[SUCCESS] DOWNLOAD DISPATCHED SAFELY.", type: 'success' }
        ]);
        sound.playDataStream();
        // Trigger actual download
        const link = document.createElement('a');
        link.href = '/resume.pdf';
        link.download = 'Muhammad_Hammad_Raza_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;

      case 'matrix':
        setMatrixActive(!matrixActive);
        setLogs([
          ...newLogs,
          { text: `MATRIX CODE RAIN: ${!matrixActive ? 'ACTIVATED' : 'DEACTIVATED'}`, type: 'success' }
        ]);
        break;

      case 'clear':
        setLogs([]);
        break;

      case 'exit':
        onClose();
        break;

      case 'hack':
        if (isHacking) return;
        setIsHacking(true);
        setLogs([...newLogs, { text: "[!] INITIATING SECURE SERVER BYPASS...", type: 'error' }]);
        
        let step = 0;
        const hackSteps = [
          { text: "[*] Scanning active ports...", type: 'system' },
          { text: "[*] Target IP: 192.168.42.108 found on Port 80, 443, 22", type: 'output' },
          { text: "[!] Bypassing local firewall and WAF...", type: 'error' },
          { text: "[+] Connection established! Decrypting SSH Key...", type: 'output' },
          { text: "[*] Decrypting: [████░░░░░░] 40%", type: 'system' },
          { text: "[*] Decrypting: [████████░░] 80%", type: 'system' },
          { text: "[*] Decrypting: [██████████] 100% - DECRYPTION OK", type: 'success' },
          { text: "[+] ROOT ACCESS ACQUIRED - INJECTING PAYLOAD...", type: 'success' },
          { text: "--------------------------------------------------", type: 'success' },
          { text: "   ACCESS GRANTED. YOU ARE IN HAMMAD'S MAINFRAME!  ", type: 'success' },
          { text: "--------------------------------------------------", type: 'success' }
        ];

        const runHack = () => {
          if (step < hackSteps.length) {
            setLogs(prev => [...prev, hackSteps[step] as LogLine]);
            sound.playClick();
            step++;
            setTimeout(runHack, 400);
          } else {
            sound.playChime();
            setIsHacking(false);
          }
        };
        setTimeout(runHack, 400);
        break;

      default:
        setLogs([
          ...newLogs,
          { text: `bash: command not found: ${command}. Type 'help' for suggestions.`, type: 'error' }
        ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      } else if (historyIndex === history.length - 1) {
        setHistoryIndex(history.length);
        setInputVal('');
      }
    }
  };

  return (
    <div 
      className="fixed inset-y-0 right-0 w-full md:w-[520px] bg-[#07090f]/95 border-l border-primary/30 z-[10000] flex flex-col font-mono text-xs shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-fade-in transition-colors duration-500"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Matrix Overlay inside terminal */}
      {matrixActive && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        />
      )}

      {/* Terminal Title Bar */}
      <div className="h-10 border-b border-primary/20 bg-[#0d121f] px-4 flex items-center justify-between z-10 select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning cursor-pointer" onClick={onClose} />
          <div className="w-3 h-3 rounded-full bg-secondary/50" />
          <div className="w-3 h-3 rounded-full bg-primary/40" />
          <span className="text-accent/60 text-[10px] ml-2 tracking-widest">
            bash - "hammad_raza.sh"
          </span>
        </div>
        <button 
          onClick={onClose} 
          className="text-primary hover:text-white transition-colors tracking-widest text-[10px] border border-primary/20 px-2 py-0.5 bg-primary/5 clickable"
        >
          [ ESC_CLOSE ]
        </button>
      </div>

      {/* Output screen */}
      <div ref={terminalContainerRef} className="flex-grow overflow-y-auto p-6 space-y-2 z-10 scrollbar-thin">
        {logs.map((log, idx) => {
          let textClass = 'text-accent';
          if (log.type === 'input') textClass = 'text-secondary font-bold';
          else if (log.type === 'error') textClass = 'text-warning font-bold';
          else if (log.type === 'success') textClass = 'text-glow-secondary text-secondary font-semibold';
          else if (log.type === 'system') textClass = 'text-primary font-semibold';

          return (
            <div key={idx} className={`${textClass} break-all whitespace-pre-wrap leading-relaxed`}>
              {log.text}
            </div>
          );
        })}
      </div>

      {/* Input panel */}
      <div className="h-12 border-t border-primary/20 bg-[#07090f] p-4 flex items-center gap-2 z-10">
        <span className="text-secondary font-bold shrink-0">guest@mhr-terminal:~$</span>
        <input 
          ref={inputRef}
          type="text" 
          disabled={isHacking}
          value={inputVal} 
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent border-none outline-none font-mono text-primary text-xs caret-primary disabled:opacity-50"
          placeholder={isHacking ? "Hacking mainframe..." : "Type command here..."}
          autoComplete="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
};
