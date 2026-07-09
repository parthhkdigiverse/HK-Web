import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Magnetic Button Wrapper for interactive back button
import { useContent } from '../context/ContentContext';

// Magnetic Button Wrapper for interactive back button
function Magnetic({ children, speed = 0.5 }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * speed;
    const y = (clientY - (top + height / 2)) * speed;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

// 3D Tilt Card Sub-component
function AwardCard({ award, idx, onClick }) {
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
      onClick={onClick}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      className="bg-[#09090d]/80 border border-white/5 rounded-3xl overflow-hidden group hover:border-amber-500/20 transition-colors shadow-2xl flex flex-col h-[420px] text-left relative cursor-pointer"
    >
      {/* Visual top border glow */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Card Image Cover */}
      <div className="w-full h-48 overflow-hidden relative border-b border-white/5">
        <img 
          src={award.img} 
          alt={award.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] to-transparent opacity-60" />
        
        {/* Category Label */}
        <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full">
          {award.category === 'company' ? 'Company Award' : 'Founder Award'}
        </span>

        {/* Year Label */}
        <span className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full">
          {award.year}
        </span>
      </div>

      {/* Card Body */}
      <div 
        className="p-6 flex-1 flex flex-col justify-between"
        style={{ transform: "translateZ(25px)" }}
      >
        <div className="space-y-3">
          <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block">
            Awarded by {award.by}
          </span>
          <h3 className="font-display text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
            {award.title}
          </h3>
          <p className="font-light text-neutral-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
            {award.description}
          </p>
        </div>

        {/* Footer info showing who received it */}
        <div className="border-t border-white/5 pt-4 flex items-center justify-between font-mono text-[10px] text-neutral-500">
          <span>RECIPIENT:</span>
          <span className="text-white font-bold">{award.recipient}</span>
        </div>
      </div>
    </motion.div>
  );
}

