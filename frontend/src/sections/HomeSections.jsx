import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import Magnetic from '../components/Magnetic';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ───────────────────── TESTIMONIALS DATA ───────────────────── */
const testimonialsData = [
  {
    id: 1,
    name: "Alexander Vance",
    role: "VP of Engineering, Saphira Aviation",
    quote: "HariKrushn DigiVerse completely transformed our fleet tracking CRM. Their engineering precision, combined with a meticulous design language, gave us a product that is both cinematic and lightning-fast. They operate at the highest level of craftsmanship.",
    rating: 5,
    avatar: "/images/gallery/avatar_alexander.png",
    color: "from-amber-500/10 to-orange-500/5",
    borderColor: "group-hover:border-amber-500/30",
    glowColor: "rgba(245,158,11,0.25)",
    tag: "CUSTOM CRM",
    tagClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    starClass: "text-amber-500",
    accentColor: "rgba(245,158,11,0.2)"
  },
  {
    id: 2,
    name: "Elena Rostova",
    role: "Co-Founder, Nova DeFi",
    quote: "Building a Web3 platform requires absolute trust and flawless UX. The team didn't just build our interfaces; they co-architected the user flow. Our transaction success rate increased by 40% after launching the new interface.",
    rating: 5,
    avatar: "/images/gallery/avatar_elena.png",
    color: "from-purple-500/10 to-indigo-500/5",
    borderColor: "group-hover:border-purple-500/30",
    glowColor: "rgba(168,85,247,0.25)",
    tag: "WEB3 PLATFORM",
    tagClass: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    starClass: "text-purple-500",
    accentColor: "rgba(168,85,247,0.2)"
  },
  {
    id: 3,
    name: "Marcus Thorn",
    role: "Head of Product, Core Logistics",
    quote: "Most agencies can code, but very few understand product flow like HariKrushn. They constructed our custom supply chain matrix from scratch, integrating AI-driven route prediction. Their work is clean, robust, and beautiful.",
    rating: 5,
    avatar: "/images/gallery/avatar_marcus.png",
    color: "from-emerald-500/10 to-teal-500/5",
    borderColor: "group-hover:border-emerald-500/30",
    glowColor: "rgba(16,185,129,0.25)",
    tag: "AI LOGISTICS",
    tagClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    starClass: "text-emerald-500",
    accentColor: "rgba(16,185,129,0.2)"
  }
];


const cardVariants = {
  left: (isMobile) => ({
    x: isMobile ? '-18%' : '-35%',
    scale: isMobile ? 0.82 : 0.85,
    rotateY: isMobile ? 12 : 25,
    zIndex: 10,
    opacity: isMobile ? 0.3 : 0.4,
  }),
  center: {
    x: '0%',
    scale: 1,
    rotateY: 0,
    zIndex: 30,
    opacity: 1,
  },
  right: (isMobile) => ({
    x: isMobile ? '18%' : '35%',
    scale: isMobile ? 0.82 : 0.85,
    rotateY: isMobile ? -12 : -25,
    zIndex: 10,
    opacity: isMobile ? 0.3 : 0.4,
  })
};

/* ───────────────────── SERVICE PREVIEWS DATA ───────────────────── */
const servicePreviews = {
  "01/07": {
    img: "/images/gallery/design_sprint.png",
    gradient: "from-blue-500 via-indigo-500 to-cyan-500"
  },
  "02/07": {
    img: "/images/gallery/digiverse_workspace.png",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500"
  },
  "03/07": {
    img: "/images/quantum_banking.png",
    gradient: "from-amber-500 via-orange-500 to-yellow-500"
  },
  "04/07": {
    img: "/images/gallery/launch_celebration.png",
    gradient: "from-rose-500 via-pink-500 to-purple-500"
  },
  "05/07": {
    img: "/images/gallery/cinematic_review.png",
    gradient: "from-pink-500 via-fuchsia-500 to-violet-500"
  },
  "06/07": {
    img: "/images/gallery/ai_orchestrator.png",
    gradient: "from-purple-500 via-violet-500 to-indigo-500"
  },
  "07/07": {
    img: "/images/gallery/hardware_calibration.png",
    gradient: "from-sky-500 via-blue-500 to-indigo-500"
  }
};

const getServicePreview = (num, idx) => {
  if (servicePreviews[num]) return servicePreviews[num];
  const keys = Object.keys(servicePreviews);
  const fallbackKey = keys[idx % keys.length];
  return servicePreviews[fallbackKey];
};

