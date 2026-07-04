import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServiceCustomSoftware() {
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

  // 2. SQL Indexing Speed State
  const [performanceMode, setPerformanceMode] = useState('optimized'); // 'bloated' | 'optimized'
  
  // 3. Feature Wireframe Graph Checklist States
  const [features, setFeatures] = useState({
    crm: true,
    rbac: true,
    backups: false,
    apis: false
  });

  const toggleFeature = (key) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 4. Custom Dashboard Mockups State
  const [mockupTab, setMockupTab] = useState('crm'); // 'crm' | 'sales' | 'records'

  // 5. Tech Stack Selector State
  const [selectedTech, setSelectedTech] = useState('python');

  const techStack = {
    python: {
      name: 'Python (FastAPI)',
      role: 'Our core language for building fast REST APIs, database models, background queues, and system utilities.',
      badge: 'Backend Core'
    },
    typescript: {
      name: 'TypeScript',
      role: 'Provides static typing across our client portals and microservice APIs, preventing data runtime issues.',
      badge: 'Strict Security'
    },
    postgresql: {
      name: 'PostgreSQL',
      role: 'Relational database housing customer accounts, transactions, logs, and multi-tenant isolated tables.',
      badge: 'Database Layer'
    },
    redis: {
      name: 'Redis',
      role: 'In-memory database that handles secure session caching, system task queues, and instant data lookups.',
      badge: 'Caching Mesh'
    },
    docker: {
      name: 'Docker',
      role: 'Virtualizes our backend services into isolated containers, ensuring identical execution from staging to production.',
      badge: 'Virtualization'
    },
    nodejs: {
      name: 'Node.js',
      role: 'Powers microservice operations, automated triggers, file compression tools, and third-party API webhooks.',
      badge: 'Microservices'
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030307] text-neutral-300 font-sans pb-24 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[10%] left-1/4 w-[35vw] h-[35vw] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[50%] right-1/4 w-[40vw] h-[40vw] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none" />

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
              className="absolute rounded-full bg-purple-400/20"
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
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-purple-400 font-light block"
          >
            // Enterprise Architectures
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            Engineering Custom <br />
            <span className="text-neutral-400 font-light italic">Software Systems</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-light text-neutral-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            We build secure multi-tenant portals, custom CRM environments, unified transaction dashboards, and automated microservice interfaces.
          </motion.p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          II. SPEED VS BLOAT SIMULATOR WIDGET
          ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-28 border-b border-white/5 relative z-10 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Performance Benchmark</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Database Engine Simulator</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mb-16">
          Toggle database indexing parameters to view changes in query speeds and CPU backend load constraints.
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
                  Unindexed Query
                </button>
                <button 
                  onClick={() => setPerformanceMode('optimized')}
                  className={`flex-1 py-2 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all ${
                    performanceMode === 'optimized' 
                      ? 'bg-purple-500 text-white font-bold shadow-lg' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Indexed Pipeline
                </button>
              </div>
            </div>

            {/* Gauges */}
            <div className="space-y-5 font-mono text-[11px]">
              
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>QUERY EXECUTION TIME:</span>
                  <span className={`font-bold ${performanceMode === 'optimized' ? 'text-purple-400' : 'text-rose-400'}`}>
                    {performanceMode === 'optimized' ? '2ms (Instant)' : '840ms (High Cost)'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: performanceMode === 'optimized' ? '3%' : '92%' }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`h-full ${performanceMode === 'optimized' ? 'bg-purple-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>MAX CONCURRENCY CAPACITY:</span>
                  <span className={`font-bold ${performanceMode === 'optimized' ? 'text-purple-400' : 'text-rose-400'}`}>
                    {performanceMode === 'optimized' ? '15,000 req/s' : '200 req/s'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: performanceMode === 'optimized' ? '100%' : '15%' }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`h-full ${performanceMode === 'optimized' ? 'bg-purple-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>CPU UTILIZATION:</span>
                  <span className={`font-bold ${performanceMode === 'optimized' ? 'text-purple-400' : 'text-rose-400'}`}>
                    {performanceMode === 'optimized' ? '3% Load' : '96% Maxed'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: performanceMode === 'optimized' ? '10%' : '96%' }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`h-full ${performanceMode === 'optimized' ? 'bg-purple-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Rendering Box (Right) */}
          <div className="lg:col-span-7 bg-[#09090d]/80 border border-white/5 rounded-3xl p-8 h-80 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            <div className="flex justify-between items-center pb-4 border-b border-white/5 relative z-10">
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Live Database Pipeline Test</span>
              <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${
                performanceMode === 'optimized' ? 'bg-purple-500/10 text-purple-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {performanceMode === 'optimized' ? 'Direct Index Fetch' : 'Full Table Scan'}
              </span>
            </div>

            <div className="relative flex-1 flex items-center justify-center">
              <motion.div
                animate={performanceMode === 'optimized' 
                  ? { scale: [0.9, 1.1, 0.9] } 
                  : { scale: [0.9, 0.95, 0.9, 0.95, 0.9], rotate: [0, 5, -5, 0] }
                }
                transition={performanceMode === 'optimized'
                  ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                  : { repeat: Infinity, duration: 3.5, ease: "linear" }
                }
                className={`w-16 h-16 rounded-2xl flex items-center justify-center z-10 shadow-2xl ${
                  performanceMode === 'optimized' 
                    ? 'bg-gradient-to-tr from-purple-500 to-indigo-400 shadow-purple-500/20' 
                    : 'bg-neutral-800 shadow-black'
                }`}
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </motion.div>
            </div>

            <div className="text-center font-mono text-[9px] text-neutral-500 relative z-10">
              // The purple box illustrates DB locks and query queue blocking.
            </div>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          III. FEATURE SELECTOR & SVG WIREFRAME GRAPH
          ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-28 border-b border-white/5 relative z-10 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Architecture Logic</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Software Architecture Blueprint</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mb-16">
          Toggle modules below to configure server nodes and database triggers on the live wireframe.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left items-stretch">
          
          <div className="lg:col-span-4 flex flex-col gap-4 justify-center">
            {[
              { key: 'crm', label: 'Multi-Tenant Portal CRM', desc: 'Secure database parameters isolating client data' },
              { key: 'rbac', label: 'Role Access Permissions (RBAC)', desc: 'Encrypted group auth tokens validation' },
              { key: 'backups', label: 'Daily Automated Backups', desc: 'Cloud storage backup triggers configuration' },
              { key: 'apis', label: 'REST API Integrations', desc: 'FastAPI microservices connector setups' }
            ].map(item => (
              <div 
                key={item.key}
                onClick={() => toggleFeature(item.key)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                  features[item.key] 
                    ? 'bg-purple-500/5 border-purple-500/30 shadow-md' 
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    features[item.key] ? 'border-purple-400 bg-purple-400' : 'border-neutral-600'
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
              
              <line x1="80" y1="150" x2="200" y2="150" stroke="#8b5cf6" strokeWidth="1.5" />
              
              {features.crm && (
                <path d="M 200 150 Q 275 80 350 80" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
              )}
              
              <line x1="200" y1="150" x2="350" y2="150" stroke="#10b981" strokeWidth="1.5" />

              {features.backups && (
                <path d="M 350 150 Q 425 220 500 220" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
              )}

              {features.rbac && (
                <path d="M 350 150 Q 425 80 500 80" fill="none" stroke="#ec4899" strokeWidth="2" />
              )}

              {features.apis && (
                <path d="M 200 150 Q 275 220 350 220" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,4" />
              )}

              <circle cx="80" cy="150" r="25" fill="#09090d" stroke="#8b5cf6" strokeWidth="2" />
              <text x="80" y="153" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">PORTAL</text>

              <circle cx="200" cy="150" r="25" fill="#09090d" stroke="#8b5cf6" strokeWidth="2" />
              <text x="200" y="153" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">ROUTING</text>

              <circle cx="350" cy="80" r="25" fill="#09090d" stroke={features.crm ? "#fbbf24" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="350" y="83" fill={features.crm ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">TENANTS</text>

              <circle cx="350" cy="150" r="25" fill="#09090d" stroke="#10b981" strokeWidth="2" />
              <text x="350" y="153" fill="white" fontSize="8" fontFamily="monospace" textAnchor="middle">FASTAPI</text>

              <circle cx="350" cy="220" r="25" fill="#09090d" stroke={features.apis ? "#a855f7" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="350" y="223" fill={features.apis ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">APIS</text>

              <circle cx="500" cy="80" r="25" fill="#09090d" stroke={features.rbac ? "#ec4899" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="500" y="83" fill={features.rbac ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">RBAC AUTH</text>

              <circle cx="500" cy="220" r="25" fill="#09090d" stroke={features.backups ? "#6366f1" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
              <text x="500" y="223" fill={features.backups ? "white" : "#444"} fontSize="8" fontFamily="monospace" textAnchor="middle">BACKUPS</text>

            </svg>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          IV. PORTAL MOCKUP FRAME (PREVIEW)
          ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-28 border-b border-white/5 relative z-10 text-center">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Portal Deliverables</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Enterprise Dashboard Layouts</h2>
        <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto mb-16">
          Toggle options below to preview transaction sheets and portal designs inside our high-fidelity container.
        </p>

        {/* Tab triggers */}
        <div className="flex justify-center gap-4 mb-10">
          {[
            { id: 'crm', label: 'Client Accounts CRM' },
            { id: 'sales', label: 'Transaction Charts' },
            { id: 'records', label: 'Role Activity Ledger' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMockupTab(tab.id)}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-medium tracking-wide border transition-all ${
                mockupTab === tab.id 
                  ? 'bg-purple-500 text-white border-purple-500 font-bold shadow-lg' 
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
              {mockupTab === 'crm' && (
                <motion.div
                  key="crm"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-[#04020a] text-left p-12 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-purple-400">// CRM MODULE STATE</span>
                    <h3 className="font-display text-2xl font-bold text-white tracking-tight leading-tight">Total Client Accounts: 1,280 Active</h3>
                    <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-sm">Secure multi-tenant database connection verified under zero-trust parameters.</p>
                  </div>
                  <div className="w-24 h-10 border border-purple-500/20 rounded flex items-center justify-center text-purple-400 font-mono text-[10px]">
                    SYSTEM_OK
                  </div>
                </motion.div>
              )}

              {mockupTab === 'sales' && (
                <motion.div
                  key="sales"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-[#020609] text-left p-12 flex flex-col justify-between font-mono"
                >
                  <div className="space-y-4">
                    <span className="text-purple-400 text-[9px] uppercase tracking-widest">// LEDGER LOGISTICS</span>
                    <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">Volume: $1.2M USD / Month</h3>
                    <div className="h-28 border border-white/5 rounded-xl bg-white/[0.01] flex items-center justify-center text-neutral-600 text-[10px]">
                      [Live charts container render]
                    </div>
                  </div>
                </motion.div>
              )}

              {mockupTab === 'records' && (
                <motion.div
                  key="records"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-[#0c0914] text-left p-12 flex flex-col justify-between font-mono"
                >
                  <div className="space-y-4">
                    <span className="text-[8px] uppercase tracking-widest text-purple-400">// AUTHENTICATION ACTIVITY</span>
                    <h3 className="text-xl font-normal text-white">System Access Ledger</h3>
                    <div className="space-y-2 text-[10px] text-neutral-400">
                      <div>- Admin user Patel logged in from Surat HQ (IP: 192.168.1.42)</div>
                      <div>- Automated cloud backup executed successfully</div>
                      <div>- API endpoint FastAPI synced database cache</div>
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
        <div className="p-8 rounded-3xl bg-[#09090d]/80 border border-white/5 hover:border-purple-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden min-h-[160px] text-left transition-all">
          <div className="absolute top-4 right-6">
            <span className="font-mono text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
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
          Start Your Enterprise Project
        </a>
      </section>

    </div>
  );
}
