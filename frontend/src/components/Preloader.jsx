import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useContent } from '../context/ContentContext';

export default function Preloader({ onComplete }) {
  const { content } = useContent();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing systems...");
  const isMountedRef = useRef(true);
  const timelineRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    const totalFrames = (content && content.hero && content.hero.frameCount) || 315;
    const frames = [];
    const images = [];
    let loadedCount = 0;

    const updateProgress = () => {
      if (!isMountedRef.current) return;
      loadedCount++;
      const percent = Math.round((loadedCount / totalFrames) * 100);
      setProgress(percent);

      if (percent < 25) {
        setStatus("Preloading cinematic assets...");
      } else if (percent < 60) {
        setStatus("Rendering canvas frames...");
      } else if (percent < 90) {
        setStatus("Synchronizing interactions...");
      } else {
        setStatus("Calibrating hardware...");
      }

      if (loadedCount === totalFrames) {
        // Expose preloaded frame Image elements globally
        window.preloadedFrames = frames;
        
        // Ensure fonts are loaded before dissolving, with a safeguard timeout
        const startDissolve = () => {
          if (!isMountedRef.current) return;
          setProgress(100);
          setStatus("Ready");
          timeoutRef.current = setTimeout(() => {
            if (!isMountedRef.current) return;
            const tl = gsap.timeline({
              onComplete: () => {
                if (isMountedRef.current) {
                  onComplete();
                }
              }
            });
            timelineRef.current = tl;
            tl.to('.preloader-logo', { opacity: 0, scale: 0.95, duration: 0.8, ease: "power4.out" })
              .to('.preloader-progress', { opacity: 0, y: 10, duration: 0.5, ease: "power4.out" }, "-=0.6")
              .to('.preloader-bg', { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", duration: 1.2, ease: "power4.inOut" }, "-=0.3");
          }, 600);
        };

        // Fallback timeout: start dissolving after 800ms even if fonts promise hangs
        const fontTimeout = setTimeout(startDissolve, 800);

        document.fonts.ready
          .then(() => {
            clearTimeout(fontTimeout);
            startDissolve();
          })
          .catch(() => {
            clearTimeout(fontTimeout);
            startDissolve();
          });
      }
    };

    // Preload each frame image
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(4, '0');
      img.src = `/images/frames/frame_${frameNum}.jpg`;
      img.onload = () => {
        if (!isMountedRef.current) return;
        frames[i] = img;
        updateProgress();
      };
      img.onerror = () => {
        console.error(`Failed to load frame ${frameNum}`);
        if (!isMountedRef.current) return;
        updateProgress();
      };
      images.push(img);
    }

    return () => {
      isMountedRef.current = false;
      // Cancel image loading handlers to prevent state updates on unmounted component
      images.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
      // Clear timers and timelines
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [onComplete]);

  return (
    <div className="preloader-bg fixed inset-0 w-full h-full bg-[#000000] z-[9999] flex flex-col items-center justify-center select-none overflow-hidden" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
      {/* Sleek geometric SVG logo */}
      <div className="preloader-logo flex flex-col items-center mb-12">
        <svg className="w-20 h-20 text-white mb-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 25 L45 25 L45 75 L25 75 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.5" />
          <path d="M55 25 L75 25 L75 75 L55 75 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.5" />
          <path d="M25 50 L75 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M45 25 L55 75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" />
        </svg>
        <span className="font-display tracking-[0.4em] text-xs uppercase font-light text-neutral-400">
          HariKrushn Digiverse
        </span>
      </div>

      {/* Progress percentage & status */}
      <div className="preloader-progress flex flex-col items-center font-mono">
        <div className="text-4xl md:text-5xl font-light tracking-widest text-white mb-2">
          {progress.toString().padStart(3, '0')}%
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-sans mt-2 animate-pulse">
          {status}
        </div>
      </div>
    </div>
  );
}
