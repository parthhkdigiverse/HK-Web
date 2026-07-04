import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ────────────────────────── INDUSTRIES DATA ────────────────────────── */
const industries = [
  {
    id: 'fintech',
    title: 'Fintech & Banking',
    description: 'Securing transaction ledgers, analytics engines, and automated KYC pipelines.',
    detailDescription: 'We build high-concurrency ledger databases, encrypted trading platforms, and automated compliance routing networks capable of processing millions of transactions securely. We implement zero-latency transaction locking and strict audit logs.',
    listImg: '/images/industries/fintech.png',
    detailImg: '/images/industries/fintech.png',
    bg: 'from-emerald-500/10 to-teal-500/10',
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/20',
    glowClass: 'rgba(16,185,129,0.06)',
    accentColor: '#10b981'
  },
  {
    id: 'realestate',
    title: 'Real Estate & Properties',
    description: 'Virtual walkthrough platforms, interactive mapping, and organizer systems.',
    detailDescription: 'We craft immersive digital walkthrough experiences, responsive vector-based property maps, and centralized CRM dashboards to streamline buyer-agent interactions and automate lead pipelines.',
    listImg: '/images/industries/realestate.png',
    detailImg: '/images/industries/realestate.png',
    bg: 'from-blue-500/10 to-indigo-500/10',
    colorClass: 'text-blue-400',
    borderClass: 'border-blue-500/20',
    glowClass: 'rgba(59,130,246,0.06)',
    accentColor: '#3b82f6'
  },
  {
    id: 'ecommerce',
    title: 'Luxury E-Commerce',
    description: 'Immersive branding layouts, high-performance checkouts, and custom payment systems.',
    detailDescription: 'We develop ultra-premium headless shopping environments featuring 3D product previews, optimized image pipelines, and customized multi-currency Stripe checkouts that eliminate cart drop-offs.',
    listImg: '/images/industries/ecommerce.png',
    detailImg: '/images/industries/ecommerce.png',
    bg: 'from-amber-500/10 to-orange-500/10',
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/20',
    glowClass: 'rgba(245,158,11,0.06)',
    accentColor: '#f59e0b'
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Biotech',
    description: 'Doctor-patient portals, digital records grids, and encrypted backups.',
    detailDescription: 'We construct secure clinical dashboards, HIPAA-compliant patient communication networks, and end-to-end encrypted backup systems to protect patient data pipelines.',
    listImg: '/images/industries/healthcare.png',
    detailImg: '/images/industries/healthcare.png',
    bg: 'from-sky-500/10 to-cyan-500/10',
    colorClass: 'text-sky-400',
    borderClass: 'border-sky-500/20',
    glowClass: 'rgba(14,165,233,0.06)',
    accentColor: '#0ea5e9'
  },
  {
    id: 'aisaas',
    title: 'AI SaaS Platforms',
    description: 'SaaS landing structures, multi-tenant databases, and custom agent integrations.',
    detailDescription: 'We engineer multi-tenant workspaces, custom semantic search caching networks, and automated prompt monitoring pipelines designed to reduce token cost overheads and scale agent runtimes.',
    listImg: '/images/industries/aisaas.png',
    detailImg: '/images/industries/aisaas.png',
    bg: 'from-purple-500/10 to-indigo-500/10',
    colorClass: 'text-purple-400',
    borderClass: 'border-purple-500/20',
    glowClass: 'rgba(168,85,247,0.06)',
    accentColor: '#a855f7'
  },
  {
    id: 'education',
    title: 'Education & EdTech',
    description: 'Learning management systems, live classroom portals, and student analytics dashboards.',
    detailDescription: 'We build scalable LMS platforms with real-time video streaming, adaptive quiz engines, progress tracking dashboards, and automated certificate generation pipelines for universities and coaching institutes.',
    listImg: '/images/industries/education.png',
    detailImg: '/images/industries/education.png',
    bg: 'from-rose-500/10 to-pink-500/10',
    colorClass: 'text-rose-400',
    borderClass: 'border-rose-500/20',
    glowClass: 'rgba(244,63,94,0.06)',
    accentColor: '#f43f5e'
  },
  {
    id: 'logistics',
    title: 'Logistics & Supply Chain',
    description: 'Fleet tracking systems, warehouse automation, and shipment routing optimizers.',
    detailDescription: 'We develop GPS-integrated fleet monitoring dashboards, automated warehouse inventory scanners, and intelligent route optimization engines that cut delivery times and fuel costs across distribution networks.',
    listImg: '/images/industries/logistics.png',
    detailImg: '/images/industries/logistics.png',
    bg: 'from-orange-500/10 to-red-500/10',
    colorClass: 'text-orange-400',
    borderClass: 'border-orange-500/20',
    glowClass: 'rgba(249,115,22,0.06)',
    accentColor: '#f97316'
  },
  {
    id: 'hospitality',
    title: 'Hospitality & Travel',
    description: 'Hotel booking engines, guest experience apps, and revenue management tools.',
    detailDescription: 'We craft elegant reservation platforms, guest concierge mobile applications, dynamic pricing engines, and review aggregation dashboards that help hospitality brands deliver five-star digital experiences.',
    listImg: '/images/industries/hospitality.png',
    detailImg: '/images/industries/hospitality.png',
    bg: 'from-teal-500/10 to-emerald-500/10',
    colorClass: 'text-teal-400',
    borderClass: 'border-teal-500/20',
    glowClass: 'rgba(20,184,166,0.06)',
    accentColor: '#14b8a6'
  }
];

