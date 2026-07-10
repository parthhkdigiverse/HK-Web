import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import OrganigramCanvas from '../components/OrganigramCanvas';

/* ─────────────────────────── DEFAULT DATA FALLBACKS ─────────────────────────── */
const DEFAULT_FOUNDERS = [
  {
    name: 'Radhe Patel',
    role: 'Co-Founder & CEO',
    bio: 'Leading strategic partnerships, vision, and growth. Radhe aligns complex commercial needs with exceptional digital delivery.',
    level: 1,
    icon: '⚡',
    dept: 'FOUNDER',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    name: 'Prince Patel',
    role: 'Co-Founder & Managing Partner',
    bio: 'Overseeing global operations, legal structures, and commercial growth strategy for HariKrushn DigiVerse.',
    level: 1,
    icon: '👑',
    dept: 'FOUNDER',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

const DEFAULT_C_LEVELS = {
  cto: {
    name: 'Krushn Patel',
    role: 'Chief Technology Officer',
    bio: 'Pioneering system architectures, custom database layers, and robust AI orchestrations. Krushn codes systems that scale to millions.',
    level: 2,
    icon: '🛡️',
    dept: 'C-SUITE / TECH',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
  },
  cdo: {
    name: 'Arjun Shah',
    role: 'Chief Design Officer',
    bio: 'Shaping the digital craftsmanship ethos. Arjun creates high-end interactive visuals, smooth motion layouts, and premium user flows.',
    level: 2,
    icon: '📐',
    dept: 'C-SUITE / DESIGN',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80'
  },
  caio: {
    name: 'Pooja Mehta',
    role: 'Chief AI Officer',
    bio: 'Integrating LLMs, custom training agent pipelines, and automated intelligence layers that streamline complex business workflows.',
    level: 2,
    icon: '🧠',
    dept: 'C-SUITE / AI',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  },
  cmo: {
    name: 'Neha Sharma',
    role: 'Chief Marketing Officer',
    bio: 'Leading business scaling, operational excellence, client strategy, and product delivery management for international accounts.',
    level: 2,
    icon: '📈',
    dept: 'C-SUITE / GROWTH',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80'
  }
};

const DEFAULT_DEPARTMENTS = [
  {
    key: 'dev',
    name: 'Software Development',
    dept: 'DEVELOPMENT',
    parentKey: 'cto',
    lead: {
      name: 'Vikram Rathod',
      role: 'Software Dev Lead',
      bio: 'Crafting fluid React interfaces and interactive visual layers with high-performance styling and custom motion graphics.',
      level: 3,
      icon: '💻',
      dept: 'DEVELOPMENT',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80',
      employee: {
        name: 'Aarav Singhania',
        role: 'Senior Fullstack Developer',
        bio: 'Architecting secure RESTful/GraphQL APIs, database schemas, and microservice infrastructure for high availability.',
        level: 4,
        icon: '⚙️',
        dept: 'DEVELOPMENT',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
        intern: {
          name: 'Neil D\'Souza',
          role: 'Frontend Intern',
          bio: 'Specializing in premium animations, user interactions, and CSS optimization across platforms.',
          level: 5,
          icon: '🎨',
          dept: 'DEVELOPMENT',
          image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80'
        }
      }
    }
  },
  {
    key: 'qa',
    name: 'Product & QA',
    dept: 'PRODUCT & QA',
    parentKey: 'cto',
    lead: {
      name: 'Simran Kaur',
      role: 'Product & QA Lead',
      bio: 'Managing strategic client communications, technical roadmaps, and cross-functional engineering deliverables.',
      level: 3,
      icon: '🤝',
      dept: 'PRODUCT & QA',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
      employee: {
        name: 'Dev Patel',
        role: 'Senior QA Engineer',
        bio: 'Optimizing server load, DevOps CI/CD deployments, and cloud scalability across multi-region networks.',
        level: 4,
        icon: '🚀',
        dept: 'PRODUCT & QA',
        image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&h=150&q=80',
        intern: {
          name: 'Meera Nair',
          role: 'Product Testing Intern',
          bio: 'Structuring internal workflows, employee onboarding automation, and resource loading metrics.',
          level: 5,
          icon: '📋',
          dept: 'PRODUCT & QA',
          image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&h=150&q=80'
        }
      }
    }
  },
  {
    key: 'design',
    name: 'UI/UX & Design',
    dept: 'CREATIVE & DESIGN',
    parentKey: 'cdo',
    lead: {
      name: 'Diya Joshi',
      role: 'Creative & UI/UX Lead',
      bio: 'Designing user-centered product flows, high-fidelity mockups, and unified design system architectures.',
      level: 3,
      icon: '✏️',
      dept: 'CREATIVE & DESIGN',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      employee: {
        name: 'Isha Verma',
        role: 'Senior UI Designer',
        bio: 'Creating cinematic transitions, svg web animations, and premium micro-interactions that make interfaces feel alive.',
        level: 4,
        icon: '✨',
        dept: 'CREATIVE & DESIGN',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
        intern: {
          name: 'Zara Khan',
          role: 'UX Design Intern',
          bio: 'Tuning language models for context preservation, sentiment tracking, and high-performance translation API layers.',
          level: 5,
          icon: '🗣️',
          dept: 'CREATIVE & DESIGN',
          image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=150&h=150&q=80'
        }
      }
    }
  },
  {
    key: 'ai',
    name: 'AI & Research',
    dept: 'AI RESEARCH',
    parentKey: 'caio',
    lead: {
      name: 'Kabir Malhotra',
      role: 'AI & ML Research Lead',
      bio: 'Developing custom NLP models, fine-tuning neural networks, and running automated workflow logic engines.',
      level: 3,
      icon: '🧪',
      dept: 'AI RESEARCH',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80',
      employee: {
        name: 'Rohan Das',
        role: 'Senior AI Engineer',
        bio: 'Building scalable pipeline systems, managing vector databases, and optimizing real-time inference resource allocation.',
        level: 4,
        icon: '📊',
        dept: 'AI RESEARCH',
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80',
        intern: {
          name: 'Kabir Das',
          role: 'Machine Learning Intern',
          bio: 'Tuning language models for context preservation, sentiment tracking, and high-performance translation API layers.',
          level: 5,
          icon: '📊',
          dept: 'AI RESEARCH',
          image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80'
        }
      }
    }
  },
  {
    key: 'marketing',
    name: 'Marketing & Brand',
    dept: 'MARKETING',
    parentKey: 'cmo',
    lead: {
      name: 'Yash Wardhan',
      role: 'Marketing & Growth Lead',
      bio: 'Optimizing web rankings, organic search visibility, and client acquisition funnel conversions.',
      level: 3,
      icon: '🔍',
      dept: 'MARKETING',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80',
      employee: {
        name: 'Ananya Sen',
        role: 'Senior Digital Marketer',
        bio: 'Specializing in premium animations, user interactions, and CSS optimization across platforms.',
        level: 4,
        icon: '🎨',
        dept: 'MARKETING',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
        intern: {
          name: 'Simran Sen',
          role: 'Digital Marketing Intern',
          bio: 'Assisting in social campaigns, search engine visibility and lead capture flows.',
          level: 5,
          icon: '✨',
          dept: 'MARKETING',
          image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80'
        }
      }
    }
  }
];

/* ───────────────── LEVEL ACCENT PALETTES ───────────────── */
const levelAccents = {
  1: {
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    glowColor: '#fbbf24',
    glowHover: 'rgba(251,191,36,0.5)',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/5',
    dot: 'bg-amber-400',
    ring: 'ring-amber-500/30',
    labelBg: 'from-amber-500/10 to-amber-600/5',
  },
  2: {
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    glowColor: '#8b5cf6',
    glowHover: 'rgba(139,92,246,0.45)',
    text: 'text-violet-400',
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/5',
    dot: 'bg-violet-400',
    ring: 'ring-violet-500/30',
    labelBg: 'from-violet-500/10 to-violet-600/5',
  },
  3: {
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    glowColor: '#10b981',
    glowHover: 'rgba(16,185,129,0.4)',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-500/30',
    labelBg: 'from-emerald-500/10 to-emerald-600/5',
  },
  4: {
    gradient: 'from-sky-400 via-blue-500 to-indigo-500',
    glowColor: '#38bdf8',
    glowHover: 'rgba(56,189,248,0.4)',
    text: 'text-sky-400',
    border: 'border-sky-500/20',
    bg: 'bg-sky-500/5',
    dot: 'bg-sky-400',
    ring: 'ring-sky-500/30',
    labelBg: 'from-sky-500/10 to-sky-600/5',
  },
  5: {
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-500',
    glowColor: '#f43f5e',
    glowHover: 'rgba(244,63,94,0.35)',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    bg: 'bg-rose-500/5',
    dot: 'bg-rose-400',
    ring: 'ring-rose-500/30',
    labelBg: 'from-rose-500/10 to-rose-600/5',
  },
};

/* ───────────────────── REPORTING RELATIONSHIPS LOOKUP ───────────────────── */
const parentMap = {
  "Radhe Patel": ["HariKrushn DigiVerse LLP"],
  "Prince Patel": ["HariKrushn DigiVerse LLP"],

  "Krushn Patel": ["Radhe Patel", "HariKrushn DigiVerse LLP"],
  "Arjun Shah": ["Radhe Patel", "HariKrushn DigiVerse LLP"],
  "Pooja Mehta": ["Prince Patel", "HariKrushn DigiVerse LLP"],
  "Neha Sharma": ["Prince Patel", "HariKrushn DigiVerse LLP"],
  
  "Vikram Rathod": ["Krushn Patel", "Radhe Patel", "HariKrushn DigiVerse LLP"],
  "Simran Kaur": ["Krushn Patel", "Radhe Patel", "HariKrushn DigiVerse LLP"],
  "Diya Joshi": ["Arjun Shah", "Radhe Patel", "HariKrushn DigiVerse LLP"],
  "Kabir Malhotra": ["Pooja Mehta", "Prince Patel", "HariKrushn DigiVerse LLP"],
  "Yash Wardhan": ["Neha Sharma", "Prince Patel", "HariKrushn DigiVerse LLP"],
  
  "Aarav Singhania": ["Vikram Rathod", "Krushn Patel", "Radhe Patel", "HariKrushn DigiVerse LLP"],
  "Dev Patel": ["Simran Kaur", "Krushn Patel", "Radhe Patel", "HariKrushn DigiVerse LLP"],
  "Isha Verma": ["Diya Joshi", "Arjun Shah", "Radhe Patel", "HariKrushn DigiVerse LLP"],
  "Rohan Das": ["Kabir Malhotra", "Pooja Mehta", "Prince Patel", "HariKrushn DigiVerse LLP"],
  "Ananya Sen": ["Yash Wardhan", "Neha Sharma", "Prince Patel", "HariKrushn DigiVerse LLP"],
  
  "Neil D'Souza": ["Aarav Singhania", "Vikram Rathod", "Krushn Patel", "Radhe Patel", "HariKrushn DigiVerse LLP"],
  "Meera Nair": ["Dev Patel", "Simran Kaur", "Krushn Patel", "Radhe Patel", "HariKrushn DigiVerse LLP"],
  "Zara Khan": ["Isha Verma", "Diya Joshi", "Arjun Shah", "Radhe Patel", "HariKrushn DigiVerse LLP"],
  "Kabir Das": ["Rohan Das", "Kabir Malhotra", "Pooja Mehta", "Prince Patel", "HariKrushn DigiVerse LLP"],
  "Simran Sen": ["Ananya Sen", "Yash Wardhan", "Neha Sharma", "Prince Patel", "HariKrushn DigiVerse LLP"]
};

/* ───────────────────── DEPT LABEL COMPONENT ───────────────────── */
function DeptLabel({ text, accent }) {
  return (
    <div className="relative px-4 h-12 flex items-center justify-center text-center select-none w-full whitespace-nowrap">
      <div
        className="absolute inset-0 rounded-full blur-md opacity-25"
        style={{ backgroundColor: accent.glowColor, margin: '8px 0' }}
      />
      <span className="relative font-mono text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: accent.glowColor }}>
        {text}
      </span>
    </div>
  );
}

/* ───────────────────── STAR PARTICLES CANVAS ───────────────────── */
function StarParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 1.1 + 0.3,
      alpha: Math.random() * 0.35 + 0.1,
      speed: Math.random() * 0.25 + 0.05,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      stars.forEach((s) => {
        s.alpha += s.speed * 0.01 * s.dir;
        if (s.alpha >= 0.45) s.dir = -1;
        if (s.alpha <= 0.05) s.dir = 1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}

/* ───────────────────── VERTICAL PERSON CARD COMPONENT ───────────────────── */
function PersonCard({ node, isActive, isDimmed, onHover, onClick, accent, hoveredNode, tooltipSide = 'right', isSelected }) {
  const isCLevel = node.level === 2;

  const cardId = `node-${node.name.replace(/\s+/g, '-').toLowerCase()}`;
  
  const tooltipPositionClasses = tooltipSide === 'left'
    ? 'right-full top-1/2 -translate-y-1/2 mr-4'
    : tooltipSide === 'right'
    ? 'left-full top-1/2 -translate-y-1/2 ml-4'
    : 'left-1/2 -translate-x-1/2 mt-3';
  const tooltipTopStyle = tooltipSide === 'bottom' ? { top: '100%' } : {};

  // Tooltip triggers on desktop hover OR mobile active click (excluding C-Level for mobile clicks)
  const showTooltip = (hoveredNode === node.name) || (isActive && !isCLevel);

  return (
    <div
      id={cardId}
      onMouseEnter={() => onHover(node.name)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      className={`w-44 p-4 rounded-2xl bg-[#09090e]/75 backdrop-blur-xl border transition-all duration-400 flex flex-col items-center text-center relative group cursor-pointer ${
        isDimmed ? 'opacity-20 scale-[0.96] blur-[0.5px] pointer-events-none' : 'opacity-100 hover:scale-[1.04]'
      }`}
      style={{
        borderColor: isSelected ? '#f43f5e' : isActive ? accent.glowColor : 'rgba(255,255,255,0.06)',
        boxShadow: isSelected
          ? `0 0 25px rgba(244,63,94,0.4), 0 10px 30px rgba(0, 0, 0, 0.6)`
          : isActive 
          ? `0 0 25px ${accent.glowColor}40, 0 10px 30px rgba(0, 0, 0, 0.6)` 
          : '0 8px 20px rgba(0, 0, 0, 0.4)',
        zIndex: (isActive || showTooltip || isSelected) ? 150 : 10
      }}
    >
      {/* Dynamic hover glow trace */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 10%, ${accent.glowColor}15, transparent 65%)`
        }}
      />
      
      {/* Profile picture on top with colored outline */}
      <div 
        className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0 transition-transform duration-500 group-hover:scale-105 mb-3 flex items-center justify-center"
        style={{ borderColor: accent.glowColor }}
      >
        {node.name === 'HariKrushn DigiVerse LLP' ? (
          <img 
            src="/images/hk-logo.png" 
            alt="HariKrushn DigiVerse LLP"
            className="w-full h-full object-contain p-1 bg-[#050508]"
            loading="lazy"
          />
        ) : (
          <img 
            src={node.image} 
            alt={node.name}
            className="w-full h-full object-cover bg-neutral-900"
            loading="lazy"
          />
        )}
      </div>

      {/* Info Block (centered name and designation) */}
      <div className="w-full min-w-0 relative z-10">
        <h4 className="font-display text-sm font-bold text-white leading-tight group-hover:text-neutral-200 transition-colors truncate">
          {node.name}
        </h4>
        <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mt-1 truncate">
          {node.role}
        </p>
      </div>

      {/* Expand trigger if C-Level */}
      {isCLevel && (
        <div 
          className="absolute bottom-2.5 right-2.5 w-4 h-4 rounded-full border border-white/10 flex items-center justify-center text-xs text-neutral-500 group-hover:text-white group-hover:border-white/20 transition-colors"
        >
          {isActive ? '−' : '+'}
        </div>
      )}

      {/* Details Popover */}
      {showTooltip && (
        <div
          className={`absolute ${tooltipPositionClasses} w-[300px] rounded-2xl p-[1px] z-[200] animate-fadeIn pointer-events-auto`}
          style={{
            ...tooltipTopStyle,
            background: `linear-gradient(135deg, ${accent.glowColor}, transparent 70%)`,
            boxShadow: `0 25px 80px rgba(0,0,0,0.8), 0 0 40px ${accent.glowColor}30`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="rounded-2xl bg-[#08080d]/95 backdrop-blur-2xl p-5 relative overflow-hidden text-left font-sans">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: accent.glowColor }} />
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: accent.glowColor }}
            />

            <div className="flex gap-3.5 items-start relative z-10">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: accent.glowColor }}>
                <img src={node.image} alt={node.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 justify-between">
                  <h4 className="font-display font-bold text-sm text-white truncate">{node.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border shrink-0`}
                    style={{ borderColor: accent.glowColor, color: accent.glowColor, backgroundColor: `${accent.glowColor}10` }}
                  >
                    Lvl {node.level}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider mt-1">{node.role}</p>
                <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">{node.dept}</p>
              </div>
            </div>

            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mt-4 pt-3 border-t border-white/5 relative z-10 font-light">
              {node.bio}
            </p>

            <div className="pt-3 mt-3 border-t border-white/5 relative z-10 text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 block">Focus Area</span>
              <span className="text-xs text-neutral-300 block mt-1 font-medium">
                {node.level === 1 ? 'Strategic Vision' :
                 node.level === 2 ? 'Executive Leadership' :
                 node.role.includes('Tech') || node.role.includes('Dev') || node.role.includes('QA') ? 'System & Logic' :
                 node.role.includes('Design') || node.role.includes('UI') ? 'UI/UX Craft' :
                 node.role.includes('AI') || node.role.includes('ML') ? 'AI Research' : 'Growth & Brand'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────── DESKTOP CONSTELLATION TREE ───────────────────── */
function DesktopTree({ activeMember, onSelect, expandedExecs, toggleExec, hoveredNode, setHoveredNode, parentMap, founders, cLevels, departments, selectedNodeName }) {
  const treeContainerRef = useRef(null);
  const [connections, setConnections] = useState([]);

  const isNodeDimmed = (name) => {
    if (!hoveredNode) return false;
    if (name === hoveredNode) return false;
    if (parentMap[hoveredNode]?.includes(name)) return false;
    if (parentMap[name]?.includes(hoveredNode)) return false;
    return true;
  };

  const updateConnections = useCallback(() => {
    if (!treeContainerRef.current) return;
    
    const containerRect = treeContainerRef.current.getBoundingClientRect();
    const newConnections = [];

    const getCenterCoords = (name, position = 'bottom') => {
      const el = document.getElementById(`node-${name.replace(/\s+/g, '-').toLowerCase()}`);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: position === 'bottom' ? rect.bottom - containerRect.top : rect.top - containerRect.top
      };
    };

    const connect = (fromName, toName, color, pulse = true) => {
      const fromPoint = getCenterCoords(fromName, 'bottom');
      const toPoint = getCenterCoords(toName, 'top');
      if (fromPoint && toPoint) {
        newConnections.push({
          fromName,
          toName,
          from: fromPoint,
          to: toPoint,
          color,
          pulse
        });
      }
    };

    // 0. Company to Founders
    connect("HariKrushn DigiVerse LLP", "Radhe Patel", "#fbbf24");
    connect("HariKrushn DigiVerse LLP", "Prince Patel", "#fbbf24");

    // 1. Founders to C-Suite
    connect("Radhe Patel", "Krushn Patel", "#fbbf24");
    connect("Radhe Patel", "Arjun Shah", "#fbbf24");
    connect("Prince Patel", "Pooja Mehta", "#fbbf24");
    connect("Prince Patel", "Neha Sharma", "#fbbf24");

    // 2. C-Suite to Leads (if visible)
    if (expandedExecs.CTO) {
      connect("Krushn Patel", "Vikram Rathod", "#8b5cf6");
      connect("Krushn Patel", "Simran Kaur", "#8b5cf6");
    }
    if (expandedExecs.CDO) {
      connect("Arjun Shah", "Diya Joshi", "#8b5cf6");
    }
    if (expandedExecs.CAIO) {
      connect("Pooja Mehta", "Kabir Malhotra", "#8b5cf6");
    }
    if (expandedExecs.CMO) {
      connect("Neha Sharma", "Yash Wardhan", "#8b5cf6");
    }

    // 3. Leads to Employees (if visible)
    if (expandedExecs.CTO) {
      connect("Vikram Rathod", "Aarav Singhania", "#10b981", false);
      connect("Simran Kaur", "Dev Patel", "#10b981", false);
    }
    if (expandedExecs.CDO) {
      connect("Diya Joshi", "Isha Verma", "#10b981", false);
    }
    if (expandedExecs.CAIO) {
      connect("Kabir Malhotra", "Rohan Das", "#10b981", false);
    }
    if (expandedExecs.CMO) {
      connect("Yash Wardhan", "Ananya Sen", "#10b981", false);
    }

    // 4. Employees to Interns (if visible)
    if (expandedExecs.CTO) {
      connect("Aarav Singhania", "Neil D'Souza", "#38bdf8", false);
      connect("Dev Patel", "Meera Nair", "#38bdf8", false);
    }
    if (expandedExecs.CDO) {
      connect("Isha Verma", "Zara Khan", "#38bdf8", false);
    }
    if (expandedExecs.CAIO) {
      connect("Rohan Das", "Kabir Das", "#38bdf8", false);
    }
    if (expandedExecs.CMO) {
      connect("Ananya Sen", "Simran Sen", "#38bdf8", false);
    }

    setConnections(newConnections);
  }, [expandedExecs]);

  useEffect(() => {
    const timer = setTimeout(updateConnections, 150);
    window.addEventListener('resize', updateConnections);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateConnections);
    };
  }, [updateConnections, expandedExecs]);

  const isInActivePath = (nodeName) => {
    if (!hoveredNode) return true;
    if (nodeName === hoveredNode) return true;
    if (parentMap[hoveredNode]?.includes(nodeName)) return true;
    if (parentMap[nodeName]?.includes(hoveredNode)) return true;
    return false;
  };

  return (
    <div ref={treeContainerRef} className="relative flex flex-col items-center w-full min-h-[920px] py-12">
      {/* SVG Canvas for dynamic Bézier curved paths and light particles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
        {connections.map((conn, idx) => {
          const fromActive = isInActivePath(conn.fromName);
          const toActive = isInActivePath(conn.toName);
          const isActive = hoveredNode ? (fromActive && toActive) : true;
          
          const strokeOpacity = hoveredNode ? (isActive ? 0.95 : 0.06) : 0.22;
          const strokeWidth = hoveredNode ? (isActive ? 2.5 : 1) : 1.25;
          
          const dy = conn.to.y - conn.from.y;
          const controlY1 = conn.from.y + dy * 0.45;
          const controlY2 = conn.from.y + dy * 0.55;
          const pathD = `M ${conn.from.x} ${conn.from.y} C ${conn.from.x} ${controlY1}, ${conn.to.x} ${controlY2}, ${conn.to.x} ${conn.to.y}`;
          
          return (
            <g key={idx}>
              {/* Glowing background line */}
              {isActive && hoveredNode && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={conn.color}
                  strokeWidth={5}
                  strokeOpacity={0.35}
                  className="blur-[3px] transition-all duration-300"
                />
              )}
              {/* Core line */}
              <path
                d={pathD}
                fill="none"
                stroke={conn.color}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                className="transition-all duration-300"
              />
              
              {/* Animated particle flow */}
              {conn.pulse && isActive && (
                <circle r="3" fill="#ffffff" style={{ filter: `drop-shadow(0 0 4px ${conn.color})` }}>
                  <animateMotion
                    dur={conn.fromName.includes("Patel") ? "3s" : "4s"}
                    repeatCount="indefinite"
                    path={pathD}
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Row 0: Company Root Node */}
      <div className="flex justify-center items-center relative z-10 mb-20">
        <PersonCard 
          node={{
            name: 'HariKrushn DigiVerse LLP',
            role: 'Parent Organization',
            bio: 'HariKrushn DigiVerse LLP is a premium digital craftsmanship studio and technology consultancy specializing in high-end web applications, AI automation agents, and custom enterprise systems.',
            level: 1,
            dept: 'ENTERPRISE'
          }} 
          isActive={hoveredNode === 'HariKrushn DigiVerse LLP'} 
          isDimmed={isNodeDimmed('HariKrushn DigiVerse LLP')}
          onHover={setHoveredNode}
          onClick={() => {}}
          accent={levelAccents[1]}
          hoveredNode={hoveredNode}
          isSelected={selectedNodeName === 'HariKrushn DigiVerse LLP'}
        />
      </div>

      {/* Row 1: Founders */}
      <div className="flex flex-wrap gap-8 sm:gap-16 lg:gap-32 justify-center items-center relative z-10 mb-20 w-full px-4">
        <PersonCard 
          node={founders[0]} 
          isActive={hoveredNode === founders[0].name} 
          isDimmed={isNodeDimmed(founders[0].name)}
          onHover={setHoveredNode}
          onClick={() => onSelect(activeMember === founders[0].name ? null : founders[0])}
          accent={levelAccents[1]}
          hoveredNode={hoveredNode}
          tooltipSide="right"
          isSelected={selectedNodeName === founders[0].name}
        />
        <PersonCard 
          node={founders[1]} 
          isActive={hoveredNode === founders[1].name} 
          isDimmed={isNodeDimmed(founders[1].name)}
          onHover={setHoveredNode}
          onClick={() => onSelect(activeMember === founders[1].name ? null : founders[1])}
          accent={levelAccents[1]}
          hoveredNode={hoveredNode}
          tooltipSide="left"
          isSelected={selectedNodeName === founders[1].name}
        />
      </div>

      {/* Row 2: C-Suite */}
      <div className="flex flex-wrap gap-6 sm:gap-12 md:gap-20 justify-center items-center relative z-10 mb-24 w-full px-4">
        {[
          { key: 'CTO', exec: cLevels.cto, side: 'right' },
          { key: 'CDO', exec: cLevels.cdo, side: 'right' },
          { key: 'CAIO', exec: cLevels.caio, side: 'left' },
          { key: 'CMO', exec: cLevels.cmo, side: 'left' }
        ].map(({ key, exec, side }) => (
          <PersonCard 
            key={exec.name}
            node={exec}
            isActive={expandedExecs[key]}
            isDimmed={isNodeDimmed(exec.name)}
            onHover={setHoveredNode}
            onClick={() => {
              toggleExec(key);
              onSelect(activeMember === exec.name ? null : exec);
            }}
            accent={levelAccents[2]}
            hoveredNode={hoveredNode}
            tooltipSide={side}
            isSelected={selectedNodeName === exec.name}
          />
        ))}
      </div>

      {/* Row 3: Expanded Department Columns */}
      <div className="flex justify-center gap-12 lg:gap-16 xl:gap-24 relative z-10 w-full px-4 items-start flex-wrap xl:flex-nowrap">
        {/* Column 1: Software Development */}
        <AnimatePresence>
          {expandedExecs.CTO && (
            <motion.div 
              initial={{ opacity: 0, y: -15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-12 items-center"
            >
              <DeptLabel text="Software Development" accent={levelAccents[3]} />
              <PersonCard 
                node={departments[0].lead} 
                isActive={hoveredNode === departments[0].lead.name}
                isDimmed={isNodeDimmed(departments[0].lead.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[0].lead.name ? null : departments[0].lead)}
                accent={levelAccents[3]}
                hoveredNode={hoveredNode}
                tooltipSide="right"
                isSelected={selectedNodeName === departments[0].lead.name}
              />
              <PersonCard 
                node={departments[0].lead.employee} 
                isActive={hoveredNode === departments[0].lead.employee.name}
                isDimmed={isNodeDimmed(departments[0].lead.employee.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[0].lead.employee.name ? null : departments[0].lead.employee)}
                accent={levelAccents[4]}
                hoveredNode={hoveredNode}
                tooltipSide="right"
                isSelected={selectedNodeName === departments[0].lead.employee.name}
              />
              <PersonCard 
                node={departments[0].lead.employee.intern} 
                isActive={hoveredNode === departments[0].lead.employee.intern.name}
                isDimmed={isNodeDimmed(departments[0].lead.employee.intern.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[0].lead.employee.intern.name ? null : departments[0].lead.employee.intern)}
                accent={levelAccents[5]}
                hoveredNode={hoveredNode}
                tooltipSide="right"
                isSelected={selectedNodeName === departments[0].lead.employee.intern.name}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Column 2: Product & QA */}
        <AnimatePresence>
          {expandedExecs.CTO && (
            <motion.div 
              initial={{ opacity: 0, y: -15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="flex flex-col gap-12 items-center"
            >
              <DeptLabel text="Product & QA" accent={levelAccents[3]} />
              <PersonCard 
                node={departments[1].lead} 
                isActive={hoveredNode === departments[1].lead.name}
                isDimmed={isNodeDimmed(departments[1].lead.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[1].lead.name ? null : departments[1].lead)}
                accent={levelAccents[3]}
                hoveredNode={hoveredNode}
                tooltipSide="right"
                isSelected={selectedNodeName === departments[1].lead.name}
              />
              <PersonCard 
                node={departments[1].lead.employee} 
                isActive={hoveredNode === departments[1].lead.employee.name}
                isDimmed={isNodeDimmed(departments[1].lead.employee.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[1].lead.employee.name ? null : departments[1].lead.employee)}
                accent={levelAccents[4]}
                hoveredNode={hoveredNode}
                tooltipSide="right"
                isSelected={selectedNodeName === departments[1].lead.employee.name}
              />
              <PersonCard 
                node={departments[1].lead.employee.intern} 
                isActive={hoveredNode === departments[1].lead.employee.intern.name}
                isDimmed={isNodeDimmed(departments[1].lead.employee.intern.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[1].lead.employee.intern.name ? null : departments[1].lead.employee.intern)}
                accent={levelAccents[5]}
                hoveredNode={hoveredNode}
                tooltipSide="right"
                isSelected={selectedNodeName === departments[1].lead.employee.intern.name}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Column 3: UI/UX & Design */}
        <AnimatePresence>
          {expandedExecs.CDO && (
            <motion.div 
              initial={{ opacity: 0, y: -15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-12 items-center"
            >
              <DeptLabel text="UI/UX & Design" accent={levelAccents[3]} />
              <PersonCard 
                node={departments[2].lead} 
                isActive={hoveredNode === departments[2].lead.name}
                isDimmed={isNodeDimmed(departments[2].lead.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[2].lead.name ? null : departments[2].lead)}
                accent={levelAccents[3]}
                hoveredNode={hoveredNode}
                tooltipSide="right"
                isSelected={selectedNodeName === departments[2].lead.name}
              />
              <PersonCard 
                node={departments[2].lead.employee} 
                isActive={hoveredNode === departments[2].lead.employee.name}
                isDimmed={isNodeDimmed(departments[2].lead.employee.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[2].lead.employee.name ? null : departments[2].lead.employee)}
                accent={levelAccents[4]}
                hoveredNode={hoveredNode}
                tooltipSide="right"
                isSelected={selectedNodeName === departments[2].lead.employee.name}
              />
              <PersonCard 
                node={departments[2].lead.employee.intern} 
                isActive={hoveredNode === departments[2].lead.employee.intern.name}
                isDimmed={isNodeDimmed(departments[2].lead.employee.intern.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[2].lead.employee.intern.name ? null : departments[2].lead.employee.intern)}
                accent={levelAccents[5]}
                hoveredNode={hoveredNode}
                tooltipSide="right"
                isSelected={selectedNodeName === departments[2].lead.employee.intern.name}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Column 4: AI & Research */}
        <AnimatePresence>
          {expandedExecs.CAIO && (
            <motion.div 
              initial={{ opacity: 0, y: -15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-12 items-center"
            >
              <DeptLabel text="AI & Research" accent={levelAccents[3]} />
              <PersonCard 
                node={departments[3].lead} 
                isActive={hoveredNode === departments[3].lead.name}
                isDimmed={isNodeDimmed(departments[3].lead.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[3].lead.name ? null : departments[3].lead)}
                accent={levelAccents[3]}
                hoveredNode={hoveredNode}
                tooltipSide="left"
                isSelected={selectedNodeName === departments[3].lead.name}
              />
              <PersonCard 
                node={departments[3].lead.employee} 
                isActive={hoveredNode === departments[3].lead.employee.name}
                isDimmed={isNodeDimmed(departments[3].lead.employee.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[3].lead.employee.name ? null : departments[3].lead.employee)}
                accent={levelAccents[4]}
                hoveredNode={hoveredNode}
                tooltipSide="left"
                isSelected={selectedNodeName === departments[3].lead.employee.name}
              />
              <PersonCard 
                node={departments[3].lead.employee.intern} 
                isActive={hoveredNode === departments[3].lead.employee.intern.name}
                isDimmed={isNodeDimmed(departments[3].lead.employee.intern.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[3].lead.employee.intern.name ? null : departments[3].lead.employee.intern)}
                accent={levelAccents[5]}
                hoveredNode={hoveredNode}
                tooltipSide="left"
                isSelected={selectedNodeName === departments[3].lead.employee.intern.name}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Column 5: Marketing & Brand */}
        <AnimatePresence>
          {expandedExecs.CMO && (
            <motion.div 
              initial={{ opacity: 0, y: -15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-12 items-center"
            >
              <DeptLabel text="Marketing & Brand" accent={levelAccents[3]} />
              <PersonCard 
                node={departments[4].lead} 
                isActive={hoveredNode === departments[4].lead.name}
                isDimmed={isNodeDimmed(departments[4].lead.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[4].lead.name ? null : departments[4].lead)}
                accent={levelAccents[3]}
                hoveredNode={hoveredNode}
                tooltipSide="left"
                isSelected={selectedNodeName === departments[4].lead.name}
              />
              <PersonCard 
                node={departments[4].lead.employee} 
                isActive={hoveredNode === departments[4].lead.employee.name}
                isDimmed={isNodeDimmed(departments[4].lead.employee.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[4].lead.employee.name ? null : departments[4].lead.employee)}
                accent={levelAccents[4]}
                hoveredNode={hoveredNode}
                tooltipSide="left"
                isSelected={selectedNodeName === departments[4].lead.employee.name}
              />
              <PersonCard 
                node={departments[4].lead.employee.intern} 
                isActive={hoveredNode === departments[4].lead.employee.intern.name}
                isDimmed={isNodeDimmed(departments[4].lead.employee.intern.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === departments[4].lead.employee.intern.name ? null : departments[4].lead.employee.intern)}
                accent={levelAccents[5]}
                hoveredNode={hoveredNode}
                tooltipSide="left"
                isSelected={selectedNodeName === departments[4].lead.employee.intern.name}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ───────────────────── MOBILE ACCORDION TREE ───────────────────── */
function MobileTreeNode({ node, activeMember, onSelect }) {
  let childrenList = [];
  if (node.children) {
    childrenList = node.children;
  } else if (node.employee) {
    childrenList = [node.employee];
  } else if (node.intern) {
    childrenList = [node.intern];
  }

  const accent = levelAccents[node.level] || levelAccents[3];

  return (
    <div className="flex flex-col w-full">
      <div className="my-2 flex justify-center">
        <PersonCard 
          node={node} 
          isActive={activeMember === node.name} 
          isDimmed={false}
          onHover={() => {}}
          onClick={() => onSelect(activeMember === node.name ? null : node)}
          accent={accent}
          tooltipSide="bottom"
        />
      </div>
      {childrenList.length > 0 && (
        <div className="pl-4 ml-8 flex flex-col gap-2 relative border-l border-dashed border-white/10">
          {childrenList.map((child) => (
            <MobileTreeNode key={child.name} node={child} activeMember={activeMember} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════ MAIN EXPORT ══════════════════ */
export default function OurPeople({ overrideContent }) {
  const { content: globalContent } = useContent();
  const activeContent = overrideContent || globalContent;
  const peopleList = activeContent?.people || [];

  // Compute structures dynamically
  const founders = [
    peopleList.find(p => p.level === 1 && p.name.toLowerCase().includes('radhe')) || DEFAULT_FOUNDERS[0],
    peopleList.find(p => p.level === 1 && p.name.toLowerCase().includes('prince')) || DEFAULT_FOUNDERS[1]
  ];

  const cLevels = {
    cto: peopleList.find(p => p.level === 2 && (p.role.includes('CTO') || p.dept.includes('TECH'))) || DEFAULT_C_LEVELS.cto,
    cdo: peopleList.find(p => p.level === 2 && (p.role.includes('CDO') || p.dept.includes('DESIGN'))) || DEFAULT_C_LEVELS.cdo,
    caio: peopleList.find(p => p.level === 2 && (p.role.includes('CAIO') || p.dept.includes('AI'))) || DEFAULT_C_LEVELS.caio,
    cmo: peopleList.find(p => p.level === 2 && (p.role.includes('CMO') || p.dept.includes('MARKETING') || p.dept.includes('GROWTH'))) || DEFAULT_C_LEVELS.cmo
  };

  const departments = [
    {
      key: 'dev',
      name: 'Software Development',
      dept: 'DEVELOPMENT',
      parentKey: 'cto',
      lead: peopleList.find(p => p.level === 3 && p.dept === 'DEVELOPMENT') || DEFAULT_DEPARTMENTS[0].lead
    },
    {
      key: 'qa',
      name: 'Product & QA',
      dept: 'PRODUCT & QA',
      parentKey: 'cto',
      lead: peopleList.find(p => p.level === 3 && p.dept === 'PRODUCT & QA') || DEFAULT_DEPARTMENTS[1].lead
    },
    {
      key: 'design',
      name: 'UI/UX & Design',
      dept: 'CREATIVE & DESIGN',
      parentKey: 'cdo',
      lead: peopleList.find(p => p.level === 3 && p.dept === 'CREATIVE & DESIGN') || DEFAULT_DEPARTMENTS[2].lead
    },
    {
      key: 'research',
      name: 'AI Research',
      dept: 'AI RESEARCH',
      parentKey: 'caio',
      lead: peopleList.find(p => p.level === 3 && p.dept === 'AI RESEARCH') || DEFAULT_DEPARTMENTS[3].lead
    },
    {
      key: 'marketing',
      name: 'Marketing & Brand',
      dept: 'MARKETING',
      parentKey: 'cmo',
      lead: peopleList.find(p => p.level === 3 && p.dept === 'MARKETING') || DEFAULT_DEPARTMENTS[4].lead
    }
  ];

  // Deep clone to avoid mutating defaults
  const clonedDeps = JSON.parse(JSON.stringify(departments));

  clonedDeps.forEach(dept => {
    if (dept.lead) {
      const employee = peopleList.find(p => p.level === 4 && p.parent_id === dept.lead.name);
      if (employee) {
        dept.lead.employee = { ...employee };
        const intern = peopleList.find(p => p.level === 5 && p.parent_id === employee.name);
        if (intern) {
          dept.lead.employee.intern = { ...intern };
        }
      } else {
        const defaultDept = DEFAULT_DEPARTMENTS.find(d => d.key === dept.key);
        if (defaultDept && defaultDept.lead.employee) {
          dept.lead.employee = defaultDept.lead.employee;
        }
      }
    }
  });

  // Re-build parentMap dynamically
  const parentMap = {};
  peopleList.forEach(p => {
    const ancestors = [];
    let current = p;
    while (current && current.parent_id) {
      ancestors.push(current.parent_id);
      current = peopleList.find(x => x.name === current.parent_id);
    }
    ancestors.push("HariKrushn DigiVerse LLP");
    parentMap[p.name] = ancestors;
  });

  const mobileTreeData = [
    {
      ...founders[0],
      children: [
        {
          ...cLevels.cto,
          children: [clonedDeps[0].lead, clonedDeps[1].lead]
        }
      ]
    },
    {
      ...founders[1],
      children: [
        { ...cLevels.cdo, children: [clonedDeps[2].lead] },
        { ...cLevels.caio, children: [clonedDeps[3].lead] },
        { ...cLevels.cmo, children: [clonedDeps[4].lead] }
      ]
    }
  ];

  const [activeMember, setActiveMember] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [expandedExecs, setExpandedExecs] = useState({
    CTO: true,
    CDO: true,
    CAIO: true,
    CMO: true
  });

  // Preview / Editor State
  const isPreviewMode = window.location.hash.includes('preview');
  const [viewMode, setViewMode] = useState('tree'); // 'map' or 'tree'
  const [selectedNodeName, setSelectedNodeName] = useState(null);

  const { updatePeople } = useContent(); // context update helper if any, but we sync via parent message

  const handleSelect = useCallback((member) => {
    setActiveMember(member ? member.name : null);
    setSelectedNodeName(member ? member.name : null);
    if (isPreviewMode && window.parent) {
      window.parent.postMessage({ type: 'ORGANIGRAM_NODE_SELECTED', name: member ? member.name : null }, '*');
    }
  }, [isPreviewMode]);

  const handleCanvasChange = (nextPeople) => {
    if (isPreviewMode && window.parent) {
      window.parent.postMessage({ type: 'ORGANIGRAM_UPDATE', people: nextPeople }, '*');
    }
  };

  const toggleExec = (key) => {
    setExpandedExecs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Sync selection from parent
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'UPDATE_CMS_PREVIEW') {
        // If a node was selected in the left panel, highlight it on the canvas
        // Wait, the parent doesn't explicitly send selectedNodeName, but we can track it
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="relative pt-4 pb-16 overflow-hidden">
      {/* ── Cinematic Background Glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Purple glow top-left */}
        <div
          className="absolute rounded-full blur-[150px] opacity-[0.07]"
          style={{ width: 600, height: 600, top: '5%', left: '10%', background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
        />
        {/* Teal glow center-right */}
        <div
          className="absolute rounded-full blur-[150px] opacity-[0.06]"
          style={{ width: 500, height: 500, top: '40%', right: '5%', background: 'radial-gradient(circle, #14b8a6, transparent)' }}
        />
        {/* Amber glow bottom-center */}
        <div
          className="absolute rounded-full blur-[150px] opacity-[0.05]"
          style={{ width: 700, height: 400, bottom: '10%', left: '30%', background: 'radial-gradient(circle, #f59e0b, transparent)' }}
        />
      </div>

      {/* ── Section Header ── */}
      <div className="text-center mb-12 relative z-10 pt-8">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
          // System Hierarchy
        </span>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          Our People
        </h1>
        <p className="font-light text-neutral-400 text-sm max-w-lg mx-auto leading-relaxed mb-8">
          The constellation of minds engineering the future at HariKrushn DigiVerse.
        </p>

      </div>

      {/* ── Interactive Constellation Canvas (Admin Preview Only for Drag & Drop Editing) ── */}
      {isPreviewMode ? (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <OrganigramCanvas
            people={peopleList}
            onChange={handleCanvasChange}
            onSelectNode={(node) => handleSelect(node)}
            selectedNodeName={selectedNodeName}
            isEditMode={true}
          />
        </div>
      ) : (
        /* ── Desktop Constellation Tree (Full Page Width for Public Live Site) ── */
        <div className="hidden lg:block w-full pb-32 pt-12 relative">
          <div
            className="absolute inset-0 rounded-3xl border border-white/[0.03] overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0)',
              backgroundSize: '48px 48px'
            }}
          >
            <StarParticles />
          </div>

          <div className="w-full max-w-full px-6 lg:px-16 xl:px-24 relative z-10">
            <DesktopTree 
              activeMember={activeMember} 
              onSelect={handleSelect} 
              expandedExecs={expandedExecs}
              toggleExec={toggleExec}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
              parentMap={parentMap}
              founders={founders}
              cLevels={cLevels}
              departments={clonedDeps}
              selectedNodeName={selectedNodeName}
            />
          </div>
        </div>
      )}

      {/* ── Mobile/Tablet Accordion Layout ── */}
      {!isPreviewMode && viewMode === 'tree' && (
        <div className="lg:hidden w-full flex justify-center pb-12 px-4 relative z-10">
          <div className="w-full max-w-md flex flex-col gap-6">
            {mobileTreeData.map((rootNode) => (
              <MobileTreeNode key={rootNode.name} node={rootNode} activeMember={activeMember} onSelect={handleSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
