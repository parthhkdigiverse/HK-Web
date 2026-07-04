import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Sub-component for 3D Perspective Tilt Service Card
function ServiceCard({ service, idx }) {
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.05 }}
      className={`p-8 rounded-3xl bg-[#09090d]/80 border border-white/5 relative overflow-hidden group transition-colors flex flex-col justify-between min-h-[300px] text-left shadow-2xl ${service.span || ''}`}
    >
      {/* Decorative top border glow */}
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      
      {/* Content wrapper with Z-translation for 3D depth */}
      <div style={{ transform: "translateZ(25px)" }} className="space-y-6">
        
        {/* Header containing Icon & Badge */}
        <div className="flex justify-between items-center">
          <div className={`w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-white/30 transition-all duration-300`}>
            {service.icon}
          </div>
          <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
            {service.code}
          </span>
        </div>

        {/* Text Details */}
        <div className="space-y-2.5">
          <h3 className="font-display text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
            {service.title}
          </h3>
          <p className="font-light text-neutral-400 text-xs sm:text-sm leading-relaxed">
            {service.description}
          </p>
        </div>

      </div>

      {/* Interactive Options Side-by-side at bottom */}
      <div 
        className="flex items-center justify-between border-t border-white/5 pt-6 mt-6"
        style={{ transform: "translateZ(20px)" }}
      >
        {/* Inquire option (Left) */}
        <a 
          href="#contact" 
          className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 hover:text-white transition-colors flex items-center gap-1.5 group/inquire"
        >
          <span>Inquire</span>
          <svg className="w-3 h-3 group-hover/inquire:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </a>

        {/* View Details option (Right - Side option to see individual page) */}
        <a 
          href={service.href} 
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-mono uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-md group-hover:border-white/20"
        >
          Explore Service
        </a>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const servicesList = [
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

  return (
    <div className="relative text-neutral-300 font-sans min-h-screen">
      
      {/* Ambient background glows */}
      <div className="absolute top-[15%] left-1/3 w-96 h-96 bg-white/5 rounded-full filter blur-[120px] pointer-events-none" />
      
      {/* Header section */}
      <div className="text-center mb-20 relative z-10 pt-8">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
          // Capabilities
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          Our Services
        </h1>
        <p className="font-light text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          We design and engineer bespoke software platforms, high-concurrency database models, and immersive frontends for high-growth enterprises.
        </p>
      </div>

      {/* Services Grid (Asymmetric layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1600px] w-full mx-auto px-4 relative z-10">
        {servicesList.map((service, index) => (
          <ServiceCard 
            key={service.title} 
            service={service} 
            idx={index} 
          />
        ))}
      </div>

    </div>
  );
}
