import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Magnetic({ children, speed = 1, tolerance = 0.35 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = container.getBoundingClientRect();
      
      // Center coordinates of the button
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      // Calculate delta distance
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      
      // Translate coordinates based on speed and tolerance
      gsap.to(container, {
        x: deltaX * tolerance * speed,
        y: deltaY * tolerance * speed,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      // Reset translation with a premium soft spring rebound
      gsap.to(container, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [speed, tolerance]);

  return (
    <div ref={containerRef} className="inline-block">
      {children}
    </div>
  );
}