const DEFAULT_AWARDS = [
  {
    id: 'digital-craftsmanship',
    title: 'Best Digital Craftsmanship Studio',
    by: 'Tech & Design Guild',
    year: '2024',
    description: 'Awarded to HariKrushn DigiVerse for outstanding excellence in building bespoke, high-performance web systems and premium responsive animations.',
    category: 'company',
    recipient: 'HariKrushn DigiVerse LLP',
    img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&h=400&q=80',
    longDescription: 'This award recognizes our studio\'s commitment to pushing the boundaries of web engineering and aesthetics. The Tech & Design Guild evaluated our projects based on visual supremacy, codebase clean-room metrics, and 120 FPS motion responses on high-concurrency portals.',
    impactStats: [
      { label: 'Evaluation Score', value: '99.4%' },
      { label: 'Performance Rank', value: 'Top 1%' },
      { label: 'Motion Frame Rate', value: '120 FPS' }
    ],
    highlights: [
      'Exceptional design engineering rating',
      'Bespoke web framework rendering standards',
      'Clean-room visual development practices'
    ]
  },
  {
    id: 'tech-leader',
    title: 'Tech Leader of the Year',
    by: 'Gujarat Tech Startups Association',
    year: '2024',
    description: 'Honored to Radhe Patel for setting tech leadership benchmarks in secure serverless system deployment, scaling web app speed, and cloud architectures.',
    category: 'founders',
    recipient: 'Radhe Patel (CEO)',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&h=400&q=80',
    longDescription: 'Honored to Radhe Patel for setting tech leadership benchmarks in secure serverless system deployment, scaling web app speed, and cloud architectures. Radhe\'s vision of absolute engineering reliability has enabled our clients to process large transaction volumes with zero downtime.',
    impactStats: [
      { label: 'System Uptime', value: '99.99%' },
      { label: 'Avg Latency', value: '< 25ms' },
      { label: 'Security Grade', value: 'Enterprise' }
    ],
    highlights: [
      'Pioneered zero-downtime serverless nodes',
      'Optimized edge-computed LLM agent paths',
      'Maintained 100% cloud security records'
    ]
  },
  {
    id: 'ai-innovation',
    title: 'Enterprise AI Innovation Honors',
    by: 'Automation Council International',
    year: '2023',
    description: 'Awarded to HariKrushn DigiVerse for the innovative deployment of local LLM agent workflows and secure automated syncing layers.',
    category: 'company',
    recipient: 'HariKrushn DigiVerse LLP',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&h=400&q=80',
    longDescription: 'Awarded to HariKrushn DigiVerse for the innovative deployment of local LLM agent workflows and secure automated syncing layers. Our AI systems have enabled automated workflow execution inside isolated environments, protecting business telemetry while delivering high accuracy.',
    impactStats: [
      { label: 'Agent Accuracy', value: '98.5%' },
      { label: 'Data Security', value: 'Isolated' },
      { label: 'Workflow Efficiency', value: '10x' }
    ],
    highlights: [
      'Bespoke prompt-cache compilation grids',
      'Decentralized local LLM node clusters',
      'Automated secure sync infrastructure'
    ]
  },
  {
    id: 'creative-director',
    title: 'Creative Director Landmark Award',
    by: 'Design & Motion Syndicate',
    year: '2023',
    description: 'Honored to Prince Patel for visual design excellence, introducing fluid glassmorphism interfaces and interactive UI/UX motion standards.',
    category: 'founders',
    recipient: 'Prince Patel (Partner)',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&h=400&q=80',
    longDescription: 'Honored to Prince Patel for visual design excellence, introducing fluid glassmorphism interfaces and interactive UI/UX motion standards. Prince\'s philosophy of editorial digital experiences merges fine art with complex engineering constraints.',
    impactStats: [
      { label: 'UX Rating', value: '4.9 / 5' },
      { label: 'Design System Coverage', value: '100%' },
      { label: 'Interaction Response', value: 'Instant' }
    ],
    highlights: [
      'Defined unified design system blueprints',
      'Pioneered custom fluid glassmorphic components',
      'Established strict 120 FPS scroll policies'
    ]
  },
  {
    id: 'web-performance',
    title: 'Outstanding Web Performance Award',
    by: 'Lighthouse Web Audits Group',
    year: '2023',
    description: 'Recognized for achieving 99+ metrics on complex, animation-heavy, and high-concurrency systems without loading lags.',
    category: 'company',
    recipient: 'HariKrushn DigiVerse LLP',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&h=400&q=80',
    longDescription: 'Recognized for achieving 99+ metrics on complex, animation-heavy, and high-concurrency systems without loading lags. The auditing team noted our unique asset lazy-loading and GPU-accelerated transition strategies.',
    impactStats: [
      { label: 'Lighthouse Performance', value: '100/100' },
      { label: 'Interaction to Next Paint', value: '< 10ms' },
      { label: 'Largest Contentful Paint', value: '0.8s' }
    ],
    highlights: [
      'GPU-accelerated animation engines',
      'Zero-blocking assets loading pipeline',
      'Bespoke bundle code-splitting systems'
    ]
  },
  {
    id: 'young-entrepreneurs',
    title: 'Young Tech Entrepreneurs Award',
    by: 'Gujarat Tech Startups Association',
    year: '2022',
    description: 'Awarded to Co-Founders Radhe Patel & Prince Patel for their rapid growth, client retention, and technical job creation in Surat.',
    category: 'founders',
    recipient: 'Radhe Patel & Prince Patel',
    img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&h=400&q=80',
    longDescription: 'Awarded to Co-Founders Radhe Patel & Prince Patel for their rapid growth, client retention, and technical job creation in Surat. The association recognized their focus on premium employment and high-value software exports.',
    impactStats: [
      { label: 'Yearly Growth Rate', value: '120%' },
      { label: 'Client Retention Rate', value: '95%' },
      { label: 'Engineering Talents', value: '30+' }
    ],
    highlights: [
      'Created premium jobs in Surat, Gujarat',
      'Generated high-value tech export volumes',
      'Founded a modern digital-craft studio model'
    ]
  }
];