const BrandLogo = ({ name }) => {
  return (
    <img 
      src={`/images/logos/${name.toLowerCase()}_logo.png`} 
      alt={`${name} Logo`} 
      className="w-14 h-14 object-contain mr-3 mix-blend-screen opacity-70" 
      onError={(e) => {
        // Fallback in case image is missing
        e.target.style.display = 'none';
      }}
    />
  );
};

export default function HomeSections({ overrideContent }) {
  const { content: globalContent } = useContent();
  const activeContent = overrideContent || globalContent;
  const { stats, services, sectors } = activeContent;

  const [activeImage, setActiveImage] = useState(null);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [isCaseStudyVisible, setIsCaseStudyVisible] = useState(false);
  const caseStudyRef = useRef(null);

  const [activeTestimonial, setActiveTestimonial] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Framer Motion values for 3D card tilt
  const xValue = useMotionValue(0);
  const yValue = useMotionValue(0);
  
  // Spring settings for smoothing the card tilt
  const tiltX = useSpring(yValue, { stiffness: 200, damping: 25 });
  const tiltY = useSpring(xValue, { stiffness: 200, damping: 25 });
  
  // Map value ranges to rotation angles (limited to -10 to 10 degrees)
  const rotateX = useTransform(tiltX, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(tiltY, [-0.5, 0.5], [-10, 10]);

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    xValue.set((mouseX / width) - 0.5);
    yValue.set((mouseY / height) - 0.5);
  };

  const handleCardMouseLeave = () => {
    xValue.set(0);
    yValue.set(0);
  };

  // Drag Gesture Handler
  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    if (offset < -100 || velocity < -500) {
      handleNext();
    } else if (offset > 100 || velocity > 500) {
      handlePrev();
    }
  };


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const handleNext = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonialsData.length);
  };

  const handleCardClick = (idx) => {
    if (idx === activeTestimonial) return;
    setActiveTestimonial(idx);
  };

  const getPosition = (index) => {
    if (index === activeTestimonial) return 'center';
    if ((activeTestimonial - 1 + testimonialsData.length) % testimonialsData.length === index) return 'left';
    return 'right';
  };


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCaseStudyVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    const currentRef = caseStudyRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const visibleStats = stats.filter(stat => stat.show !== false);
  const visibleServices = services.filter(service => service.show !== false);

  const handleMouseMove = (e) => {
    setMouseCoords({ x: e.clientX, y: e.clientY });
  };

  // Determine grid columns dynamically based on visible stats count
  const gridColsClass = visibleStats.length === 1 
    ? 'grid-cols-1' 
    : visibleStats.length === 2 
    ? 'grid-cols-1 md:grid-cols-2' 
    : visibleStats.length === 3 
    ? 'grid-cols-1 md:grid-cols-3' 
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="bg-[#0c0c0c] text-[#e5e2e1] font-sans relative z-10 border-t border-white/5">
      {/* Stats Row */}
      {visibleStats.length > 0 && (
        <section className={`border-b border-white/5 grid ${gridColsClass} max-w-[1600px] w-full mx-auto`}>
          {visibleStats.map((stat, i) => (
            <div 
              key={stat.label || i} 
              className={`p-12 space-y-2 border-b md:border-b-0 border-white/5 ${
                i < visibleStats.length - 1 ? 'lg:border-r' : ''
              }`}
            >
              <div className="font-display text-5xl sm:text-6xl font-bold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 font-light">
                {stat.label}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Brand Ticker */}
      <div className="py-12 border-b border-white/5 overflow-hidden bg-black/40">
        <div className="flex whitespace-nowrap animate-scroll">
          <div className="flex gap-24 items-center px-12">
            {['SAPHIRA', 'NOVA', 'CORE', 'AETHER', 'QUANTUM', 'VERTEX', 'HELIOS', 'ORION', 'AXIOM'].map((brand) => (
              <span key={brand} className="inline-flex items-center font-display text-4xl font-extrabold text-white tracking-wider">
                <BrandLogo name={brand} />
                <span className="opacity-25">{brand}</span>
              </span>
            ))}
          </div>
          <div className="flex gap-24 items-center px-12" aria-hidden="true">
            {['SAPHIRA', 'NOVA', 'CORE', 'AETHER', 'QUANTUM', 'VERTEX', 'HELIOS', 'ORION', 'AXIOM'].map((brand) => (
              <span key={brand + '-clone'} className="inline-flex items-center font-display text-4xl font-extrabold text-white tracking-wider">
                <BrandLogo name={brand} />
                <span className="opacity-25">{brand}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Service Index */}
      <section 
        className="py-32 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1600px] w-full mx-auto relative"
        onMouseMove={handleMouseMove}
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-8 h-[0.5px] bg-white opacity-40"></span>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">// What we do</p>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">Service Index [ {visibleServices.length} CAPABILITIES ]</h2>
          </div>
          <div className="max-w-xs text-neutral-400 font-light text-xs sm:text-sm leading-relaxed">
            Deploying deep technical expertise across the entire product lifecycle, from initial architectural blueprint to scaled AI deployment.
          </div>
        </div>

        <div className="border-t border-white/5 relative">
          {visibleServices.map((service, idx) => {
            const preview = getServicePreview(service.num, idx);
            return (
              <a 
                key={service.num || idx} 
                href={service.href}
                className="group py-10 border-b border-white/5 grid grid-cols-12 gap-6 items-center hover:bg-white/[0.01] transition-colors duration-300 px-4 -mx-4 rounded-xl cursor-pointer block relative overflow-hidden"
                onMouseEnter={() => setActiveImage(preview.img)}
                onMouseLeave={() => setActiveImage(null)}
              >
                {/* 1. Slide Number to Arrow Animation */}
                <div className="col-span-2 font-mono text-xs text-neutral-500 font-light overflow-hidden h-5 relative">
                  <div className="transition-transform duration-500 ease-in-out transform group-hover:-translate-y-full">
                    {service.num}
                  </div>
                  <div className="transition-transform duration-500 ease-in-out transform absolute top-0 left-0 translate-y-full group-hover:translate-y-0 text-white font-bold">
                    →
                  </div>
                </div>

                <div className="col-span-10 md:col-span-4 font-display text-base sm:text-lg font-semibold text-white group-hover:text-neutral-200 transition-colors">
                  {service.title}
                </div>
                <div className="col-span-12 md:col-span-4 font-light text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  {service.desc}
                </div>
                <div className="col-span-12 md:col-span-2 flex flex-wrap gap-2 md:justify-end z-10">
                  {service.tags && service.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 border border-white/10 rounded bg-white/[0.01] text-[9px] font-mono tracking-widest text-neutral-400 font-light">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 2. Neon Underline Animation */}
                <div 
                  className={`absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r ${preview.gradient} transition-all duration-500 group-hover:w-full z-10`}
                  style={{
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
                  }}
                />
              </a>
            );
          })}
        </div>

        {/* 3 & 4. Floating Preview Image & Cursor Follower */}
        {activeImage && (
          <div 
            className="fixed pointer-events-none z-50 transition-all duration-300 ease-out select-none hidden lg:block"
            style={{
              left: mouseCoords.x + 24,
              top: mouseCoords.y + 24,
              transform: 'translate(0, -50%)',
            }}
          >
            <div className="bg-[#050508]/90 border border-white/10 p-2.5 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-fadeIn">
              <img src={activeImage} alt="Service Preview" className="w-[200px] h-[140px] object-cover rounded-xl border border-white/5" />
              <div className="mt-2 text-center">
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-neutral-400">
                  Explore Capability
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Featured Case Study */}
      <section className="py-32 bg-black/60 border-t border-b border-white/5">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Aesthetic Visual Frame */}
            <div ref={caseStudyRef} className="order-2 lg:order-1 relative group cursor-pointer">
              <div className="w-full aspect-square bg-[#101010] border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Generated Mockup Image */}
                <img 
                  src="/images/gallery/digiverse_workspace.png" 
                  alt="AeroCRM Workspace" 
                  className={`w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-[1.02] ${
                    isCaseStudyVisible ? 'grayscale-0' : 'grayscale'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 font-mono text-[9px] tracking-widest text-neutral-400 uppercase bg-black/60 px-3 py-1.5 rounded-md backdrop-blur-sm border border-white/5">
                  Simulation [CRM.v1]
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img 
                    src="/images/logos/aerocrm_logo.png" 
                    alt="AeroCRM Logo" 
                    className="w-14 h-14 object-contain mix-blend-screen opacity-90"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">// LATEST CLIENT WORK</p>
                    <h3 className="font-display text-lg font-bold text-white tracking-wide">AeroCRM Aviation</h3>
                  </div>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">Custom Cloud CRM Platform</h2>
              </div>

              <div className="space-y-4 border-t border-white/5 pt-8">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">What we built:</p>
                <ul className="space-y-3 font-light text-neutral-400 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span>Constructed custom CRM dashboards with automated lead tracking pipelines</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span>Built secure client management portal and transaction records matrix</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span>Integrated automated contract signing and PDF invoice generators</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <a href="#case-study" className="inline-flex items-center gap-3 group cursor-pointer">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white border-b border-white pb-1">
                    View Case Study Details
                  </span>
                  <svg className="w-4 h-4 text-white group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium 3D Stack Testimonials Section */}
      <section className="py-32 px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 border-t border-b border-white/5 bg-black/30 relative overflow-hidden">
        {/* Dynamic ambient color-shifting background glow */}
        <div 
          className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none opacity-40 blur-[120px] z-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${testimonialsData[activeTestimonial].glowColor}, transparent 65%)`
          }}
        />
        
        <div className="max-w-[1600px] w-full mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-20">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-8 h-[0.5px] bg-white opacity-40"></span>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">// Client Perspectives</p>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">Trusted by pioneers.</h2>
            </div>
            <div className="max-w-xs text-neutral-400 font-light text-xs sm:text-sm leading-relaxed">
              Read what industry leaders say about our custom software engineering, high-fidelity interfaces, and digital architectures.
            </div>
          </div>

          {/* 3D Stack Container */}
          <div 
            className="relative flex items-center justify-center h-[460px] md:h-[420px] select-none w-full"
            style={{ perspective: "1200px" }}
          >
            {testimonialsData.map((testimonial, idx) => {
              const position = getPosition(idx);
              const isActive = position === 'center';
              
              return (
                <motion.div
                  key={testimonial.id}
                  custom={isMobile}
                  variants={cardVariants}
                  animate={position}
                  initial={position}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 26,
                  }}
                  // Drag bindings on center card
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={isActive ? handleDragEnd : undefined}
                  // Interactive 3D tilt on center card
                  onMouseMove={isActive ? handleCardMouseMove : undefined}
                  onMouseLeave={isActive ? handleCardMouseLeave : undefined}
                  onClick={() => handleCardClick(idx)}
                  className={`absolute w-full max-w-[580px] p-8 md:p-10 rounded-3xl bg-[#0e0e13]/85 backdrop-blur-xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] flex flex-col justify-between group transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.9)] cursor-pointer z-10`}
                  style={{
                    transformStyle: "preserve-3d",
                    boxShadow: isActive 
                      ? `0 25px 60px -15px ${testimonial.glowColor}` 
                      : '0 25px 60px -15px rgba(0,0,0,0.8)',
                    // Spring-smoothed tilt applied only to center card
                    rotateX: isActive ? rotateX : undefined,
                    rotateY: isActive ? rotateY : undefined,
                  }}
                >
                  {/* Glowing Accent */}
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${testimonial.color} rounded-full filter blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none`} />

                  {/* Top Row: Quotes & Project Tag */}
                  <div className="flex justify-between items-start relative z-10">
                    <span className="font-serif text-6xl text-white/10 select-none -mt-4 transition-colors duration-500 group-hover:text-white/20">“</span>
                    <span className={`px-3.5 py-1 border rounded text-[9px] font-mono tracking-widest font-light transition-all duration-500 ${testimonial.tagClass}`}>
                      {testimonial.tag}
                    </span>
                  </div>

                  {/* Body Quote */}
                  <div className="my-6 relative z-10">
                    <p className="text-neutral-200 font-light text-sm sm:text-base leading-relaxed italic">
                      {testimonial.quote}
                    </p>
                  </div>

                  {/* Bottom Row: Client Info & Star Rating */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 transition-all shadow-lg">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold text-white group-hover:text-neutral-200 transition-colors">
                          {testimonial.name}
                        </h4>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-light mt-0.5">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 fill-current transition-colors duration-500 ${testimonial.starClass}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-10">
            <Magnetic speed={0.5}>
              <button 
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-white/10 bg-[#0a0a0f]/40 backdrop-blur-sm text-neutral-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center cursor-pointer group"
                aria-label="Previous testimonial"
              >
                <span className="group-hover:-translate-x-0.5 transition-transform duration-300">←</span>
              </button>
            </Magnetic>
            
            <div className="flex gap-2.5">
              {testimonialsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleCardClick(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeTestimonial 
                      ? 'bg-white w-6 shadow-[0_0_8px_rgba(255,255,255,0.6)]' 
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <Magnetic speed={0.5}>
              <button 
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-white/10 bg-[#0a0a0f]/40 backdrop-blur-sm text-neutral-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center cursor-pointer group"
                aria-label="Next testimonial"
              >
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">→</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </section>



      {/* Bottom CTA */}
      <section className="py-40 px-4 sm:px-6 md:px-8 lg:px-12 text-center max-w-[1600px] w-full mx-auto">
        <div className="space-y-10">
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight text-white">
            Let's build the <span className="text-neutral-400 font-light italic">future together.</span>
          </h2>
          <div className="flex justify-center pt-4">
            <a href="#contact" className="glass-btn px-12 py-5 rounded-full text-xs uppercase tracking-[0.2em] font-medium text-white shadow-md inline-block">
              Start a Project →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
