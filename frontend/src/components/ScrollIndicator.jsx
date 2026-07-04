import React, { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 transition-all duration-700 ease-out select-none pointer-events-none",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <span className="text-[10px] uppercase tracking-[0.3em] font-light text-neutral-400">
        Scroll
      </span>
      {/* Sleek, luxury animated vertical line indicator */}
      <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden rounded-full">
        <div className="w-full h-1/2 bg-white absolute top-0 left-0 animate-scroll-line" />
      </div>
      
      {/* Styles for line animation */}
      <style>{`
        @keyframes scroll-line {
          0% {
            transform: translateY(-100%);
          }
          50% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(200%);
          }
        }
        .animate-scroll-line {
          animation: scroll-line 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
      `}</style>
    </div>
  );
}
