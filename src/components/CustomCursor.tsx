import React, { useState, useEffect, useRef } from 'react';

interface Trail {
  x: number;
  y: number;
  id: number;
  bit: string;
  opacity: number;
}

export const CustomCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reticlePos, setReticlePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [deviceActive, setDeviceActive] = useState(false); // Only enable custom cursor if active pointer is mouse/pen
  const [trails, setTrails] = useState<Trail[]>([]);
  const [clickRipples, setClickRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const mousePosRef = useRef({ x: 0, y: 0 });
  const reticlePosRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  // Lerping animation loop for spring cursor feel
  const animateReticle = () => {
    const targetX = mousePosRef.current.x;
    const targetY = mousePosRef.current.y;
    const currentX = reticlePosRef.current.x;
    const currentY = reticlePosRef.current.y;

    // Smooth LERP (linear interpolation) formula
    const newX = currentX + (targetX - currentX) * 0.16;
    const newY = currentY + (targetY - currentY) * 0.16;

    reticlePosRef.current = { x: newX, y: newY };
    setReticlePos({ x: newX, y: newY });

    requestRef.current = requestAnimationFrame(animateReticle);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateReticle);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Check pointer type: "mouse", "pen", "touch"
      // If user is on a touch device (mobile, tablet, screen touch), e.pointerType is "touch"
      if (e.pointerType === 'touch') {
        setDeviceActive(false);
        document.documentElement.classList.remove('custom-cursor-active');
        return;
      }
      
      setDeviceActive(true);
      document.documentElement.classList.add('custom-cursor-active');
      
      // Update mouse position
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });

      // Determine if hovering clickable element
      const target = e.target as HTMLElement;
      const isOverClickable = !!target.closest('button, a, .clickable, input, select, textarea');
      setIsHovering(isOverClickable);

      // Add high-tech binary trail particles
      if (Math.random() > 0.88) {
        const id = Math.random();
        setTrails(prev => [
          ...prev.slice(-12),
          {
            x: e.clientX + (Math.random() * 20 - 10),
            y: e.clientY + (Math.random() * 20 - 10),
            id,
            bit: Math.random() > 0.5 ? '1' : '0',
            opacity: 0.8
          }
        ]);
        
        setTimeout(() => {
          setTrails(prev => prev.filter(t => t.id !== id));
        }, 600);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      setIsClicking(true);
      
      // Spawn target sonar ripple
      const rippleId = Math.random();
      setClickRipples(prev => [...prev, { x: e.clientX, y: e.clientY, id: rippleId }]);
      setTimeout(() => {
        setClickRipples(prev => prev.filter(r => r.id !== rippleId));
      }, 500);
    };

    const handlePointerUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  if (!deviceActive) return null;

  return (
    <>
      {/* 1. Main instant cursor laser dot */}
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[100000] -translate-x-1/2 -translate-y-1/2"
        style={{ left: mousePos.x, top: mousePos.y }}
      >
        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
          isHovering ? 'bg-secondary shadow-[0_0_8px_var(--secondary)]' : 'bg-primary shadow-[0_0_8px_var(--primary)]'
        }`} />
      </div>

      {/* 2. Delayed Target Scope reticle */}
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2"
        style={{ left: reticlePos.x, top: reticlePos.y }}
      >
        <div className={`relative flex items-center justify-center transition-all duration-300 ${
          isHovering ? 'scale-125' : 'scale-100'
        } ${isClicking ? 'scale-90 opacity-70' : ''}`}>
          {/* Outer rotating HUD circle notches */}
          <div className={`absolute w-9 h-9 border rounded-full border-dashed animate-spin-slow transition-colors duration-300 ${
            isHovering ? 'border-secondary/70' : 'border-primary/30'
          }`} style={{ animationDuration: isHovering ? '6s' : '15s' }} />

          {/* Precision Crosshair Lines */}
          <div className={`absolute w-5 h-[1px] transition-colors duration-300 ${isHovering ? 'bg-secondary/40' : 'bg-primary/20'}`} />
          <div className={`absolute h-5 w-[1px] transition-colors duration-300 ${isHovering ? 'bg-secondary/40' : 'bg-primary/20'}`} />

          {/* Lock Corners */}
          <div className={`absolute w-12 h-12 transition-all duration-300 border-t border-l rounded-tl-[4px] ${
            isHovering ? 'border-secondary/90 -translate-x-1 -translate-y-1' : 'border-transparent'
          }`} />
          <div className={`absolute w-12 h-12 transition-all duration-300 border-t border-r rounded-tr-[4px] ${
            isHovering ? 'border-secondary/90 translate-x-1 -translate-y-1' : 'border-transparent'
          }`} />
          <div className={`absolute w-12 h-12 transition-all duration-300 border-b border-l rounded-bl-[4px] ${
            isHovering ? 'border-secondary/90 -translate-x-1 translate-y-1' : 'border-transparent'
          }`} />
          <div className={`absolute w-12 h-12 transition-all duration-300 border-b border-r rounded-br-[4px] ${
            isHovering ? 'border-secondary/90 translate-x-1 translate-y-1' : 'border-transparent'
          }`} />

          {/* Coordinate Readout label */}
          <div className="absolute left-7 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 text-[7px] font-mono tracking-widest text-primary/45 uppercase whitespace-nowrap bg-background/80 px-1 py-0.5 border border-primary/5 select-none">
            <span>SYS:OK</span>
            <span>X:{Math.round(mousePos.x)}</span>
            <span>Y:{Math.round(mousePos.y)}</span>
            {isHovering && <span className="text-secondary font-bold animate-pulse">LOCKED</span>}
          </div>
        </div>
      </div>

      {/* 3. Sonar Scan Click Ripples */}
      {clickRipples.map(ripple => (
        <div 
          key={ripple.id}
          className="fixed top-0 left-0 pointer-events-none z-[99998] w-14 h-14 border border-secondary rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}

      {/* 4. Binary Decaying Trails */}
      {trails.map(trail => (
        <div 
          key={trail.id}
          className="fixed top-0 left-0 pointer-events-none z-[99997] text-[8px] font-mono text-primary/30 select-none animate-fade-out"
          style={{ left: trail.x, top: trail.y }}
        >
          {trail.bit}
        </div>
      ))}
    </>
  );
};
