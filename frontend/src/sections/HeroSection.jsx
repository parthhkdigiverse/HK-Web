import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Magnetic from '../components/Magnetic';
import { useContent } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection({ isLoaded, overrideContent }) {
  const { content: globalContent } = useContent();
  const activeContent = overrideContent || globalContent;
  const { hero } = activeContent;

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textContainerRef = useRef(null);
  const [framesAvailable, setFramesAvailable] = useState(false);

  const totalFrames = hero.frameCount || 315;
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);

  // Detect once preloader has exposed the frames
  useEffect(() => {
    if (isLoaded && window.preloadedFrames && window.preloadedFrames.length > 0) {
      setFramesAvailable(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !framesAvailable) return;

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.8, // Heavy, luxurious scroll inertia
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    let animFrameId;
    function raf(time) {
      lenis.raf(time);
      animFrameId = requestAnimationFrame(raf);
    }
    animFrameId = requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    const tickerUpdate = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctxCanvas = canvas.getContext('2d');
    if (!ctxCanvas) return;

    // Frame drawing logic (respects cover sizing)
    const drawFrame = (index) => {
      const img = window.preloadedFrames[index];
      if (!img) return;

      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;

      const imgWidth = img.naturalWidth || 1920;
      const imgHeight = img.naturalHeight || 1080;

      // Cover scaling math
      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const x = (canvasWidth - imgWidth * scale) / 2;
      const y = (canvasHeight - imgHeight * scale) / 2;

      ctxCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
      ctxCanvas.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    };

    // Canvas sizing setup with pixel ratio density
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctxCanvas.scale(window.devicePixelRatio, window.devicePixelRatio);
      drawFrame(Math.round(currentFrameRef.current));
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Trigger initial sizing

    // Draw first frame immediately
    drawFrame(0);

    // Scope GSAP and ScrollTrigger in a gsap.context()
    const ctx = gsap.context(() => {
      // Create ScrollTrigger to pin hero section and scrub frames
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // 300% of viewport scroll track height (400vh total height)
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          // Map scroll progress (0 to 1) directly to total frame indices
          targetFrameRef.current = self.progress * (totalFrames - 1);
        }
      });

      // Slow fade out on scroll for typography
      const content = textContainerRef.current;
      if (content) {
        gsap.to(content, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150%",
            scrub: true,
          },
          opacity: 0.1,
          y: -40,
          ease: "none"
        });
      }
    });

    // Lerp loop for fluid 60 FPS scrolling frame renders
    let frameRenderAnimFrameId;
    const updateFrame = () => {
      const lerpFactor = 0.08; 
      const diff = targetFrameRef.current - currentFrameRef.current;
      
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * lerpFactor;
        
        if (currentFrameRef.current < 0) currentFrameRef.current = 0;
        if (currentFrameRef.current > totalFrames - 1) currentFrameRef.current = totalFrames - 1;
        
        drawFrame(Math.round(currentFrameRef.current));
      }

      frameRenderAnimFrameId = requestAnimationFrame(updateFrame);
    };
    
    updateFrame();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      lenis.destroy();
      gsap.ticker.remove(tickerUpdate);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (frameRenderAnimFrameId) cancelAnimationFrame(frameRenderAnimFrameId);
      ctx.revert(); // Reverts and cleans up all animations/ScrollTriggers created inside the context
    };
  }, [isLoaded, framesAvailable]);

  // Content entrance animations on loaded trigger
  useEffect(() => {
    if (!isLoaded || !framesAvailable) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo('.reveal-label', 
        { y: '105%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1.2, ease: 'power4.out' }
      )
      .fromTo('.reveal-title-1', 
        { y: '105%' }, 
        { y: '0%', duration: 1.4, ease: 'power4.out' },
        '-=1.0'
      )
      .fromTo('.reveal-title-2', 
        { y: '105%' }, 
        { y: '0%', duration: 1.4, ease: 'power4.out' },
        '-=1.2'
      )
      .fromTo('.reveal-desc', 
        { opacity: 0, y: 25, filter: 'blur(8px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' },
        '-=1.0'
      )
      .fromTo('.reveal-buttons', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=1.1'
      );
    });

    return () => ctx.revert();
  }, [isLoaded, framesAvailable]);

  if (hero.show === false) {
    return null;
  }

  // Calculate container height style
  const containerStyle = {
    height: hero.height || '100vh',
  };

  // Calculate alignment classes
  const alignmentClass = hero.align === 'center' 
    ? 'items-center text-center mx-auto' 
    : hero.align === 'right' 
    ? 'items-end text-right ml-auto' 
    : 'items-start text-left';

  // Calculate overlay style
  const overlayStyle = {
    backgroundColor: hero.overlayColor || '#000000',
    opacity: hero.overlayOpacity !== undefined ? parseFloat(hero.overlayOpacity) : 0.5,
  };

  return (
    <div className="w-full bg-black">
      <div 
        ref={containerRef} 
        style={containerStyle}
        className="relative w-full overflow-hidden bg-black transition-all duration-300"
      >
        {/* Edge-to-Edge Centered Fullscreen Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 block"
        />

        {/* Cinematic Overlays */}
        <div 
          style={overlayStyle}
          className="absolute inset-0 z-[1] pointer-events-none transition-all duration-300" 
        />
        <div className="cinematic-vignette" />
        <div className="noise-overlay" />

        {/* Hero Content */}
        <div 
          ref={textContainerRef}
          className={`absolute inset-0 z-10 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 max-w-6xl space-y-8 ${alignmentClass}`}
        >
          <div className="flex items-center gap-4 reveal-label">
            {hero.align !== 'right' && <span className="w-12 h-[0.5px] bg-white opacity-60"></span>}
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-light">
              {hero.label}
            </span>
            {hero.align === 'right' && <span className="w-12 h-[0.5px] bg-white opacity-60"></span>}
          </div>

          <h1 className="font-display leading-[1.05] mb-2 flex flex-col text-white text-[56px] sm:text-[72px] md:text-[96px] xl:text-[120px] font-bold tracking-tight">
            <span className="mask-reveal block h-fit py-2">
              <span className="reveal-title-1 block text-neutral-400 opacity-60 font-semibold leading-none">
                {hero.title1}
              </span>
            </span>
            <span className="mask-reveal block h-fit py-2">
              <span className="reveal-title-2 block text-white italic font-normal leading-none pt-2">
                {hero.title2}
              </span>
            </span>
          </h1>

          <p className="reveal-desc font-light text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
            {hero.desc}
          </p>

          <div className="reveal-buttons flex flex-wrap gap-5 items-center pt-2">
            {hero.primaryBtnText !== '' && (
              <Magnetic speed={1.2} tolerance={0.4}>
                <a 
                  href={hero.primaryBtnLink || '#contact'}
                  className="glass-btn px-10 py-5 rounded-full text-xs uppercase tracking-[0.2em] font-medium text-white shadow-md relative overflow-hidden group/btn cursor-pointer inline-block"
                >
                  <span className="relative z-10">{hero.primaryBtnText || 'Start a Project →'}</span>
                  <div className="absolute inset-0 bg-white/10 scale-x-0 origin-left transition-transform duration-500 group-hover/btn:scale-x-100" />
                </a>
              </Magnetic>
            )}

            {hero.secondaryBtnText !== '' && (
              <Magnetic speed={1.2} tolerance={0.4}>
                <a 
                  href={hero.secondaryBtnLink || '#portfolio'}
                  className="px-10 py-5 rounded-full text-xs uppercase tracking-[0.2em] font-medium text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer flex items-center gap-2 group/secondary inline-block"
                >
                  <span>{hero.secondaryBtnText || 'View Work'}</span>
                </a>
              </Magnetic>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