export default function Awards() {
  const { content } = useContent();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAward, setSelectedAward] = useState(null);

  const awardsData = (content?.awards || DEFAULT_AWARDS).map(a => ({
    ...a,
    id: a.slug || a.id
  }));


  const activeAward = awardsData.find(a => a.id === selectedAward);

  const filteredAwards = activeTab === 'all' 
    ? awardsData 
    : awardsData.filter(award => award.category === activeTab);

  return (
    <div className="relative text-neutral-300 font-sans min-h-screen">
      
      {/* Background Ambience */}
      <div className="absolute top-[20%] left-1/4 w-[35vw] h-[35vw] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[60%] right-1/4 w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!selectedAward ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header Section */}
            <div className="text-center mb-16 relative z-10 pt-8">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
                // Company Honors
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
                Awards & Achievements
              </h1>
              <p className="font-light text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Celebrating technical excellence and creative design landmarks won by HariKrushn DigiVerse and our founders.
              </p>
            </div>

            {/* Interactive Tabs Menu */}
            <div className="flex justify-center items-center mb-16 relative z-20">
              <div className="bg-[#0c0c12] border border-white/5 p-1.5 rounded-full flex gap-2">
                {[
                  { id: 'all', label: 'All Achievements' },
                  { id: 'company', label: 'Company Awards' },
                  { id: 'founders', label: 'Founder Awards' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 font-mono tracking-wider ${
                      activeTab === tab.id 
                        ? 'bg-amber-400 text-black shadow-lg font-bold' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Awards Grid Container */}
            <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 mb-20">
              <motion.div 
                layout 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredAwards.map((award, index) => (
                    <AwardCard 
                      key={award.title} 
                      award={award} 
                      idx={index} 
                      onClick={() => setSelectedAward(award.id)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* DETAIL VIEW — Single Award Page */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {/* Back Button */}
            <div className="mb-10 px-4">
              <button
                onClick={() => setSelectedAward(null)}
                className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                <span>Back to Awards</span>
              </button>
            </div>

            {activeAward && (
              <div className="max-w-[1600px] w-full mx-auto px-4">
                {/* Hero Image */}
                <div 
                  className="relative h-72 sm:h-96 rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl" 
                  style={{ boxShadow: `0 30px 80px -20px rgba(251, 191, 36, 0.25)` }}
                >
                  <img src={activeAward.img} alt={activeAward.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-left">
                    <span className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-lg border bg-amber-500/10 text-amber-400 border-amber-500/20 inline-block mb-3">
                      {activeAward.year} // {activeAward.category === 'company' ? 'Company Award' : 'Founder Award'}
                    </span>
                    <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{activeAward.title}</h1>
                    <p className="font-mono text-sm text-neutral-400 mt-2">Awarded by {activeAward.by}</p>
                  </div>
                </div>

                {/* Impact Stats */}
                {activeAward.impactStats && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
                    {activeAward.impactStats.map(stat => (
                      <div key={stat.label} className="text-center p-6 rounded-2xl bg-[#050508]/40 border border-white/5 backdrop-blur-md">
                        <span className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400 block">{stat.value}</span>
                        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 mt-2 block">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Detailed Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-left">
                  <div className="md:col-span-2 space-y-6">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">Honorable Citation</h2>
                    <p className="font-light text-neutral-300 text-sm sm:text-base leading-relaxed">
                      {activeAward.longDescription}
                    </p>
                    <p className="font-light text-neutral-400 text-sm sm:text-base leading-relaxed">
                      At HariKrushn DigiVerse LLP, we thrive under the pressure of creating world-class digital applications. Receiving this honor from {activeAward.by} highlights our team's dedication to building high-fidelity products that set new standards in user experience, speed, and design precision.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 rounded-3xl bg-[#09090d]/60 border border-white/5 space-y-6">
                      <h3 className="font-display text-lg font-bold text-white tracking-tight">// Award Key Highlights</h3>
                      <ul className="space-y-4">
                        {activeAward.highlights && activeAward.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300 font-light">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-white/5 pt-4 flex items-center justify-between font-mono text-xs text-neutral-500">
                        <span>RECIPIENT:</span>
                        <span className="text-white font-bold">{activeAward.recipient}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
