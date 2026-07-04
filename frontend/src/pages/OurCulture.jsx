import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OurCulture() {
  // 1. State for Art & Logic Interactive Balance
  const [balanceVal, setBalanceVal] = useState(50);

  const activities = [
    {
      title: 'Continuous Learning',
      desc: 'We encourage curiosity and continuous learning. From new technologies to emerging trends, we invest in our team to stay future-ready.',
      img: '/images/culture/learning.png',
      icon: (
        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      )
    },
    {
      title: 'Collaborative Environment',
      desc: 'We believe the best ideas come from working together. Open communication and teamwork are at the heart of everything we do.',
      img: '/images/culture/collab.png',
      icon: (
        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: 'Celebrate Every Moment',
      desc: 'From birthdays to big wins, we celebrate every milestone together. Because memories built together, last forever.',
      img: '/images/culture/celebrate.png',
      icon: (
        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'Client Success Mindset',
      desc: 'Our clients\' goals become our mission. We focus on delivering real value and long-term growth through every solution we build.',
      img: '/images/culture/client.png',
      icon: (
        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Ownership & Accountability',
      desc: 'We take pride in ownership. Every team member is empowered to take initiative and deliver quality with integrity.',
      img: '/images/culture/ownership.png',
      icon: (
        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Grow Without Limits',
      desc: 'We provide the platform, resources, and freedom to grow. Your progress drives our progress. Together, we scale new heights.',
      img: '/images/culture/grow.png',
      icon: (
        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative text-neutral-300 font-sans min-h-screen pb-20">
      
      {/* 1. Ambient Glowing Screen Backing */}
      <div className="absolute top-[10%] left-1/4 w-[35vw] h-[35vw] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[50%] right-1/4 w-[30vw] h-[30vw] rounded-full bg-red-600/5 blur-[110px] pointer-events-none z-0" />

      <div className="text-center mb-24 relative z-10 pt-8 space-y-4">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
          // Where Code Meets Art
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Our Culture
        </h1>
        <p className="font-light text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          At HariKrushn DigiVerse LLP, our culture is the foundation of innovation, collaboration, and impact. We don't just build digital solutions, we build trust and long-term relationships.
        </p>
      </div>

      {/* ──────────────────────────────────────────────────
          II. LIFE AT HK ACTIVITY GRID (IMAGE + BRIEF DETAILS)
          ────────────────────────────────────────────────── */}
      <section className="max-w-[1600px] w-full mx-auto px-4 mb-32 relative z-10 text-center">
        <div className="mb-16 space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-red-500 font-semibold block">
            Life at HK DigiVerse
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            More Than Work. It's Our Way of Life.
          </h2>
          <p className="font-light text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            At HK DigiVerse LLP, we believe that a strong culture builds a strong team. Here's what makes our workplace inspiring, engaging, and truly our own.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {activities.map((act, idx) => (
            <motion.div 
              key={act.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="bg-[#09090e]/70 border border-white/5 rounded-3xl p-6 hover:border-white/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.05)] transition-all duration-300 flex gap-5 items-stretch min-h-[220px]"
            >
              {/* Left Side: Vertical Image */}
              <div className="w-24 sm:w-28 rounded-2xl overflow-hidden shrink-0 border border-white/5 relative">
                <img src={act.img} alt={act.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* Right Side: Details */}
              <div className="flex flex-col justify-between py-1 flex-1">
                <div>
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    {act.icon}
                  </div>
                  <h4 className="font-display font-bold text-white text-base sm:text-lg mt-3 leading-tight">{act.title}</h4>
                  {/* Red Divider */}
                  <div className="w-8 h-[2px] bg-red-500 my-2.5" />
                  <p className="font-light text-neutral-400 text-xs sm:text-sm leading-relaxed">{act.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          III. INTERACTIVE ART & LOGIC BALANCE COMPASS
          ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 mb-32 relative z-10 text-center">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-amber-500 block mb-3">// Interactive Widget</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Art & Logic Equilibrium</h2>
        <p className="font-light text-neutral-400 text-sm sm:text-base max-w-lg mx-auto mb-12">
          We operate at the intersection of fine digital art and deep system logic. Adjust the slider below to observe how the structures sync.
        </p>

        {/* Dual State Canvas */}
        <div className="h-64 rounded-3xl bg-[#09090e]/80 border border-white/5 relative overflow-hidden flex items-center justify-center p-8 mb-8 shadow-2xl">
          
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px]" />

          {/* Left Graphic: Pure Art Visuals (Curves, neon sparks) */}
          <div 
            className="absolute left-8 w-44 h-44 rounded-full border border-pink-500/20 bg-pink-500/5 filter blur-[4px] flex items-center justify-center transition-all duration-300 pointer-events-none"
            style={{
              opacity: (100 - balanceVal) / 100,
              transform: `scale(${1.2 - (balanceVal / 200)}) translate(${balanceVal}px, 0)`
            }}
          >
            {/* Visual Art Symbol */}
            <div className="w-12 h-12 rounded-full border-2 border-pink-500 flex items-center justify-center text-pink-500 font-display font-bold text-lg select-none">
              A
            </div>
          </div>

          {/* Right Graphic: Pure Logic Code (Terminal blocks) */}
          <div 
            className="absolute right-8 w-44 h-44 rounded-full border border-cyan-500/20 bg-cyan-500/5 filter blur-[4px] flex items-center justify-center transition-all duration-300 pointer-events-none"
            style={{
              opacity: balanceVal / 100,
              transform: `scale(${0.7 + (balanceVal / 200)}) translate(-${100 - balanceVal}px, 0)`
            }}
          >
            {/* Visual Logic Symbol */}
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500 flex items-center justify-center text-cyan-500 font-mono font-bold text-lg select-none">
              L
            </div>
          </div>

          {/* Blended Synthesized State (Visible near center 50%) */}
          <AnimatePresence>
            {balanceVal >= 40 && balanceVal <= 60 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
              >
                <div className="w-28 h-28 rounded-full border border-amber-500/40 bg-amber-500/10 shadow-[0_0_40px_rgba(251,191,36,0.2)] flex flex-col items-center justify-center animate-pulse">
                  <span className="font-display font-extrabold text-[10px] text-white tracking-widest">SYNTHESIZED</span>
                  <span className="font-mono text-[8px] text-amber-400 mt-1">EQUILIBRIUM</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Value Tags */}
          <div className="absolute top-4 left-6 font-mono text-[9px] text-pink-500 uppercase tracking-widest">Fine Art [{(100 - balanceVal).toFixed(0)}%]</div>
          <div className="absolute top-4 right-6 font-mono text-[9px] text-cyan-500 uppercase tracking-widest">Core Logic [{balanceVal.toFixed(0)}%]</div>
        </div>

        {/* Custom Slider Element */}
        <div className="max-w-md mx-auto flex items-center gap-4 bg-black/60 border border-white/5 px-6 py-4 rounded-full">
          <span className="font-display text-xs text-pink-500 font-bold uppercase tracking-wider">Art</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={balanceVal} 
            onChange={(e) => setBalanceVal(parseFloat(e.target.value))} 
            className="flex-1 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="font-mono text-xs text-cyan-500 font-bold uppercase tracking-wider">Logic</span>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          IV. CULTURE PROTOCOL MANIFESTO (CODE BLOCK)
          ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 relative z-10 text-left">
        <div className="text-center mb-16">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-3">// Manifesto Protocol</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">The Culture Code</h2>
        </div>

        {/* Glassmorphic IDE Terminal Window */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-[#050508]/90 overflow-hidden shadow-2xl font-mono text-xs sm:text-sm"
        >
          {/* Header IDE Tabs */}
          <div className="bg-[#0d0d12] border-b border-white/5 px-6 py-3.5 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">hk_culture_protocol.json</span>
            <div className="w-8 h-1" />
          </div>

          {/* Syntax Code area */}
          <div className="p-6 sm:p-8 space-y-2 text-neutral-400 leading-relaxed overflow-x-auto whitespace-pre">
            <div><span className="text-indigo-400">{"{"}</span></div>
            <div>  <span className="text-sky-400">"organization"</span>: <span className="text-amber-300">"HariKrushn DigiVerse LLP"</span>,</div>
            <div>  <span className="text-sky-400">"ethos"</span>: <span className="text-amber-300">"Bespoke Digital Craftsmanship"</span>,</div>
            <div>  <span className="text-sky-400">"foundationalRule"</span>: <span className="text-amber-300">"Zero generic templates, 100% custom architectures"</span>,</div>
            <div>  <span className="text-sky-400">"executionStandards"</span>: <span className="text-indigo-400">{"{"}</span></div>
            <div>    <span className="text-sky-400">"designFrameRate"</span>: <span className="text-rose-400">120</span>, <span className="text-neutral-600">// Target FPS for animations</span></div>
            <div>    <span className="text-sky-400">"backendQuality"</span>: <span className="text-amber-300">"TDD + Strict API health parameters"</span>,</div>
            <div>    <span className="text-sky-400">"deliveryPipeline"</span>: <span className="text-amber-300">"Automated CI/CD gates"</span></div>
            <div>  <span className="text-indigo-400">{"}"}</span>,</div>
            <div>  <span className="text-sky-400">"communicationCode"</span>: <span className="text-indigo-400">{"["}</span></div>
            <div>    <span className="text-amber-300">"High trust, absolute ownership"</span>,</div>
            <div>    <span className="text-amber-300">"Low meetings, maximum coding flow"</span>,</div>
            <div>    <span className="text-amber-300">"Constructive, transparent feedback loops"</span></div>
            <div>  <span className="text-indigo-400">{"]"}</span></div>
            <div><span className="text-indigo-400">{"}"}</span></div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
