import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../lib/sound';

interface LogEntry {
  timestamp: string;
  source: string;
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'blocked';
}

const ATTACK_TYPES = [
  { id: 'scan', name: 'PORT SCAN SCANNER', desc: 'Active scanning of ports 22, 80, 443, 8080.', severity: 'medium' },
  { id: 'ddos', name: 'DDoS REFLECTED ATTACK', desc: 'Simulated multi-node traffic flood targeting main node.', severity: 'high' },
  { id: 'sqli', name: 'SQL INJECTION PROBE', desc: 'Malicious SQL queries injected into authentication endpoints.', severity: 'critical' }
];

export const ThreatSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [firewallActive, setFirewallActive] = useState(true);
  const [aiDetection, setAiDetection] = useState(true);
  const [activeAttack, setActiveAttack] = useState<string | null>(null);
  const [systemLoad, setSystemLoad] = useState(12); // in %
  const [threatScore, setThreatScore] = useState(0); // 0-100
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: new Date().toLocaleTimeString(), source: 'FIREWALL', event: 'IPS engine initialized. Security protocols running.', severity: 'low' },
    { timestamp: new Date().toLocaleTimeString(), source: 'AI_MODEL', event: 'Anomaly detection model online. Baseline established.', severity: 'low' }
  ]);

  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs locally without scrolling the main window viewport
  useEffect(() => {
    const container = logsContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  // Simulation loop for background noise/traffic
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && !activeAttack) {
        // Generate generic baseline traffic log
        const ips = ['192.168.1.5', '10.0.0.12', '172.16.254.1', '192.168.100.42'];
        const randomIp = ips[Math.floor(Math.random() * ips.length)];
        const events = [
          'HTTPS Handshake successful', 
          'Database query executed safely', 
          'Static assets loaded (200 OK)', 
          'SSH connection checked - host verification ok'
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        
        setLogs(prev => [...prev.slice(-30), {
          timestamp: new Date().toLocaleTimeString(),
          source: randomIp,
          event: randomEvent,
          severity: 'low'
        }]);
        
        // Randomly fluctuate system load
        setSystemLoad(prev => Math.max(5, Math.min(25, prev + Math.floor(Math.random() * 5) - 2)));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeAttack]);

  // Canvas Attack Animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const isMobile = window.innerWidth < 768;
    canvas.width = isMobile ? 320 : 420;
    canvas.height = 300;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Nodes
    const coreNode = { x: centerX, y: centerY, r: 18, pulse: 0 };
    let attackers: { x: number; y: number; r: number; active: boolean; label: string }[] = [];
    
    // Attacker position configurations
    const count = 3;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const dist = isMobile ? 110 : 140;
      attackers.push({
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        r: 8,
        active: false,
        label: `BOT_0${i+1}`
      });
    }

    // Packets
    let packets: { x: number; y: number; tx: number; ty: number; speed: number; progress: number; type: string }[] = [];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Secondary/primary theme colors
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00d4ff';
      const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#00ff88';
      const warningColor = getComputedStyle(document.documentElement).getPropertyValue('--warning').trim() || '#ff4d6d';

      // 1. Draw Network Connections (Lines)
      ctx.strokeStyle = `color-mix(in srgb, ${primaryColor} 10%, transparent)`;
      ctx.lineWidth = 1;
      attackers.forEach(att => {
        ctx.beginPath();
        ctx.moveTo(att.x, att.y);
        ctx.lineTo(coreNode.x, coreNode.y);
        ctx.stroke();
      });

      // 2. Draw Firewall Shield Perimeter
      if (firewallActive) {
        ctx.strokeStyle = `color-mix(in srgb, ${secondaryColor} 35%, transparent)`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(coreNode.x, coreNode.y, 45, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset
        
        // Subtle shield glow ring
        ctx.strokeStyle = `color-mix(in srgb, ${secondaryColor} 10%, transparent)`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(coreNode.x, coreNode.y, 45, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Draw Core Host Node
      coreNode.pulse += 0.05;
      const pulseRadius = coreNode.r + Math.sin(coreNode.pulse) * 3;
      
      // Outer glow
      ctx.fillStyle = threatScore > 50 
        ? `color-mix(in srgb, ${warningColor} 20%, transparent)` 
        : `color-mix(in srgb, ${primaryColor} 15%, transparent)`;
      ctx.beginPath();
      ctx.arc(coreNode.x, coreNode.y, pulseRadius + 6, 0, Math.PI * 2);
      ctx.fill();

      // Main core node
      ctx.fillStyle = threatScore > 50 ? warningColor : primaryColor;
      ctx.beginPath();
      ctx.arc(coreNode.x, coreNode.y, coreNode.r, 0, Math.PI * 2);
      ctx.fill();

      // Core label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("HOST_CORE", coreNode.x, coreNode.y);

      // 4. Draw Attacker Nodes
      attackers.forEach(att => {
        const isAttacking = activeAttack !== null;
        ctx.fillStyle = isAttacking ? warningColor : `color-mix(in srgb, ${primaryColor} 40%, transparent)`;
        
        ctx.beginPath();
        ctx.arc(att.x, att.y, att.r, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = isAttacking ? warningColor : '#99adbd';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        
        let labelYOffset = att.y > coreNode.y ? 18 : -12;
        ctx.fillText(att.label, att.x, att.y + labelYOffset);
      });

      // 5. Update and Draw Packets
      packets = packets.filter(p => {
        p.progress += p.speed;
        
        // Interpolate packet position
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        p.x += (dx / distance) * p.speed * 8;
        p.y += (dy / distance) * p.speed * 8;

        // Check collision with Shield
        const distToCore = Math.sqrt((p.x - coreNode.x) ** 2 + (p.y - coreNode.y) ** 2);
        
        if (firewallActive && distToCore <= 46) {
          // Blocked by firewall
          createExplosion(p.x, p.y, secondaryColor);
          
          // Log blocking event
          const randomBlockMessages = [
            `IPS blocked anomalous signature from malicious peer`,
            `Intrusion Prevention system filtered invalid packet stream`,
            `TCP handshake aborted - dropped suspicious payload header`
          ];
          const logMsg = randomBlockMessages[Math.floor(Math.random() * randomBlockMessages.length)];
          
          setLogs(prev => [...prev.slice(-30), {
            timestamp: new Date().toLocaleTimeString(),
            source: 'SHIELD_IPS',
            event: logMsg,
            severity: 'blocked'
          }]);
          
          sound.playClick();
          
          // Cool threat mitigation factor
          setThreatScore(prev => Math.max(0, prev - 4));
          return false;
        }

        // Check collision with Core
        if (distToCore <= coreNode.r) {
          createExplosion(p.x, p.y, warningColor);
          
          // Penetration log
          setLogs(prev => [...prev.slice(-30), {
            timestamp: new Date().toLocaleTimeString(),
            source: 'SECURITY_AUDIT',
            event: `CRITICAL: Attack vector penetrated core. Buffer overflow payload active!`,
            severity: 'critical'
          }]);
          
          sound.playBeep();
          
          // Threat spike
          setThreatScore(prev => Math.min(100, prev + 15));
          return false;
        }

        // Draw packet
        ctx.fillStyle = p.type === 'blocked' ? secondaryColor : warningColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // 6. Generate Packets during active attack
      if (activeAttack && Math.random() > 0.8) {
        const randomAttacker = attackers[Math.floor(Math.random() * attackers.length)];
        packets.push({
          x: randomAttacker.x,
          y: randomAttacker.y,
          tx: coreNode.x,
          ty: coreNode.y,
          speed: 0.8 + Math.random() * 0.8,
          progress: 0,
          type: activeAttack
        });
      }

      animId = requestAnimationFrame(draw);
    };

    // Explosion sparks array
    let explosions: { x: number; y: number; color: string; duration: number; maxDuration: number; particles: { x: number; y: number; vx: number; vy: number }[] }[] = [];

    const createExplosion = (x: number, y: number, color: string) => {
      const sparks: { x: number; y: number; vx: number; vy: number }[] = [];
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const force = 1 + Math.random() * 2;
        sparks.push({
          x: 0,
          y: 0,
          vx: Math.cos(angle) * force,
          vy: Math.sin(angle) * force
        });
      }
      explosions.push({
        x,
        y,
        color,
        duration: 0,
        maxDuration: 15,
        particles: sparks
      });
    };

    // Sub-draw loop inside canvas for explosion rendering
    const drawExplosions = () => {
      explosions = explosions.filter(e => {
        e.duration++;
        if (e.duration >= e.maxDuration) return false;
        
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.fillStyle = e.color;
        ctx.globalAlpha = 1 - (e.duration / e.maxDuration);
        
        e.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
        return true;
      });
    };

    // Intercept draw to render explosions
    const mainAnimate = () => {
      draw();
      drawExplosions();
    };

    mainAnimate();

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      canvas.width = isMobile ? 320 : 420;
      canvas.height = 300;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [firewallActive, activeAttack, threatScore]);

  // Execute Simulated Attacks
  const triggerAttackSim = (typeId: string) => {
    if (activeAttack) return;
    
    sound.playClick();
    setActiveAttack(typeId);
    setThreatScore(20);
    setSystemLoad(45);

    const attack = ATTACK_TYPES.find(a => a.id === typeId);
    if (!attack) return;

    // Log initialization
    setLogs(prev => [
      ...prev.slice(-30),
      {
        timestamp: new Date().toLocaleTimeString(),
        source: 'INTRUSION_DETECTED',
        event: `ALERT: Initiated attack simulation: ${attack.name}`,
        severity: 'high'
      },
      {
        timestamp: new Date().toLocaleTimeString(),
        source: 'IDS_DECRYPTOR',
        event: `Details: ${attack.desc}`,
        severity: 'medium'
      }
    ]);

    // Attack simulation duration (8 seconds)
    setTimeout(() => {
      setActiveAttack(null);
      setSystemLoad(12);
      
      // Log completion
      const attackResolvedMsg = firewallActive 
        ? `Simulation complete. Intrusion successfully isolated and mitigated by IPS/Firewall.` 
        : `Simulation complete. Core damage reported: ${threatScore}% penetration leakage. Rebooting core segments.`;

      setLogs(prev => [
        ...prev.slice(-30),
        {
          timestamp: new Date().toLocaleTimeString(),
          source: 'IDS_CLEANUP',
          event: attackResolvedMsg,
          severity: firewallActive ? 'blocked' : 'critical'
        }
      ]);
      
      if (firewallActive) {
        sound.playChime();
        setThreatScore(0);
      } else {
        sound.playBeep();
      }
    }, 8000);
  };

  const getLogSeverityClass = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'text-warning font-bold border-l-2 border-warning pl-2';
      case 'high':
        return 'text-warning/80 pl-2';
      case 'medium':
        return 'text-primary pl-2';
      case 'blocked':
        return 'text-secondary font-semibold pl-2';
      default:
        return 'text-accent/50 pl-2';
    }
  };

  return (
    <section id="threat-simulator" className="min-h-screen py-24 px-6 md:px-24 flex flex-col items-center bg-[#07090f]/30 transition-colors duration-500">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-mono text-primary mb-12 flex items-center gap-4">
          <span className="opacity-50 text-base md:text-xl">02.5.</span> {"> "}CYBER_THREAT_SIMULATION
          <div className="h-[1px] flex-grow bg-primary/20" />
        </h2>

        {/* Dashboard Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-primary/5 border border-primary/20 p-6 md:p-8 rounded-sm relative overflow-hidden border-pulse-glow">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,212,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,212,255,0.005)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

          {/* Left Column: Diagnostics & Control widgets */}
          <div className="lg:col-span-4 flex flex-col gap-6 relative z-10">
            <div>
              <h3 className="text-secondary font-mono text-xs tracking-wider mb-4 uppercase font-bold">&gt; Control Panel</h3>
              <div className="flex flex-col gap-3">
                
                {/* Attack Triggers */}
                {ATTACK_TYPES.map(attack => (
                  <button
                    key={attack.id}
                    disabled={activeAttack !== null}
                    onClick={() => triggerAttackSim(attack.id)}
                    className="w-full py-2.5 px-4 bg-primary/5 border border-primary/30 text-primary text-[10px] uppercase font-mono tracking-widest hover:bg-primary/20 hover:border-primary disabled:opacity-30 disabled:hover:bg-primary/5 disabled:hover:border-primary/30 transition-all text-left flex justify-between items-center clickable rounded-sm"
                  >
                    <span>{attack.name.split(' ')[0]} {attack.name.split(' ')[1] || ''}</span>
                    <span className="text-[8px] bg-primary/10 px-1.5 py-0.5 border border-primary/20">RUN_ATTACK</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Overrides */}
            <div>
              <h3 className="text-secondary font-mono text-xs tracking-wider mb-4 uppercase font-bold">&gt; Firewall Rules</h3>
              <div className="space-y-4">
                
                {/* Firewall Toggle */}
                <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white font-mono uppercase tracking-wider font-bold">IPS/IDS SHIELD</span>
                    <span className="text-[8px] text-accent/50">Mitigate core vector exploits</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setFirewallActive(!firewallActive);
                    }}
                    className={`px-3 py-1 border text-[9px] font-mono font-bold tracking-widest clickable rounded-sm ${
                      firewallActive 
                        ? 'bg-secondary/15 border-secondary text-secondary shadow-[0_0_10px_rgba(0,255,136,0.15)]' 
                        : 'bg-warning/10 border-warning text-warning'
                    }`}
                  >
                    {firewallActive ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>

                {/* AI Detection Toggle */}
                <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white font-mono uppercase tracking-wider font-bold">AI ANALYZER</span>
                    <span className="text-[8px] text-accent/50">Statistical anomaly mapping</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setAiDetection(!aiDetection);
                    }}
                    className={`px-3 py-1 border text-[9px] font-mono font-bold tracking-widest clickable rounded-sm ${
                      aiDetection 
                        ? 'bg-secondary/15 border-secondary text-secondary shadow-[0_0_10px_rgba(0,255,136,0.15)]' 
                        : 'bg-primary/5 border-primary/20 text-primary/45'
                    }`}
                  >
                    {aiDetection ? 'ONLINE' : 'OFFLINE'}
                  </button>
                </div>
              </div>
            </div>

            {/* Server Health Diagnostics widget */}
            <div className="bg-[#0c0e14] border border-primary/10 p-4 rounded-sm">
              <h4 className="text-[9px] text-primary/60 font-mono tracking-widest uppercase mb-3 font-bold">SYSTEM DIAGNOSTICS</h4>
              <div className="space-y-3 font-mono text-[9px] tracking-wide">
                <div className="flex justify-between">
                  <span>MAINFRAME STATUS:</span>
                  <span className={threatScore > 50 ? 'text-warning font-bold' : 'text-secondary'}>
                    {threatScore > 50 ? 'ALERT_WARNING' : 'SECURE'}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>CPU LOAD:</span>
                    <span>{systemLoad}%</span>
                  </div>
                  <div className="h-1 bg-primary/10 w-full overflow-hidden rounded-full">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${systemLoad}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>IDS THREAT INDEX:</span>
                    <span className={threatScore > 50 ? 'text-warning font-bold' : 'text-secondary'}>{threatScore}%</span>
                  </div>
                  <div className="h-1 bg-primary/10 w-full overflow-hidden rounded-full">
                    <div className="h-full bg-warning transition-all duration-300" style={{ width: `${threatScore}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Interactive Canvas Network Map */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative z-10 border-y lg:border-y-0 lg:border-x border-primary/10 py-6 lg:py-0">
            <h3 className="text-secondary font-mono text-xs tracking-wider mb-2 uppercase font-bold text-center w-full">&gt; Visual Intrusion Map</h3>
            <canvas ref={canvasRef} className="bg-background/45 border border-primary/15 rounded-sm" />
            <div className="text-[8px] text-primary/45 uppercase tracking-widest mt-2">
              REAL-TIME LOCAL NET NODE CONNECTIVITY
            </div>
          </div>

          {/* Right Column: Dynamic Scrolling security logs */}
          <div className="lg:col-span-4 flex flex-col relative z-10 h-[320px] lg:h-auto">
            <h3 className="text-secondary font-mono text-xs tracking-wider mb-4 uppercase font-bold">&gt; System Threat Logs</h3>
            <div ref={logsContainerRef} className="flex-grow bg-[#07090f]/75 border border-primary/25 rounded-sm p-4 overflow-y-auto font-mono text-[9px] space-y-2.5 max-h-[300px] lg:max-h-[320px] scrollbar-thin">
              {logs.map((log, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 leading-normal border-b border-primary/5 pb-1">
                  <div className="flex justify-between text-primary/40 font-semibold">
                    <span>[{log.timestamp}] // SRC: {log.source}</span>
                    <span className="uppercase text-[8px] bg-primary/5 px-1 font-bold">{log.severity}</span>
                  </div>
                  <div className={getLogSeverityClass(log.severity)}>{log.event}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
