import React, { useState, useEffect } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState<{ x: number, y: number, id: number, bit: string }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('button, a, .clickable'));

      // Add binary trail
      if (Math.random() > 0.9) {
        const id = Math.random();
        setTrails(prev => [...prev.slice(-10), { x: e.clientX, y: e.clientY, id, bit: Math.random() > 0.5 ? '1' : '0' }]);
        setTimeout(() => {
          setTrails(prev => prev.filter(t => t.id !== id));
        }, 500);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Target Reticle */}
      <div 
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-150 ease-out`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div className={`relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 ${isHovering ? 'scale-150' : 'scale-100'}`}>
          {/* Outer Ring */}
          <div className={`absolute w-8 h-8 border-2 rounded-full border-dashed animate-spin-slow ${isHovering ? 'border-secondary' : 'border-primary/50'}`} />
          
          {/* Inner Crosshair */}
          <div className={`absolute w-1 h-1 bg-white rounded-full ${isClicking ? 'scale-50' : 'scale-100'}`} />
          <div className={`absolute w-4 h-[1px] ${isHovering ? 'bg-secondary' : 'bg-primary'}`} />
          <div className={`absolute h-4 w-[1px] ${isHovering ? 'bg-secondary' : 'bg-primary'}`} />
          
          {/* Locked On Label */}
          {isHovering && (
            <div className="absolute left-6 top-0 text-[8px] font-mono text-secondary animate-pulse whitespace-nowrap">
              LOCKED_ON
            </div>
          )}
        </div>
      </div>

      {/* Binary Trails */}
      {trails.map(trail => (
        <div 
          key={trail.id}
          className="fixed top-0 left-0 pointer-events-none z-[9998] text-[10px] font-mono text-primary/30 animate-fade-out"
          style={{ left: trail.x, top: trail.y }}
        >
          {trail.bit}
        </div>
      ))}

      {/* Click Ripple (handled globally in CSS or simplified here) */}
      {isClicking && (
        <div 
          className="fixed top-0 left-0 pointer-events-none z-[9997] w-12 h-12 border border-primary/50 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{ left: position.x, top: position.y }}
        />
      )}
    </>
  );
};
