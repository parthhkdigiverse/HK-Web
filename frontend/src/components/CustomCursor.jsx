import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Position references for interpolation (lerp)
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if it's desktop
    const checkDevice = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      const isLargeScreen = window.innerWidth > 1024;
      setIsDesktop(hasFinePointer && isLargeScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    if (!isDesktop) return () => window.removeEventListener('resize', checkDevice);

    // Add active class to body to hide browser cursor
    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      // Scale cursor on interactive elements
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer');

      if (isInteractive) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovered(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    // Lerp loop for outer ring
    let animationFrameId;
    const render = () => {
      // Lerp formula: current = current + (target - current) * lerpFactor
      const ease = 0.12;
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * ease;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorPos.current.x}px`;
        cursorRef.current.style.top = `${cursorPos.current.y}px`;
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Main mouse dot */}
      <div 
        ref={dotRef} 
        className="custom-cursor-dot" 
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      {/* Interpolated outer ring with glow */}
      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{
          transform: 'translate(-50%, -50%)',
          width: isHovered ? '50px' : '20px',
          height: isHovered ? '50px' : '20px',
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)',
          boxShadow: isHovered ? '0 0 20px rgba(255, 255, 255, 0.15)' : 'none',
        }}
      />
    </>
  );
}
