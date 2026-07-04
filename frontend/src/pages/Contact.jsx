import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ────────────────────────── OFFICE DATA ────────────────────────── */
const offices = [
  {
    id: 'surat',
    city: 'Surat',
    country: 'INDIA',
    role: 'Headquarters',
    address: 'Silver Trade Center, 501 & 502, near Pragati IT Park, Mota Varachha, Surat, Gujarat 394101',
    phone: '+91 98765 43210',
    timeZone: 'Asia/Kolkata',
    isHQ: true,
    color: 'border-emerald-500/10 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  }
];

/* ────────────────────────── FAQ DATA ────────────────────────── */
const faqs = [
  { q: 'How quickly do you respond to inquiries?', a: 'We aim to respond to every inquiry within 2-4 business hours during working days (Mon-Sat). Urgent project queries are prioritized and may receive a response within 30 minutes.' },
  { q: 'What is the minimum project budget?', a: 'Our projects typically start from ₹50,000 for basic websites. Custom CRM/SaaS platforms range from ₹2-10 Lakhs depending on complexity. We provide detailed quotes after understanding your requirements.' },
  { q: 'Do you work with international clients?', a: 'Absolutely! We work with clients across USA, UK, UAE, and Australia. We schedule calls according to your timezone and use Slack/Teams for seamless communication.' },
  { q: 'What is your typical project timeline?', a: 'Simple websites take 2-4 weeks. Custom web applications take 6-12 weeks. Enterprise CRM/SaaS platforms take 3-6 months. We provide detailed milestone-based timelines before starting.' },
  { q: 'Do you provide post-launch support?', a: 'Yes! We offer 3-month free support after project launch. Extended maintenance plans are available for ongoing updates, bug fixes, performance monitoring, and feature additions.' }
];

/* ────────────────────────── SERVICE OPTIONS ────────────────────────── */
const serviceOptions = [
  'Website Development',
  'Mobile App Development',
  'Custom Software / CRM',
  'Digital Marketing',
  'Social Media Management',
  'AI Consulting',
  'IT Consulting',
  'UI/UX Design',
  'Other'
];

const budgetRanges = [
  'Under ₹50,000',
  '₹50,000 - ₹1 Lakh',
  '₹1 Lakh - ₹5 Lakhs',
  '₹5 Lakhs - ₹10 Lakhs',
  '₹10 Lakhs+',
  'Not sure yet'
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', budget: '', message: '' });
  const [sent, setSent] = useState(false);
  const [timeSlots, setTimeSlots] = useState({});
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const storedBlueprint = sessionStorage.getItem('hk_project_blueprint');
    if (storedBlueprint) {
      try {
        const bp = JSON.parse(storedBlueprint);
        const formattedMsg = `Hello HariKrushn Team,\n\nI would like to inquire about a project based on the following blueprint:\n- Service: ${bp.service}\n- Project Class: ${bp.type?.toUpperCase()}\n- Scope Size: ${bp.pages} Pages\n- Animation Level: ${bp.animations?.toUpperCase()}\n- Estimated Timeline: ${bp.timeline}\n- Complexity: ${bp.complexity}\n\nLooking forward to your response.`;
        setFormData(prev => ({ ...prev, message: formattedMsg }));
        sessionStorage.removeItem('hk_project_blueprint');
      } catch (err) {
        console.error("Failed to parse blueprint:", err);
      }
    }
  }, []);

  useEffect(() => {
    const updateClocks = () => {
      const slots = {};
      offices.forEach((office) => {
        slots[office.id] = new Date().toLocaleTimeString('en-US', {
          timeZone: office.timeZone,
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
      });
      setTimeSlots(slots);
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', phone: '', service: '', budget: '', message: '' });
    }, 4000);
  };

  // Motion variants for fade-in & container orchestration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <div className="relative text-neutral-300 font-sans overflow-hidden">
      {/* Background ambient glowing circles with color-shifting and movement animation */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[8%] right-1/4 w-[38vw] h-[38vw] rounded-full bg-emerald-500/[0.07] blur-[130px] pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[50%] left-1/4 w-[35vw] h-[35vw] rounded-full bg-blue-600/[0.07] blur-[110px] pointer-events-none z-0" 
      />

      {/* ══════════════════════════════════════════════════
          I. HERO HEADER (Clean White Heading)
          ══════════════════════════════════════════════════ */}
      <div className="text-center mb-20 pt-8 relative z-10">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
          // Get In Touch
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          Let's Create Together
        </h1>
        <p className="font-light text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Have a project in mind, want to inquire about custom solutions, or simply want to say hello? We'd love to hear from you.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════
          II. RESPONSE PROMISE BAR (Animated on enter)
          ══════════════════════════════════════════════════ */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 mb-16 relative z-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, borderColor: 'rgba(16, 185, 129, 0.3)' }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-[#050508]/40 border border-white/5 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-xs">2-4 Hour Response</h4>
              <p className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">Mon — Sat</p>
            </div>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.3)' }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-[#050508]/40 border border-white/5 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-xs">Global Clients</h4>
              <p className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">India • USA • UK • UAE</p>
            </div>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, borderColor: 'rgba(168, 85, 247, 0.3)' }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-[#050508]/40 border border-white/5 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-xs">Free Consultation</h4>
              <p className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">No obligation quote</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════
          III. CONTACT FORM + OFFICE INFO
          ══════════════════════════════════════════════════ */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto px-4 mb-24 relative z-10"
      >
        
        {/* Left Column: Direct Lines + Office + Business Hours */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Direct Lines */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-white/5">
            <div className="flex-1">
              <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-3">// Direct Lines</p>
              <div className="space-y-2">
                <a href="mailto:hello@harikrushndigiverse.com" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 flex items-center justify-center transition-all">
                    <svg className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  </div>
                  <span className="font-light text-xs">hello@harikrushndigiverse.com</span>
                </a>
                <a href="mailto:join@harikrushndigiverse.com" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 flex items-center justify-center transition-all">
                    <svg className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </div>
                  <span className="font-light text-xs">join@harikrushndigiverse.com</span>
                </a>
                <a href="tel:+919876543210" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 group-hover:border-purple-500/40 group-hover:bg-purple-500/10 flex items-center justify-center transition-all">
                    <svg className="w-3.5 h-3.5 text-neutral-400 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  </div>
                  <span className="font-light text-xs">+91 98765 43210</span>
                </a>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-3">// Social Networks</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    name: 'LinkedIn',
                    hoverClass: 'hover:border-[#0077B5]/40 hover:bg-[#0077B5]/5',
                    icon: (
                      <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 duration-300" fill="#0077B5" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    )
                  },
                  {
                    name: 'Instagram',
                    hoverClass: 'hover:border-[#ee2a7b]/40 hover:bg-[#ee2a7b]/5',
                    icon: (
                      <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 duration-300" viewBox="0 0 24 24">
                        <defs>
                          <linearGradient id="insta-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f9ce34" />
                            <stop offset="50%" stopColor="#ee2a7b" />
                            <stop offset="100%" stopColor="#6228d7" />
                          </linearGradient>
                        </defs>
                        <path fill="url(#insta-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    )
                  },
                  {
                    name: 'Twitter / X',
                    hoverClass: 'hover:border-white/20 hover:bg-white/5',
                    icon: (
                      <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 duration-300" fill="#FFFFFF" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )
                  },
                  {
                    name: 'YouTube',
                    hoverClass: 'hover:border-[#FF0000]/40 hover:bg-[#FF0000]/5',
                    icon: (
                      <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 duration-300" fill="#FF0000" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    )
                  }
                ].map(social => (
                  <a key={social.name} href="#contact" className={`flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-300 group ${social.hoverClass}`}>
                    {social.icon}
                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Office Card (HQ) */}
          {offices.map((office) => (
            <motion.div 
              key={office.id} 
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className={`bg-[#050508]/60 backdrop-blur-md border rounded-3xl p-7 transition-all duration-500 ${office.color} relative overflow-hidden`}
            >
              {office.isHQ && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.04] rounded-full filter blur-3xl pointer-events-none" />}
              <div className="flex justify-between items-start mb-4 gap-2">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block mb-1">{office.country}</span>
                  <h4 className="font-display text-lg font-bold text-white tracking-wide flex items-center gap-2">
                    {office.city}
                    {office.isHQ && <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
                  </h4>
                </div>
                <span className={`px-3 py-1 border rounded-lg text-[9px] font-mono tracking-widest uppercase ${office.badge}`}>{office.role}</span>
              </div>
              <p className="font-light text-neutral-300 text-sm leading-relaxed mb-6 max-w-xl">{office.address}</p>
              <div className="flex justify-between items-center border-t border-white/5 pt-5 text-xs font-mono">
                <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-neutral-400 hover:text-white hover:underline transition-colors">{office.phone}</a>
                <div className="flex items-center gap-2 text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LOCAL TIME: {timeSlots[office.id] || '--:--:-- --'}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Business Hours */}
          <motion.div variants={itemVariants} className="bg-[#050508]/40 border border-white/5 rounded-3xl p-7">
            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-5">// Business Hours</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { day: 'Monday — Friday', time: '9:00 AM — 7:00 PM', active: true, color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' },
                { day: 'Saturday', time: '10:00 AM — 4:00 PM', active: true, color: 'text-blue-400 bg-blue-500/5 border-blue-500/10' },
                { day: 'Sunday', time: 'Closed', active: false, color: 'text-neutral-600 bg-white/[0.01] border-white/5' },
                { day: 'Public Holidays', time: 'Closed', active: false, color: 'text-neutral-600 bg-white/[0.01] border-white/5' }
              ].map(h => (
                <div key={h.day} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${h.color}`}>
                  <span className="font-mono text-[10px]">{h.day}</span>
                  <span className="font-mono text-[10px] font-bold">{h.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* WhatsApp Quick Chat */}
          <motion.a 
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            href="https://wa.me/919876543210?text=Hi%20HariKrushn%20Team%2C%20I%20am%20interested%20in%20your%20services." 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-3xl bg-[#25D366]/5 border border-[#25D366]/15 hover:border-[#25D366]/40 hover:shadow-[0_0_30px_rgba(37,211,102,0.15)] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </div>
            <div>
              <h4 className="font-display font-bold text-[#25D366] text-sm group-hover:text-[#2be672] transition-colors">Chat on WhatsApp</h4>
              <p className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 mt-0.5">Instant response • Available 24/7</p>
            </div>
            <span className="ml-auto text-neutral-500 group-hover:translate-x-1 transition-transform">→</span>
          </motion.a>
        </div>

        {/* Right Column: Contact Form (With Focus Glows) */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 bg-[#050508]/60 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-lg relative lg:sticky lg:top-32 hover:border-emerald-500/20 transition-all duration-500"
        >
          <h2 className="font-display text-xl font-bold text-white tracking-tight mb-6">Send Us a Message</h2>
          
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="font-display text-emerald-400 text-lg font-semibold block">Message Dispatched!</span>
                <p className="font-light text-neutral-400 text-sm">We have received your request and will follow up within 2-4 hours.</p>
              </motion.div>
            ) : (
              <form key="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label htmlFor="contact-name" className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Name *</label>
                    <input 
                      id="contact-name"
                      type="text" 
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      placeholder="Your name" 
                      className="bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.02] focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 text-left">
                    <label htmlFor="contact-phone" className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Phone</label>
                    <input 
                      id="contact-phone"
                      type="tel" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                      placeholder="+91 XXXXX XXXXX" 
                      className="bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500/40 focus:bg-blue-500/[0.02] focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="contact-email" className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Email *</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    placeholder="your@email.com" 
                    className="bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500/40 focus:bg-purple-500/[0.02] focus:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label htmlFor="contact-service" className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Service Interested In</label>
                    <select 
                      id="contact-service"
                      value={formData.service} 
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })} 
                      className="bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.02] focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-black">Select service...</option>
                      {serviceOptions.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 text-left">
                    <label htmlFor="contact-budget" className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Budget Range</label>
                    <select 
                      id="contact-budget"
                      value={formData.budget} 
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })} 
                      className="bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.02] focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-black">Select budget...</option>
                      {budgetRanges.map(b => <option key={b} value={b} className="bg-black">{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="contact-message" className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Project Brief *</label>
                  <textarea 
                    id="contact-message"
                    required 
                    rows="4" 
                    value={formData.message} 
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                    placeholder="Describe your project, timeline, and requirements" 
                    className="bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.02] focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all resize-none" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="bg-white text-black hover:bg-emerald-400 hover:text-black hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] px-6 py-4 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-300 mt-2 shadow-md cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════════
          IV. GOOGLE MAPS — EXACT LOCATION
          ══════════════════════════════════════════════════ */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 mb-24 relative z-10"
      >
        <div className="text-center mb-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block mb-3">// Visit Our Office</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">Our Location</h2>
          <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto">
            Silver Trade Center, 501 & 502, near Pragati IT Park, Mota Varachha, Surat, Gujarat 394101
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-80 sm:h-[450px] relative bg-neutral-900 group">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.5!2d72.8614!3d21.2254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f3f2b23c6b1%3A0x1234567890abcdef!2sSilver%20Trade%20Center%2C%20Mota%20Varachha%2C%20Surat%2C%20Gujarat%20394101!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.3)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="HariKrushn Digiverse Office — Silver Trade Center, Mota Varachha, Surat"
          />
          {/* Address overlay */}
          <div className="absolute bottom-6 left-6 bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 max-w-sm shadow-2xl group-hover:border-emerald-500/20 transition-all duration-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-sm mb-1">HariKrushn Digiverse LLP</h4>
                <p className="font-light text-neutral-400 text-[11px] leading-relaxed">Silver Trade Center, 501 & 502, near Pragati IT Park, Mota Varachha, Surat, Gujarat 394101</p>
                <a 
                  href="https://www.google.com/maps/dir//Silver+Trade+Center,+Mota+Varachha,+Surat,+Gujarat+394101" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 hover:text-emerald-300 mt-2 inline-block transition-colors"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════
          V. FAQ SECTION
          ══════════════════════════════════════════════════ */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4 mb-20 relative z-10"
      >
        <div className="text-center mb-12">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block mb-3">// Common Questions</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">Before You Reach Out</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#050508]/40 border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10"
            >
              <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-display font-bold text-white text-xs sm:text-sm pr-4">{faq.q}</span>
                <motion.span animate={{ rotate: openFaq === idx ? 45 : 0 }} className="text-neutral-400 text-lg shrink-0">+</motion.span>
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <p className="px-5 pb-5 font-light text-neutral-400 text-xs sm:text-sm leading-relaxed border-t border-white/5 pt-4">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
