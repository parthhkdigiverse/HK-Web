import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';

/* ────────────────────────── CONSULTANCY CASE STUDIES ────────────────────────── */
const DEFAULT_CASES = [
  {
    id: 'vesper',
    client: 'Vesper Luxury Living',
    title: 'Cinematic Visual Sales Engine',
    industry: 'Real Estate',
    summary: 'We transformed Vesper\'s high-end property portal by integrating custom canvas scrubbing transitions, rendering 4K frame sequences that scroll smoothly on desktop and mobile. The cinematic experience increased buyer engagement dramatically.',
    challenge: 'Vesper needed a property showcase that felt like a luxury brand experience, not a generic listing site. Their existing platform had poor mobile performance and lacked visual storytelling.',
    solution: 'Built a custom canvas-based scroll scrub engine with optimized frame preloading, lazy-loaded 4K imagery, and GPU-accelerated transitions. Integrated interactive floor plans and virtual walkthrough modules.',
    tech: ['React', 'Canvas API', 'GSAP', 'Vite', 'Three.js'],
    img: '/images/casestudies/vesper.png',
    metrics: [
      { label: 'Conversion Rate', value: '+142%' },
      { label: 'Avg. Time on Page', value: '4m 12s' },
      { label: 'Load Time', value: '0.8s' }
    ],
    duration: '4 months',
    color: 'amber',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.15)'
  },
  {
    id: 'aerocrm',
    client: 'AeroCRM Aviation',
    title: 'Automated Operations Platform',
    industry: 'Aviation',
    summary: 'Replaced a fragmented array of legacy software sheets with a custom high-performance CRM, featuring automated emailers, booking schedules, vector notifications, and daily backups.',
    challenge: 'AeroCRM was managing fleet operations across spreadsheets and disconnected tools, causing booking conflicts, delayed communications, and zero audit trails.',
    solution: 'Architected a unified CRM with real-time booking conflict detection, automated email/SMS triggers, role-based dashboards, and end-to-end encrypted data backups running every 6 hours.',
    tech: ['React', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis'],
    img: '/images/casestudies/aerocrm.png',
    metrics: [
      { label: 'Operational Efficiency', value: '+400%' },
      { label: 'Booking Failures', value: '0%' },
      { label: 'Manual Input Time', value: '-85%' }
    ],
    duration: '6 months',
    color: 'blue',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.15)'
  },
  {
    id: 'novadefi',
    client: 'Nova DeFi',
    title: 'Web3 Trading Platform & UX Overhaul',
    industry: 'Fintech / Web3',
    summary: 'Co-architected the complete user flow for Nova\'s decentralized finance platform, designing intuitive swap interfaces, wallet connectivity, and real-time portfolio dashboards.',
    challenge: 'Nova\'s existing DeFi interface had a 60% user drop-off at the wallet connection step. Complex transaction flows confused first-time crypto users.',
    solution: 'Redesigned the entire UX flow with progressive disclosure patterns, one-click wallet connect, real-time gas estimation, and visual transaction confirmations with animated feedback.',
    tech: ['Next.js', 'Ethers.js', 'Solidity', 'The Graph', 'Framer Motion'],
    img: '/images/casestudies/novadefi.png',
    metrics: [
      { label: 'Transaction Success', value: '+40%' },
      { label: 'User Drop-off', value: '-60%' },
      { label: 'Daily Active Users', value: '3x' }
    ],
    duration: '5 months',
    color: 'purple',
    accentColor: '#a855f7',
    glowColor: 'rgba(168,85,247,0.15)'
  },
  {
    id: 'corelogistics',
    client: 'Core Logistics',
    title: 'AI-Driven Supply Chain Matrix',
    industry: 'Logistics',
    summary: 'Constructed a custom supply chain optimization system from scratch, integrating AI-driven route prediction, real-time fleet tracking, and automated warehouse inventory management.',
    challenge: 'Core Logistics was losing 20% of delivery efficiency due to manual route planning and lack of real-time visibility into fleet locations and warehouse stock levels.',
    solution: 'Built an AI route optimizer using historical traffic and weather data, integrated GPS fleet tracking with geofence alerts, and automated inventory scanning with barcode/QR integration.',
    tech: ['Python', 'TensorFlow', 'React', 'Google Maps API', 'PostgreSQL'],
    img: '/images/casestudies/corelogistics.png',
    metrics: [
      { label: 'Delivery Efficiency', value: '+38%' },
      { label: 'Fuel Cost Savings', value: '₹12L/yr' },
      { label: 'Real-time Accuracy', value: '99.7%' }
    ],
    duration: '7 months',
    color: 'emerald',
    accentColor: '#10b981',
    glowColor: 'rgba(16,185,129,0.15)'
  },
  {
    id: 'pulsehealth',
    client: 'Pulse MedTech',
    title: 'HIPAA-Compliant Patient Portal',
    industry: 'Healthcare',
    summary: 'Designed and built a secure doctor-patient portal with encrypted medical records, automated appointment scheduling, video consultations, and digital prescription management.',
    challenge: 'Pulse MedTech needed a patient management system that met strict HIPAA compliance while being intuitive enough for elderly patients to navigate without assistance.',
    solution: 'Created an accessibility-first portal with large-text modes, voice-guided navigation, E2E encrypted data at rest and in transit, and automated appointment reminders via SMS and WhatsApp.',
    tech: ['React', 'Express', 'MongoDB', 'WebRTC', 'Twilio'],
    img: '/images/casestudies/pulsehealth.png',
    metrics: [
      { label: 'Patient Satisfaction', value: '4.9/5' },
      { label: 'Booking Efficiency', value: '+200%' },
      { label: 'Data Breach Incidents', value: '0' }
    ],
    duration: '5 months',
    color: 'sky',
    accentColor: '#0ea5e9',
    glowColor: 'rgba(14,165,233,0.15)'
  },
  {
    id: 'learnverse',
    client: 'LearnVerse Academy',
    title: 'Full-Stack LMS with Live Classrooms',
    industry: 'EdTech',
    summary: 'Built a scalable Learning Management System with live video classrooms, adaptive quiz engines, real-time progress tracking, and automated certificate generation for 50,000+ students.',
    challenge: 'LearnVerse was using Zoom for classes and Google Sheets for tracking, losing student engagement data and unable to personalize the learning experience.',
    solution: 'Developed a custom LMS with WebRTC-based live classrooms, adaptive quizzing that adjusts difficulty based on performance, gamified progress dashboards, and auto-generated PDF certificates.',
    tech: ['Next.js', 'WebRTC', 'FastAPI', 'PostgreSQL', 'Redis'],
    img: '/images/casestudies/learnverse.png',
    metrics: [
      { label: 'Student Retention', value: '+65%' },
      { label: 'Course Completion', value: '94%' },
      { label: 'Students Onboarded', value: '50K+' }
    ],
    duration: '6 months',
    color: 'rose',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244,63,94,0.15)'
  }
];

