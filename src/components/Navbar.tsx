import React, { useState, useEffect } from 'react';
import { sound } from '../lib/sound';

interface NavbarProps {
  crtEnabled: boolean;
  setCrtEnabled: (val: boolean) => void;
  glitchEnabled: boolean;
  setGlitchEnabled: (val: boolean) => void;
  onOpenTerminal: () => void;
}

const THEMES = [
  { id: 'cyan', name: 'CYAN PROTOCOL', color: '#00d4ff' },
  { id: 'matrix', name: 'GREEN MATRIX', color: '#00ff66' },
  { id: 'amber', name: 'AMBER RETRO', color: '#ffb300' },
  { id: 'vamp', name: 'NEON VAMP', color: '#ff0055' }
];

export const Navbar: React.FC<NavbarProps> = ({
  crtEnabled,
  setCrtEnabled,
  glitchEnabled,
  setGlitchEnabled,
  onOpenTerminal
}) => {
  const [activeTheme, setActiveTheme] = useState('cyan');
  const [soundMuted, setSoundMuted] = useState(true);
  const [musicActive, setMusicActive] = useState(false);
  const [uptime, setUptime] = useState(0);
  const [ping, setPing] = useState(24);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  // Uptime and Ping Simulation
  useEffect(() => {
    const uptimeInterval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);

    const pingInterval = setInterval(() => {
      setPing(prev => {
        const diff = Math.floor(Math.random() * 9) - 4; // -4 to 4
        const newPing = prev + diff;
        return Math.max(10, Math.min(60, newPing));
      });
    }, 3000);

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(uptimeInterval);
      clearInterval(pingInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId);
    setThemeDropdownOpen(false);
    
    // Play SFX
    sound.playBeep();

    const root = document.documentElement;
    const themes: Record<string, Record<string, string>> = {
      cyan: {
        '--background': '#07090f',
        '--primary': '#00d4ff',
        '--secondary': '#00ff88',
        '--warning': '#ff4d6d',
        '--accent': '#c8d6e5'
      },
      matrix: {
        '--background': '#020402',
        '--primary': '#00ff66',
        '--secondary': '#009944',
        '--warning': '#ff3333',
        '--accent': '#d4ffd4'
      },
      amber: {
        '--background': '#120902',
        '--primary': '#ffb300',
        '--secondary': '#ff6600',
        '--warning': '#ff3333',
        '--accent': '#ffe6cc'
      },
      vamp: {
        '--background': '#0e0214',
        '--primary': '#ff0055',
        '--secondary': '#a300ff',
        '--warning': '#00f0ff',
        '--accent': '#fceeff'
      }
    };

    const selectedTheme = themes[themeId];
    if (selectedTheme) {
      Object.entries(selectedTheme).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });
    }
  };

  const toggleSound = () => {
    const nextMute = !soundMuted;
    setSoundMuted(nextMute);
    sound.toggleMute(nextMute);
    
    if (!nextMute) {
      // Play a direct blip to confirm audio works
      sound.playBeep();
      if (musicActive) {
        sound.toggleMusic(true);
      }
    } else {
      sound.toggleMusic(false);
    }
  };

  const toggleMusic = () => {
    const nextMusic = !musicActive;
    setMusicActive(nextMusic);
    
    if (nextMusic) {
      // Auto-unmute sound system if music is turned on
      setSoundMuted(false);
      sound.toggleMute(false);
      sound.toggleMusic(true);
    } else {
      sound.toggleMusic(false);
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    sound.playClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top HUD Navbar */}
      <header className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-primary/20 font-mono text-xs text-accent select-none transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          
          {/* Brand/Identity */}
          <div className="flex items-center gap-3">
            <span 
              onClick={() => scrollToSection('hero')}
              className="text-white hover:text-primary transition-colors cursor-pointer font-bold tracking-widest text-sm flex items-center gap-2 group clickable"
              onMouseEnter={() => sound.playTyping()}
            >
              <span className="text-primary font-mono">&lt;</span>
              M_HAMMAD_RAZA
              <span className="text-primary font-mono">/&gt;</span>
            </span>
            
            {/* Desktop Status Badges */}
            <div className="hidden lg:flex items-center gap-3 text-[10px] border-l border-primary/20 pl-4 text-primary/50">
              <span className="flex items-center gap-1.5 bg-primary/5 px-2 py-0.5 border border-primary/10 rounded-sm">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                ONLINE
              </span>
              <span>UPTIME: {formatUptime(uptime)}</span>
              <span>PING: {ping}ms</span>
              <span>COORD: X:{coords.x} Y:{coords.y}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {['about', 'projects', 'skills', 'education', 'achievements', 'contact'].map((sect, i) => (
              <button
                key={sect}
                onClick={() => scrollToSection(sect)}
                className="hover:text-primary transition-colors uppercase tracking-widest text-[10px] relative py-1 group clickable"
                onMouseEnter={() => sound.playTyping()}
              >
                <span className="text-primary/30 mr-1">0{i+1}.</span>
                {sect}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Controls Panel */}
          <div className="flex items-center gap-4">
            
            {/* Terminal Launch Shortcut */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenTerminal();
              }}
              className="hidden md:block bg-primary/10 border border-primary/30 hover:border-primary text-primary px-3 py-1 hover:bg-primary/25 transition-all text-[10px] tracking-wider clickable"
              onMouseEnter={() => sound.playTyping()}
            >
              [ ~/terminal.bin ]
            </button>

            {/* Sound Wave Control */}
            <button
              onClick={toggleSound}
              className={`flex items-center gap-2 px-2.5 py-1 border transition-all duration-300 text-[10px] clickable ${
                !soundMuted 
                  ? 'bg-secondary/10 border-secondary text-secondary shadow-[0_0_10px_rgba(0,255,136,0.15)]' 
                  : 'bg-primary/5 border-primary/20 text-primary/40 hover:border-primary/40'
              }`}
              onMouseEnter={() => sound.playTyping()}
              title={soundMuted ? "Enable Immersive Sounds" : "Mute Sound System"}
            >
              <div className="flex items-end gap-0.5 h-2.5 w-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-[2px] bg-current rounded-full transition-all duration-300 ${
                      !soundMuted ? 'animate-bounce' : 'h-1'
                    }`}
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '0.8s',
                      height: !soundMuted ? `${[40, 90, 60, 100][i]}%` : '2px'
                    }}
                  />
                ))}
              </div>
              <span className="tracking-widest">SFX: {!soundMuted ? 'ON' : 'OFF'}</span>
            </button>

            {/* Background Music Control */}
            <button
              onClick={toggleMusic}
              className={`flex items-center gap-1.5 px-2.5 py-1 border transition-all duration-300 text-[10px] clickable ${
                musicActive && !soundMuted
                  ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(0,212,255,0.15)]' 
                  : 'bg-primary/5 border-primary/20 text-primary/40 hover:border-primary/40'
              }`}
              onMouseEnter={() => sound.playTyping()}
              title={musicActive && !soundMuted ? "Mute Background Music" : "Play Retro Synth Soundtrack"}
            >
              <span className="tracking-widest">BGM: {musicActive && !soundMuted ? 'PLAYING' : 'OFF'}</span>
            </button>

            {/* Theme Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  sound.playClick();
                  setThemeDropdownOpen(!themeDropdownOpen);
                }}
                className="bg-primary/5 border border-primary/20 hover:border-primary px-2.5 py-1 text-[10px] tracking-wider flex items-center gap-1.5 clickable"
                onMouseEnter={() => sound.playTyping()}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full transition-colors duration-500" 
                  style={{ backgroundColor: THEMES.find(t => t.id === activeTheme)?.color }}
                />
                <span className="hidden sm:inline">SCHEME: {activeTheme.toUpperCase()}</span>
                <span>▾</span>
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#0d111d] border border-primary/30 rounded-sm shadow-xl z-50 py-1 overflow-hidden">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`w-full text-left px-3 py-2 text-[10px] tracking-widest hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2 ${
                        activeTheme === theme.id ? 'text-primary bg-primary/5' : 'text-accent/70'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.color }} />
                      {theme.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Visual Switches Toggle Drawer Button (Desktop) */}
            <div className="hidden lg:flex items-center gap-3 border-l border-primary/20 pl-4 text-[10px]">
              <button
                onClick={() => {
                  sound.playClick();
                  setCrtEnabled(!crtEnabled);
                }}
                className={`transition-colors clickable ${crtEnabled ? 'text-primary' : 'text-accent/30 hover:text-accent/50'}`}
                title="Toggle CRT Screen Scanline/Bulge Simulation"
              >
                [ CRT: {crtEnabled ? 'ON' : 'OFF'} ]
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setGlitchEnabled(!glitchEnabled);
                }}
                className={`transition-colors clickable ${glitchEnabled ? 'text-primary' : 'text-accent/30 hover:text-accent/50'}`}
                title="Toggle Glitch Animations"
              >
                [ GLITCH: {glitchEnabled ? 'ON' : 'OFF'} ]
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="xl:hidden bg-primary/10 border border-primary/30 px-3 py-1 hover:bg-primary/20 text-primary text-[10px] tracking-widest clickable"
            >
              {mobileMenuOpen ? '[ CLOSE ]' : '[ MENU ]'}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#07090f]/98 backdrop-blur-lg font-mono flex flex-col justify-center items-center p-8 transition-all duration-300">
          
          {/* Cyber bracket decoration */}
          <div className="absolute top-20 bottom-10 left-6 right-6 border border-primary/10 pointer-events-none">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50" />
            
            {/* Vertical scanner line inside mobile menu */}
            <div className="absolute left-0 w-full h-[1px] bg-primary/10 animate-scanline" />
          </div>

          <div className="flex flex-col gap-6 text-center z-10 w-full max-w-xs">
            
            <div className="text-[10px] text-primary/40 uppercase tracking-widest border-b border-primary/20 pb-4 mb-4">
              -- OPERATIVE OPTIONS --
            </div>

            {['about', 'projects', 'skills', 'education', 'achievements', 'contact'].map((sect, i) => (
              <button
                key={sect}
                onClick={() => scrollToSection(sect)}
                className="text-lg text-white hover:text-primary uppercase tracking-widest py-1 border-b border-primary/5 group"
                onMouseEnter={() => sound.playTyping()}
              >
                <span className="text-primary text-xs mr-2">0{i+1}.</span>
                {sect}
              </button>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setTimeout(onOpenTerminal, 300);
              }}
              className="mt-6 w-full bg-primary/10 border border-primary text-primary py-3 hover:bg-primary hover:text-background transition-all text-xs tracking-widest font-bold"
            >
              [ RUN TERMINAL.BIN ]
            </button>

            {/* Mobile Visual Effect Controls */}
            <div className="grid grid-cols-2 gap-3 mt-8 text-[9px] text-accent/60">
              <button
                onClick={() => {
                  sound.playClick();
                  setCrtEnabled(!crtEnabled);
                }}
                className={`py-2 border border-primary/20 bg-[#0d111d] clickable ${crtEnabled ? 'border-primary text-primary' : ''}`}
              >
                CRT SCANLINE: {crtEnabled ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setGlitchEnabled(!glitchEnabled);
                }}
                className={`py-2 border border-primary/20 bg-[#0d111d] clickable ${glitchEnabled ? 'border-primary text-primary' : ''}`}
              >
                GLITCH EFFECT: {glitchEnabled ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  toggleSound();
                }}
                className={`py-2 border border-primary/20 bg-[#0d111d] clickable ${!soundMuted ? 'border-primary text-primary' : ''}`}
              >
                SFX SOUNDS: {!soundMuted ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  toggleMusic();
                }}
                className={`py-2 border border-primary/20 bg-[#0d111d] clickable ${musicActive && !soundMuted ? 'border-primary text-primary' : ''}`}
              >
                BGM MUSIC: {musicActive && !soundMuted ? 'PLAYING' : 'OFF'}
              </button>
            </div>

            {/* Mobile diagnostics display */}
            <div className="flex flex-col gap-1 items-center justify-center text-[8px] text-primary/30 mt-8 leading-relaxed uppercase border-t border-primary/10 pt-4">
              <div>DEVICE SECURE CONNECTION</div>
              <div>UPTIME: {formatUptime(uptime)} // PING: {ping}ms</div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
