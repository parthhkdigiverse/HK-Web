import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Magnetic from '../components/Magnetic';

/* ───────────────────── DYNAMIC YEAR METADATA ───────────────────── */
const yearMetaData = {
  "2021": {
    colorClass: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    glowColor: "#06b6d4",
    nodeColor: "border-cyan-500/40",
    accentColor: "rgba(6, 182, 212, 0.15)",
    highlights: ["Founded in Surat", "Core team of 3 engineers", "First custom SaaS deployed"]
  },
  "2022": {
    colorClass: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    glowColor: "#14b8a6",
    nodeColor: "border-teal-500/40",
    accentColor: "rgba(20, 184, 166, 0.15)",
    highlights: ["Shipped 50+ custom sites", "Expanded team to 15 members", "98% client satisfaction rate"]
  },
  "2023": {
    colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    glowColor: "#a855f7",
    nodeColor: "border-purple-500/40",
    accentColor: "rgba(168, 85, 247, 0.15)",
    highlights: ["Custom CRM panels constructed", "High-concurrency microservices mesh", "340% throughput increase for clients"]
  },
  "2024": {
    colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    glowColor: "#f59e0b",
    nodeColor: "border-amber-500/40",
    accentColor: "rgba(245, 158, 11, 0.15)",
    highlights: ["Integrated LLM agents", "WebGL and cinematic animations", "Client operations scaled 4x"]
  },
  "2025": {
    colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    glowColor: "#10b981",
    nodeColor: "border-emerald-500/40",
    accentColor: "rgba(16, 185, 129, 0.15)",
    highlights: ["Decentralized agent networks", "Spatial web viewport designs", "Cryptographic local databases"]
  },
  "2026": {
    colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    glowColor: "#3b82f6",
    nodeColor: "border-blue-500/40",
    accentColor: "rgba(59, 130, 246, 0.15)",
    highlights: ["Edge AI integration", "Autonomous visual state routers", "Leading spatial computing benchmarks"]
  }
};

const monthToNum = (m) => {
  if (!m) return 0;
  const mClean = m.toLowerCase().trim();
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const shortMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  
  let idx = months.indexOf(mClean);
  if (idx !== -1) return idx + 1;
  
  idx = shortMonths.indexOf(mClean);
  if (idx !== -1) return idx + 1;
  
  const num = parseInt(mClean);
  if (!isNaN(num) && num >= 1 && num <= 12) return num;
  
  return 0;
};

const getYearMeta = (year) => {
  return yearMetaData[year] || yearMetaData["2024"];
};

/* ───────────────────── YEARLY STRATEGIC DIRECTIVES (VISION/MISSION) ───────────────────── */
const strategicDirectives = {
  "2023": {
    theme: "Enterprise Integration & Core CRM",
    color: "from-purple-500/10 to-indigo-500/5 border-purple-500/20",
    glowColor: "rgba(168, 85, 247, 0.15)",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    vision: "Establish HariKrushn as a leading architect of high-concurrency cloud ecosystems, custom CRM software, and data management matrices for global enterprises.",
    mission: "Deploy secure, multi-tenant databases and automated signing portals that reduce human administrative overhead by 80% and scale operational speeds.",
    kpis: [
      "Zero-downtime migration protocols",
      "Unified client management databases",
      "High-throughput microservices mesh"
    ]
  },
  "2024": {
    theme: "Cognitive Intelligence & Cinematic Web",
    color: "from-amber-500/10 to-orange-500/5 border-amber-500/20",
    glowColor: "rgba(245, 158, 11, 0.15)",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    vision: "Pioneer the application of customized LLM agents, vector database indexing pipelines, and fluid, high-fidelity user interfaces.",
    mission: "Integrate context-aware AI automations directly into client product structures, accompanied by 3D gestures and cinematic front-end animations.",
    kpis: [
      "Dynamic prompt-caching networks",
      "Framer Motion & WebGL fluid interfaces",
      "Vector-based cognitive search nodes"
    ]
  },
  "2025": {
    theme: "Decentralized Autonomy & Spatial Web",
    color: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20",
    glowColor: "rgba(16, 185, 129, 0.15)",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    vision: "Lead the evolution of visual human-computer interaction by bridging decentralized visual nodes with spatial web computing frameworks.",
    mission: "Architect fully autonomous multi-agent networks that execute secure device-level tasks, rendering real-time responsive spatial grids.",
    kpis: [
      "Peer-to-peer visual state routers",
      "Responsive 3D viewport systems",
      "Local-first cryptographic databases"
    ]
  },
  "2026": {
    theme: "Cognitive Ecosystem & Edge AI",
    color: "from-blue-500/10 to-cyan-500/5 border-blue-500/20",
    glowColor: "rgba(59, 130, 246, 0.15)",
    badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    vision: "Empower modern platforms with self-optimizing code nodes, localized LLMs, and zero-latency visual computing ecosystems.",
    mission: "Deploy robust, edge-native micro-agents and visual rendering engines that sync in real-time across decentralized client networks.",
    kpis: [
      "Autonomous prompt compilation loops",
      "Edge-native sub-10ms data sync",
      "Unified cognitive control panels"
    ]
  }
};

