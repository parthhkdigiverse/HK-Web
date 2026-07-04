import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ────────────────────────── VENTURES DATA ────────────────────────── */
const ventures = [
  {
    id: 'aisetu',
    name: 'AI Setu',
    tagline: 'Bridging India to AI',
    status: 'Active',
    img: '/images/ventures/aisetu.png',
    color: 'cyan',
    accentColor: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.20)',
    shortDesc: 'A national-scale AI literacy and integration initiative designed to democratize artificial intelligence across Tier-2 and Tier-3 cities of India.',
    fullDescription: 'AI Setu (meaning "AI Bridge") is our flagship social-impact venture aimed at making artificial intelligence accessible, understandable, and usable for every Indian citizen — regardless of their technical background. We believe AI should not remain an urban privilege. From local shopkeepers to rural entrepreneurs, AI Setu bridges the knowledge gap through vernacular workshops, ready-to-deploy AI toolkits, and community-driven learning hubs.',
    mission: 'To create a seamless bridge between cutting-edge AI technology and India\'s diverse population, enabling 10 million people to leverage AI tools for business, education, and governance by 2030.',
    vision: 'An India where every citizen, regardless of geography or language, can harness the power of AI to improve their livelihood, education, and community governance.',
    keyInitiatives: [
      { title: 'Vernacular AI Workshops', desc: 'Free monthly workshops in Hindi, Gujarati, Tamil, Telugu, and Marathi teaching AI basics, prompt engineering, and tool usage to local entrepreneurs and students.' },
      { title: 'AI Toolkit for SMEs', desc: 'Pre-built AI templates for invoice processing, customer support chatbots, inventory prediction, and marketing automation — all in regional languages.' },
      { title: 'AI Setu Fellowship', desc: 'A 6-month paid fellowship for graduates from Tier-2/3 cities to learn AI engineering and get placed in top tech companies.' },
      { title: 'Open-Source AI Hub', desc: 'A public repository of AI models fine-tuned for Indian languages, agriculture, healthcare diagnostics, and legal document processing.' },
      { title: 'Government Partnership Program', desc: 'Collaborating with state governments to integrate AI-powered dashboards for public health monitoring, education tracking, and agricultural advisory systems.' },
      { title: 'AI Setu Mobile App', desc: 'A mobile-first platform offering bite-sized AI courses, real-time translation tools, and a community forum — all optimized for low-bandwidth networks.' }
    ],
    impactStats: [
      { label: 'Cities Reached', value: '25+' },
      { label: 'Workshops Conducted', value: '100+' },
      { label: 'Lives Impacted', value: '50K+' },
      { label: 'AI Models Released', value: '15+' }
    ],
    techStack: ['Python', 'FastAPI', 'LangChain', 'React Native', 'PostgreSQL', 'Hugging Face'],
    partners: ['IIT Research Labs', 'State Skill Missions', 'Google for Startups', 'NASSCOM']
  },
  {
    id: 'bef',
    name: 'BEF',
    tagline: 'Business Entrepreneurship Forum',
    status: 'Active',
    img: '/images/ventures/bef.png',
    color: 'amber',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.20)',
    shortDesc: 'A premier entrepreneurship community and accelerator platform connecting young founders, investors, and mentors across Gujarat and India.',
    fullDescription: 'The Business Entrepreneurship Forum (BEF) is our community-driven initiative to nurture the next generation of Indian entrepreneurs. Founded with the belief that great ideas should never die due to lack of guidance or capital, BEF provides a structured ecosystem where aspiring founders can pitch ideas, receive mentorship from seasoned entrepreneurs, connect with angel investors, and access co-working infrastructure.',
    mission: 'To build India\'s most impactful grassroots entrepreneurship ecosystem that transforms 1,000 ideas into funded, scalable startups by 2028.',
    vision: 'A thriving startup culture in every Indian city where entrepreneurship is not a privilege but an accessible career path for ambitious youth.',
    keyInitiatives: [
      { title: 'Monthly Pitch Nights', desc: 'Open-mic style pitch events where founders present ideas to a panel of investors and industry experts. Top pitches receive seed funding commitments on the spot.' },
      { title: 'Founder Mentorship Program', desc: '12-week structured mentorship pairing first-time founders with experienced entrepreneurs covering product-market fit, fundraising, legal setup, and scaling strategies.' },
      { title: 'BEF Startup Accelerator', desc: 'A 6-month intensive accelerator program providing ₹5-10 lakh seed capital, office space, technical support, and investor demo day for selected startups.' },
      { title: 'Investor Connect Network', desc: 'A curated network of 100+ angel investors and VC funds actively looking to invest in early-stage startups across fintech, healthtech, edtech, and D2C.' },
      { title: 'BEF Annual Summit', desc: 'A flagship 2-day conference bringing together 2,000+ entrepreneurs, 50+ investors, and 30+ speakers for keynotes, panels, networking, and startup expo.' },
      { title: 'Campus Entrepreneur Program', desc: 'Partnering with 50+ colleges across Gujarat to identify student entrepreneurs, provide incubation support, and create a campus-to-startup pipeline.' }
    ],
    impactStats: [
      { label: 'Startups Incubated', value: '75+' },
      { label: 'Funding Raised', value: '₹5Cr+' },
      { label: 'Active Mentors', value: '50+' },
      { label: 'Community Members', value: '10K+' }
    ],
    techStack: ['Next.js', 'PostgreSQL', 'Stripe', 'Zoom API', 'Firebase', 'Notion API'],
    partners: ['Gujarat University', 'TiE Surat', 'Startup India', 'CIIE IIM-A']
  },
  {
    id: 'nationbuilder',
    name: 'Nation Builder',
    tagline: 'Building Digital India Together',
    status: 'Active',
    img: '/images/ventures/nationbuilder.png',
    color: 'emerald',
    accentColor: '#10b981',
    glowColor: 'rgba(16,185,129,0.20)',
    shortDesc: 'A civic-tech initiative building open-source digital governance tools, smart city dashboards, and citizen engagement platforms for modern India.',
    fullDescription: 'Nation Builder is our most ambitious venture — a civic-technology platform designed to empower citizens, strengthen local governance, and accelerate India\'s digital transformation at the grassroots level. We build open-source tools that help municipal corporations, panchayats, and state departments digitize services, track development projects, and engage citizens transparently.',
    mission: 'To digitize and democratize local governance across 500 Indian cities and 5,000 villages by building transparent, accessible, and efficient civic technology platforms.',
    vision: 'A digitally empowered India where every citizen can track government spending, access public services online, and participate in local decision-making through technology.',
    keyInitiatives: [
      { title: 'Smart City Dashboard', desc: 'Real-time dashboards tracking infrastructure projects, budget allocation, water supply, electricity, and waste management metrics for municipal corporations.' },
      { title: 'Citizen Feedback Portal', desc: 'A mobile-first complaint and suggestion platform where citizens can report issues (pothole, water leak, garbage), track resolution status, and rate service quality.' },
      { title: 'Digital Panchayat System', desc: 'A simplified digital governance toolkit for village panchayats covering meeting minutes, budget tracking, scheme distribution, and villager communication.' },
      { title: 'Open Data India', desc: 'A public data portal publishing anonymized government datasets on education, health, infrastructure, and economy for researchers, journalists, and policy makers.' },
      { title: 'E-Governance Training', desc: 'Training programs for government officials on using digital tools, data analysis, cybersecurity basics, and transparent reporting standards.' },
      { title: 'Youth Policy Fellowship', desc: 'A 3-month fellowship for young graduates to work directly with district collectors and municipal commissioners on data-driven policy implementation.' }
    ],
    impactStats: [
      { label: 'Cities Onboarded', value: '15+' },
      { label: 'Citizen Reports Processed', value: '1L+' },
      { label: 'Government Partners', value: '25+' },
      { label: 'Open Datasets Published', value: '200+' }
    ],
    techStack: ['React', 'FastAPI', 'PostgreSQL', 'Docker', 'Mapbox', 'D3.js'],
    partners: ['NITI Aayog', 'Smart Cities Mission', 'Digital India', 'IIM Ahmedabad']
  }
];