export default function CaseStudy() {
  const { content } = useContent();

  const cases = (content?.case_studies || DEFAULT_CASES).map(c => {
    const styleFallback = DEFAULT_CASES.find(x => x.id === c.slug || x.id === c.id) || DEFAULT_CASES[0];
    return {
      ...styleFallback,
      ...c,
      id: c.slug || c.id
    };
  });

  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('?case=')) {
        const caseId = hash.split('?case=')[1];
        if (caseId) {
          setSelectedCase(caseId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        setSelectedCase(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (selectedCase) {
    const item = cases.find(c => c.id === selectedCase);
    if (item) {
      return (
        <motion.div
          key="detail-page"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative text-neutral-300 font-sans max-w-6xl mx-auto px-4 py-16 text-left min-h-screen"
        >
          {/* Background ambience */}
          <div className="absolute top-[10%] right-1/4 w-[35vw] h-[35vw] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
          <div className="absolute top-[60%] left-1/4 w-[30vw] h-[30vw] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

          {/* Back button */}
          <button
            onClick={() => {
              window.location.hash = '#case-study';
            }}
            className="group flex items-center gap-2 mb-10 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white cursor-pointer transition-colors"
          >
            <span>← Back to Case Studies</span>
          </button>

          {/* Hero Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 relative z-10">
            <div className="space-y-6">
              <div className="flex gap-2">
                <span className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg border bg-${item.color}-500/10 text-${item.color}-400 border-${item.color}-500/20`}>
                  {item.industry}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg border bg-white/5 text-neutral-400 border-white/10">
                  {item.duration}
                </span>
              </div>
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block">{item.client}</span>
                <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">{item.title}</h1>
              </div>
              <p className="font-light text-neutral-400 text-sm sm:text-base leading-relaxed">{item.summary}</p>
            </div>
            
            {/* Poster / Cover Image */}
            <div className="relative aspect-video lg:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 border-t border-b border-white/5 py-10 relative z-10">
            {(item.metrics || []).map((metric) => (
              <div key={metric.label} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors text-center">
                <span className={`font-display text-3xl sm:text-4xl font-extrabold text-${item.color}-400 block`}>{metric.value}</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 mt-2 block">{metric.label}</span>
              </div>
            ))}
          </div>

          {/* Detailed Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16 relative z-10">
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold">// The Challenge</h3>
              <p className="font-light text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">{item.challenge}</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold">// Our Solution</h3>
              <p className="font-light text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">{item.solution}</p>
            </div>
          </div>

          {/* Tech Stack Used */}
          <div className="space-y-4 border-t border-white/5 pt-10 relative z-10">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold">// Technologies Utilized</h3>
            <div className="flex flex-wrap gap-2.5">
              {(item.tech || []).map(t => (
                <span key={t} className={`font-mono text-[10px] uppercase tracking-widest text-${item.color}-400 bg-${item.color}-500/5 border border-${item.color}-500/15 px-4 py-2 rounded-xl`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      );
    }
  }

  return (
    <div className="relative text-neutral-300 font-sans">
      {/* Background ambience */}
      <div className="absolute top-[10%] right-1/4 w-[35vw] h-[35vw] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[60%] left-1/4 w-[30vw] h-[30vw] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      {/* ── Header ── */}
      <div className="text-center mb-20 pt-8 relative z-10">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
          // Consultancy Impact
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          Case Studies
        </h1>
        <p className="font-light text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Deep dives into how our consultancy, design aesthetics, and custom engineering solved complex operational and brand challenges for our clients.
        </p>
      </div>

      {/* ── Case Study Cards ── */}
      <div className="flex flex-col gap-16 max-w-[1600px] w-full mx-auto px-4 relative z-10 mb-20">
        {cases.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <div 
              onClick={() => {
                window.location.hash = '#case-study?case=' + item.id;
              }}
              className="bg-[#050508]/60 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-white/15 transition-all duration-500 shadow-2xl relative cursor-pointer text-left"
              style={{ boxShadow: `0 20px 60px -20px ${item.glowColor}` }}
            >
              {/* Image + Overlay */}
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent" />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className={`font-mono text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-lg border bg-${item.color}-500/10 text-${item.color}-400 border-${item.color}-500/20`}>
                    {item.industry}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-lg border bg-white/5 text-neutral-400 border-white/10">
                    {item.duration}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block mb-2">{item.client}</span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{item.title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <p className="font-light text-neutral-300 text-sm leading-relaxed">{item.summary}</p>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-4">
                  {(item.metrics || []).map((metric) => (
                    <div key={metric.label} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className={`font-display text-xl sm:text-2xl font-extrabold text-${item.color}-400 block`}>{metric.value}</span>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-500 mt-1 block">{metric.label}</span>
                    </div>
                  ))}
                </div>

                {/* Expand Button */}
                <div
                  className="font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center gap-2"
                >
                  <span>[ View Full Case Study ]</span>
                  <span className="text-xs">→</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
