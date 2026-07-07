import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';

export default function ServiceWeb({ overrideContent }) {
  const { content: liveContent } = useContent();
  const content = overrideContent || liveContent;

  // Find current Web service details from database with flexible matching
  const serviceData = content?.services?.find(s => 
    s.href === '#service-web' || 
    s.href === 'service-web' || 
    s.href === '/service-web' ||
    (s.title && s.title.toLowerCase().includes('web'))
  ) || {};

  // 1. Particle positions for Cinematic Hero Background
  const [particles, setParticles] = useState([]);
  const heroRef = useRef(null);

  useEffect(() => {
    // Generate initial particle grid coordinates
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
    
    // Slightly shift particles relative to mouse cursor position
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

  // 2. Speed vs Bloat State
  const [performanceMode, setPerformanceMode] = useState('optimized'); // 'bloated' | 'optimized'
  
  // 3. Feature Wireframe Graph Checklist States (Mapped dynamically from serviceData)
  const [activeFeatures, setActiveFeatures] = useState([]);
  
  useEffect(() => {
    if (serviceData.inner_features) {
      setActiveFeatures(serviceData.inner_features.map((_, i) => i < 2)); // Default first 2 active
    }
  }, [serviceData]);

  const toggleFeature = (index) => {
    setActiveFeatures(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  // 4. Laptop Mockup Frame Tabs State
  const [mockupTab, setMockupTab] = useState('luxury'); // 'luxury' | 'neon' | 'editorial'

  // 5. Tech Stack Selector State
  const [selectedTechIdx, setSelectedTechIdx] = useState(0);
  const techStackList = serviceData.inner_tech_stack || [
    { name: 'React.js', badge: 'Interactive UI', role: 'Component architecture enabling fast component rendering.' },
    { name: 'FastAPI (Python)', badge: 'API Core', role: 'API endpoints with automatic async route processing.' },
    { name: 'PostgreSQL', badge: 'Database', role: 'Secure transactional storage and query indexing layers.' }
  ];
  const activeTech = techStackList[selectedTechIdx] || techStackList[0] || {};

  return (
    <div className="relative min-h-screen bg-[#030307] text-neutral-300 font-sans pb-24 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[10%] left-1/4 w-[35vw] h-[35vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[50%] right-1/4 w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

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
              className="absolute rounded-full bg-amber-400/20"
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
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-500 font-light block"
          >
            {serviceData.page_subtitle || "// Web Engineering Studio"}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            {serviceData.page_hero_title || "Architecting High-Fidelity Web Spaces"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-light text-neutral-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            {serviceData.page_hero_desc || "We replace rigid standard templates with custom component architecture. Hand-coded for visual wow-factor, Lighthouse speeds, and scaling parameters."}
          </motion.p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          II. SPEED VS BLOAT SIMULATOR WIDGET
          ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-28 border-b border-white/5 relative z-10 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Performance Benchmark</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Speed vs Bloat Simulator</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mb-16">
          Toggle between WordPress templates and our optimized code to witness the differences in package weight, frame rate, and load speed.
        </p>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          
          {/* Controls & Gauges (Left - 5 columns) */}
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
                  Standard Template
                </button>
                <button 
                  onClick={() => setPerformanceMode('optimized')}
                  className={`flex-1 py-2 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all ${
                    performanceMode === 'optimized' 
                      ? 'bg-emerald-500 text-black font-bold shadow-lg' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  HK Custom Code
                </button>
              </div>
            </div>

            {/* Gauges parameters list */}
            <div className="space-y-5 font-mono text-[11px]">
              
              {/* Load Time parameter */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>LOAD SPEED:</span>
                  <span className={`font-bold ${performanceMode === 'optimized' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {performanceMode === 'optimized' ? '0.15s (Instant)' : '4.8s (Lagging)'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: performanceMode === 'optimized' ? '8%' : '95%' }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`h-full ${performanceMode === 'optimized' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

              {/* Package size parameter */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>PACKAGE SIZE:</span>
                  <span className={`font-bold ${performanceMode === 'optimized' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {performanceMode === 'optimized' ? '145 KB' : '5.4 MB'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: performanceMode === 'optimized' ? '10%' : '100%' }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`h-full ${performanceMode === 'optimized' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

              {/* Rendering rate parameter */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>FRAME RATE (FPS):</span>
                  <span className={`font-bold ${performanceMode === 'optimized' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {performanceMode === 'optimized' ? '120 FPS' : '24 FPS'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: performanceMode === 'optimized' ? '100%' : '20%' }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`h-full ${performanceMode === 'optimized' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Rendering Box (Right - 7 columns) */}
          <div className="lg:col-span-7 bg-[#09090d]/80 border border-white/5 rounded-3xl p-8 h-80 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
            
            {/* Grid gridlines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            <div className="flex justify-between items-center pb-4 border-b border-white/5 relative z-10">
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Live Frame Rendering Test</span>
              <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${
                performanceMode === 'optimized' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {performanceMode === 'optimized' ? 'Smooth GPU Rendering' : 'CPU Bottle-Neck'}
              </span>
            </div>

            {/* Scrolling test box */}
            <div className="relative flex-1 flex items-center justify-center">
              <motion.div
                animate={performanceMode === 'optimized' 
                  ? { x: [-150, 150] } 
                  : { x: [-150, -100, -50, 0, 50, 100, 150, 100, 50, 0, -50, -100, -150] }
                }
                transition={performanceMode === 'optimized'
                  ? { repeat: Infinity, repeatType: "reverse", duration: 1.8, ease: "easeInOut" }
                  : { repeat: Infinity, duration: 4.5, ease: "linear" }
                }
                className={`w-16 h-16 rounded-2xl flex items-center justify-center z-10 shadow-2xl ${
                  performanceMode === 'optimized' 
                    ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-amber-500/20' 
                    : 'bg-neutral-800 shadow-black'
                }`}
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
            </div>

            <div className="text-center font-mono text-[9px] text-neutral-500 relative z-10">
              // The golden box demonstrates visual response lag on scrolling.
            </div>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          III. FEATURE SELECTOR & SVG WIREFRAME GRAPH
          ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-28 border-b border-white/5 relative z-10 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Architecture Logic</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Custom Feature Blueprint</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mb-16">
          Toggle structural elements on the checklist below to observe how the network connections form on the live wireframe.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left items-stretch">
          
          {/* Checklist side (Left - 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-4 justify-center">
            {(serviceData.inner_features || [
              { title: 'Cinematic Frontends', desc: 'GPU-accelerated interface layouts with smooth gesture physics.' },
              { title: 'Distributed Backend Integration', desc: 'Secure backend microservices configured for horizontal auto-scaling.' },
              { title: 'Continuous Integration Flow', desc: 'Automated CI/CD pipelines deploying builds directly to cloud nodes.' }
            ]).map((item, idx) => (
              <div 
                key={idx}
                onClick={() => toggleFeature(idx)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer select-none text-left ${
                  activeFeatures[idx] 
                    ? 'bg-amber-500/5 border-amber-500/30 shadow-md' 
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    activeFeatures[idx] ? 'border-amber-400 bg-amber-400' : 'border-neutral-600'
                  }`}>
                    {activeFeatures[idx] && (
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-white">{item.title}</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SVG Canvas diagram side (Right - 8 columns) */}
          <div className="lg:col-span-8 bg-[#07070b]/60 border border-white/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md min-h-[340px] flex items-center justify-center">
            
            {/* SVG Wireframe Network Diagram */}
            <svg viewBox="0 0 600 300" className="w-full h-full max-w-[540px] overflow-visible">
              
              {/* Connection Lines */}
              {/* Browser -> Edge (Always active) */}
              <line x1="80" y1="150" x2="200" y2="150" stroke="#3b82f6" strokeWidth="1.5" />
              
              {/* Edge -> WebGL */}
              {activeFeatures[0] && (
                <path d="M 200 150 Q 275 80 350 80" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
              )}
              
              {/* Edge -> FastAPI */}
              <line x1="200" y1="150" x2="350" y2="150" stroke="#10b981" strokeWidth="1.5" />

              {/* FastAPI -> DB */}
              {activeFeatures[1] && (
                <path d="M 350 150 Q 425 220 500 220" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
              )}

              {/* FastAPI -> Admin */}
              {activeFeatures[2] && (
                <path d="M 350 150 Q 425 80 500 80" fill="none" stroke="#ec4899" strokeWidth="2" />
              )}

              {/* Edge -> CI/CD */}
              {activeFeatures[3] && (
                <path d="M 200 150 Q 275 220 350 220" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,4" />
              )}

              {/* Nodes */}
              {/* Browser Node */}
              <circle cx="80" cy="150" r="25" fill="#09090d" stroke="#3b82f6" strokeWidth="2" />
              <text x="80" y="153" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">BROWSER</text>

              {/* CDN Edge Node */}
              <circle cx="200" cy="150" r="25" fill="#09090d" stroke="#3b82f6" strokeWidth="2" />
              <text x="200" y="153" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">EDGE CDN</text>

              {/* WebGL Canvas Node */}
              <circle cx="350" cy="80" r="25" fill="#09090d" stroke={activeFeatures[0] ? "#fbbf24" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="350" y="83" fill={activeFeatures[0] ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">WEBGL</text>

              {/* FastAPI Node */}
              <circle cx="350" cy="150" r="25" fill="#09090d" stroke="#10b981" strokeWidth="2" />
              <text x="350" y="153" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">FASTAPI</text>

              {/* CI/CD Node */}
              <circle cx="350" cy="220" r="25" fill="#09090d" stroke={activeFeatures[3] ? "#a855f7" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="350" y="223" fill={activeFeatures[3] ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">CI / CD</text>

              {/* Admin Panel Node */}
              <circle cx="500" cy="80" r="25" fill="#09090d" stroke={activeFeatures[2] ? "#ec4899" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="500" y="83" fill={activeFeatures[2] ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">ADMIN</text>

              {/* DB Node */}
              <circle cx="500" cy="220" r="25" fill="#09090d" stroke={activeFeatures[1] ? "#6366f1" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="500" y="223" fill={activeFeatures[1] ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">DB MESH</text>

            </svg>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          IV. LAPTOP MOCKUP FRAME (TEMPLATE PREVIEW)
          ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-28 relative z-10 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Design Deliverables</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Visual Mockup Layouts</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mb-16">
          Toggle options below to preview different responsive branding templates inside our high-fidelity container.
        </p>

        {/* Tab triggers */}
        <div className="flex justify-center gap-4 mb-10">
          {[
            { id: 'luxury', label: 'Luxury Dark Editorial' },
            { id: 'neon', label: 'Hacker Cyberpunk Grid' },
            { id: 'editorial', label: 'Warm Light Serif' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMockupTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-medium tracking-wide border transition-all ${
                mockupTab === tab.id 
                  ? 'bg-white text-black border-white font-bold shadow-lg' 
                  : 'text-neutral-400 bg-white/[0.01] border-white/5 hover:border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mockup Frame Container */}
        <div className="rounded-3xl border border-white/10 bg-[#09090d]/90 p-4 max-w-3xl mx-auto shadow-2xl relative">
          
          {/* Header Browser bar */}
          <div className="flex gap-1.5 pb-4 border-b border-white/5 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {/* Browser inner canvas screen */}
          <div className="relative h-96 rounded-2xl overflow-hidden flex items-center justify-center p-6 transition-all duration-700">
            <AnimatePresence mode="wait">
              {mockupTab === 'luxury' && (
                <motion.div
                  key="luxury"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-[#030307] text-left p-12 flex flex-col justify-between"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(245,158,11,0.06),transparent_50%)]" />
                  <div className="space-y-4 relative z-10">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500">// LUXURY RESORT SITE</span>
                    <h3 className="font-display text-3xl font-extrabold text-white tracking-tight leading-tight max-w-md">Bespoke Architectural Destinies</h3>
                    <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-sm">Crafting premium, quiet-luxury digital booking spaces with custom motion maps.</p>
                  </div>
                  <div className="w-16 h-10 border border-amber-500/20 rounded flex items-center justify-center text-amber-400 font-mono text-[10px] relative z-10">
                    GOLDEN
                  </div>
                </motion.div>
              )}

              {mockupTab === 'neon' && (
                <motion.div
                  key="neon"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-[#010809] text-left p-12 flex flex-col justify-between font-mono"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <div className="space-y-4 relative z-10">
                    <span className="text-cyan-400 text-[9px] uppercase tracking-widest">// SECURE BLOCKCHAIN SYSTEM</span>
                    <h3 className="text-2xl font-bold text-white tracking-tight leading-tight max-w-md">INITIALIZE SECURE SHIELD PROTOCOL</h3>
                    <p className="text-cyan-500/80 text-[11px] max-w-sm">Triggering high-concurrency node validation scripts over multithreaded edge servers.</p>
                  </div>
                  <div className="text-cyan-400 text-[10px] animate-pulse">
                    SYS_STATUS: ACTIVE_OK
                  </div>
                </motion.div>
              )}

              {mockupTab === 'editorial' && (
                <motion.div
                  key="editorial"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-[#fbfaf6] text-neutral-800 text-left p-12 flex flex-col justify-between font-serif"
                >
                  <div className="space-y-4">
                    <span className="font-sans text-[8px] uppercase tracking-widest text-neutral-500 font-bold">// THE MODERN ART JOURNAL</span>
                    <h3 className="text-3xl font-normal tracking-tight text-neutral-900 leading-tight max-w-md">The Silent Symphony of Spaces</h3>
                    <p className="font-light text-neutral-500 text-xs sm:text-sm font-sans max-w-sm leading-relaxed">An editorial perspective showcasing minimalist furniture lines, spatial lighting design and organic textures.</p>
                  </div>
                  <div className="font-sans text-[9px] uppercase font-bold text-neutral-900 border-b border-neutral-900 pb-1 w-20">
                    READ JOURNAL
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
        <div className="p-8 rounded-3xl bg-[#09090d]/80 border border-white/5 hover:border-amber-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden min-h-[160px] text-left transition-all">
          <div className="absolute top-4 right-6">
            <span className="font-mono text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
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
          Start Your Web Project
        </a>
      </section>

    </div>
  );
}