export default function Ventures() {
  const [selectedVenture, setSelectedVenture] = useState(null);

  const activeVenture = ventures.find(v => v.id === selectedVenture);

  return (
    <div className="relative text-neutral-300 font-sans">
      {/* Background ambience */}
      <div className="absolute top-[10%] left-1/4 w-[35vw] h-[35vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[55%] right-1/4 w-[30vw] h-[30vw] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!selectedVenture ? (
          /* ══════════════════════════════════════════════════
              LISTING VIEW — All Ventures
              ══════════════════════════════════════════════════ */
          <motion.div
            key="listing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="text-center mb-20 pt-8 relative z-10">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
                // Our Initiatives
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
                Digiverse Ventures
              </h1>
              <p className="font-light text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Beyond client work, we build, incubate, and run initiatives that create lasting social and economic impact across India.
              </p>
            </div>

            {/* Venture Cards */}
            <div className="flex flex-col gap-10 max-w-7xl mx-auto px-4 relative z-10 mb-20">
              {ventures.map((venture, index) => (
                <motion.div
                  key={venture.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  onClick={() => setSelectedVenture(venture.id)}
                  className="cursor-pointer group"
                >
                  <div 
                    className="bg-[#050508]/60 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 shadow-2xl relative"
                    style={{ boxShadow: `0 20px 60px -20px ${venture.glowColor}` }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {/* Image Side */}
                      <div className="relative h-64 lg:h-auto overflow-hidden">
                        <img 
                          src={venture.img} 
                          alt={venture.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050508]/80 hidden lg:block" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent lg:hidden" />
                        <div className="absolute top-5 left-5">
                          <span className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg border bg-${venture.color}-500/10 text-${venture.color}-400 border-${venture.color}-500/20 backdrop-blur-sm`}>
                            {venture.status}
                          </span>
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="p-8 lg:p-10 flex flex-col justify-center space-y-5">
                        <div>
                          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-neutral-100 transition-colors">{venture.name}</h2>
                          <span className={`font-mono text-xs uppercase tracking-widest text-${venture.color}-400 mt-1 block`}>{venture.tagline}</span>
                        </div>
                        <p className="font-light text-neutral-400 text-sm sm:text-base leading-relaxed">{venture.shortDesc}</p>
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          {venture.impactStats.slice(0, 4).map(stat => (
                            <div key={stat.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                              <span className={`font-display text-lg font-extrabold text-${venture.color}-400 block`}>{stat.value}</span>
                              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{stat.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 pt-2">
                          <span className={`font-mono text-xs uppercase tracking-widest text-${venture.color}-400 group-hover:text-${venture.color}-300 transition-colors`}>
                            Explore {venture.name}
                          </span>
                          <span className="text-white/40 group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ══════════════════════════════════════════════════
              DETAIL VIEW — Single Venture Page
              ══════════════════════════════════════════════════ */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {/* Back Button */}
            <button
              onClick={() => setSelectedVenture(null)}
              className="flex items-center gap-2 mb-10 font-mono text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer group px-4"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
              <span>Back to Ventures</span>
            </button>

            {activeVenture && (
              <div className="max-w-7xl mx-auto px-4">
                {/* Hero Image */}
                <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl" style={{ boxShadow: `0 30px 80px -20px ${activeVenture.glowColor}` }}>
                  <img src={activeVenture.img} alt={activeVenture.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <span className={`font-mono text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-lg border bg-${activeVenture.color}-500/10 text-${activeVenture.color}-400 border-${activeVenture.color}-500/20 inline-block mb-3`}>
                      {activeVenture.status}
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{activeVenture.name}</h1>
                    <p className={`font-mono text-sm text-${activeVenture.color}-400 mt-2`}>{activeVenture.tagline}</p>
                  </div>
                </div>

                {/* Impact Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
                  {activeVenture.impactStats.map(stat => (
                    <div key={stat.label} className="text-center p-6 rounded-2xl bg-[#050508]/40 border border-white/5 backdrop-blur-md">
                      <span className={`font-display text-2xl sm:text-3xl font-extrabold text-${activeVenture.color}-400 block`}>{stat.value}</span>
                      <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 mt-2 block">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  <div className="p-8 rounded-3xl bg-[#09090d]/60 border border-white/5">
                    <div className={`w-12 h-12 rounded-2xl bg-${activeVenture.color}-500/10 border border-${activeVenture.color}-500/20 flex items-center justify-center mb-5`}>
                      <svg className={`w-5 h-5 text-${activeVenture.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="font-display text-lg font-bold text-white mb-3">Our Mission</h3>
                    <p className="font-light text-neutral-400 text-xs sm:text-sm leading-relaxed">{activeVenture.mission}</p>
                  </div>
                  <div className="p-8 rounded-3xl bg-[#09090d]/60 border border-white/5">
                    <div className={`w-12 h-12 rounded-2xl bg-${activeVenture.color}-500/10 border border-${activeVenture.color}-500/20 flex items-center justify-center mb-5`}>
                      <svg className={`w-5 h-5 text-${activeVenture.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <h3 className="font-display text-lg font-bold text-white mb-3">Our Vision</h3>
                    <p className="font-light text-neutral-400 text-xs sm:text-sm leading-relaxed">{activeVenture.vision}</p>
                  </div>
                </div>

                {/* About */}
                <div className="mb-16">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block mb-4">// About {activeVenture.name}</span>
                  <p className="font-light text-neutral-300 text-sm sm:text-base leading-relaxed max-w-4xl">{activeVenture.fullDescription}</p>
                </div>

                {/* Key Initiatives */}
                <div className="mb-16">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block mb-6">// Key Initiatives</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {activeVenture.keyInitiatives.map((item, idx) => (
                      <div key={item.title} className={`p-6 rounded-2xl bg-[#050508]/40 border border-white/5 hover:border-${activeVenture.color}-500/20 transition-all duration-300 space-y-3`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-${activeVenture.color}-500/10 border border-${activeVenture.color}-500/20 flex items-center justify-center`}>
                            <span className={`font-mono text-xs font-bold text-${activeVenture.color}-400`}>{String(idx + 1).padStart(2, '0')}</span>
                          </div>
                          <h4 className="font-display font-bold text-white text-sm">{item.title}</h4>
                        </div>
                        <p className="font-light text-neutral-400 text-[11px] sm:text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack + Partners */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  <div className="space-y-4">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block">// Tech Stack</span>
                    <div className="flex flex-wrap gap-2">
                      {activeVenture.techStack.map(t => (
                        <span key={t} className={`font-mono text-[9px] uppercase tracking-widest text-${activeVenture.color}-400 bg-${activeVenture.color}-500/5 border border-${activeVenture.color}-500/15 px-3 py-1.5 rounded-lg`}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block">// Partners & Collaborators</span>
                    <div className="flex flex-wrap gap-2">
                      {activeVenture.partners.map(p => (
                        <span key={p} className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-lg">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center py-16 border-t border-white/5">
                  <h3 className="font-display text-2xl font-bold text-white mb-4">Interested in {activeVenture.name}?</h3>
                  <p className="font-light text-neutral-400 text-sm mb-8 max-w-lg mx-auto">Whether you want to collaborate, invest, volunteer, or simply learn more — we'd love to hear from you.</p>
                  <button 
                    onClick={() => { window.location.hash = '#contact'; }}
                    className={`bg-${activeVenture.color}-500 text-black px-8 py-4 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg`}
                  >
                    Get in Touch
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