/* ────────────────────────── INDUSTRY METRICS ────────────────────────── */
const industryMetrics = {
  fintech: [
    { label: 'Volume Secured', value: '$50M+' },
    { label: 'KYC Compliance Rate', value: '100%' }
  ],
  realestate: [
    { label: '3D Renderings Served', value: '2,500+' },
    { label: 'Agent Efficiency Boost', value: '85%' }
  ],
  ecommerce: [
    { label: 'Checkout Load Time', value: '0.8s' },
    { label: 'Cart Conversion Lift', value: '32%' }
  ],
  healthcare: [
    { label: 'HIPAA Encrypted Records', value: '5M+' },
    { label: 'Portal Booking Uptime', value: '100%' }
  ],
  aisaas: [
    { label: 'Inference Tokens Tracked', value: '2B+' },
    { label: 'Multi-Tenant Scale', value: 'Unlimited' }
  ],
  education: [
    { label: 'Students Onboarded', value: '50K+' },
    { label: 'Course Completion Rate', value: '94%' }
  ],
  logistics: [
    { label: 'Shipments Tracked', value: '1.2M+' },
    { label: 'Delivery Time Reduction', value: '38%' }
  ],
  hospitality: [
    { label: 'Bookings Processed', value: '200K+' },
    { label: 'Guest Satisfaction Score', value: '4.9/5' }
  ]
};

