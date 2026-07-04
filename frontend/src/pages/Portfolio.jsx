import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ────────────────────────── PORTFOLIO PROJECTS ────────────────────────── */
const projects = [
  {
    id: 'zenith',
    title: 'Zenith CRM Platform',
    client: 'Zenith Global',
    category: 'platform',
    description: 'An automation-rich CRM platform designed for global distribution and supply chains, featuring real-time analytical logs, automated email campaigns, and role-based dashboards.',
    tech: ['React', 'FastAPI', 'Docker', 'PostgreSQL'],
    img: '/images/casestudies/corelogistics.png',
    color: 'emerald',
    accentColor: '#10b981'
  },
  {
    id: 'devpulse',
    title: 'DevPulse Agentic System',
    client: 'DevPulse Inc',
    category: 'ai',
    description: 'An automated developer metrics platform powered by custom LLM pipelines, pulling analytics directly from vector search and providing AI-generated code review summaries.',
    tech: ['Python', 'Vector DB', 'FastAPI', 'LangChain'],
    img: '/images/casestudies/novadefi.png',
    color: 'purple',
    accentColor: '#a855f7'
  },
  {
    id: 'solis',
    title: 'Solis Trading Portal',
    client: 'Solis Ltd',
    category: 'platform',
    description: 'A responsive fintech dashboard delivering rapid metric updates, instant payment gates, multi-tenant scaling, and real-time portfolio tracking with Stripe integration.',
    tech: ['React', 'Stripe API', 'AWS', 'Redis'],
    img: '/images/casestudies/vesper.png',
    color: 'amber',
    accentColor: '#f59e0b'
  },
  {
    id: 'flavorbowl',
    title: 'FlavorBowl Restaurant App',
    client: 'FlavorBowl Kitchen',
    category: 'web',
    description: 'A premium food ordering website with beautiful dish photography, real-time order tracking, table reservation system, and integrated payment gateway for dine-in and delivery.',
    tech: ['Next.js', 'Stripe', 'Firebase', 'Tailwind'],
    img: '/images/portfolio/restaurant.png',
    color: 'orange',
    accentColor: '#f97316'
  },
  {
    id: 'ironpulse',
    title: 'IronPulse Fitness Platform',
    client: 'IronPulse Gym',
    category: 'web',
    description: 'A fitness tracking web app with personalized workout plans, body metrics dashboard, trainer booking system, and progress photo timeline for gym members.',
    tech: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
    img: '/images/portfolio/fitness.png',
    color: 'red',
    accentColor: '#ef4444'
  },
  {
    id: 'glamour',
    title: 'Glamour Studio Booking',
    client: 'Glamour Salon & Spa',
    category: 'web',
    description: 'An elegant beauty salon booking platform with service cards, stylist profiles, appointment calendar, and automated SMS/WhatsApp reminders for scheduled appointments.',
    tech: ['React', 'Express', 'PostgreSQL', 'Twilio'],
    img: '/images/portfolio/salon.png',
    color: 'pink',
    accentColor: '#ec4899'
  },
  {
    id: 'luxethread',
    title: 'LuxeThread Fashion Store',
    client: 'LuxeThread Co.',
    category: 'ecommerce',
    description: 'A modern fashion e-commerce store with product quick-view, size recommendations, wishlist system, multi-currency checkout, and automated inventory management.',
    tech: ['Next.js', 'Shopify API', 'Stripe', 'GraphQL'],
    img: '/images/portfolio/ecommerce.png',
    color: 'neutral',
    accentColor: '#a3a3a3'
  },
  {
    id: 'wanderlust',
    title: 'Wanderlust Travel Platform',
    client: 'Wanderlust Travels',
    category: 'web',
    description: 'A travel agency booking website with destination discovery, flight/hotel search, itinerary builder, and group travel management for families and corporate retreats.',
    tech: ['React', 'Node.js', 'Google Maps API', 'PostgreSQL'],
    img: '/images/portfolio/travel.png',
    color: 'teal',
    accentColor: '#14b8a6'
  },
  {
    id: 'eventcraft',
    title: 'EventCraft Platform',
    client: 'EventCraft Studios',
    category: 'platform',
    description: 'An event management platform with ticket booking, venue maps, speaker profiles, live streaming integration, and post-event analytics dashboards.',
    tech: ['Next.js', 'Stripe', 'WebRTC', 'Redis'],
    img: '/images/portfolio/event.png',
    color: 'violet',
    accentColor: '#8b5cf6'
  },
  {
    id: 'neurosass',
    title: 'NeuroSaaS Grid',
    client: 'NeuroSaaS Co',
    category: 'ai',
    description: 'Multi-tenant SaaS workspace integrated with custom agent orchestration, context management, usage-based billing, and real-time LLM token consumption metrics.',
    tech: ['React', 'FastAPI', 'PostgreSQL', 'Vector DB'],
    img: '/images/casestudies/aerocrm.png',
    color: 'blue',
    accentColor: '#3b82f6'
  },
  {
    id: 'apexledger',
    title: 'Apex Ledger Engine',
    client: 'Apex Capital',
    category: 'platform',
    description: 'High-throughput transaction processing ledger built for institutional digital banking, handling 10K transactions/sec with encrypted audit trails and compliance reports.',
    tech: ['FastAPI', 'Redis', 'Docker', 'PostgreSQL'],
    img: '/images/casestudies/novadefi.png',
    color: 'cyan',
    accentColor: '#06b6d4'
  },
  {
    id: 'estateshub',
    title: 'EstatesHub CRM Dashboard',
    client: 'EstatesHub Group',
    category: 'platform',
    description: 'A virtual walkthrough dashboard and workflow coordinator built to align property metrics with agent pipelines, featuring lead scoring and automated follow-up sequences.',
    tech: ['Next.js', 'Tailwind', 'PostgreSQL', 'Mapbox'],
    img: '/images/casestudies/vesper.png',
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
  const [filter, setFilter] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

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
                className="bg-[#050508]/60 border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-500 h-full flex flex-col"
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
                  <div className="flex flex-wrap gap-1.5">
                    {item.tech.map(t => (
                      <span key={t} className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 bg-white/[0.02] border border-white/5 px-2 py-1 rounded">
                        {t}
                      </span>
                    ))}
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
