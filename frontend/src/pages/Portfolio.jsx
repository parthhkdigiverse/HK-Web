import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';

/* ────────────────────────── PORTFOLIO PROJECTS ────────────────────────── */
const DEFAULT_PROJECTS = [
  {
    id: 'zenith',
    title: 'Zenith CRM Platform',
    client: 'Zenith Global',
    category: 'platform',
    description: 'An automation-rich CRM platform designed for global distribution and supply chains, featuring real-time analytical logs, automated email campaigns, and role-based dashboards.',
    challenge: 'Zenith Global was managing their global supply chain through disconnected spreadsheets and legacy ERP systems, causing delays in order processing and zero visibility into distributor performance.',
    solution: 'Built a unified CRM platform with real-time order tracking, automated email campaigns triggered by pipeline stages, role-based dashboards for each distributor tier, and comprehensive analytical reporting.',
    features: ['Real-time Order Tracking', 'Automated Email Campaigns', 'Role-based Dashboards', 'Distributor Analytics', 'Inventory Management'],
    tech: ['React', 'FastAPI', 'Docker', 'PostgreSQL'],
    img: '/images/casestudies/corelogistics.png',
    liveUrl: '',
    color: 'emerald',
    accentColor: '#10b981'
  },
  {
    id: 'devpulse',
    title: 'DevPulse Agentic System',
    client: 'DevPulse Inc',
    category: 'ai',
    description: 'An automated developer metrics platform powered by custom LLM pipelines, pulling analytics directly from vector search and providing AI-generated code review summaries.',
    challenge: 'DevPulse needed a way to automatically track developer productivity, code quality metrics, and generate intelligent code review summaries without manual overhead.',
    solution: 'Designed custom LLM pipelines with vector search integration that automatically analyzes code commits, generates review summaries, and provides actionable developer productivity dashboards.',
    features: ['LLM Code Reviews', 'Vector Search Analytics', 'Developer Metrics', 'Automated Reports', 'Team Insights'],
    tech: ['Python', 'Vector DB', 'FastAPI', 'LangChain'],
    img: '/images/casestudies/novadefi.png',
    liveUrl: '',
    color: 'purple',
    accentColor: '#a855f7'
  },
  {
    id: 'solis',
    title: 'Solis Trading Portal',
    client: 'Solis Ltd',
    category: 'platform',
    description: 'A responsive fintech dashboard delivering rapid metric updates, instant payment gates, multi-tenant scaling, and real-time portfolio tracking with Stripe integration.',
    challenge: 'Solis needed a real-time trading portal that could handle thousands of concurrent users while maintaining sub-second update speeds for portfolio values and market data.',
    solution: 'Architected a high-performance fintech dashboard with WebSocket-driven real-time updates, Stripe payment integration, multi-tenant architecture, and Redis-cached portfolio calculations.',
    features: ['Real-time Portfolio Tracking', 'Stripe Payment Gates', 'Multi-tenant Architecture', 'Market Data Feeds', 'Transaction History'],
    tech: ['React', 'Stripe API', 'AWS', 'Redis'],
    img: '/images/casestudies/vesper.png',
    liveUrl: '',
    color: 'amber',
    accentColor: '#f59e0b'
  },
  {
    id: 'flavorbowl',
    title: 'FlavorBowl Restaurant App',
    client: 'FlavorBowl Kitchen',
    category: 'web',
    description: 'A premium food ordering website with beautiful dish photography, real-time order tracking, table reservation system, and integrated payment gateway for dine-in and delivery.',
    challenge: 'FlavorBowl Kitchen was losing online orders due to a clunky third-party ordering system with high commissions and no brand identity.',
    solution: 'Created a custom branded ordering platform with stunning food photography layouts, real-time kitchen order tracking, table reservation calendar, and zero-commission payment processing.',
    features: ['Online Ordering', 'Table Reservations', 'Real-time Tracking', 'Menu Management', 'Payment Gateway'],
    tech: ['Next.js', 'Stripe', 'Firebase', 'Tailwind'],
    img: '/images/portfolio/restaurant.png',
    liveUrl: '',
    color: 'orange',
    accentColor: '#f97316'
  },
  {
    id: 'ironpulse',
    title: 'IronPulse Fitness Platform',
    client: 'IronPulse Gym',
    category: 'web',
    description: 'A fitness tracking web app with personalized workout plans, body metrics dashboard, trainer booking system, and progress photo timeline for gym members.',
    challenge: 'IronPulse Gym members had no way to track their progress digitally, leading to low retention rates and difficulty in personalizing workout programs.',
    solution: 'Built a comprehensive fitness platform with AI-suggested workout plans, body composition tracking charts, trainer scheduling, and a visual progress timeline with photo comparisons.',
    features: ['Workout Plans', 'Body Metrics Dashboard', 'Trainer Booking', 'Progress Photos', 'Nutrition Tracking'],
    tech: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
    img: '/images/portfolio/fitness.png',
    liveUrl: '',
    color: 'red',
    accentColor: '#ef4444'
  },
  {
    id: 'glamour',
    title: 'Glamour Studio Booking',
    client: 'Glamour Salon & Spa',
    category: 'web',
    description: 'An elegant beauty salon booking platform with service cards, stylist profiles, appointment calendar, and automated SMS/WhatsApp reminders for scheduled appointments.',
    challenge: 'Glamour Salon was losing bookings due to phone-only scheduling, no-shows without reminders, and inability to showcase their stylists\' portfolios online.',
    solution: 'Designed an elegant booking platform with service showcases, stylist portfolio galleries, interactive appointment calendar, and automated WhatsApp/SMS reminder sequences.',
    features: ['Online Booking', 'Stylist Profiles', 'Appointment Calendar', 'SMS Reminders', 'Service Gallery'],
    tech: ['React', 'Express', 'PostgreSQL', 'Twilio'],
    img: '/images/portfolio/salon.png',
    liveUrl: '',
    color: 'pink',
    accentColor: '#ec4899'
  },
  {
    id: 'luxethread',
    title: 'LuxeThread Fashion Store',
    client: 'LuxeThread Co.',
    category: 'ecommerce',
    description: 'A modern fashion e-commerce store with product quick-view, size recommendations, wishlist system, multi-currency checkout, and automated inventory management.',
    challenge: 'LuxeThread needed a premium e-commerce experience that matched their luxury brand positioning while handling multi-currency transactions and complex inventory across multiple warehouses.',
    solution: 'Built a high-end fashion store with smooth product animations, AI-powered size recommendations, multi-currency Stripe checkout, and real-time inventory sync across all warehouses.',
    features: ['Product Quick-view', 'Size Recommendations', 'Multi-currency Checkout', 'Wishlist System', 'Inventory Management'],
    tech: ['Next.js', 'Shopify API', 'Stripe', 'GraphQL'],
    img: '/images/portfolio/ecommerce.png',
    liveUrl: '',
    color: 'neutral',
    accentColor: '#a3a3a3'
  },
  {
    id: 'wanderlust',
    title: 'Wanderlust Travel Platform',
    client: 'Wanderlust Travels',
    category: 'web',
    description: 'A travel agency booking website with destination discovery, flight/hotel search, itinerary builder, and group travel management for families and corporate retreats.',
    challenge: 'Wanderlust Travels was using generic booking portals that offered no brand differentiation and couldn\'t support custom group travel packages or corporate retreat management.',
    solution: 'Created a branded travel platform with interactive destination maps, custom itinerary builder, group booking management, and corporate retreat planning tools.',
    features: ['Destination Discovery', 'Itinerary Builder', 'Group Booking', 'Flight/Hotel Search', 'Corporate Retreats'],
    tech: ['React', 'Node.js', 'Google Maps API', 'PostgreSQL'],
    img: '/images/portfolio/travel.png',
    liveUrl: '',
    color: 'teal',
    accentColor: '#14b8a6'
  },
  {
    id: 'eventcraft',
    title: 'EventCraft Platform',
    client: 'EventCraft Studios',
    category: 'platform',
    description: 'An event management platform with ticket booking, venue maps, speaker profiles, live streaming integration, and post-event analytics dashboards.',
    challenge: 'EventCraft Studios needed a unified platform to manage everything from ticket sales and venue logistics to live streaming and post-event engagement analytics.',
    solution: 'Architected an all-in-one event platform with interactive venue maps, tiered ticket sales, WebRTC live streaming, speaker profile management, and real-time attendance analytics.',
    features: ['Ticket Booking', 'Venue Maps', 'Live Streaming', 'Speaker Profiles', 'Event Analytics'],
    tech: ['Next.js', 'Stripe', 'WebRTC', 'Redis'],
    img: '/images/portfolio/event.png',
    liveUrl: '',
    color: 'violet',
    accentColor: '#8b5cf6'
  },
  {
    id: 'neurosass',
    title: 'NeuroSaaS Grid',
    client: 'NeuroSaaS Co',
    category: 'ai',
    description: 'Multi-tenant SaaS workspace integrated with custom agent orchestration, context management, usage-based billing, and real-time LLM token consumption metrics.',
    challenge: 'NeuroSaaS needed a scalable multi-tenant workspace where each customer could deploy custom AI agents with isolated contexts, usage tracking, and transparent billing.',
    solution: 'Built a multi-tenant SaaS grid with isolated agent workspaces, custom orchestration pipelines, real-time token consumption dashboards, and usage-based billing integration.',
    features: ['Agent Orchestration', 'Multi-tenant Workspaces', 'Usage-based Billing', 'Token Metrics', 'Context Management'],
    tech: ['React', 'FastAPI', 'PostgreSQL', 'Vector DB'],
    img: '/images/casestudies/aerocrm.png',
    liveUrl: '',
    color: 'blue',
    accentColor: '#3b82f6'
  },
  {
    id: 'apexledger',
    title: 'Apex Ledger Engine',
    client: 'Apex Capital',
    category: 'platform',
    description: 'High-throughput transaction processing ledger built for institutional digital banking, handling 10K transactions/sec with encrypted audit trails and compliance reports.',
    challenge: 'Apex Capital required a transaction ledger that could process 10,000+ transactions per second while maintaining complete audit trails and regulatory compliance documentation.',
    solution: 'Engineered a high-throughput ledger engine with encrypted audit trails, real-time compliance report generation, multi-layer transaction validation, and automated regulatory filing.',
    features: ['10K TPS Processing', 'Encrypted Audit Trails', 'Compliance Reports', 'Transaction Validation', 'Regulatory Filing'],
    tech: ['FastAPI', 'Redis', 'Docker', 'PostgreSQL'],
    img: '/images/casestudies/novadefi.png',
    liveUrl: '',
    color: 'cyan',
    accentColor: '#06b6d4'
  },
  {
    id: 'estateshub',
    title: 'EstatesHub CRM Dashboard',
    client: 'EstatesHub Group',
    category: 'platform',
    description: 'A virtual walkthrough dashboard and workflow coordinator built to align property metrics with agent pipelines, featuring lead scoring and automated follow-up sequences.',
    challenge: 'EstatesHub Group agents were losing leads due to manual follow-up processes and no visibility into which properties matched buyer preferences.',
    solution: 'Created a CRM dashboard with virtual property walkthroughs, AI-powered lead scoring, automated follow-up email sequences, and agent performance tracking dashboards.',
    features: ['Virtual Walkthroughs', 'Lead Scoring', 'Automated Follow-ups', 'Agent Dashboards', 'Property Matching'],
    tech: ['Next.js', 'Tailwind', 'PostgreSQL', 'Mapbox'],
    img: '/images/casestudies/vesper.png',
    liveUrl: '',
    color: 'indigo',
    accentColor: '#6366f1'
  }
];

