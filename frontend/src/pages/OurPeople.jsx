import React, { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import OrganigramCanvas from '../components/OrganigramCanvas';

const OurPeopleContext = createContext({});

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

/* ── Module-level position store (persists across re-renders) ── */
const CARD_OFFSETS = {};

/* ───────────────────── VERTICAL PERSON CARD COMPONENT ───────────────────── */
function PersonCard({ node, isActive, isDimmed, onHover, onClick, accent, hoveredNode, tooltipSide = 'right', isSelected, isPreviewMode, onReParent, onDelete, onAddSubordinate, connectMode, onConnectClick }) {
  if (!node) return null;
  const isCLevel = node.level === 2;

  const cardId = `node-${node.name.replace(/\s+/g, '-').toLowerCase()}`;
  const [offset, setOffset] = useState(CARD_OFFSETS[node.name] || { x: 0, y: 0 });
  
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
      onMouseDown={(e) => {
        if (!isPreviewMode || node.name === 'HariKrushn DigiVerse LLP' || e.button !== 0) return;

        const cardEl = e.currentTarget;
        const startX = e.clientX;
        const startY = e.clientY;
        const currentOffset = CARD_OFFSETS[node.name] || { x: 0, y: 0 };
        let hasMoved = false;

        const onMove = (me) => {
          const dx = me.clientX - startX;
          const dy = me.clientY - startY;

          if (!hasMoved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
            hasMoved = true;
            cardEl.style.zIndex = '9999';
            cardEl.style.transition = 'none';
            cardEl.style.boxShadow = '0 20px 60px rgba(244,63,94,0.5)';
            cardEl.style.borderColor = '#f43f5e';
            cardEl.style.cursor = 'grabbing';

            // Highlight potential drop targets
            document.querySelectorAll('[id^="node-"]').forEach(el => {
              const targetName = el.querySelector('h4')?.textContent?.trim();
              if (targetName && targetName !== node.name) {
                const list = context.peopleList || [];
                const isDesc = (parent, child) => {
                  if (!parent || !child) return false;
                  if (parent === child) return true;
                  const pNode = list.find(p => p.name === parent);
                  if (pNode && pNode.parent_id) {
                    return isDesc(pNode.parent_id, child);
                  }
                  return false;
                };
                if (!isDesc(targetName, node.name)) {
                  el.style.border = '2px dashed #06b6d4';
                  el.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.4)';
                  el.style.transform = 'scale(1.02)';
                }
              }
            });
          }

          if (hasMoved) {
            cardEl.style.position = 'relative';
            cardEl.style.left = (currentOffset.x + dx) + 'px';
            cardEl.style.top = (currentOffset.y + dy) + 'px';
            // Dispatch event so SVG lines update in real-time
            window.dispatchEvent(new CustomEvent('card-moved'));
          }
        };

        const onUp = (ue) => {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);

          // Reset visual drag styles
          cardEl.style.zIndex = '';
          cardEl.style.transition = '';
          cardEl.style.boxShadow = '';
          cardEl.style.borderColor = '';
          cardEl.style.cursor = '';

          // Reset other targets' visual styles
          document.querySelectorAll('[id^="node-"]').forEach(el => {
            el.style.border = '';
            el.style.boxShadow = '';
            el.style.transform = '';
          });

          if (hasMoved) {
            const dx = ue.clientX - startX;
            const dy = ue.clientY - startY;

            // Check if dropped on another card → re-parent
            cardEl.style.pointerEvents = 'none';
            const els = document.elementsFromPoint(ue.clientX, ue.clientY);
            cardEl.style.pointerEvents = '';
            const target = els.find(el => el.id && el.id.startsWith('node-') && el.id !== cardEl.id);

            if (target) {
              const h4 = target.querySelector('h4');
              if (h4 && onReParent) {
                // Reset offset and position on re-parent
                CARD_OFFSETS[node.name] = { x: 0, y: 0 };
                setOffset({ x: 0, y: 0 });
                cardEl.style.left = '';
                cardEl.style.top = '';
                cardEl.style.position = '';
                onReParent(node.name, h4.textContent.trim());
                setTimeout(() => window.dispatchEvent(new CustomEvent('card-moved')), 100);
                return;
              }
            }

            // No re-parent → card stays at dropped position
            const newOffset = { x: currentOffset.x + dx, y: currentOffset.y + dy };
            CARD_OFFSETS[node.name] = newOffset;
            setOffset(newOffset);
            window.dispatchEvent(new CustomEvent('card-moved'));
          }
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      }}
      className={`w-44 p-4 rounded-2xl bg-[#09090e]/75 backdrop-blur-xl border transition-all duration-400 flex flex-col items-center text-center relative group ${
        isDimmed 
          ? `opacity-20 scale-[0.96] blur-[0.5px] ${isPreviewMode ? '' : 'pointer-events-none'}` 
          : 'opacity-100 hover:scale-[1.04]'
      }`}
      style={{
        borderColor: isSelected ? '#f43f5e' : isActive ? accent.glowColor : 'rgba(255,255,255,0.06)',
        boxShadow: isSelected
          ? `0 0 25px rgba(244,63,94,0.4), 0 10px 30px rgba(0, 0, 0, 0.6)`
          : isActive 
          ? `0 0 25px ${accent.glowColor}40, 0 10px 30px rgba(0, 0, 0, 0.6)` 
          : '0 8px 20px rgba(0, 0, 0, 0.4)',
        zIndex: (isActive || showTooltip || isSelected) ? 150 : 10,
        cursor: isPreviewMode ? 'grab' : 'pointer',
        ...(isPreviewMode && (offset.x || offset.y) ? {
          position: 'relative',
          left: offset.x + 'px',
          top: offset.y + 'px',
        } : {})
      }}
    >
      {/* Delete button in preview mode */}
      {isPreviewMode && node.name !== 'HariKrushn DigiVerse LLP' && onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(node.name); }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/90 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-400 hover:scale-110 z-[300] shadow-lg"
          title="Delete member"
        >
          ✕
        </button>
      )}

      {/* Add subordinate button in preview mode */}
      {isPreviewMode && onAddSubordinate && (
        <button
          onClick={(e) => { e.stopPropagation(); onAddSubordinate(node.name); }}
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-emerald-400 hover:scale-110 z-[300] shadow-lg font-bold"
          title="Add subordinate member"
        >
          ＋
        </button>
      )}

      {/* Connect mode indicator */}
      {connectMode && (
        <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-cyan-400 animate-pulse z-[300]" />
      )}

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
function DesktopTree({ 
  activeMember, 
  onSelect, 
  hoveredNode, 
  setHoveredNode, 
  parentMap, 
  selectedNodeName, 
  isPreviewMode, 
  onReParent, 
  onDelete, 
  connectMode, 
  onConnectClick, 
  unassignedPeople, 
  peopleList 
}) {
  const treeContainerRef = useRef(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 1. Root organization node configuration
  const rootNode = {
    name: 'HariKrushn DigiVerse LLP',
    role: 'Parent Organization',
    bio: 'HariKrushn DigiVerse LLP is a premium digital craftsmanship studio and technology consultancy specializing in high-end web applications, AI automation agents, and custom enterprise systems.',
    level: 1,
    dept: 'ENTERPRISE',
    image: '/images/hk-logo.png'
  };

  // 2. Separate hierarchy tree members from floating members
  const treeNodes = [rootNode];
  const floatingNodes = [];

  peopleList.forEach(p => {
    // Member belongs to the tree if parent exists in the list or is level 1
    const parentExists = p.parent_id && (p.parent_id === rootNode.name || peopleList.some(x => x.name === p.parent_id));
    if (p.level === 1 || parentExists) {
      const parentId = p.parent_id || (p.level === 1 ? rootNode.name : null);
      treeNodes.push({ ...p, parent_id: parentId });
    } else {
      floatingNodes.push(p);
    }
  });

  // 3. Dynamic Auto-Layout Engine Calculations
  const Y_SPACING = 200;
  const X_SPACING = 210;

  const runAutoLayout = (nodes, rootId = 'HariKrushn DigiVerse LLP') => {
    const childrenMap = {};
    nodes.forEach(n => {
      const parentId = n.name === rootId ? null : (n.parent_id || rootId);
      if (parentId) {
        if (!childrenMap[parentId]) childrenMap[parentId] = [];
        childrenMap[parentId].push(n);
      }
    });

    const positions = {};
    const nextXAtLevel = {};

    const layoutSubtree = (nodeId, level = 1) => {
      const node = nodes.find(n => n.name === nodeId);
      if (!node) return;

      const children = childrenMap[nodeId] || [];

      if (children.length === 0) {
        const currentNextX = nextXAtLevel[level] || 40;
        positions[nodeId] = { x: currentNextX, y: level * Y_SPACING - 150 };
        for (let l = level; l <= 6; l++) {
          nextXAtLevel[l] = Math.max(nextXAtLevel[l] || 40, currentNextX + X_SPACING);
        }
      } else {
        children.forEach(child => {
          layoutSubtree(child.name, level + 1);
        });

        const firstChildX = positions[children[0].name].x;
        const lastChildX = positions[children[children.length - 1].name].x;
        let x = (firstChildX + lastChildX) / 2;

        const currentNextX = nextXAtLevel[level] || 40;
        if (x < currentNextX) {
          const shift = currentNextX - x;
          const shiftChildren = (cId) => {
            if (positions[cId]) positions[cId].x += shift;
            const cc = childrenMap[cId] || [];
            cc.forEach(child => shiftChildren(child.name));
          };
          children.forEach(child => shiftChildren(child.name));
          x = currentNextX;
          for (let l = level + 1; l <= 6; l++) {
            nextXAtLevel[l] = (nextXAtLevel[l] || 40) + shift;
          }
        }

        positions[nodeId] = { x, y: level * Y_SPACING - 150 };
        nextXAtLevel[level] = x + X_SPACING;
      }
    };

    layoutSubtree(rootId, 1);
    return positions;
  };

  const positions = runAutoLayout(treeNodes);

  // 4. Determine container viewport size dynamically
  let maxX = 1200;
  let maxY = 800;
  Object.entries(positions).forEach(([name, pos]) => {
    if (pos.x > maxX) maxX = pos.x;
    if (pos.y > maxY) maxY = pos.y;
  });

  const canvasWidth = maxX + 260;
  const canvasHeight = maxY + 350;

  // 5. Track mouse coordinates during live connections/dragging
  const handleMouseMove = (e) => {
    if (!treeContainerRef.current) return;
    const rect = treeContainerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Node dimension constants
  const CARD_WIDTH = 176;
  const CARD_HEIGHT = 100;

  const isNodeDimmed = (name) => {
    if (!hoveredNode) return false;
    if (name === hoveredNode) return false;
    if (parentMap[hoveredNode]?.includes(name)) return false;
    if (parentMap[name]?.includes(hoveredNode)) return false;
    return true;
  };

  const isInActivePath = (nodeName) => {
    if (!hoveredNode) return true;
    if (nodeName === hoveredNode) return true;
    if (parentMap[hoveredNode]?.includes(nodeName)) return true;
    if (parentMap[nodeName]?.includes(hoveredNode)) return true;
    return false;
  };

  return (
    <div 
      ref={treeContainerRef} 
      onMouseMove={handleMouseMove}
      className="relative mx-auto overflow-visible select-none"
      style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
    >
      {/* SVG Canvas for dynamic connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
        {treeNodes.map((node) => {
          if (!node.parent_id) return null;
          const parentPos = positions[node.parent_id];
          const childPos = positions[node.name];
          if (!parentPos || !childPos) return null;

          const fromPoint = { x: parentPos.x + CARD_WIDTH / 2, y: parentPos.y + CARD_HEIGHT };
          const toPoint = { x: childPos.x + CARD_WIDTH / 2, y: childPos.y };

          const fromActive = isInActivePath(node.parent_id);
          const toActive = isInActivePath(node.name);
          const isActive = hoveredNode ? (fromActive && toActive) : true;

          const strokeOpacity = hoveredNode ? (isActive ? 0.95 : 0.06) : 0.22;
          const strokeWidth = hoveredNode ? (isActive ? 2.5 : 1) : 1.25;

          let color = "rgba(255, 255, 255, 0.2)";
          if (node.level === 2) color = "#fbbf24";
          else if (node.level === 3) color = "#8b5cf6";
          else if (node.level === 4) color = "#10b981";
          else if (node.level === 5) color = "#38bdf8";

          const dy = toPoint.y - fromPoint.y;
          const controlY1 = fromPoint.y + dy * 0.45;
          const controlY2 = fromPoint.y + dy * 0.55;
          const pathD = `M ${fromPoint.x} ${fromPoint.y} C ${fromPoint.x} ${controlY1}, ${toPoint.x} ${controlY2}, ${toPoint.x} ${toPoint.y}`;

          return (
            <g key={node.name}>
              {isActive && hoveredNode && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={color}
                  strokeWidth={5}
                  strokeOpacity={0.35}
                  className="blur-[3px] transition-all duration-300"
                />
              )}
              <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                className="transition-all duration-300"
              />
              {node.level <= 3 && isActive && (
                <circle r="3" fill="#ffffff" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
                  <animateMotion dur="4s" repeatCount="indefinite" path={pathD} />
                </circle>
              )}
            </g>
          );
        })}

        {/* Live animated connection line preview */}
        {connectMode && selectedNodeName && (
          <path
            d={`M ${positions[selectedNodeName]?.x + CARD_WIDTH / 2} ${positions[selectedNodeName]?.y + CARD_HEIGHT} L ${mousePos.x} ${mousePos.y}`}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
        )}
      </svg>

      {/* Nodes Placement */}
      {treeNodes.map((node) => {
        const pos = positions[node.name] || { x: 0, y: 0 };
        const accent = levelAccents[node.level] || levelAccents[3];

        return (
          <div
            key={node.name}
            id={`node-${node.name.replace(/\s+/g, '-').toLowerCase()}`}
            className="absolute transition-all duration-300"
            style={{ 
              left: `${pos.x}px`, 
              top: `${pos.y}px`,
              zIndex: 10
            }}
          >
            <PersonCard 
              node={node}
              isActive={hoveredNode === node.name}
              isDimmed={isNodeDimmed(node.name)}
              onHover={setHoveredNode}
              onClick={() => onSelect(activeMember === node.name ? null : node)}
              accent={accent}
              isSelected={selectedNodeName === node.name}
              isPreviewMode={isPreviewMode}
              onReParent={onReParent}
              onDelete={onDelete}
              connectMode={connectMode}
            />
          </div>
        );
      })}

      {/* Floating / Unassigned Row Placement */}
      {floatingNodes.length > 0 && (
        <div 
          className="absolute border-t border-dashed border-white/10 pt-12 flex flex-col items-center"
          style={{ 
            left: '40px', 
            top: `${maxY + 220}px`,
            width: `${canvasWidth - 80}px`
          }}
        >
          <h5 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-6">
            {isPreviewMode ? '// UNASSIGNED / FLOATING MEMBERS' : '// ASSOCIATE TEAM MEMBERS'}
          </h5>
          <div className="flex flex-wrap gap-8 justify-center w-full px-4">
            {floatingNodes.map((person) => (
              <PersonCard
                key={person.name}
                node={person}
                isActive={hoveredNode === person.name}
                isDimmed={isNodeDimmed(person.name)}
                onHover={setHoveredNode}
                onClick={() => onSelect(activeMember === person.name ? null : person)}
                accent={{ glowColor: '#10b981' }}
                tooltipSide="top"
                isSelected={selectedNodeName === person.name}
                isPreviewMode={isPreviewMode}
                onReParent={onReParent}
                onDelete={onDelete}
                connectMode={connectMode}
              />
            ))}
          </div>
        </div>
      )}
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
  const level1People = peopleList.filter(p => p.level === 1);
  const founders = [
    level1People[0] || DEFAULT_FOUNDERS[0],
    level1People[1] || DEFAULT_FOUNDERS[1]
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
    const visited = new Set();
    let current = p;
    while (current && current.parent_id && !visited.has(current.name)) {
      visited.add(current.name);
      ancestors.push(current.parent_id);
      current = peopleList.find(x => x.name === current.parent_id);
    }
    ancestors.push("HariKrushn DigiVerse LLP");
    parentMap[p.name] = ancestors;
  });

  const assignedNames = new Set([
    "HariKrushn DigiVerse LLP",
    ...founders.map(f => f?.name),
    ...Object.values(cLevels).map(c => c?.name),
    ...clonedDeps.flatMap(d => [
      d.lead?.name,
      d.lead?.employee?.name,
      d.lead?.employee?.intern?.name
    ])
  ].filter(Boolean));

  const unassignedPeople = peopleList.filter(p => !assignedNames.has(p.name));

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

  // ── Connect Mode State ──
  const [connectMode, setConnectMode] = useState(false);
  const [connectSource, setConnectSource] = useState(null);

  const handleCanvasChange = (nextPeople) => {
    if (isPreviewMode && window.parent) {
      window.parent.postMessage({ type: 'ORGANIGRAM_UPDATE', people: nextPeople }, '*');
    }
  };

  // ── Add New Member ──
  const handleAddMember = useCallback((parentName = null) => {
    const newId = crypto.randomUUID().split('-')[0];
    const parentNode = parentName ? peopleList.find(p => p.name === parentName) : null;
    const newMember = {
      name: `Employee-${newId}`,
      role: 'Team Member',
      dept: parentNode ? (parentNode.dept || 'GENERAL') : 'GENERAL',
      level: parentNode ? Math.min(5, (parentNode.level || 1) + 1) : 3,
      parent_id: parentName === 'HariKrushn DigiVerse LLP' ? null : parentName,
      bio: 'New team member waiting to be assigned to a manager.',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      skills: [],
      social: {}
    };
    const updatedPeople = [...peopleList, newMember];
    handleCanvasChange(updatedPeople);
  }, [peopleList]);

  // ── Delete Member ──
  const handleDeleteMember = useCallback((memberName) => {
    if (memberName === 'HariKrushn DigiVerse LLP') return;
    if (!confirm(`Delete "${memberName}" and disconnect all links?`)) return;

    // Remove the member and re-parent their children to the deleted member's parent
    const member = peopleList.find(p => p.name === memberName);
    const memberParent = member?.parent_id || null;

    const updatedPeople = peopleList
      .filter(p => p.name !== memberName)
      .map(p => {
        if (p.parent_id === memberName) {
          return { ...p, parent_id: memberParent };
        }
        return p;
      });

    handleCanvasChange(updatedPeople);
    setTimeout(() => window.dispatchEvent(new CustomEvent('card-moved')), 150);
  }, [peopleList]);

  // Core re-parent function with strict validation
  const handleReParentFn = useCallback((childName, parentName) => {
    if (childName === parentName) {
      alert("કર્મચારી પોતાનો જ પેરન્ટ ન બની શકે! (Self-parenting is not allowed)");
      return;
    }

    const isDescendant = (parent, child) => {
      if (!parent || !child) return false;
      if (parent === child) return true;
      const parentNode = peopleList.find(p => p.name === parent);
      if (parentNode && parentNode.parent_id) {
        return isDescendant(parentNode.parent_id, child);
      }
      return false;
    };

    if (isDescendant(parentName, childName)) {
      alert("સાયક્લિક સંબંધ સ્વીકાર્ય નથી! (Cyclic relationships are not allowed)");
      return;
    }

    // Check parent exists
    const parentNode = parentName === 'HariKrushn DigiVerse LLP' 
      ? { name: 'HariKrushn DigiVerse LLP', level: 1, dept: 'ENTERPRISE' }
      : peopleList.find(x => x.name === parentName);
      
    if (!parentNode) {
      alert("પસંદ કરેલ મેનેજર અસ્તિત્વમાં નથી! (Manager does not exist)");
      return;
    }

    const childNode = peopleList.find(x => x.name === childName);
    if (!childNode) return;

    let targetDept = childNode.dept;
    if (parentNode.dept && parentNode.dept !== 'ENTERPRISE' && parentNode.dept !== childNode.dept) {
      const confirmTransfer = confirm(`શું તમે ${childNode.name} ને નવા ડિપાર્ટમેન્ટ (${parentNode.dept}) માં ટ્રાન્સફર કરવા માંગો છો?`);
      if (confirmTransfer) {
        targetDept = parentNode.dept;
      }
    }

    const updatedPeople = peopleList.map(p => {
      if (p.name === childName) {
        const parentId = parentName === 'HariKrushn DigiVerse LLP' ? null : parentName;
        const newLevel = Math.min(5, (parentNode.level || 1) + 1);
        return { ...p, parent_id: parentId, level: newLevel, dept: targetDept };
      }
      return p;
    });

    handleCanvasChange(updatedPeople);
  }, [peopleList]);

  // ── Connect Click Handler (Workflow: Select Parent -> Select Child) ──
  const handleConnectClick = useCallback((nodeName) => {
    if (!connectMode) return;
    if (!connectSource) {
      // First click: select the Parent Node
      setConnectSource(nodeName);
    } else {
      // Second click: select the Child Node
      const parentName = connectSource;
      const childName = nodeName;
      if (parentName !== childName) {
        const confirmMsg = `શું તમે ${childName} ને મેનેજર ${parentName} ના હાથ નીચે કનેક્ટ કરવા માંગો છો?`;
        if (confirm(confirmMsg)) {
          handleReParentFn(childName, parentName);
        }
      }
      setConnectSource(null);
      setConnectMode(false);
    }
  }, [connectMode, connectSource, handleReParentFn]);

  const handleReParent = useCallback((childName, parentName) => {
    handleReParentFn(childName, parentName);
  }, [handleReParentFn]);

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
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Keyboard Shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPreviewMode) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (window.parent) window.parent.postMessage({ type: 'ORGANIGRAM_UNDO' }, '*');
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        if (window.parent) window.parent.postMessage({ type: 'ORGANIGRAM_REDO' }, '*');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode]);

  return (
    <OurPeopleContext.Provider value={{ 
      isPreviewMode, 
      onDelete: handleDeleteMember, 
      onAddSubordinate: handleAddMember, 
      onReParent: handleReParent, 
      connectMode, 
      onConnectClick: handleConnectClick, 
      selectedNodeName, 
      activeMember, 
      onSelect: handleSelect,
      peopleList
    }}>
      <div className={`relative pt-4 pb-16 ${isPreviewMode ? 'overflow-x-auto overflow-y-hidden' : 'overflow-hidden'}`}>
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

          {connectMode && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 backdrop-blur-xl text-center space-y-2 mb-6"
            >
              <div className="flex justify-center items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-[10px] text-cyan-300 uppercase tracking-widest font-bold">// Link Connection Guide</span>
              </div>
              <p className="text-xs text-neutral-200">
                {!connectSource 
                  ? "૧. કનેક્ટ કરવા માટે સોર્સ કાર્ડ પર ક્લિક કરો (જેને કનેક્ટ કરવો છે)." 
                  : `૨. "${connectSource}" માટે પેરન્ટ/મેનેજરનું કાર્ડ પસંદ કરો.`}
              </p>
            </motion.div>
          )}

        </div>

        {/* ── Desktop Constellation Tree (Full Page Width) ── */}
        <div className={`${isPreviewMode ? 'block' : 'hidden lg:block'} w-full pb-32 pt-12 relative`}>
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
              onSelect={(member) => {
                if (connectMode) {
                  handleConnectClick(member?.name);
                  return;
                }
                handleSelect(member);
              }} 
              expandedExecs={expandedExecs}
              toggleExec={toggleExec}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
              parentMap={parentMap}
              founders={founders}
              cLevels={cLevels}
              departments={clonedDeps}
              selectedNodeName={connectSource || selectedNodeName}
              isPreviewMode={isPreviewMode}
              onReParent={handleReParent}
              onDelete={handleDeleteMember}
              connectMode={connectMode}
              onConnectClick={handleConnectClick}
              unassignedPeople={unassignedPeople}
            />
          </div>
        </div>

        {/* ── Preview Mode Floating Toolbar ── */}
        {isPreviewMode && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0e0e14]/95 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Add New Member */}
            <button
              onClick={() => handleAddMember(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all text-sm font-medium"
            >
              <span className="text-lg">+</span> Add Member
            </button>

            {/* Connect Mode Toggle */}
            <button
              onClick={() => { setConnectMode(!connectMode); setConnectSource(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${
                connectMode
                  ? 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20'
              }`}
            >
              <span className="text-lg">⟶</span> {connectMode ? (connectSource ? `Click target for "${connectSource.split(' ').slice(0,2).join(' ')}"` : 'Click source card...') : 'Connect Cards'}
            </button>

            {/* Cancel Connect */}
            {connectMode && (
              <button
                onClick={() => { setConnectMode(false); setConnectSource(null); }}
                className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {/* ── Mobile/Tablet Accordion Layout (hidden in preview mode) ── */}
        {!isPreviewMode && (
          <div className="lg:hidden w-full flex justify-center pb-12 px-4 relative z-10">
            <div className="w-full max-w-md flex flex-col gap-6">
              {mobileTreeData.map((rootNode) => (
                <MobileTreeNode key={rootNode.name} node={rootNode} activeMember={activeMember} onSelect={handleSelect} />
              ))}
            </div>
          </div>
        )}
      </div>
    </OurPeopleContext.Provider>
  );
}
