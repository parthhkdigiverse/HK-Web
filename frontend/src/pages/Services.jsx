import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useContent } from '../context/ContentContext';

const iconMap = {
  web: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  app: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  software: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  ai: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  it: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  marketing: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  social: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  )
};

// Sub-component for 3D Perspective Tilt Service Card
function ServiceCard({ service, idx, onHoverStart, onHoverEnd }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 180, damping: 22 });
  const springY = useSpring(y, { stiffness: 180, damping: 22 });
  
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  
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

  // Determine a glowing color representation based on service.color
  const activeColor = service.color ? service.color.replace('from-', '').replace('/40 to-transparent', '') : 'amber-500';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHoverStart(activeColor)}
      onMouseLeave={() => {
        handleMouseLeave();
        onHoverEnd();
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.08 }}
      className={`p-8 sm:p-10 rounded-[32px] bg-gradient-to-b from-white/[0.03] to-white/[0.01] hover:from-white/[0.06] hover:to-white/[0.02] border border-white/[0.05] hover:border-white/15 relative overflow-hidden group transition-all duration-500 flex flex-col justify-between min-h-[340px] text-left shadow-[0_15px_40px_-20px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)] ${service.span || ''}`}
    >
      {/* Absolute Ambient Background Radial Glow */}
      <div className={`absolute -right-20 -top-20 w-48 h-48 rounded-full bg-${activeColor}/10 filter blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
      
      {/* Decorative top border glow using the gradient color */}
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${service.color || 'from-amber-500 to-transparent'} opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      {/* Content wrapper with Z-translation for 3D depth */}
      <div style={{ transform: "translateZ(30px)" }} className="space-y-6">
        
        {/* Header containing Icon & Badge */}
        <div className="flex justify-between items-center">
          <div className={`w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-white/30 group-hover:bg-gradient-to-br group-hover:${service.color || 'from-amber-500 to-transparent'} group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500`}>
            {service.icon}
          </div>
          <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest bg-white/5 border border-white/5 rounded-full px-3 py-1 font-semibold group-hover:border-white/10 group-hover:text-neutral-400 transition-all">
            {service.code}
          </span>
        </div>
 
        {/* Text Details */}
        <div className="space-y-3">
          <h3 className={`font-display text-xl sm:text-2xl font-bold text-white group-hover:text-${activeColor} tracking-tight transition-colors duration-300`}>
            {service.title}
          </h3>
          <p className="font-light text-neutral-400 text-xs sm:text-sm leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
            {service.description}
          </p>
        </div>
 
      </div>
 
      {/* Interactive Options Side-by-side at bottom */}
      <div 
        className="flex items-center justify-between border-t border-white/5 pt-6 mt-8"
        style={{ transform: "translateZ(25px)" }}
      >
        {/* Inquire option (Left) */}
        <a 
          href="#contact" 
          className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors flex items-center gap-2 group/inquire font-semibold"
        >
          <span>Inquire</span>
          <svg className="w-3.5 h-3.5 group-hover/inquire:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </a>
 
        {/* View Details option (Right - Side option to see individual page) */}
        <a 
          href={service.href} 
          className="bg-white/[0.02] hover:bg-white border border-white/10 hover:text-black hover:border-transparent text-white text-[10px] font-mono uppercase tracking-[0.15em] px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md font-semibold"
        >
          Explore Service
        </a>
      </div>
    </motion.div>
  );
}

const DEFAULT_SERVICES = [
  {
    title: 'Web Engineering',
    code: 'HK-WEB',
    description: 'Crafting high-fidelity, cinematic, and fast-loading web applications using custom WebGL rendering, 120 FPS Framer Motion structures, and optimized server side rendering (SSR).',
    href: '#service-web',
    span: 'md:col-span-2', // Double width card for layout asymmetry
    color: 'from-amber-500/40 to-transparent',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: 'App Engineering',
    code: 'HK-APP',
    description: 'Designing and developing native iOS & Android applications with offline support, fluid gestural layers, and real-time syncing architectures.',
    href: '#service-app',
    color: 'from-cyan-500/40 to-transparent',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: 'Custom Software',
    code: 'HK-SYS',
    description: 'Constructing robust enterprise portals, customized backend panels, scalable dashboards, and automated database syncing solutions.',
    href: '#service-custom-software',
    color: 'from-purple-500/40 to-transparent',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    title: 'AI Consulting',
    code: 'HK-AI',
    description: 'Deploying neural automation pipelines, custom training agent workflows, semantic vector configurations, and AI-driven CRM integration patterns.',
    href: '#service-ai-consulting',
    color: 'from-rose-500/40 to-transparent',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  },
  {
    title: 'IT Consulting',
    code: 'HK-NET',
    description: 'Auditing system safety layers, backup routines, load handling systems, API gates, and deploying corporate zero-trust network configurations.',
    href: '#service-it-consulting',
    color: 'from-emerald-500/40 to-transparent',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Digital Marketing',
    code: 'HK-MKT',
    description: 'Optimizing web rankings, setting search console metrics, setting automated newsletter campaigns, and managing strategic search rankings.',
    href: '#service-digital-marketing',
    color: 'from-sky-500/40 to-transparent',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    title: 'Social Media Management',
    code: 'HK-SOC',
    description: 'Designing brand post layouts, content planners, motion micro-visuals, and managing business communication across multi-channel client grids.',
    href: '#service-social-media-management',
    span: 'md:col-span-2', // Double width card to complete the row balance
    color: 'from-pink-500/40 to-transparent',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    )
  }
];

export default function Services() {
  const { content } = useContent();
  const [hoveredColor, setHoveredColor] = React.useState(null);

  const rawServices = content?.services || DEFAULT_SERVICES;

  // Dynamic Grid Auto-balancer
  // Calculates the best asymmetric spans (1 or 2 cols) dynamically
  // based on list ordering to prevent holes in a 3-column grid layout.
  let remainingColumns = 3;
  let makeNextLarge = true; // Toggle to alternate large cards

  const servicesList = rawServices.map((s, idx) => {
    let spanClass = 'col-span-1';

    // If we are starting a brand new row
    if (remainingColumns === 3) {
      // Check if this is NOT the last element in the list (so it doesn't leave an empty space at the end)
      const isLastItem = idx === rawServices.length - 1;
      
      if (makeNextLarge && !isLastItem) {
        spanClass = 'md:col-span-2';
        remainingColumns -= 2;
        makeNextLarge = false; // Alternate the next new row to start with small
      } else {
        spanClass = 'col-span-1';
        remainingColumns -= 1;
        makeNextLarge = true; // Alternate the next new row to start with large
      }
    } else {
      // If a row has already started (remainingColumns is 1 or 2),
      // we fill the remaining slots with 1-column small cards to balance it perfectly.
      spanClass = 'col-span-1';
      remainingColumns -= 1;
    }

    // Reset columns for the next row once this one is full
    if (remainingColumns <= 0) {
      remainingColumns = 3;
    }

    // Safely evaluate icon string mappings or fallbacks
    let finalIcon = s.icon;
    if (typeof s.icon === 'string') {
      finalIcon = iconMap[s.icon] || iconMap['web'];
    } else if (!s.icon) {
      finalIcon = DEFAULT_SERVICES[idx % DEFAULT_SERVICES.length].icon;
    }

    return {
      ...s,
      span: s.span || spanClass,
      icon: finalIcon
    };
  });

  // Helper to map active color to tailwind RGBA / HEX for the background glow
  const getGlowBg = () => {
    if (!hoveredColor) return 'rgba(0, 0, 0, 0)';
    
    // Map Tailwind color names to real CSS values for framer motion animation
    const colorMap = {
      'blue-500': 'rgba(59, 130, 246, 0.05)',
      'indigo-500': 'rgba(99, 102, 241, 0.05)',
      'cyan-500': 'rgba(6, 182, 212, 0.05)',
      'emerald-500': 'rgba(10, 185, 129, 0.05)',
      'teal-500': 'rgba(20, 184, 166, 0.05)',
      'amber-500': 'rgba(245, 158, 11, 0.04)',
      'orange-500': 'rgba(249, 115, 22, 0.04)',
      'rose-500': 'rgba(244, 63, 94, 0.05)',
      'pink-500': 'rgba(236, 72, 153, 0.05)',
      'purple-500': 'rgba(168, 85, 247, 0.05)',
      'sky-500': 'rgba(14, 165, 233, 0.05)'
    };
    
    // Find matching key
    const matchKey = Object.keys(colorMap).find(key => hoveredColor.includes(key));
    return matchKey ? colorMap[matchKey] : 'rgba(255, 255, 255, 0.02)';
  };

  return (
    <div className="relative text-neutral-300 font-sans min-h-screen py-20 overflow-hidden bg-[#050508] transition-colors duration-1000">
      
      {/* Dynamic Ambient Full Page Glow that changes color depending on active hover card */}
      <motion.div 
        animate={{
          backgroundColor: getGlowBg(),
          scale: hoveredColor ? 1.05 : 1
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Trendy Grid background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e2f_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0" />

      {/* Premium Apple-style Ambient mesh blur glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full filter blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full filter blur-[140px] pointer-events-none z-0" />
      
      {/* Additional responsive glowing orb that follows active hover color */}
      {hoveredColor && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-[30%] left-[25%] w-[45vw] h-[45vw] bg-white rounded-full filter blur-[160px] pointer-events-none z-0"
          style={{
            backgroundColor: hoveredColor.includes('blue') ? '#3b82f6' :
                             hoveredColor.includes('cyan') ? '#06b6d4' :
                             hoveredColor.includes('emerald') ? '#10b981' :
                             hoveredColor.includes('purple') ? '#a855f7' :
                             hoveredColor.includes('pink') ? '#ec4899' :
                             hoveredColor.includes('rose') ? '#f43f5e' :
                             hoveredColor.includes('amber') ? '#f59e0b' : '#ffffff'
          }}
        />
      )}

      {/* Header section */}
      <div className="text-center mb-24 relative z-10 pt-4">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.45em] bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold block mb-4">
          // Capabilities & Architecture
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          Our Services
        </h1>
        <p className="font-light text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed px-6">
          We design and engineer bespoke software platforms, high-concurrency database models, and immersive frontends for high-growth enterprises.
        </p>
      </div>

      {/* Services Grid (Asymmetric layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] w-full mx-auto px-6 relative z-10">
        {servicesList.map((service, index) => (
          <ServiceCard 
            key={service.title} 
            service={service} 
            idx={index} 
            onHoverStart={(color) => setHoveredColor(color)}
            onHoverEnd={() => setHoveredColor(null)}
          />
        ))}
      </div>

    </div>
  );
}