/* ────────────────────────── PROJECTS DATA ────────────────────────── */
const projects = [
  {
    title: 'Solis Trading Portal',
    industryId: 'fintech',
    description: 'A responsive fintech dashboard delivering rapid metric updates, instant payment gates, and multi-tenant scaling.',
    tech: ['React', 'Stripe API', 'AWS'],
    client: 'Solis Ltd'
  },
  {
    title: 'Apex Ledger Engine',
    industryId: 'fintech',
    description: 'High-throughput transaction processing ledger built for institutional digital banking, handling 10k transactions/sec securely.',
    tech: ['FastAPI', 'Redis', 'Docker'],
    client: 'Apex Capital'
  },
  {
    title: 'Vesper Luxury Homes',
    industryId: 'realestate',
    description: 'An immersive cinematic web experience built for high-end properties in London. Features high-frame-rate scroll scrub.',
    tech: ['Canvas API', 'GSAP', 'Vite'],
    client: 'Vesper Estates'
  },
  {
    title: 'EstatesHub CRM',
    industryId: 'realestate',
    description: 'A virtual walkthrough dashboard and workflow coordinator built to align property metrics with agent pipelines.',
    tech: ['Next.js', 'Tailwind', 'PostgreSQL'],
    client: 'EstatesHub Group'
  },
  {
    title: 'Aura Bespoke Checkout',
    industryId: 'ecommerce',
    description: 'Designing bespoke product layouts, high-performance checkout funnels, immersive branding pages, and robust Stripe payment logic.',
    tech: ['React', 'Stripe', 'Framer Motion'],
    client: 'Aura Lifestyle'
  },
  {
    title: 'LuxeCart Engine',
    industryId: 'ecommerce',
    description: 'Tailor-made headless ecommerce store with multi-currency checkout, optimized product image load, and admin controls.',
    tech: ['Node.js', 'GraphQL', 'Shopify API'],
    client: 'LuxeCart Global'
  },
  {
    title: 'Pulse Health Portal',
    industryId: 'healthcare',
    description: 'Constructing secure doctor-patient portals, digital record grids, automated booking queues, and encrypted data backups.',
    tech: ['React', 'Express', 'MongoDB'],
    client: 'Pulse Medtech'
  },
  {
    title: 'GeneData Analyzer',
    industryId: 'healthcare',
    description: 'High-performance sequence visualization grid and encrypted biometric data storage complying with healthcare privacy standards.',
    tech: ['Python', 'Django', 'PostgreSQL'],
    client: 'GeneData Labs'
  },
  {
    title: 'DevPulse Agentic System',
    industryId: 'aisaas',
    description: 'An automated developer metrics platform powered by custom LLM pipelines, pulling analytics directly from vector search.',
    tech: ['Python', 'Vector DB', 'FastAPI'],
    client: 'DevPulse Inc'
  },
  {
    title: 'NeuroSaaS Grid',
    industryId: 'aisaas',
    description: 'Multi-tenant SaaS workspace integrated with custom agent orchestration, context management, and real-time usage metrics.',
    tech: ['React', 'FastAPI', 'PostgreSQL'],
    client: 'NeuroSaaS Co'
  },
  {
    title: 'LearnVerse LMS',
    industryId: 'education',
    description: 'Full-stack learning management system with live video classrooms, adaptive quizzes, and automated progress certificates.',
    tech: ['Next.js', 'WebRTC', 'PostgreSQL'],
    client: 'LearnVerse Academy'
  },
  {
    title: 'SkillPath Analytics',
    industryId: 'education',
    description: 'Student performance analytics dashboard tracking engagement metrics, quiz scores, and personalized learning recommendations.',
    tech: ['React', 'D3.js', 'FastAPI'],
    client: 'SkillPath Institute'
  },
  {
    title: 'FreightPulse Tracker',
    industryId: 'logistics',
    description: 'Real-time GPS fleet monitoring dashboard with geofence alerts, driver performance logs, and fuel consumption analytics.',
    tech: ['React', 'Node.js', 'Google Maps API'],
    client: 'FreightPulse Corp'
  },
  {
    title: 'ChainFlow Optimizer',
    industryId: 'logistics',
    description: 'AI-powered route optimization engine that reduces delivery times by analyzing traffic patterns, weather data, and load capacity.',
    tech: ['Python', 'TensorFlow', 'Redis'],
    client: 'ChainFlow Logistics'
  },
  {
    title: 'StayLux Booking Engine',
    industryId: 'hospitality',
    description: 'Premium hotel reservation platform with dynamic pricing algorithms, room inventory sync, and multi-channel distribution.',
    tech: ['Next.js', 'Stripe', 'PostgreSQL'],
    client: 'StayLux Resorts'
  },
  {
    title: 'GuestWave Concierge',
    industryId: 'hospitality',
    description: 'Mobile concierge application enabling guests to order room service, book spa sessions, and chat with hotel staff in real-time.',
    tech: ['Flutter', 'Firebase', 'Node.js'],
    client: 'GuestWave Hotels'
  }
];

