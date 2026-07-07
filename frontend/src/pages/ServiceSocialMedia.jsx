import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';

export default function ServiceSocialMedia({ overrideContent }) {
  const { content: liveContent } = useContent();
  const content = overrideContent || liveContent;
  const serviceData = content?.services?.find(s => 
    s.href === '#service-social-media-management' || 
    s.href === 'service-social-media-management' || 
    s.href === '/service-social-media-management' ||
    (s.title && (s.title.toLowerCase().includes('social') || s.title.toLowerCase().includes('media')))
  ) || {};

  // 1. Particle positions for Cinematic Hero Background
  const [particles, setParticles] = useState([]);
  const heroRef = useRef(null);

  useEffect(() => {
    const list = [];
    for (let i = 0; i < 30; i++) {
      list.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 20 + 20
      });
    }
    setParticles(list);
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setParticles(prev => prev.map(p => {
      const pX = (p.x / 100) * rect.width;
      const pY = (p.y / 100) * rect.height;
      const dist = Math.hypot(pX - mouseX, pY - mouseY);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        return {
          ...p,
          shiftX: (pX - mouseX) * force * 0.15,
          shiftY: (pY - mouseY) * force * 0.15
        };
      }
      return { ...p, shiftX: 0, shiftY: 0 };
    }));
  };

  // 2. Aesthetic Content Grid State
  const [performanceMode, setPerformanceMode] = useState('optimized'); // 'bloated' | 'optimized'
  
  // 3. Feature Wireframe Graph Checklist States
  const [features, setFeatures] = useState({
    planner: true,
    assets: true,
    community: false,
    guide: false
  });

  const toggleFeature = (key) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 4. Custom Feed Mockups State
  const [mockupTab, setMockupTab] = useState('linkedin'); // 'linkedin' | 'instagram' | 'twitter'

  // 5. Tech Stack Selector State
  const [selectedTechIdx, setSelectedTechIdx] = useState(0);
  const techStackList = serviceData.inner_tech_stack || [
    { name: 'Adobe Photoshop', badge: 'Visual Design', role: 'Crafts high-fidelity layouts, composite editorial graphic plates, and pixel-perfect image visual adjustments.' },
    { name: 'Adobe Illustrator', badge: 'Vector Graphics', role: 'Engineers vector logo assets, structural icons, editorial brand shapes, and clean brand packaging layouts.' },
    { name: 'Adobe Premiere / AE', badge: 'Motion Video', role: 'Produces fluid video micro-animations, reels transition cuts, audio synchronization, and visual effects pipelines.' }
  ];
  const activeTech = techStackList[selectedTechIdx] || techStackList[0] || {};

  return (
    <div className="relative min-h-screen bg-[#030307] text-neutral-300 font-sans pb-24 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[10%] left-1/4 w-[35vw] h-[35vw] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[50%] right-1/4 w-[40vw] h-[40vw] rounded-full bg-rose-500/5 blur-[130px] pointer-events-none" />

      {/* ──────────────────────────────────────────────────
          I. CINEMATIC HERO SECTION WITH FLOATING PARTICLES
          ────────────────────────────────────────────────── */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative h-[65vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden border-b border-white/5"
      >
        {/* Floating Particle Canvas */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {particles.map(p => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-pink-400/20"
              animate={{
                y: ["0%", "100%"],
                x: [`${p.x}%`, `${p.x + (Math.sin(p.id) * 5)}%`]
              }}
              transition={{
                duration: p.speed,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                width: p.size,
                height: p.size,
                top: `${p.y}%`,
                left: `${p.x}%`,
                transform: `translate(${p.shiftX || 0}px, ${p.shiftY || 0}px)`,
                filter: "blur(0.5px)"
              }}
            />
          ))}
        </div>

        <div className="relative z-10 space-y-6 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-pink-400 font-light block"
          >
            {serviceData.page_subtitle || "// Brand Management Agency"}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            {serviceData.page_hero_title || "Curating Immersive Brand Stories"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-light text-neutral-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            {serviceData.page_hero_desc || "We structure editorial visual grids, creating bespoke brand design manuals and high-end digital assets that stand out across global networks."}
          </motion.p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          II. SPEED VS BLOAT SIMULATOR WIDGET
          ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-28 border-b border-white/5 relative z-10 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Performance Benchmark</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Branding Engagement Simulator</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mb-16">
          Toggle brand templates to compare standard corporate posts with optimized aesthetic content.
        </p>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          
          <div className="lg:col-span-5 space-y-8 bg-white/[0.01] border border-white/5 p-8 rounded-3xl backdrop-blur-md">
            
            {/* Mode Switcher */}
            <div className="space-y-3">
              <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block">Select Build Mode</label>
              <div className="flex gap-2 bg-black/40 border border-white/5 p-1 rounded-full">
                <button 
                  onClick={() => setPerformanceMode('bloated')}
                  className={`flex-1 py-2 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all ${
                    performanceMode === 'bloated' 
                      ? 'bg-rose-500 text-white font-bold shadow-lg' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Standard Post Set
                </button>
                <button 
                  onClick={() => setPerformanceMode('optimized')}
                  className={`flex-1 py-2 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all ${
                    performanceMode === 'optimized' 
                      ? 'bg-pink-500 text-white font-bold shadow-lg' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  HK Aesthetic Grid
                </button>
              </div>
            </div>

            {/* Gauges */}
            <div className="space-y-5 font-mono text-[11px]">
              
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>ENGAGEMENT FREQUENCY RATE:</span>
                  <span className={`font-bold ${performanceMode === 'optimized' ? 'text-pink-400' : 'text-rose-400'}`}>
                    {performanceMode === 'optimized' ? '8.4% (Industry High)' : '0.8% (Sluggish)'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: performanceMode === 'optimized' ? '92%' : '10%' }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`h-full ${performanceMode === 'optimized' ? 'bg-pink-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>ORGANIC OUTREACH GROWTH:</span>
                  <span className={`font-bold ${performanceMode === 'optimized' ? 'text-pink-400' : 'text-rose-400'}`}>
                    {performanceMode === 'optimized' ? '+420% Monthly' : '+3% Stagnant'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: performanceMode === 'optimized' ? '100%' : '12%' }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`h-full ${performanceMode === 'optimized' ? 'bg-pink-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>BRAND AUTHORITY INDEX:</span>
                  <span className={`font-bold ${performanceMode === 'optimized' ? 'text-pink-400' : 'text-rose-400'}`}>
                    {performanceMode === 'optimized' ? 'Premium Niche' : 'Commodity Level'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: performanceMode === 'optimized' ? '95%' : '20%' }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`h-full ${performanceMode === 'optimized' ? 'bg-pink-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Rendering Box (Right) */}
          <div className="lg:col-span-7 bg-[#09090d]/80 border border-white/5 rounded-3xl p-8 h-80 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            <div className="flex justify-between items-center pb-4 border-b border-white/5 relative z-10">
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Live Brand Badge Pulse Test</span>
              <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${
                performanceMode === 'optimized' ? 'bg-pink-500/10 text-pink-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {performanceMode === 'optimized' ? 'Immersive Authority' : 'Static Brand Output'}
              </span>
            </div>

            <div className="relative flex-1 flex items-center justify-center">
              <motion.div
                animate={performanceMode === 'optimized' 
                  ? { scale: [1, 1.2, 1], rotate: 360 } 
                  : { scale: [1, 1.02, 1] }
                }
                transition={performanceMode === 'optimized'
                  ? { repeat: Infinity, duration: 3, ease: "easeInOut" }
                  : { repeat: Infinity, duration: 5, ease: "linear" }
                }
                className={`w-16 h-16 rounded-full flex items-center justify-center z-10 shadow-2xl ${
                  performanceMode === 'optimized' 
                    ? 'bg-gradient-to-tr from-pink-500 to-rose-400 shadow-pink-500/20' 
                    : 'bg-neutral-800 shadow-black'
                }`}
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </motion.div>
            </div>

            <div className="text-center font-mono text-[9px] text-neutral-500 relative z-10">
              // The pink circle shows design vibration and client interaction response.
            </div>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          III. FEATURE SELECTOR & SVG WIREFRAME GRAPH
          ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-28 border-b border-white/5 relative z-10 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Architecture Logic</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Branding Logic Blueprint</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mb-16">
          Toggle brand pipeline systems to visualize graphic delivery paths and media schedules.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left items-stretch">
          
          <div className="lg:col-span-4 flex flex-col gap-4 justify-center">
            {[
              { key: 'planner', label: 'Editorial Planner Calendars', desc: 'Schedules post distributions' },
              { key: 'assets', label: 'High-End Visual Assets', desc: 'Bespoke image palettes and graphics design' },
              { key: 'community', label: 'Active Community Channels', desc: 'Triggers customer response grids' },
              { key: 'guide', label: 'Brand Guidelines Guidebook', desc: 'Corporate communication voice definition' }
            ].map(item => (
              <div 
                key={item.key}
                onClick={() => toggleFeature(item.key)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                  features[item.key] 
                    ? 'bg-pink-500/5 border-pink-500/30 shadow-md' 
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    features[item.key] ? 'border-pink-400 bg-pink-400' : 'border-neutral-600'
                  }`}>
                    {features[item.key] && (
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-white">{item.label}</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-8 bg-[#07070b]/60 border border-white/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md min-h-[340px] flex items-center justify-center">
            
            <svg viewBox="0 0 600 300" className="w-full h-full max-w-[540px] overflow-visible">
              
              <line x1="80" y1="150" x2="200" y2="150" stroke="#ec4899" strokeWidth="1.5" />
              
              {features.planner && (
                <path d="M 200 150 Q 275 80 350 80" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
              )}
              
              <line x1="200" y1="150" x2="350" y2="150" stroke="#10b981" strokeWidth="1.5" />

              {features.guide && (
                <path d="M 350 150 Q 425 220 500 220" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
              )}

              {features.assets && (
                <path d="M 350 150 Q 425 80 500 80" fill="none" stroke="#ec4899" strokeWidth="2" />
              )}

              {features.community && (
                <path d="M 200 150 Q 275 220 350 220" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,4" />
              )}

              <circle cx="80" cy="150" r="25" fill="#09090d" stroke="#ec4899" strokeWidth="2" />
              <text x="80" y="153" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">BRAND</text>

              <circle cx="200" cy="150" r="25" fill="#09090d" stroke="#ec4899" strokeWidth="2" />
              <text x="200" y="153" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">MEDIA</text>

              <circle cx="350" cy="80" r="25" fill="#09090d" stroke={features.planner ? "#fbbf24" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="350" y="83" fill={features.planner ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">PLANNER</text>

              <circle cx="350" cy="150" r="25" fill="#09090d" stroke="#10b981" strokeWidth="2" />
              <text x="350" y="153" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">FEED PIP</text>

              <circle cx="350" cy="220" r="25" fill="#09090d" stroke={features.community ? "#a855f7" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="350" y="223" fill={features.community ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">COMMUNITY</text>

              <circle cx="500" cy="80" r="25" fill="#09090d" stroke={features.assets ? "#ec4899" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="500" y="83" fill={features.assets ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">ASSETS</text>

              <circle cx="500" cy="220" r="25" fill="#09090d" stroke={features.guide ? "#6366f1" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="500" y="223" fill={features.guide ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">VOICE GD</text>

            </svg>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          IV. BRAND FEED MOCKUP FRAME (PREVIEW)
          ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-28 border-b border-white/5 relative z-10 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Branding Deliverables</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Feed Interface Mockups</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mb-16">
          Toggle options below to preview live editorial layouts across LinkedIn, Instagram, and Twitter frameworks.
        </p>

        {/* Tab triggers */}
        <div className="flex justify-center gap-4 mb-10">
          {[
            { id: 'linkedin', label: 'LinkedIn Article Grid' },
            { id: 'instagram', label: 'Quiet-Luxury Puzzle Grid' },
            { id: 'twitter', label: 'Technical Twitter Thread' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMockupTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-medium tracking-wide border transition-all ${
                mockupTab === tab.id 
                  ? 'bg-pink-500 text-white border-pink-500 font-bold shadow-lg' 
                  : 'text-neutral-400 bg-white/[0.01] border-white/5 hover:border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mockup Frame Container */}
        <div className="rounded-3xl border border-white/10 bg-[#09090d]/90 p-4 max-w-3xl mx-auto shadow-2xl relative">
          
          <div className="flex gap-1.5 pb-4 border-b border-white/5 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="relative h-96 rounded-2xl overflow-hidden flex items-center justify-center p-6 transition-all duration-700">
            <AnimatePresence mode="wait">
              {mockupTab === 'linkedin' && (
                <motion.div
                  key="linkedin"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-[#040206] text-left p-12 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-pink-400">// LINKEDIN ARTICLE FEED</span>
                    <h3 className="font-display text-2xl font-bold text-white tracking-tight leading-tight max-w-md">Cultivating Leadership: Custom CRM Dynamics</h3>
                    <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-sm">How we build custom micro-frontends to increase enterprise productivity.</p>
                  </div>
                  <div className="w-24 h-10 border border-pink-500/20 rounded flex items-center justify-center text-pink-400 font-mono text-[10px]">
                    PUBLISHED
                  </div>
                </motion.div>
              )}

              {mockupTab === 'instagram' && (
                <motion.div
                  key="instagram"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-[#090204] text-left p-12 flex flex-col justify-between font-mono"
                >
                  <div className="space-y-4">
                    <span className="text-pink-400 text-[9px] uppercase tracking-widest">// INSTAGRAM FEED</span>
                    <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">Visual Equilibrium</h3>
                    <div className="h-28 border border-white/5 rounded-xl bg-white/[0.01] flex items-center justify-center text-neutral-600 text-[10px]">
                      [Aesthetic puzzle visual layout grid]
                    </div>
                  </div>
                </motion.div>
              )}

              {mockupTab === 'twitter' && (
                <motion.div
                  key="twitter"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-[#0d0914] text-left p-12 flex flex-col justify-between font-mono"
                >
                  <div className="space-y-4">
                    <span className="text-[8px] uppercase tracking-widest text-pink-400">// TECH THREAD LOGS</span>
                    <h3 className="text-xl font-normal text-white">System Architecture Thread</h3>
                    <div className="space-y-2 text-[10px] text-neutral-400">
                      <div>1/ We replaced rigid template layouts with custom React components.</div>
                      <div>2/ Result: Lighthouse index performance jumped from 40 to 98.</div>
                      <div>3/ Read our full engineering guidelines below.</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          IV.5 INTERACTIVE TECH STACK SELECTOR
          ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 mb-24 relative z-10 text-center pt-16">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Architecture Suite</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Our Tech Stack</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-md mx-auto mb-12">
          Click on any technology component below to understand its technical role in our system builds.
        </p>

        {/* Tab Buttons flex layout */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {techStackList.map((tech, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTechIdx(idx)}
              className={`px-4 py-3 rounded-2xl text-[10px] font-mono font-bold tracking-wider uppercase border transition-all duration-300 ${
                selectedTechIdx === idx 
                  ? 'bg-white text-black border-white shadow-lg' 
                  : 'text-neutral-400 bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}
            >
              {tech.name}
            </button>
          ))}
        </div>

        {/* Selected Tech Card info details */}
        <div className="p-8 rounded-3xl bg-[#09090d]/80 border border-white/5 hover:border-pink-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden min-h-[160px] text-left transition-all">
          <div className="absolute top-4 right-6">
            <span className="font-mono text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400">
              {activeTech.badge || 'Core Stack'}
            </span>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTechIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h4 className="font-display font-extrabold text-base text-white">{activeTech.name}</h4>
              <p className="font-light text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {activeTech.role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          V. START PROJECT CTA
          ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 relative z-10 text-center py-20">
        <a 
          href="#contact" 
          className="bg-white text-black px-12 py-5 rounded-full text-xs font-mono font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-2xl shadow-white/5"
        >
          Inquire About Brand Management
        </a>
      </section>

    </div>
  );
}