const categories = [
  { key: 'all', label: 'All Work' },
  { key: 'web', label: 'Web Development' },
  { key: 'platform', label: 'CRM & Platforms' },
  { key: 'ai', label: 'AI Integrations' },
  { key: 'ecommerce', label: 'E-Commerce' }
];

export default function Portfolio() {
  const { content } = useContent();
  const [filter, setFilter] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = (content?.portfolio || DEFAULT_PROJECTS).map(p => {
    const fallback = DEFAULT_PROJECTS.find(d => d.id === (p.slug || p.id)) || {};
    return {
      ...fallback,
      ...p,
      id: p.slug || p.id
    };
  });

  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  // Hash-based detail routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('?project=')) {
        const projectId = hash.split('?project=')[1];
        if (projectId) {
          setSelectedProject(projectId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        setSelectedProject(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  /* ────────── DETAIL PAGE VIEW ────────── */
  if (selectedProject) {
    const item = projects.find(p => p.id === selectedProject);
    if (item) {
      return (
        <motion.div
          key="portfolio-detail"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative text-neutral-300 font-sans max-w-6xl mx-auto px-4 py-16 text-left min-h-screen"
        >
          {/* Background ambience */}
          <div className="absolute top-[10%] right-1/4 w-[35vw] h-[35vw] rounded-full blur-[120px] pointer-events-none" style={{ background: `${item.accentColor}08` }} />
          <div className="absolute top-[60%] left-1/4 w-[30vw] h-[30vw] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

          {/* Back button */}
          <button
            onClick={() => { window.location.hash = '#portfolio'; }}
            className="group flex items-center gap-2 mb-10 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white cursor-pointer transition-colors"
          >
            <span>← Back to Portfolio</span>
          </button>

          {/* Hero Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 relative z-10">
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <span className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg border bg-${item.color}-500/10 text-${item.color}-400 border-${item.color}-500/20`}>
                  {item.category === 'web' ? 'Web Development' : item.category === 'platform' ? 'CRM & Platform' : item.category === 'ai' ? 'AI Integration' : 'E-Commerce'}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg border bg-white/5 text-neutral-400 border-white/10">
                  {item.client}
                </span>
              </div>
              <div className="space-y-2">
                <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">{item.title}</h1>
              </div>
              <p className="font-light text-neutral-400 text-sm sm:text-base leading-relaxed">{item.description}</p>

              {/* Live Link Button */}
              {item.liveUrl && (
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl border bg-${item.color}-500/10 border-${item.color}-500/20 hover:bg-${item.color}-500/20 transition-all group`}
                >
                  <span className={`font-mono text-[10px] uppercase tracking-widest text-${item.color}-400 font-bold`}>
                    Visit Live Website
                  </span>
                  <svg className={`w-4 h-4 text-${item.color}-400 group-hover:translate-x-1 transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
            
            {/* Poster / Cover Image */}
            <div className="relative aspect-video lg:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Key Features */}
          {item.features && item.features.length > 0 && (
            <div className="mb-16 border-t border-white/5 pt-10 relative z-10">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-6">// Key Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {item.features.map((feat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors text-center">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 block">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenge & Solution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16 relative z-10">
            {item.challenge && (
              <div className="space-y-4">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold">// The Challenge</h3>
                <p className="font-light text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">{item.challenge}</p>
              </div>
            )}
            {item.solution && (
              <div className="space-y-4">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold">// Our Solution</h3>
                <p className="font-light text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">{item.solution}</p>
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <div className="space-y-4 border-t border-white/5 pt-10 relative z-10">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-bold">// Technologies Used</h3>
            <div className="flex flex-wrap gap-2.5">
              {(item.tech || []).map(t => (
                <span key={t} className={`font-mono text-[10px] uppercase tracking-widest text-${item.color}-400 bg-${item.color}-500/5 border border-${item.color}-500/15 px-4 py-2 rounded-xl`}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Live Link CTA (bottom) */}
          {item.liveUrl && (
            <div className="mt-16 border-t border-white/5 pt-10 text-center relative z-10">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-4">// See it in action</p>
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-mono text-[11px] uppercase tracking-widest font-bold rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Open Live Website
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </motion.div>
      );
    }
  }

  /* ────────── GRID LIST VIEW ────────── */
  return (
    <div className="relative text-neutral-300 font-sans">
      {/* Background ambience */}
      <div className="absolute top-[15%] left-1/3 w-[30vw] h-[30vw] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[55%] right-1/3 w-[35vw] h-[35vw] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      {/* ── Header ── */}
      <div className="text-center mb-20 pt-8 relative z-10">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
          // Our Showcase
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          Our Portfolio
        </h1>
        <p className="font-light text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          A curated collection of websites, platforms, mobile apps, and AI solutions we've built for clients across industries — from small businesses to enterprise-scale products.
        </p>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex justify-center flex-wrap gap-2 mb-16 px-4 relative z-10">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-5 py-2.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border transition-all ${
              filter === cat.key
                ? 'bg-white text-black border-white shadow-lg'
                : 'text-neutral-400 bg-white/[0.02] border-white/5 hover:border-white/15'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Project Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1600px] w-full mx-auto px-4 relative z-10 mb-20">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative"
            >
              <div 
                onClick={() => { window.location.hash = '#portfolio?project=' + item.id; }}
                className="bg-[#050508]/60 border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-500 h-full flex flex-col cursor-pointer"
                style={{ boxShadow: hoveredId === item.id ? `0 20px 50px -15px ${item.accentColor}33` : 'none' }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md border bg-black/50 backdrop-blur-sm text-${item.color}-400 border-${item.color}-500/20`}>
                      {item.category === 'web' ? 'Web' : item.category === 'platform' ? 'Platform' : item.category === 'ai' ? 'AI' : 'E-Com'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">{item.client}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-neutral-200 transition-colors">{item.title}</h3>
                  <p className="font-light text-neutral-400 text-xs sm:text-sm leading-relaxed mb-4 flex-1">{item.description}</p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(item.tech || []).map(t => (
                      <span key={t} className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 bg-white/[0.02] border border-white/5 px-2 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* View Details CTA */}
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/50 group-hover:text-white transition-colors flex items-center gap-2 pt-2 border-t border-white/5">
                    <span>[ View Project Details ]</span>
                    <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Stats Bar ── */}
      <div className="border-t border-white/5 py-16 max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <span className="font-display text-3xl font-extrabold text-white block">12+</span>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 mt-1 block">Projects Shipped</span>
          </div>
          <div>
            <span className="font-display text-3xl font-extrabold text-white block">8+</span>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 mt-1 block">Industries Covered</span>
          </div>
          <div>
            <span className="font-display text-3xl font-extrabold text-white block">100%</span>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 mt-1 block">Client Satisfaction</span>
          </div>
          <div>
            <span className="font-display text-3xl font-extrabold text-white block">50+</span>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 mt-1 block">Features Built</span>
          </div>
        </div>
      </div>
    </div>
  );
}
