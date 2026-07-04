import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Blogs() {
  const [selectedPost, setSelectedPost] = useState(null);

  const posts = [
    {
      id: "microservices",
      title: "Re-architecting Enterprise Microservices for Scale",
      desc: "How we transitioned a legacy monolithic platform into a high-availability microservices mesh capable of millions of transactions.",
      date: "JUNE 24, 2026",
      category: "ENGINEERING",
      readTime: "5 MIN READ",
      image: "/images/gallery/ai_orchestrator.png",
      author: "Radhe Patel (CEO)",
      longContent: [
        "At HariKrushn DigiVerse, we frequently consult with enterprise firms running legacy monolithic codebases. Over time, these platforms struggle to maintain performance under high concurrent user load, leading to database lockups and downtime. In this deep dive, we walk through our engineering strategy for decomposing a core monolithic financial transactional ledger into a fully distributed microservices mesh.",
        "We began by establishing strict boundaries using domain-driven design (DDD). By separating user authentication, transactional ledger records, billing details, and analytics into independent services, we isolated computational dependencies. We chose FastAPI for our REST endpoints and compiled them into lightweight Docker containers orchestrated by Kubernetes.",
        "A key challenge was maintaining transaction consistency across services without introducing blocking locks. We implemented the Saga design pattern using an asynchronous message broker (RabbitMQ) to trigger compensating transactions in case of failure. Additionally, we placed a Redis Sentinel caching grid in front of hot database tables, reducing average response latency from 450ms to less than 15ms.",
        "The resulting network now easily scales to handle millions of transactions daily, providing our enterprise clients with absolute reliability, auto-scaling, and a clean interface to integrate emerging internal apps."
      ],
      highlights: [
        "Reduced response latency from 450ms to 15ms",
        "Implemented Saga Pattern for transaction safety",
        "Containerized orchestration with Auto-Scaling Kubernetes"
      ]
    },
    {
      id: "cinematic-design",
      title: "The Art of Cinematic Web Design",
      desc: "Exploring the boundary between luxury brand aesthetics, smooth WebGL canvasses, and interactive scroll animations.",
      date: "MAY 18, 2026",
      category: "DESIGN",
      readTime: "4 MIN READ",
      image: "/images/gallery/cinematic_review.png",
      author: "Prince Patel (Partner)",
      longContent: [
        "Traditional web development prioritizes static layout grids. However, high-end brands require digital environments that evoke emotion, establish premium status, and tell a memorable visual story. Cinematic web design bridges this gap by merging classic layout logic with WebGL graphics, custom typography matrices, and dynamic scroll physics.",
        "When we set out to build HariKrushn's design system, we established a strict set of visual parameters. Every hover state should feel responsive, utilizing custom cursor interactions to guide the user. Every transition should utilize smooth spring physics (via Framer Motion) to mimic the natural inertia of real-world materials.",
        "Furthermore, we utilize asset lazy-loading and GPU-accelerated canvas layers to ensure that complex animation-heavy websites load instantly. By separating heavy visual logic onto background threads and rendering only viewport-adjacent nodes, we achieve 120 FPS scrolling interactions even on legacy mobile devices.",
        "Ultimately, cinematic design is not about decoration. It is about crafting an interactive virtual space where brand values are communicated through motion, light, and editorial detail."
      ],
      highlights: [
        "Maintained consistent 120 FPS viewport transitions",
        "Designed fluid glassmorphism component libraries",
        "Engineered custom cursor tracking algorithms"
      ]
    },
    {
      id: "ai-agents",
      title: "Integrating Advanced AI Agents in CRM Systems",
      desc: "A technical walkthrough of building automated database query flows and vector search engines into modern SaaS apps.",
      date: "APRIL 02, 2026",
      category: "AI & SYSTEMS",
      readTime: "7 MIN READ",
      image: "/images/gallery/digiverse_workspace.png",
      author: "Radhe Patel (CEO)",
      longContent: [
        "Integrating Large Language Models (LLMs) into customer relationship platforms (CRMs) has evolved beyond basic chatbot widgets. Today's enterprise applications require autonomous AI agents capable of querying live databases, executing workflows, and preparing data briefs without human intervention.",
        "In this technical guide, we outline our architecture for building AI agents that operate directly inside client-managed CRM systems. We utilize a secure prompt-cache compilation layer to reduce API latency. When a user requests an analytical summary, the agent utilizes a secure semantic router to match the query to a pre-authorized SQL template.",
        "To maintain data security, the agent operates in an isolated execution sandbox. Telemetry data is stripped of personally identifiable information (PII) before it is passed to cloud-hosted LLM endpoints. For highly sensitive operations, we deploy decentralized local LLM clusters within the client's private VPC.",
        "By automating database queries, client categorization, and response drafting, our AI integrations have increased operational efficiency for our clients by more than 10x, enabling teams to focus on relationship management rather than database navigation."
      ],
      highlights: [
        "Developed secure sandboxed execution environments",
        "Reduced API costs with semantic prompt caching",
        "Deployed private local LLM clusters for VPC security"
      ]
    }
  ];

  const activePost = posts.find(p => p.id === selectedPost);

  return (
    <div className="relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full filter blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!selectedPost ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-20 pt-8">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
                // Insights
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">Our Blogs</h1>
              <p className="font-light text-neutral-400 text-base max-w-xl mx-auto leading-relaxed">
                Deep dives, technical briefs, and design theories from the HariKrushn engineering studio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 px-4">
              {posts.map((post) => (
                <article 
                  key={post.title} 
                  onClick={() => setSelectedPost(post.id)}
                  className="group bg-[#050508]/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-white/12 transition-all duration-500 flex flex-col justify-between cursor-pointer text-left"
                >
                  <div>
                    <div className="w-full aspect-[16/10] overflow-hidden relative">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-102 transition-all duration-750" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </div>
                    <div className="p-7 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 border border-white/10 rounded bg-white/[0.02] text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-light">
                          {post.category}
                        </span>
                        <span className="font-mono text-xs text-neutral-500 font-light">{post.readTime}</span>
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-neutral-200 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="font-light text-neutral-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {post.desc}
                      </p>
                    </div>
                  </div>
                  <div className="p-7 pt-0 border-t border-white/5 mt-4 flex items-center justify-between">
                    <span className="font-mono text-xs text-neutral-500 font-light">{post.date}</span>
                    <span className="font-mono text-xs uppercase text-white group-hover:translate-x-1.5 transition-transform duration-300 inline-flex items-center gap-1.5 font-medium">
                      Read →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        ) : (
          /* DETAIL VIEW — Single Blog Page */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {/* Back Button */}
            <div className="mb-10 px-4 text-left">
              <button
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                <span>Back to Blogs</span>
              </button>
            </div>

            {activePost && (
              <div className="max-w-[1600px] w-full mx-auto px-4">
                {/* Hero Image */}
                <div 
                  className="relative h-72 sm:h-96 rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl" 
                  style={{ boxShadow: `0 30px 80px -20px rgba(255, 255, 255, 0.05)` }}
                >
                  <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-left">
                    <span className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-lg border bg-white/5 text-white border-white/10 inline-block mb-3">
                      {activePost.category} // {activePost.readTime}
                    </span>
                    <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{activePost.title}</h1>
                    <p className="font-mono text-sm text-neutral-400 mt-2">Published: {activePost.date}</p>
                  </div>
                </div>

                {/* Detailed Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-left">
                  <div className="md:col-span-2 space-y-6">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">Article Narrative</h2>
                    <div className="space-y-6">
                      {activePost.longContent.map((paragraph, idx) => (
                        <p key={idx} className="font-light text-neutral-300 text-sm sm:text-base leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 rounded-3xl bg-[#09090d]/60 border border-white/5 space-y-6">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">WRITTEN BY:</span>
                        <h4 className="font-display text-base font-bold text-white tracking-tight">{activePost.author}</h4>
                      </div>

                      <div className="border-t border-white/5 pt-6">
                        <h3 className="font-display text-sm font-bold text-white tracking-tight mb-4">// Key Insights</h3>
                        <ul className="space-y-4">
                          {activePost.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300 font-light">
                              <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2 flex-shrink-0" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
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
