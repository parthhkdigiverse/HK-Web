import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServiceApp() {
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

  // 2. Gesture / Framework Speed State
  const [performanceMode, setPerformanceMode] = useState('optimized'); // 'bloated' | 'optimized'
  
  // 3. Feature Wireframe Graph Checklist States
  const [features, setFeatures] = useState({
    notifications: true,
    offline: true,
    auth: false,
    biometrics: false
  });

  const toggleFeature = (key) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 4. Mobile Screen Mockups State
  const [mockupTab, setMockupTab] = useState('crypto'); // 'crypto' | 'fitness' | 'retail'

  // 5. Tech Stack Selector State
  const [selectedTech, setSelectedTech] = useState('flutter');

  const techStack = {
    flutter: {
      name: 'Flutter (Dart)',
      role: 'Google\'s high-performance UI toolkit. Compiles to native ARM machine code for iOS and Android, allowing 120 FPS render pipelines.',
      badge: 'Primary Framework'
    },
    reactnative: {
      name: 'React Native',
      role: 'Builds native applications using React and JavaScript. Bridges component logic to platform UI views seamlessly.',
      badge: 'Hybrid Bridge'
    },
    swift: {
      name: 'Swift / SwiftUI',
      role: 'Apple\'s native language for iOS. Enables high-fidelity widget views, Apple Pay configurations, and direct hardware API calls.',
      badge: 'Native iOS'
    },
    kotlin: {
      name: 'Kotlin',
      role: 'Google\'s preferred language for Android. Ideal for building native background services, sensor polling, and notification channels.',
      badge: 'Native Android'
    },
    sqlite: {
      name: 'SQLite / Room',
      role: 'Embedded serverless database that stores application data locally, facilitating immediate offline operations.',
      badge: 'Local Database'
    },
    firebase: {
      name: 'Firebase (FCM)',
      role: 'Manages real-time cloud data streams, Google Analytics reporting, crash logs, and remote push notification deliveries.',
      badge: 'Cloud Services'
    }
  };

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
              className="absolute rounded-full bg-cyan-400/20"
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
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-light block"
          >
            // Mobile Systems Studio
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            Engineering Native <br />
            <span className="text-neutral-400 font-light italic">Mobile Interfaces</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-light text-neutral-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            We develop premium iOS and Android applications utilizing Flutter or Swift, optimizing native frame updates, local caches, and seamless sensor integrations.
          </motion.p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          II. SPEED VS BLOAT SIMULATOR WIDGET
          ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-28 border-b border-white/5 relative z-10 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Performance Benchmark</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Native Performance Simulator</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mb-16">
          Compare hybrid web views with our native compiled engine metrics to see differences in gesture response and battery draw.
        </p>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          
          {/* Controls & Gauges (Left) */}
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
                  WebView Hybrid
                </button>
                <button 
                  onClick={() => setPerformanceMode('optimized')}
                  className={`flex-1 py-2 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all ${
                    performanceMode === 'optimized' 
                      ? 'bg-cyan-500 text-black font-bold shadow-lg' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Native Compiled
                </button>
              </div>
            </div>

            {/* Gauges */}
            <div className="space-y-5 font-mono text-[11px]">
              
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>GESTURE RESPONSE TIMING:</span>
                  <span className={`font-bold ${performanceMode === 'optimized' ? 'text-cyan-400' : 'text-rose-400'}`}>
                    {performanceMode === 'optimized' ? '5ms (Instant)' : '110ms (Sluggish)'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: performanceMode === 'optimized' ? '5%' : '90%' }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`h-full ${performanceMode === 'optimized' ? 'bg-cyan-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>BATTERY CONSUMPTION RATE:</span>
                  <span className={`font-bold ${performanceMode === 'optimized' ? 'text-cyan-400' : 'text-rose-400'}`}>
                    {performanceMode === 'optimized' ? 'Minimal' : 'Extremely High'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: performanceMode === 'optimized' ? '12%' : '85%' }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`h-full ${performanceMode === 'optimized' ? 'bg-cyan-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>REFRESH FREQUENCY:</span>
                  <span className={`font-bold ${performanceMode === 'optimized' ? 'text-cyan-400' : 'text-rose-400'}`}>
                    {performanceMode === 'optimized' ? '120 FPS' : '30 FPS'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: performanceMode === 'optimized' ? '100%' : '25%' }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`h-full ${performanceMode === 'optimized' ? 'bg-cyan-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Rendering Box (Right) */}
          <div className="lg:col-span-7 bg-[#09090d]/80 border border-white/5 rounded-3xl p-8 h-80 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            <div className="flex justify-between items-center pb-4 border-b border-white/5 relative z-10">
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Live Gesture Rendering Test</span>
              <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${
                performanceMode === 'optimized' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {performanceMode === 'optimized' ? 'Native Rendering' : 'UI Thread Overload'}
              </span>
            </div>

            <div className="relative flex-1 flex items-center justify-center">
              <motion.div
                animate={performanceMode === 'optimized' 
                  ? { y: [-60, 60] } 
                  : { y: [-60, -40, -20, 0, 20, 40, 60, 40, 20, 0, -20, -40, -60] }
                }
                transition={performanceMode === 'optimized'
                  ? { repeat: Infinity, repeatType: "reverse", duration: 1.8, ease: "easeInOut" }
                  : { repeat: Infinity, duration: 4.5, ease: "linear" }
                }
                className={`w-16 h-16 rounded-2xl flex items-center justify-center z-10 shadow-2xl ${
                  performanceMode === 'optimized' 
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-400 shadow-cyan-500/20' 
                    : 'bg-neutral-800 shadow-black'
                }`}
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </motion.div>
            </div>

            <div className="text-center font-mono text-[9px] text-neutral-500 relative z-10">
              // The cyan box demonstrates frame dropping during thread operations.
            </div>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          III. FEATURE SELECTOR & SVG WIREFRAME GRAPH
          ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-28 border-b border-white/5 relative z-10 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Architecture Logic</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Mobile Feature Blueprint</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mb-16">
          Toggle features to visualize sync paths and secure connections across mobile databases.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left items-stretch">
          
          <div className="lg:col-span-4 flex flex-col gap-4 justify-center">
            {[
              { key: 'notifications', label: 'Push Notifications FCM', desc: 'Firebase Cloud messaging updates' },
              { key: 'offline', label: 'Offline Sync Database', desc: 'Secure SQLite parameters caching' },
              { key: 'auth', label: 'OAuth Google / Apple', desc: 'External secure API validations' },
              { key: 'biometrics', label: 'FaceID / TouchID Lock', desc: 'Encrypted device keychain parameters' }
            ].map(item => (
              <div 
                key={item.key}
                onClick={() => toggleFeature(item.key)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                  features[item.key] 
                    ? 'bg-cyan-500/5 border-cyan-500/30 shadow-md' 
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    features[item.key] ? 'border-cyan-400 bg-cyan-400' : 'border-neutral-600'
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
              
              <line x1="80" y1="150" x2="200" y2="150" stroke="#06b6d4" strokeWidth="1.5" />
              
              {features.notifications && (
                <path d="M 200 150 Q 275 80 350 80" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
              )}
              
              <line x1="200" y1="150" x2="350" y2="150" stroke="#10b981" strokeWidth="1.5" />

              {features.offline && (
                <path d="M 350 150 Q 425 220 500 220" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
              )}

              {features.biometrics && (
                <path d="M 350 150 Q 425 80 500 80" fill="none" stroke="#ec4899" strokeWidth="2" />
              )}

              {features.auth && (
                <path d="M 200 150 Q 275 220 350 220" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,4" />
              )}

              <circle cx="80" cy="150" r="25" fill="#09090d" stroke="#06b6d4" strokeWidth="2" />
              <text x="80" y="153" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">MOBILE APP</text>

              <circle cx="200" cy="150" r="25" fill="#09090d" stroke="#06b6d4" strokeWidth="2" />
              <text x="200" y="153" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">API SYNC</text>

              <circle cx="350" cy="80" r="25" fill="#09090d" stroke={features.notifications ? "#fbbf24" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="350" y="83" fill={features.notifications ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">PUSH NOTIF</text>

              <circle cx="350" cy="150" r="25" fill="#09090d" stroke="#10b981" strokeWidth="2" />
              <text x="350" y="153" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">FASTAPI</text>

              <circle cx="350" cy="220" r="25" fill="#09090d" stroke={features.auth ? "#a855f7" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="350" y="223" fill={features.auth ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">OAUTH API</text>

              <circle cx="500" cy="80" r="25" fill="#09090d" stroke={features.biometrics ? "#ec4899" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="500" y="83" fill={features.biometrics ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">FACE ID</text>

              <circle cx="500" cy="220" r="25" fill="#09090d" stroke={features.offline ? "#6366f1" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="500" y="223" fill={features.offline ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">SQLITE</text>

            </svg>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          IV. PHONE SCREEN MOCKUP FRAME (PREVIEW)
          ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-28 border-b border-white/5 relative z-10 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Mobile Layouts</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Mobile Interface Mockups</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mb-16">
          Select client options below to inspect interface mockups inside our high-fidelity mobile shell.
        </p>

        {/* Tab triggers */}
        <div className="flex justify-center gap-4 mb-10">
          {[
            { id: 'crypto', label: 'DeFi Wallet Screen' },
            { id: 'fitness', label: 'Workout Stats Tracker' },
            { id: 'retail', label: 'Minimalist Storefront' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMockupTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-medium tracking-wide border transition-all ${
                mockupTab === tab.id 
                  ? 'bg-cyan-500 text-black border-cyan-500 font-bold shadow-lg' 
                  : 'text-neutral-400 bg-white/[0.01] border-white/5 hover:border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Phone Mockup Frame Container */}
        <div className="rounded-[40px] border-[8px] border-neutral-800 bg-[#09090d] p-3 max-w-[280px] mx-auto shadow-2xl relative aspect-[9/19]">
          
          {/* Phone speaker notch element */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-neutral-800 rounded-full z-20" />

          {/* Inner screen */}
          <div className="relative h-full w-full rounded-[30px] overflow-hidden bg-black flex flex-col justify-between p-4 pt-8 transition-all duration-700">
            <AnimatePresence mode="wait">
              {mockupTab === 'crypto' && (
                <motion.div
                  key="crypto"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-[#02090a] p-5 flex flex-col justify-between text-left font-mono"
                >
                  <div className="space-y-4">
                    <span className="text-[7px] text-cyan-400">// WALLET STATE</span>
                    <h3 className="text-sm font-bold text-white leading-tight">Total Portfolio: $42,910.15</h3>
                    <div className="h-20 border border-cyan-500/20 rounded-xl bg-cyan-500/[0.02] flex items-center justify-center">
                      <span className="text-[8px] text-cyan-400">[Chart Grid Render]</span>
                    </div>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] py-2 rounded-lg text-center font-bold">
                    SEND ASSETS
                  </div>
                </motion.div>
              )}

              {mockupTab === 'fitness' && (
                <motion.div
                  key="fitness"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-[#06030c] p-5 flex flex-col justify-between text-left"
                >
                  <div className="space-y-3">
                    <span className="text-[7px] text-purple-400 font-mono">// ACTIVITY RADAR</span>
                    <h3 className="text-sm font-bold text-white tracking-tight leading-tight">Workout Complete</h3>
                    <div className="space-y-1 text-[10px] text-neutral-400">
                      <div>Calories: 480 kcal</div>
                      <div>Duration: 42 mins</div>
                      <div>Avg HR: 142 bpm</div>
                    </div>
                  </div>
                  <div className="bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[8px] py-2 rounded-lg text-center font-bold font-mono">
                    VIEW SUMMARY
                  </div>
                </motion.div>
              )}

              {mockupTab === 'retail' && (
                <motion.div
                  key="retail"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-[#fbfaf8] p-5 flex flex-col justify-between text-left text-neutral-800"
                >
                  <div className="space-y-4">
                    <span className="text-[7px] text-neutral-400 font-bold uppercase tracking-widest font-sans">// STUDIO COFFEE</span>
                    <h3 className="text-xs font-bold font-serif leading-tight">Handcrafted Ceramics</h3>
                    <div className="w-full aspect-square bg-neutral-200 rounded-lg flex items-center justify-center">
                      <span className="text-[7px] text-neutral-500">[Product Item Preview]</span>
                    </div>
                  </div>
                  <div className="bg-neutral-900 text-white text-[8px] py-2 rounded-lg text-center font-bold">
                    ADD TO CART
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

        {/* Tab Buttons grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-10">
          {Object.keys(techStack).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedTech(key)}
              className={`px-3 py-3 rounded-2xl text-[10px] font-mono font-bold tracking-wider uppercase border transition-all duration-300 ${
                selectedTech === key 
                  ? 'bg-white text-black border-white shadow-lg' 
                  : 'text-neutral-400 bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}
            >
              {techStack[key].name}
            </button>
          ))}
        </div>

        {/* Selected Tech Card info details */}
        <div className="p-8 rounded-3xl bg-[#09090d]/80 border border-white/5 hover:border-cyan-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden min-h-[160px] text-left transition-all">
          <div className="absolute top-4 right-6">
            <span className="font-mono text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              {techStack[selectedTech].badge}
            </span>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTech}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h4 className="font-display font-extrabold text-base text-white">{techStack[selectedTech].name}</h4>
              <p className="font-light text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {techStack[selectedTech].role}
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
          Start Your Mobile Project
        </a>
      </section>

    </div>
  );
}