/* ───────────────────── PARTICLE BACKGROUND COMPONENT ───────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(80, Math.floor((width * height) / 25000));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.4,
        speedY: Math.random() * 0.35 + 0.1,
        speedX: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.35 + 0.08,
        driftFactor: Math.random() * 0.015 + 0.005,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      particles.forEach((p) => {
        const offsetX = (mouse.x - width / 2) * p.driftFactor;
        const offsetY = (mouse.y - height / 2) * p.driftFactor;

        ctx.beginPath();
        ctx.arc(p.x + offsetX, p.y + offsetY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10 || p.x > width + 10) {
          p.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" />;
}

/* ───────────────────── MAIN COMPONENT ───────────────────── */
export default function OurStory() {
  const { content } = useContent();
  const milestones = content?.milestones || [];

  const finalMilestones = [...milestones];

  // Sort final milestones list descending (latest year & month at top)
  finalMilestones.sort((a, b) => {
    const yearDiff = parseInt(b.year) - parseInt(a.year);
    if (yearDiff !== 0) return yearDiff;
    return monthToNum(b.month) - monthToNum(a.month);
  });

  const [activeDirectiveId, setActiveDirectiveId] = useState("");
  const [activeYearIndex, setActiveYearIndex] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const getDirectiveId = (d) => {
    return d.month ? `${d.month}-${d.year}` : d.year;
  };

  const rawDirectives = content?.strategic_directives || [];
  const finalDirectives = rawDirectives.length > 0
    ? rawDirectives.map(d => {
        const staticStyle = strategicDirectives[d.year] || strategicDirectives["2025"];
        return {
          theme: d.theme || staticStyle.theme,
          color: d.color || staticStyle.color,
          glowColor: d.glowColor || staticStyle.glowColor,
          badgeColor: d.badgeColor || staticStyle.badgeColor,
          vision: d.vision || staticStyle.vision,
          mission: d.mission || staticStyle.mission,
          kpis: d.kpis || staticStyle.kpis || [],
          year: d.year,
          month: d.month || ""
        };
      })
    : Object.keys(strategicDirectives).map(yr => ({
        ...strategicDirectives[yr],
        year: yr,
        month: ""
      }));

  finalDirectives.sort((a, b) => {
    const yearDiff = parseInt(b.year) - parseInt(a.year);
    if (yearDiff !== 0) return yearDiff;
    return monthToNum(b.month) - monthToNum(a.month);
  });

  const activeDirective = finalDirectives.find(d => getDirectiveId(d) === activeDirectiveId) || finalDirectives[0] || {
    theme: "Cognitive Ecosystem & Edge AI",
    color: "from-blue-500/10 to-cyan-500/5 border-blue-500/20",
    glowColor: "rgba(59, 130, 246, 0.15)",
    badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    vision: "",
    mission: "",
    kpis: [],
    year: "2026",
    month: ""
  };

  useEffect(() => {
    if (finalDirectives.length > 0 && !activeDirectiveId) {
      setActiveDirectiveId(getDirectiveId(finalDirectives[0]));
    }
  }, [finalDirectives, activeDirectiveId]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const timelineContainerRef = useRef(null);

  // Track scroll progress of the timeline section
  const { scrollYProgress } = useScroll({
    target: timelineContainerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Track currently in-view section based on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveYearIndex(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    finalMilestones.forEach((item) => {
      const targetId = item.month ? `${item.month}-${item.year}` : item.year;
      const el = document.getElementById(targetId);
      if (el) observer.observe(el);
    });

    const elDir = document.getElementById("directives");
    if (elDir) observer.observe(elDir);

    return () => observer.disconnect();
  }, [finalMilestones]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 140; // navbar spacing
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const getMilestoneIcon = (index) => {
    const icons = [
      (
        <svg key="icon-0" className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      (
        <svg key="icon-1" className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      (
        <svg key="icon-2" className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      (
        <svg key="icon-3" className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    ];
    return icons[index % icons.length];
  };

  const getCardVariants = (index) => {
    if (isMobile) {
      return {
        hidden: { opacity: 0, x: 30 },
        visible: { opacity: 1, x: 0 }
      };
    }
    return {
      hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
      visible: { opacity: 1, x: 0 }
    };
  };

  return (
    <div className="relative">
      {/* 1. Interactive 3D Particle Canvas Background */}
      <ParticleCanvas />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-white/5 to-white/0 rounded-full filter blur-[140px] pointer-events-none z-0" />

      {/* 2. Sticky Floating Timeline Navigation Sidebar */}
      {!isMobile && finalMilestones && finalMilestones.length > 0 && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3.5 p-3.5 bg-black/45 backdrop-blur-md border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none w-[115px] animate-fadeIn">
          <div className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest text-center border-b border-white/5 pb-2.5 mb-1.5">
            JOURNEY INDEX
          </div>
          {finalMilestones.map((item) => {
            const yearStr = item.year;
            const monthStr = item.month ? `${item.month.substring(0, 3)} ` : '';
            const labelStr = `${monthStr}${yearStr}`;
            const targetId = item.month ? `${item.month}-${item.year}` : item.year;
            const isTargetActive = activeYearIndex === targetId;
            return (
              <button
                key={item.year + '-' + (item.month || '')}
                onClick={() => scrollToSection(targetId)}
                className={`py-2 px-3 rounded-xl font-mono text-[9px] tracking-wider text-left transition-all duration-300 cursor-pointer ${isTargetActive
                    ? 'bg-white/10 text-white border-l-2 border-white pl-2 shadow-[0_0_12px_rgba(255,255,255,0.05)] font-bold'
                    : 'text-neutral-400 hover:text-white pl-3 hover:bg-white/[0.02]'
                  }`}
              >
                {labelStr}
              </button>
            );
          })}
          <button
            onClick={() => scrollToSection("directives")}
            className={`py-2 px-3 rounded-xl font-mono text-[9px] tracking-wider text-left transition-all duration-300 cursor-pointer ${activeYearIndex === "directives"
                ? 'bg-white/10 text-white border-l-2 border-white pl-2 shadow-[0_0_12px_rgba(255,255,255,0.05)] font-bold'
                : 'text-neutral-400 hover:text-white pl-3 hover:bg-white/[0.02]'
              }`}
          >
            Blueprint
          </button>
        </div>
      )}

      <div className="text-center mb-28 space-y-4 z-10 relative pt-8">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">// COMPANY MATRIX</span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">Our Story</h1>
        <p className="font-light text-neutral-400 text-base max-w-xl mx-auto leading-relaxed">
          From a bold idea to a premium digital craftsmanship studio. Here is how we evolved over the years.
        </p>
      </div>

      <div ref={timelineContainerRef} className="relative max-w-[1600px] w-full mx-auto pb-24 z-10">
        {/* Central vertical line */}
        <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-[1px] bg-white/10">
          <motion.div
            style={{ height: lineHeight }}
            className="w-full bg-gradient-to-b from-white via-neutral-300 to-white/10 origin-top shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          />
        </div>

        <div className="flex flex-col gap-20">
          {finalMilestones.map((item, index) => {
            const cardVariants = getCardVariants(index);
            const meta = getYearMeta(item.year);
            const targetId = item.month ? `${item.month}-${item.year}` : item.year;
            return (
              <div
                id={targetId}
                key={targetId + '-' + index}
                className={`flex flex-col md:flex-row relative items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
              >
                {/* 3. Central Node with Dynamic Color and Glow */}
                <motion.div
                  initial={{ scale: 0.8, borderColor: "rgba(255,255,255,0.15)" }}
                  whileInView={{
                    scale: 1.15,
                    borderColor: meta.glowColor,
                    boxShadow: `0 0 15px ${meta.glowColor}`,
                    backgroundColor: "#050505"
                  }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className="absolute left-6 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-black border flex items-center justify-center z-10"
                >
                  {getMilestoneIcon(index)}
                </motion.div>

                {/* Card Container */}
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 100, damping: 18 }}
                  className="w-full md:w-[47%] pl-16 md:pl-0"
                >
                  {/* 3. Milestone Card with Dynamic Hover Glow matching year theme */}
                  <div
                    className="bg-[#050508]/65 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group relative overflow-hidden"
                    style={{
                      '--hover-glow': meta.glowColor
                    }}
                  >
                    {/* Custom hover glow style injected via styles */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
                      style={{
                        background: `radial-gradient(circle at 10% 10%, ${meta.accentColor}, transparent 55%)`
                      }}
                    />

                    <div className="absolute top-0 left-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full z-10"
                      style={{ backgroundColor: meta.glowColor }}
                    />

                    <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-neutral-500 font-light block mb-2 relative z-10">
                      {item.month ? `${item.month} ` : ''}{item.year}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-white mb-3 group-hover:text-neutral-200 transition-colors relative z-10">{item.title}</h3>
                    <p className="font-light text-neutral-400 text-sm sm:text-base leading-relaxed relative z-10 mb-4">{item.description}</p>

                    {/* 4. Achievement highlights list */}
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2.5 relative z-10">
                      <div className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 font-medium">// KEY DELIVERABLES</div>
                      <ul className="space-y-1.5">
                        {(item.highlights || meta.highlights || []).map((highlight, idx) => (
                          <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-400 font-light">
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: meta.glowColor }}
                            />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Empty spacer for grid alignment */}
                <div className="hidden md:block w-[47%]" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Yearly Strategic Directives (Vision & Mission) */}
      <section id="directives" className="mt-20 max-w-6xl mx-auto border-t border-white/5 pt-28 pb-12 z-10 relative">
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <span className="w-8 h-[0.5px] bg-white opacity-40"></span>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">// STRATEGIC BLUEPRINTS</p>
            <span className="w-8 h-[0.5px] bg-white opacity-40"></span>
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white">Yearly Vision & Mission</h2>
          <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto">
            Strategic focuses and execution parameters mapped year-by-year as we scale our engineering directives.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {finalDirectives.map((d) => {
            const dId = getDirectiveId(d);
            const isActive = activeDirectiveId === dId;
            const label = d.month ? `${d.month} ${d.year}` : `${d.year}`;
            return (
              <Magnetic key={dId} speed={0.4}>
                <button
                  onClick={() => setActiveDirectiveId(dId)}
                  className={`px-6 py-3 rounded-full font-mono text-[10px] tracking-widest border transition-all duration-500 cursor-pointer ${isActive
                      ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] font-bold'
                      : 'bg-transparent text-neutral-400 border-white/10 hover:text-white hover:border-white/30'
                    }`}
                >
                  {label}
                </button>
              </Magnetic>
            );
          })}
        </div>

        {/* Vision & Mission Cards Grid */}
        <div className="relative min-h-[380px] md:min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDirectiveId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Vision Card */}
              <div
                className="p-8 rounded-3xl bg-[#08080c]/80 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden group hover:border-white/15 transition-all duration-500 flex flex-col justify-between"
                style={{
                  boxShadow: `0 20px 40px -15px ${activeDirective.glowColor}`
                }}
              >
                {/* Glow Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${activeDirective.color} rounded-full filter blur-[40px] opacity-40 group-hover:opacity-60 transition-all duration-500 pointer-events-none`} />

                <div>
                  <div className="flex justify-between items-start mb-6 z-10 relative">
                    <span className={`px-3.5 py-1 border rounded text-[9px] font-mono tracking-widest font-light ${activeDirective.badgeColor}`}>
                      VISION DIRECTIVE
                    </span>
                    <span className="font-mono text-xs text-neutral-600 font-light">
                      {activeDirective.month ? `${activeDirective.month} ` : ''}{activeDirective.year} // STRATEGY
                    </span>
                  </div>

                  <p className="text-white text-base font-light leading-relaxed mb-6 z-10 relative">
                    {activeDirective.vision}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest z-10 relative border-t border-white/5 pt-4">
                  Theme: {activeDirective.theme}
                </div>
              </div>

              {/* Mission Card */}
              <div
                className="p-8 rounded-3xl bg-[#08080c]/80 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden group hover:border-white/15 transition-all duration-500 flex flex-col justify-between"
                style={{
                  boxShadow: `0 20px 40px -15px ${activeDirective.glowColor}`
                }}
              >
                {/* Glow Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${activeDirective.color} rounded-full filter blur-[40px] opacity-40 group-hover:opacity-60 transition-all duration-500 pointer-events-none`} />

                <div>
                  <div className="flex justify-between items-start mb-6 z-10 relative">
                    <span className={`px-3.5 py-1 border rounded text-[9px] font-mono tracking-widest font-light ${activeDirective.badgeColor}`}>
                      MISSION PARAMETERS
                    </span>
                    <span className="font-mono text-xs text-neutral-600 font-light">
                      {activeDirective.month ? `${activeDirective.month} ` : ''}{activeDirective.year} // EXECUTION
                    </span>
                  </div>

                  <p className="text-white text-base font-light leading-relaxed mb-6 z-10 relative">
                    {activeDirective.mission}
                  </p>
                </div>

                {/* KPI Checkpoints */}
                <div className="space-y-3 z-10 relative border-t border-white/5 pt-4">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">// KEY DELIVERABLES</div>
                  <ul className="space-y-2">
                    {(activeDirective.kpis || []).map((kpi, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-neutral-400 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                        <span>{kpi}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