export default function Industry() {
  const [selectedIndustry, setSelectedIndustry] = useState('fintech');
  const detailsRef = useRef(null);

  useEffect(() => {
    const parseHashParam = () => {
      const hash = window.location.hash;
      if (hash.includes('?')) {
        const queryString = hash.split('?')[1];
        const params = new URLSearchParams(queryString);
        const type = params.get('type');
        if (type && ['fintech', 'realestate', 'ecommerce', 'healthcare', 'aisaas', 'education', 'logistics', 'hospitality'].includes(type)) {
          setSelectedIndustry(type);
        }
      } else {
        setSelectedIndustry('fintech'); // Default to fintech instead of all for split layout
      }
    };

    parseHashParam();
    window.addEventListener('hashchange', parseHashParam);
    return () => window.removeEventListener('hashchange', parseHashParam);
  }, []);

  const handleSelectIndustry = (id) => {
    setSelectedIndustry(id);
    window.location.hash = `#industry?type=${id}`;
    
    // Smooth scroll to details on mobile screens
    if (window.innerWidth < 1024) {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeInd = industries.find(i => i.id === selectedIndustry) || industries[0];
  const filteredProjects = projects.filter(p => p.industryId === selectedIndustry);

  return (
    <div className="relative pb-24 overflow-hidden text-neutral-300 font-sans">
      
      {/* Background ambient glows */}
      <div 
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full filter blur-[140px] pointer-events-none transition-all duration-1000 ease-in-out" 
        style={{ backgroundColor: activeInd.glowClass, opacity: 0.6 }}
      />
      <div 
        className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full filter blur-[120px] pointer-events-none transition-all duration-1000 ease-in-out" 
        style={{ backgroundColor: activeInd.glowClass, opacity: 0.4 }}
      />

      {/* Header Section */}
      <div className="text-center mb-20 pt-8 relative z-10">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
          // Verticals We Scale
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          Industries We Serve
        </h1>
        <p className="font-light text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Click on any industry vertical below to explore custom solutions, metric outcomes, and technical project briefs on the side.
        </p>
      </div>

      {/* ──────────────────────────────────────────────────
          SPLIT SCREEN MASTER-DETAIL CONTAINER
          ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto px-4 relative z-10 items-start">
        
        {/* Left Side (5 Columns) - Master Industry List */}
        <div className="lg:col-span-5 space-y-4">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block mb-2">// Select Vertical</span>
          {industries.map((ind) => {
            const isSelected = selectedIndustry === ind.id;
            return (
              <div
                key={ind.id}
                onClick={() => handleSelectIndustry(ind.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 flex gap-5 items-center cursor-pointer select-none text-left relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-[#09090e]/80 border-white/10 shadow-2xl' 
                    : 'bg-[#050508]/40 border-white/5 hover:border-white/10 hover:bg-[#07070b]/60'
                }`}
              >
                {/* Accent border glow (Active state) */}
                {isSelected && (
                  <div className="absolute left-0 inset-y-0 w-[3px] bg-gradient-to-b from-teal-500 to-cyan-500" />
                )}

                {/* Industry List Image Preview */}
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/5 relative bg-neutral-900">
                  <img 
                    src={ind.listImg} 
                    alt={ind.title} 
                    className={`w-full h-full object-cover transition-all duration-500 ${isSelected ? '' : 'grayscale'}`}
                  />
                </div>

                {/* Details Summary */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className={`font-display text-sm sm:text-base font-bold transition-colors ${
                    isSelected ? 'text-white' : 'text-neutral-400 group-hover:text-white'
                  }`}>
                    {ind.title}
                  </h3>
                  <p className="font-light text-neutral-500 text-[11px] sm:text-xs leading-relaxed truncate-none">
                    {ind.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side (7 Columns) - Detail Panel ("Second Page next to it") */}
        <div 
          ref={detailsRef}
          className="lg:col-span-7 bg-[#09090d]/80 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl min-h-[500px] flex flex-col justify-between"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndustry}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-left"
            >
              {/* Header section containing Big Image */}
              <div className="space-y-6">
                <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-white/10 relative bg-neutral-900 shadow-lg">
                  <img 
                    src={activeInd.detailImg} 
                    alt={activeInd.title} 
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-6">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-teal-400">// Verticals Detail Page</span>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                      {activeInd.title}
                    </h2>
                  </div>
                </div>
                
                <p className="font-light text-neutral-300 text-xs sm:text-sm leading-relaxed">
                  {activeInd.detailDescription}
                </p>
              </div>

              {/* Dynamic metrics block */}
              <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-6">
                {industryMetrics[selectedIndustry].map((m) => (
                  <div key={m.label} className="space-y-1">
                    <span className="font-display text-2xl sm:text-3xl font-extrabold text-white block" style={{ color: activeInd.accentColor }}>
                      {m.value}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Case Studies / Projects */}
              <div className="space-y-4">
                <h4 className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">// Technical Case Briefs</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProjects.map((proj) => (
                    <div 
                      key={proj.title}
                      className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">{proj.client}</span>
                      <h5 className="font-display font-bold text-xs sm:text-sm text-white mt-1 mb-2">{proj.title}</h5>
                      <p className="font-light text-neutral-400 text-[11px] leading-relaxed line-clamp-3 mb-4">{proj.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tech.map((t) => (
                          <span key={t} className="font-mono text-[7px] text-neutral-500 bg-white/[0.01] border border-white/5 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* CTA Inquire option at bottom */}
          <div className="border-t border-white/5 pt-6 mt-8 flex justify-between items-center">
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
              Need a bespoke {activeInd.title} system?
            </span>
            <a 
              href="#contact" 
              className="bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors shadow-md"
            >
              Start Project
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
