import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useMotionValue } from 'framer-motion';
import { useContent } from '../context/ContentContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8008';

const resolveImageUrl = (imgSrc) => {
  if (!imgSrc) return '';
  const normalizedSrc = imgSrc.replace(/\\/g, '/');
  if (normalizedSrc.startsWith('http://') || normalizedSrc.startsWith('https://') || normalizedSrc.startsWith('data:')) {
    return normalizedSrc;
  }
  const cleanSrc = normalizedSrc.startsWith('/') ? normalizedSrc : '/' + normalizedSrc;
  if (cleanSrc.startsWith('/uploads')) {
    return `${API_URL}${cleanSrc}`;
  }
  return cleanSrc;
};

// Workspace card sub-component with 3D Perspective Tilt Effect
function WorkspaceCard({ room, idx }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring settings for smooth physical card reactions
  const springX = useSpring(x, { stiffness: 180, damping: 22 });
  const springY = useSpring(y, { stiffness: 180, damping: 22 });
  
  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.05 }}
      className={`break-inside-avoid relative rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0f] group cursor-pointer ${room.size || 'h-72'}`}
    >
      <img 
        src={resolveImageUrl(room.img)} 
        alt={room.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      {/* 3D push for text on Z-axis */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 transition-opacity duration-300 flex flex-col justify-end p-6 text-left"
        style={{ transform: "translateZ(25px)" }}
      >
        <h4 className="font-display font-bold text-sm text-white">{room.title}</h4>
        <p className="font-light text-neutral-400 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
          {room.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutUs() {
  const containerRef = useRef(null);
  
  // Section 2: Founder Message Parallax Refs
  const founderSectionRef = useRef(null);
  const { scrollYProgress: founderScroll } = useScroll({
    target: founderSectionRef,
    offset: ["start end", "end start"]
  });
  const yRadhe = useTransform(founderScroll, [0, 1], [-25, 25]);
  const yPrince = useTransform(founderScroll, [0, 1], [25, -25]);

  const { content } = useContent();
  const aboutUs = content?.about_us || {};
  const philosophy = aboutUs.philosophy || {
    title: "Why We Exist",
    quote: "We exist to simplify digital transformation and construct scalable, future-ready technology platforms that drive clear business value.",
    description: "In a landscape crowded with off-the-shelf templates and rigid software designs, HariKrushn DigiVerse stands for bespoke digital craftsmanship. We combine architectural-grade frontend graphics with secure, high-concurrency microservices, crafting products that elevate your brand and work reliably."
  };
  const vision = aboutUs.vision || {
    title: "Our Vision",
    text: "To stand as the international benchmark for bespoke digital craftsmanship, engineering high-concurrency cloud networks that empower enterprises to run reliably at scale."
  };
  const mission = aboutUs.mission || {
    title: "Our Mission",
    text: "Architect fully autonomous multi-agent networks that execute secure device-level tasks, rendering real-time responsive spatial grids."
  };

  const personalLetter = aboutUs.personal_letter || {
    eyebrow: "// Personal Letter",
    title: "Crafting the Infinite Digital",
    founders: [
      {
        name: "Radhe Patel",
        role: "Co-Founder & CEO",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=500&q=80",
        signatureTitle: "Radhe Patel, CEO"
      },
      {
        name: "Prince Patel",
        role: "Co-Founder & Partner",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=500&q=80",
        signatureTitle: "Prince Patel, Partner"
      }
    ],
    paragraphs: [
      "Dear Partners & Clients,",
      "From the moment we envisioned HariKrushn DigiVerse, our goal was clear: to create corporate platforms that combine structural engineering with luxury aesthetics. Software should not just be functional; it should be an asset that inspires trust and is satisfying to interact with.",
      "We do not believe in taking shortcuts. Every system configuration, cloud setup, and animation path we build is designed with precision. We are committed to fostering deep engineering partnerships, helping your team scale into the next phase of digital business with confidence.",
      "Thank you for trusting us with your core technology architectures."
    ]
  };

  const timelineOperational = aboutUs.timeline_operational || {
    eyebrow: "// Operational Lifecycle",
    title: "Development Standards",
    steps: [
      {step: "Discovery", label: "01", desc: "Aligning business needs with technical deliverables, specifying database matrices and system blueprints."},
      {step: "Architecture", label: "02", desc: "Drafting data models, serverless endpoint paths, caching grids, load handling, and folder schemas."},
      {step: "UI/UX Design", label: "03", desc: "Crafting luxury glassmorphic layouts, customized typography matrices, responsive systems, and gestural motions."},
      {step: "Development", label: "04", desc: "Coding responsive structures, clean React components, fast FastAPI routes, clean logic, and TDD validations."},
      {step: "Quality Assurance", label: "05", desc: "Rigorous manual tests, automated Selenium scripts, concurrency validation, and memory leak analysis."},
      {step: "Deployment", label: "06", desc: "Setting CI/CD integration checkpoints, cloud assets, and SSL certificates."},
      {step: "Continuous Improvement", label: "07", desc: "Analyzing user telemetry, updating databases, tuning speeds, and updating emerging packages."}
    ]
  };

  const officeLocations = aboutUs.office_locations || {
    eyebrow: "// Corporate Nodes",
    title: "Office Locations",
    offices: [
      {location: "Dubai Headquarters", code: "UAE-HQ", address: "Techno Hub, Silicon Oasis, Dubai, United Arab Emirates", contact: "hello@hkdigiverse.com"},
      {location: "Surat Development Hub", code: "IN-DEV", address: "401, HariKrushn Tower, VIP Road, Surat, GJ 395007, India", contact: "surat@hkdigiverse.com"},
      {location: "Future Expansion Nodes", code: "US/UK-EXP", address: "Planning operations hubs in London and New York tech hubs.", contact: "expansion@hkdigiverse.com"}
    ]
  };

  const manifesto = aboutUs.manifesto || {
    eyebrow: "// Company Manifesto",
    quote1: "We don't just build software. We build digital ecosystems.",
    quote2: "We don't follow technology. We create the future with it.",
    footnote: "// Every line of code should create measurable business value."
  };

  const dnaValues = aboutUs.dna_values || [
    { name: 'Innovation', desc: 'Pushing technical boundaries to create custom, forward-thinking architectures.' },
    { name: 'Ownership', desc: 'Taking complete accountability for code execution, product quality, and business impact.' },
    { name: 'Transparency', desc: 'Clear, open communication with no hidden costs, agendas, or black boxes.' },
    { name: 'Execution', desc: 'Moving fast from design blueprints to high-availability production code.' },
    { name: 'Learning', desc: 'Constant upskilling and integration of emerging technology and scientific paradigms.' },
    { name: 'Quality', desc: 'Writing clean, test-driven, performant code that stands the test of time.' },
    { name: 'Speed', desc: 'Launching software rapidly without compromising architectural integrity.' },
    { name: 'Impact', desc: 'Aligning software decisions directly with measurable enterprise value.' }
  ];

  const [activeDna, setActiveDna] = useState(null);
  const dnaRadius = 200; // Locked coordinate system for consistent SVG & positioning

  // Section 5: Scroll Progress for Timeline
  const timelineRef = useRef(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });
  const lineScale = useSpring(timelineProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative text-neutral-300 overflow-x-hidden font-sans">
      
      {/* Background Atmosphere */}
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[75%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Page Header */}
      <div className="text-center mb-24 relative z-10 pt-8">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
          // Corporate Identity
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          About Us
        </h1>
      </div>

      {/* ──────────────────────────────────────────────────
          1. COMPANY PHILOSOPHY (WIPE ANIMATION)
          ────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/5 relative z-10 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 md:via-amber-500/[0.02] to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-2"
          >
            <span className="w-8 h-[0.5px] bg-white/30"></span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Company Philosophy</span>
            <span className="w-8 h-[0.5px] bg-white/30"></span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight"
          >
            {philosophy.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto bg-clip-text text-transparent bg-gradient-to-r from-neutral-300 via-white to-neutral-400 font-light"
          >
            "{philosophy.quote}"
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-neutral-400 font-light text-sm sm:text-base leading-relaxed max-w-3xl mx-auto"
          >
            {philosophy.description}
          </motion.p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          1.5 VISION & MISSION
          ────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/5 relative z-10 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          
          {/* Vision Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-[#09090e]/80 border border-white/5 backdrop-blur-xl hover:border-indigo-500/20 transition-all relative overflow-hidden group min-h-[300px] flex flex-col justify-between"
          >
            {/* Hover Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-indigo-500/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="space-y-6">
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-white transition-colors">
                <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              
              <div className="space-y-3">
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-indigo-400">// The Long Horizon</span>
                <h3 className="font-display text-2xl font-bold text-white tracking-tight">{vision.title}</h3>
                <p className="font-light text-neutral-300 text-sm sm:text-base leading-relaxed">
                  {vision.text}
                </p>
              </div>
            </div>
            
            <div className="w-12 h-[1px] bg-white/20 mt-8 group-hover:w-24 transition-all duration-500" />
          </motion.div>

          {/* Mission Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-[#09090e]/80 border border-white/5 backdrop-blur-xl hover:border-amber-500/20 transition-all relative overflow-hidden group min-h-[300px] flex flex-col justify-between"
          >
            {/* Hover Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber-500/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="space-y-6">
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:text-white transition-colors">
                <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <div className="space-y-3">
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-amber-400">// The Strategic Path</span>
                <h3 className="font-display text-2xl font-bold text-white tracking-tight">{mission.title}</h3>
                <p className="font-light text-neutral-300 text-sm sm:text-base leading-relaxed">
                  {mission.text}
                </p>
              </div>
            </div>
            
            <div className="w-12 h-[1px] bg-white/20 mt-8 group-hover:w-24 transition-all duration-500" />
          </motion.div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          2. FOUNDER'S MESSAGE (PARALLAX + DYNAMIC SIGNATURE)
          ────────────────────────────────────────────────── */}
      <section ref={founderSectionRef} className="py-28 border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Images Grid (Left side - Asymmetric Parallax Scroll) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <motion.div 
              style={{ y: yRadhe }}
              className="bg-[#0a0a0f]/80 border border-white/5 p-2 rounded-2xl shadow-xl overflow-hidden aspect-[4/5] relative group"
            >
              <img 
                src={resolveImageUrl(personalLetter.founders?.[0]?.img) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=500&q=80"} 
                alt={personalLetter.founders?.[0]?.name || "Radhe Patel"} 
                className="w-full h-full object-cover rounded-xl filter grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/5 p-3 rounded-lg text-left">
                <h4 className="font-display font-bold text-xs text-white">{personalLetter.founders?.[0]?.name || "Radhe Patel"}</h4>
                <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mt-0.5">{personalLetter.founders?.[0]?.role || "Co-Founder & CEO"}</p>
              </div>
            </motion.div>
            
            <motion.div 
              style={{ y: yPrince }}
              className="bg-[#0a0a0f]/80 border border-white/5 p-2 rounded-2xl shadow-xl overflow-hidden aspect-[4/5] relative group mt-8 lg:mt-12"
            >
              <img 
                src={resolveImageUrl(personalLetter.founders?.[1]?.img) || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=500&q=80"} 
                alt={personalLetter.founders?.[1]?.name || "Prince Patel"} 
                className="w-full h-full object-cover rounded-xl filter grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/5 p-3 rounded-lg text-left">
                <h4 className="font-display font-bold text-xs text-white">{personalLetter.founders?.[1]?.name || "Prince Patel"}</h4>
                <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mt-0.5">{personalLetter.founders?.[1]?.role || "Co-Founder & Partner"}</p>
              </div>
            </motion.div>
          </div>

          {/* Vision Letter (Right side) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-amber-400">{personalLetter.eyebrow}</span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">{personalLetter.title}</h3>
            <div className="font-light text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4 border-t border-white/5 pt-6">
              {(personalLetter.paragraphs || []).map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            
            {/* Dynamic Hand-drawn Signatures */}
            <div className="flex gap-12 pt-8 border-t border-white/5 items-center">
              <div className="space-y-1">
                {/* SVG path or Image representing Radhe Patel signature */}
                {personalLetter.founders?.[0]?.signatureImg ? (
                  <div className="h-8 flex items-center mb-1">
                    <img 
                      src={resolveImageUrl(personalLetter.founders[0].signatureImg)} 
                      alt="Radhe Patel Signature" 
                      className="h-full object-contain max-h-8 max-w-[120px]" 
                    />
                  </div>
                ) : (
                  <svg className="w-28 h-8 text-neutral-300" viewBox="0 0 150 40" fill="none">
                    <motion.path
                      d="M 15 25 Q 30 10 45 25 T 75 22 T 105 18 T 135 25"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, delay: 0.4, ease: "easeInOut" }}
                    />
                  </svg>
                )}
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{personalLetter.founders?.[0]?.signatureTitle || "Radhe Patel, CEO"}</p>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="space-y-1">
                {/* SVG path or Image representing Prince Patel signature */}
                {personalLetter.founders?.[1]?.signatureImg ? (
                  <div className="h-8 flex items-center mb-1">
                    <img 
                      src={resolveImageUrl(personalLetter.founders[1].signatureImg)} 
                      alt="Prince Patel Signature" 
                      className="h-full object-contain max-h-8 max-w-[120px]" 
                    />
                  </div>
                ) : (
                  <svg className="w-28 h-8 text-neutral-300" viewBox="0 0 150 40" fill="none">
                    <motion.path
                      d="M 20 20 C 40 38 65 12 85 28 T 115 18 T 130 22"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, delay: 0.5, ease: "easeInOut" }}
                    />
                  </svg>
                )}
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{personalLetter.founders?.[1]?.signatureTitle || "Prince Patel, Partner"}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          3. HK DNA (ROTATING ORBITS + ENERGY PARTICLES + CENTRAL LOGO)
          ────────────────────────────────────────────────── */}
      <section className="py-28 border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 block mb-3">// Core Identity</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">Our DNA Structure</h2>
          <p className="font-light text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-16">
            Hover over the orbital elements to trace the values that guide every line of code we write.
          </p>

          {/* Scaled constellation box on mobile */}
          <div className="relative flex items-center justify-center h-[360px] sm:h-[600px] w-[360px] sm:w-[600px] mx-auto select-none overflow-visible scale-[0.9] sm:scale-100">
            
            {/* Rotating Wrapper */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 55, ease: "linear" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
            >
              {/* SVG Canvas for Connecting lines + flowing energy particles */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 600 600">
                {dnaValues.map((val, idx) => {
                  const angle = (idx * 360) / dnaValues.length;
                  const rad = (angle * Math.PI) / 180;
                  const x = Math.cos(rad) * dnaRadius;
                  const y = Math.sin(rad) * dnaRadius;
                  const isHovered = activeDna === val.name;
                  
                  const startX = 300 + x;
                  const startY = 300 + y;
                  const pathD = `M ${startX} ${startY} L 300 300`;

                  return (
                    <g key={val.name}>
                      {/* Connection Line */}
                      <path 
                        d={pathD}
                        fill="none"
                        stroke={isHovered ? "#fbbf24" : "rgba(255,255,255,0.06)"}
                        strokeWidth={isHovered ? 2.5 : 1}
                        className="transition-all duration-300"
                      />
                      
                      {/* Flowing Energy Particle toward Center Logo */}
                      <circle r={isHovered ? "4" : "2.5"} fill="#fbbf24" style={{ filter: isHovered ? "drop-shadow(0 0 4px #fbbf24)" : "none" }}>
                        <animateMotion 
                          dur={isHovered ? "1.8s" : "3.5s"} 
                          repeatCount="indefinite" 
                          path={pathD} 
                        />
                      </circle>
                    </g>
                  );
                })}
              </svg>

              {/* Orbital Nodes */}
              {dnaValues.map((val, idx) => {
                const angle = (idx * 360) / dnaValues.length;
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * dnaRadius;
                const y = Math.sin(rad) * dnaRadius;
                const isHovered = activeDna === val.name;

                return (
                  <div
                    key={val.name}
                    onMouseEnter={() => setActiveDna(val.name)}
                    onMouseLeave={() => setActiveDna(null)}
                    className="absolute z-30 transition-all duration-300 cursor-pointer pointer-events-auto"
                    style={{
                      transform: `translate(calc(-50% + ${300 + x}px), calc(-50% + ${300 + y}px))`,
                      left: 0,
                      top: 0
                    }}
                  >
                    {/* Node contents counter-rotates so text stays upright */}
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 55, ease: "linear" }}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border bg-[#050508]/95 transition-all duration-300 ${
                        isHovered 
                          ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.25)] scale-110' 
                          : 'border-white/5'
                      }`}
                    >
                      <span className="font-display text-[11px] sm:text-xs font-bold text-white tracking-wide">{val.name}</span>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>

            {/* Central Root Logo (Static + Pulse Aura) */}
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#050508] border border-amber-500/20 flex items-center justify-center z-20 shadow-[0_0_35px_rgba(251,191,36,0.15)] p-5">
              <div className="absolute inset-0 rounded-full border border-amber-500/10 animate-ping opacity-25 pointer-events-none" />
              <img 
                src="/images/hk-logo.png" 
                alt="HariKrushn Logo" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Hover details box below DNA */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full max-w-md h-20 text-center flex items-center justify-center px-6">
              <AnimatePresence mode="wait">
                {activeDna ? (
                  <motion.div
                    key={activeDna}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1"
                  >
                    <h4 className="font-display text-sm font-bold text-amber-400 uppercase tracking-widest">{activeDna}</h4>
                    <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                      {dnaValues.find(d => d.name === activeDna)?.desc}
                    </p>
                  </motion.div>
                ) : (
                  <motion.p 
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400"
                  >
                    // Hover nodes to read specifications
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          4. OUR WORKSPACE (MASONRY GALLERY WITH 3D PERSPECTIVE TILT)
          ────────────────────────────────────────────────── */}
      <section className="py-28 border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 text-left">
            <div>
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400">// Visual Craft</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mt-3">Our Workspaces</h2>
            </div>
            <p className="font-light text-neutral-400 text-sm sm:text-base max-w-xs leading-relaxed">
              Take a walk through our corporate studio spaces built to foster focus, security, and digital creativity.
            </p>
          </div>

          {/* Masonry Columns Grid using 3D tilt WorkspaceCard sub-component */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {(aboutUs.workspace_rooms || [
              { title: 'Office Reception', size: 'h-64', desc: 'A minimalist reception area introducing our high-fidelity design ethos.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' },
              { title: 'Development Floor', size: 'h-80', desc: 'Where robust architectures are coded and high-concurrency systems scale.', img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80' },
              { title: 'Meeting Room', size: 'h-72', desc: 'Collaborating on system flows, blueprints and client partnerships.', img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80' },
              { title: 'Innovation Lab', size: 'h-96', desc: 'Testing AI agent models, LLM vector configurations and automated logic.', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80' },
              { title: 'Discussion Area', size: 'h-64', desc: 'Reviewing wireframes and fine art assets over high-speed connectivity.', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80' },
              { title: 'Creative Workspace', size: 'h-80', desc: 'Designing brand typography systems and micro-interactions.', img: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=600&q=80' }
            ]).map((room, idx) => {
              const heightMap = ['h-64', 'h-80', 'h-72', 'h-96', 'h-64', 'h-80'];
              const size = room.size && room.size.includes('h-') ? room.size : (heightMap[idx % 6]);
              return (
                <WorkspaceCard key={room.title} room={{ ...room, size }} idx={idx} />
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          5. DEVELOPMENT STANDARDS
          ────────────────────────────────────────────────── */}
      <section ref={timelineRef} className="py-28 border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-left">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 block mb-3">{timelineOperational.eyebrow}</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-20">{timelineOperational.title}</h2>

          <div className="relative pl-8 md:pl-0">
            {/* Vertical timeline connector */}
            <div className="absolute left-3.5 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2">
              <motion.div 
                className="absolute top-0 w-[1px] bg-gradient-to-b from-amber-400 to-indigo-500 origin-top h-full"
                style={{ scaleY: lineScale }}
              />
            </div>

            <div className="space-y-16">
              {(timelineOperational.steps || []).map((item, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 items-center relative">
                    
                    {/* Node Dot Indicator */}
                    <div className="absolute left-3.5 md:left-1/2 top-1.5 w-3 h-3 rounded-full bg-black border-2 border-amber-400 -translate-x-1/2 z-10 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />

                    {/* Step Card */}
                    <div className={`md:w-[90%] ${isEven ? 'md:mr-auto pl-8 md:pl-0 md:text-right' : 'md:ml-auto md:col-start-2 pl-8 md:pl-12'}`}>
                      <motion.div 
                        initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                        className="bg-[#09090d]/80 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors inline-block text-left max-w-md"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">{item.label}</span>
                          <h4 className="font-display font-bold text-base text-white">{item.step}</h4>
                        </div>
                        <p className="font-light text-neutral-400 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                      </motion.div>
                    </div>
                    
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          6. OFFICE LOCATIONS
          ────────────────────────────────────────────────── */}
      <section className="py-28 border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-left">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 block mb-3">{officeLocations.eyebrow}</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-16">{officeLocations.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(officeLocations.offices || []).map((office, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-[#09090e]/80 border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all flex flex-col justify-between h-64 text-left relative group"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-[11px] font-bold text-amber-500 tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{office.code}</span>
                    <span className="text-xs font-mono text-neutral-600">Active</span>
                  </div>
                  <h4 className="font-display font-bold text-lg text-white mb-2">{office.location}</h4>
                  <p className="font-light text-neutral-400 text-sm sm:text-base leading-relaxed">{office.address}</p>
                </div>
                <div className="border-t border-white/5 pt-4 mt-4 font-mono text-[10px] sm:text-xs text-neutral-500 group-hover:text-white transition-colors">
                  EMAIL: {office.contact}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          7. COMPANY MANIFESTO
          ────────────────────────────────────────────────── */}
      <section className="py-40 bg-black relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.1),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center px-4 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-2"
          >
            <span className="w-8 h-[0.5px] bg-white/20"></span>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500">{manifesto.eyebrow}</span>
            <span className="w-8 h-[0.5px] bg-white/20"></span>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight"
            >
              "{manifesto.quote1}"
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="w-12 h-[1px] bg-white/10 mx-auto my-8"
            />

            <motion.h3 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-display text-xl sm:text-2xl lg:text-3xl font-medium text-neutral-300 max-w-2xl mx-auto leading-relaxed"
            >
              "{manifesto.quote2}"
            </motion.h3>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-mono text-xs sm:text-sm uppercase tracking-widest text-neutral-500 pt-8"
            >
              {manifesto.footnote}
            </motion.p>
          </div>
        </div>
      </section>

    </div>
  );
}
