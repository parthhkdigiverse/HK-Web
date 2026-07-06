import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent, DEFAULT_CONTENT } from '../context/ContentContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8008';

/* ────────────────────────── JOBS DATA ────────────────────────── */
const DEFAULT_JOBS = [
  {
    id: 'frontend',
    title: 'Senior Frontend Architect',
    department: 'Engineering',
    type: 'Full-time / Hybrid',
    location: 'Surat, Gujarat',
    description: 'We are seeking an expert developer capable of building cinematic frontend experiences. Experience with custom Canvas, GSAP, WebGL, and Lenis smooth scrolling is highly desired.',
    requirements: ['4+ years of React development experience', 'Extensive knowledge of DOM rendering performance', 'Deep expertise in CSS transitions and canvas mechanics'],
    steps: ['Resume & Portfolio Screening', '30-Min Technical Sync', 'Culture Fit & Offer']
  },
  {
    id: 'ai-eng',
    title: 'Senior AI Systems Engineer',
    department: 'AI & Data',
    type: 'Full-time / Hybrid',
    location: 'Surat, Gujarat',
    description: 'You will orchestrate localized LLM middleware solutions, agent-to-agent architectures, vector search databases, and automated pipelines syncing CRMs with intelligence systems.',
    requirements: ['3+ years in Python, FastAPI, and Docker', 'Strong background in prompt engineering and embeddings', 'Experience deploying scalable async applications'],
    steps: ['Resume & Technical Briefing', 'Sandbox Coding Test', 'Architecture Discussion & Offer']
  },
  {
    id: 'uiux',
    title: 'Senior UI/UX Designer',
    department: 'Design',
    type: 'Full-time / Remote',
    location: 'Remote Possible',
    description: 'Looking for a designer inspired by the aesthetic standards of Apple, Stripe, Linear, and Tesla. You will create luxury layouts, design system tokens, and detailed prototyping guidelines.',
    requirements: ['3+ years of professional UX design with a strong portfolio', 'Advanced prototyping skills in Figma', 'Clear understanding of responsive grid systems'],
    steps: ['Portfolio Review', 'Collaborative Design Sprint', 'Final Meet & Terms']
  },
  {
    id: 'backend',
    title: 'Backend Developer (Python)',
    department: 'Engineering',
    type: 'Full-time / Hybrid',
    location: 'Surat, Gujarat',
    description: 'Build scalable REST APIs, microservice architectures, and database management systems using FastAPI, PostgreSQL, Redis, and Docker containerization.',
    requirements: ['2+ years Python backend development', 'Experience with SQL databases and ORM tools', 'Understanding of Docker, CI/CD, and cloud deployments'],
    steps: ['Resume Screening', 'Technical Interview', 'System Design & Offer']
  },
  {
    id: 'mobile',
    title: 'Mobile App Developer (Flutter)',
    department: 'Engineering',
    type: 'Full-time / Hybrid',
    location: 'Surat, Gujarat',
    description: 'Develop cross-platform mobile applications using Flutter and Dart. Integrate native device APIs, push notifications, biometric authentication, and offline-first database architectures.',
    requirements: ['2+ years Flutter/Dart experience', 'Published apps on Play Store or App Store', 'Knowledge of Firebase, SQLite, and REST API integration'],
    steps: ['Resume & App Review', 'Live Coding Session', 'Culture Fit & Offer']
  },
  {
    id: 'marketing',
    title: 'Digital Marketing Manager',
    department: 'Marketing',
    type: 'Full-time / Hybrid',
    location: 'Surat, Gujarat',
    description: 'Lead multi-channel marketing campaigns across Google Ads, Meta, LinkedIn, and SEO. Manage analytics dashboards, A/B testing frameworks, and conversion optimization funnels.',
    requirements: ['3+ years digital marketing experience', 'Google Ads & Meta Ads certification preferred', 'Strong analytical skills with GA4 and SEMrush'],
    steps: ['Resume & Case Study Review', 'Strategy Presentation', 'Final Discussion & Offer']
  },
  {
    id: 'content',
    title: 'Content Writer & Strategist',
    department: 'Marketing',
    type: 'Full-time / Remote',
    location: 'Remote Possible',
    description: 'Craft compelling brand narratives, technical blog posts, case studies, social media copy, and SEO-optimized landing page content for our clients and internal brand.',
    requirements: ['2+ years content writing experience', 'Strong command of English grammar and storytelling', 'Basic understanding of SEO and keyword research'],
    steps: ['Writing Sample Review', 'Content Brief Test', 'Final Meet & Offer']
  },
  {
    id: 'pm',
    title: 'Project Manager',
    department: 'Operations',
    type: 'Full-time / Hybrid',
    location: 'Surat, Gujarat',
    description: 'Coordinate cross-functional teams, manage client deliverables, track sprint timelines, and ensure seamless communication between design, engineering, and stakeholders.',
    requirements: ['2+ years project management experience', 'Proficiency with Jira, Notion, or similar tools', 'Strong communication and leadership skills'],
    steps: ['Resume & Reference Check', 'Scenario-Based Interview', 'Leadership Discussion & Offer']
  },
  {
    id: 'designer',
    title: 'Graphic Designer',
    department: 'Design',
    type: 'Full-time / Hybrid',
    location: 'Surat, Gujarat',
    description: 'Create stunning visual assets for social media, branding packages, marketing collateral, and client presentations using Adobe Creative Suite and Figma.',
    requirements: ['2+ years graphic design experience', 'Expert in Photoshop, Illustrator, and Figma', 'Strong portfolio showcasing brand identity work'],
    steps: ['Portfolio Review', 'Design Task Assignment', 'Creative Discussion & Offer']
  }
];

/* ────────────────────────── DEPARTMENTS FILTER ────────────────────────── */
const departments = ['All', 'Engineering', 'Design', 'Marketing', 'Operations', 'AI & Data'];

/* ────────────────────────── PERKS DATA ────────────────────────── */
const DEFAULT_PERKS = [
  { title: 'Elite Hardware', desc: 'M3 Max MacBook Pro setups, dual 4K monitors, and custom layouts tailored to engineering speed.', color: 'emerald' },
  { title: 'Hybrid Autonomy', desc: 'Flexible hours and fluid work-from-home options to support creative focus and lifestyle flow.', color: 'blue' },
  { title: '20% R&D Labs', desc: 'Dedicate every Friday afternoon exclusively to experimental tools, personal projects, or open source.', color: 'purple' },
  { title: 'Elite Workspace', desc: 'Ergonomic seating, unlimited custom beans, and a high-frequency architectural design culture.', color: 'amber' },
  { title: 'Health Insurance', desc: 'Comprehensive medical insurance coverage for you and your family from day one of joining.', color: 'rose' },
  { title: 'Learning Budget', desc: '₹50,000 annual budget for courses, conferences, certifications, and technical book subscriptions.', color: 'cyan' }
];

/* ────────────────────────── TESTIMONIALS ────────────────────────── */
const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: 'Ravi Patel',
    role: 'Frontend Developer',
    tenure: '2 years',
    quote: 'The engineering culture here is unmatched. Every day I get to push the boundaries of what\'s possible with web animations and performance. The team genuinely supports innovation.',
    rating: 5,
    color: 'from-emerald-500/10 to-teal-500/5',
    glowColor: 'rgba(16,185,129,0.25)',
    tag: 'ENGINEERING',
    tagClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    starClass: 'text-emerald-500'
  },
  {
    id: 2,
    name: 'Priya Shah',
    role: 'UI/UX Designer',
    tenure: '1.5 years',
    quote: 'I\'ve grown more in 18 months here than in 4 years at my previous company. The design standards are world-class and inspiring. Every project is a new creative challenge.',
    rating: 5,
    color: 'from-purple-500/10 to-indigo-500/5',
    glowColor: 'rgba(168,85,247,0.25)',
    tag: 'DESIGN',
    tagClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    starClass: 'text-purple-500'
  },
  {
    id: 3,
    name: 'Arjun Mehta',
    role: 'AI Engineer',
    tenure: '1 year',
    quote: 'Building autonomous agent systems with cutting-edge LLM frameworks every day — this is the future of software engineering. HK gives you the freedom to experiment and innovate.',
    rating: 5,
    color: 'from-amber-500/10 to-orange-500/5',
    glowColor: 'rgba(245,158,11,0.25)',
    tag: 'AI & DATA',
    tagClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    starClass: 'text-amber-500'
  },
  {
    id: 4,
    name: 'Neha Desai',
    role: 'Project Manager',
    tenure: '2.5 years',
    quote: 'The collaborative environment and flat hierarchy make every day exciting. I get to work directly with founders, coordinate global projects, and shape product strategy from the ground up.',
    rating: 5,
    color: 'from-sky-500/10 to-cyan-500/5',
    glowColor: 'rgba(14,165,233,0.25)',
    tag: 'OPERATIONS',
    tagClass: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    starClass: 'text-sky-500'
  },
  {
    id: 5,
    name: 'Karan Joshi',
    role: 'Full-Stack Developer',
    tenure: '1.5 years',
    quote: 'From day one, I was trusted with real client projects. The mentorship program, code review culture, and Friday R&D labs have accelerated my career beyond anything I imagined.',
    rating: 5,
    color: 'from-rose-500/10 to-pink-500/5',
    glowColor: 'rgba(244,63,94,0.25)',
    tag: 'ENGINEERING',
    tagClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    starClass: 'text-rose-500'
  }
];

/* ────────────────────────── FAQ DATA ────────────────────────── */
const DEFAULT_FAQS = [
  { q: 'What is the interview process like?', a: 'Our process typically involves 3 stages: an initial resume/portfolio screening, a technical or creative assessment, and a final culture-fit discussion with the founders. The entire process takes 5-7 business days.' },
  { q: 'Is remote work allowed?', a: 'Yes! Several roles support full remote work. For hybrid roles, we follow a flexible 3-days-in-office model at our Surat headquarters, with the remaining days being work-from-home.' },
  { q: 'What tech stack does HK use?', a: 'We primarily work with React, Next.js, FastAPI (Python), PostgreSQL, Docker, Flutter, and various AI/ML frameworks including LangChain, OpenAI APIs, and vector databases.' },
  { q: 'Do you offer internships?', a: 'Absolutely! We run 3-month and 6-month internship programs for college students. Interns work on real client projects alongside senior engineers and designers.' },
  { q: 'What is the salary range?', a: 'Compensation is competitive and depends on role, experience, and skills. We also offer performance bonuses, equity participation for senior roles, and annual increments.' },
  { q: 'How do I prepare for the interview?', a: 'Review our website portfolio, understand our design philosophy, and be ready to discuss your past projects in depth. For technical roles, practice system design and coding challenges.' }
];

/* ────────────────────────── CAREER LADDER ────────────────────────── */
const DEFAULT_LADDER = [
  { level: 'Intern', duration: '3-6 months', desc: 'Learn fundamentals, shadow senior team members, and contribute to live projects.' },
  { level: 'Junior', duration: 'Year 1', desc: 'Own small features independently, participate in code reviews, and build domain expertise.' },
  { level: 'Mid-Level', duration: 'Year 2-3', desc: 'Lead feature development, mentor juniors, and make architectural decisions.' },
  { level: 'Senior', duration: 'Year 3-5', desc: 'Drive technical strategy, lead client engagements, and define engineering standards.' },
  { level: 'Lead / Manager', duration: 'Year 5+', desc: 'Shape company direction, manage teams, and drive innovation across verticals.' }
];

/* ────────────────────────── STATS ────────────────────────── */
const DEFAULT_STATS = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '8+', label: 'Industries Served' },
  { value: '3+', label: 'Years of Excellence' },
  { value: '30+', label: 'Team Members' }
];

const renderPhilosophyIcon = (iconName, color) => {
  const colorMap = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    rose: 'text-rose-400',
    amber: 'text-amber-400'
  };
  const cls = colorMap[color] || 'text-neutral-400';
  
  if (iconName === 'lightning') {
    return <svg className={`w-6 h-6 ${cls}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
  }
  if (iconName === 'users') {
    return <svg className={`w-6 h-6 ${cls}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>;
  }
  if (iconName === 'eye') {
    return <svg className={`w-6 h-6 ${cls}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
  }
  // Fallback bulb icon
  return <svg className={`w-6 h-6 ${cls}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
};

export default function Career() {
  const { content } = useContent();
  const stats = content?.career_stats || DEFAULT_STATS;
  const perks = content?.career_perks || DEFAULT_PERKS;
  const testimonials = content?.career_testimonials || DEFAULT_TESTIMONIALS;
  const faqs = content?.career_faqs || DEFAULT_FAQS;
  const careerLadder = content?.career_ladder || DEFAULT_LADDER;
  const careerSettings = content?.career_settings || {
    title: "Build the Future",
    subtitle: "We are always looking for exceptional engineers, designers, and strategists obsessed with visual, motion, and backend perfection.",
    philosophy_eyebrow: "// Our Philosophy",
    philosophy_title: "Why Join HariKrushn Digiverse?",
    philosophy_desc: "We don't just build software — we engineer premium digital experiences that set industry benchmarks."
  };
  const philosophyCards = content?.career_philosophy_cards || DEFAULT_CONTENT?.career_philosophy_cards || [];

  const jobs = (content?.careers || DEFAULT_JOBS).map(j => ({
    ...j,
    id: j.slug || j.id
  }));

  const [activeJob, setActiveJob] = useState(null);
  const [activeDept, setActiveDept] = useState('All');
  const jobFormFields = content?.career_job_form_fields || DEFAULT_CONTENT.career_job_form_fields || [];
  const internFormFields = content?.career_intern_form_fields || DEFAULT_CONTENT.career_intern_form_fields || [];

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (jobFormFields.length > 0) {
      const initial = {};
      jobFormFields.forEach(field => {
        initial[field.id] = '';
      });
      setFormData(initial);
    }
  }, [content?.career_job_form_fields]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [highlightForm, setHighlightForm] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [counters, setCounters] = useState([]);
  const statsRef = useRef(null);

  // Sync counters size with dynamic stats list
  useEffect(() => {
    if (stats) {
      setCounters(stats.map(() => 0));
      setStatsAnimated(false);
    }
  }, [stats]);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials every 6 seconds (same as Home page)
  useEffect(() => {
    if (!testimonials || !testimonials.length) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const [showInternshipForm, setShowInternshipForm] = useState(false);
  const [internFormData, setInternFormData] = useState({});

  useEffect(() => {
    if (internFormFields.length > 0) {
      const initial = {};
      internFormFields.forEach(field => {
        if (field.id === 'track') {
          initial[field.id] = 'React/Next.js';
        } else {
          initial[field.id] = '';
        }
      });
      setInternFormData(initial);
    }
  }, [content?.career_intern_form_fields]);
  const [internSubmitted, setInternSubmitted] = useState(false);
  const [internSubmitting, setInternSubmitting] = useState(false);
  const [internErrorMsg, setInternErrorMsg] = useState('');

  const fileInputRef = useRef(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState('');

  const internFileInputRef = useRef(null);
  const [uploadingInternResume, setUploadingInternResume] = useState(false);
  const [uploadedInternFilename, setUploadedInternFilename] = useState('');

  const uploadFile = async (file, setUploading, setFilename, updateForm) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(API_URL + '/api/upload/resume', {
        method: 'POST',
        body: fd
      });
      if (res.ok) {
        const data = await res.json();
        updateForm(data.resumeUrl);
        setFilename(file.name);
      } else {
        const err = await res.json();
        alert(err.detail || 'Failed to upload resume. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('Error uploading file. Check your connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleResumeFileChange = (e, fieldId) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(
        e.target.files[0],
        setUploadingResume,
        setUploadedFilename,
        (url) => setFormData(p => ({ ...p, [fieldId]: url }))
      );
    }
  };

  const handleInternResumeFileChange = (e, fieldId) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(
        e.target.files[0],
        setUploadingInternResume,
        setUploadedInternFilename,
        (url) => setInternFormData(p => ({ ...p, [fieldId]: url }))
      );
    }
  };

  const handleInternSubmit = async (e) => {
    e.preventDefault();
    setInternSubmitting(true);
    setInternErrorMsg('');
    try {
      const response = await fetch(API_URL + '/api/applications/intern', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(internFormData),
      });
      if (response.ok) {
        setInternSubmitted(true);
        setTimeout(() => {
          setInternSubmitted(false);
          const initial = {};
          internFormFields.forEach(f => {
            if (f.id === 'track') initial[f.id] = 'React/Next.js';
            else initial[f.id] = '';
          });
          setInternFormData(initial);
          setUploadedInternFilename('');
          setShowInternshipForm(false);
        }, 4000);
      } else {
        const err = await response.json();
        const detailMsg = !err.detail ? 'Failed to submit application.' : (typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail));
        setInternErrorMsg(detailMsg);
      }
    } catch (err) {
      setInternErrorMsg('Failed to submit application. Please check your network connection.');
    } finally {
      setInternSubmitting(false);
    }
  };

  // Animated counter on scroll
  useEffect(() => {
    if (!stats || stats.length === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
          stats.forEach((stat, idx) => {
            const target = parseInt(stat.value) || 0;
            let current = 0;
            const increment = Math.ceil(target / 40) || 1;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              setCounters(prev => {
                const next = [...prev];
                next[idx] = current;
                return next;
              });
            }, 40);
          });
        }
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [stats, statsAnimated]);

  const filteredJobs = activeDept === 'All' ? jobs : jobs.filter(j => j.department === activeDept);

  const handleApplyClick = (job) => {
    setActiveJob(job.id);
    setFormData((prev) => ({ ...prev, role: job.title }));
    setHighlightForm(true);
    setTimeout(() => setHighlightForm(false), 2000);
    const formElement = document.getElementById('apply-form-container');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch(API_URL + '/api/applications/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, job_id: activeJob || 'general' }),
      });
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          const initial = {};
          jobFormFields.forEach(f => { initial[f.id] = ''; });
          setFormData(initial);
          setUploadedFilename('');
          setActiveJob(null);
        }, 4000);
      } else {
        const err = await response.json();
        const detailMsg = !err.detail ? 'Failed to submit application.' : (typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail));
        setErrorMsg(detailMsg);
      }
    } catch (err) {
      setErrorMsg('Failed to submit application. Please check your network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative text-neutral-300 font-sans">
      
      {/* Background ambience */}
      <div className="absolute top-[10%] left-1/4 w-[35vw] h-[35vw] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[60%] right-1/4 w-[40vw] h-[40vw] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none" />

      {/* ══════════════════════════════════════════════════
          I. HERO HEADER
          ══════════════════════════════════════════════════ */}
      <div className="text-center mb-20 pt-8 relative z-10">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
          // Join Our Team
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          {careerSettings.title}
        </h1>
        <p className="font-light text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          {careerSettings.subtitle}
        </p>
      </div>

      {/* ══════════════════════════════════════════════════
          II. ANIMATED STATS COUNTER
          ══════════════════════════════════════════════════ */}
      <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 mb-24 relative z-10">
        {stats.map((stat, idx) => (
          <div key={stat.label} className="text-center p-6 rounded-2xl bg-[#050508]/40 border border-white/5 backdrop-blur-md">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-white block">
              {counters[idx]}{stat.value.replace(/\d+/, '')}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mt-2 block">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          III. WHY JOIN US
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 mb-28 relative z-10">
        <div className="text-center mb-14">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block mb-3">
            {careerSettings.philosophy_eyebrow || '// Our Philosophy'}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
            {careerSettings.philosophy_title || 'Why Join HariKrushn Digiverse?'}
          </h2>
          <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto">
            {careerSettings.philosophy_desc || "We don't just build software — we engineer premium digital experiences that set industry benchmarks."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {philosophyCards.map((card, idx) => {
            const hoverBorderCls = {
              emerald: 'hover:border-emerald-500/20',
              blue: 'hover:border-blue-500/20',
              purple: 'hover:border-purple-500/20',
              rose: 'hover:border-rose-500/20',
              amber: 'hover:border-amber-500/20'
            }[card.color] || 'hover:border-white/10';

            const iconBgCls = {
              emerald: 'bg-emerald-500/10 border-emerald-500/20',
              blue: 'bg-blue-500/10 border-blue-500/20',
              purple: 'bg-purple-500/10 border-purple-500/20',
              rose: 'bg-rose-500/10 border-rose-500/20',
              amber: 'bg-amber-500/10 border-amber-500/20'
            }[card.color] || 'bg-white/5 border-white/10';

            return (
              <div 
                key={idx} 
                className={`p-8 rounded-3xl bg-[#09090d]/60 border border-white/5 transition-all text-center space-y-4 ${hoverBorderCls}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border ${iconBgCls}`}>
                  {renderPhilosophyIcon(card.icon, card.color)}
                </div>
                <h3 className="font-display font-bold text-white text-sm">{card.title}</h3>
                <p className="font-light text-neutral-400 text-xs leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          IV. OPEN ROLES + APPLICATION FORM
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 mb-28 relative z-10">
        <div className="text-center mb-14">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block mb-3">// Open Positions</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">Current Openings</h2>
        </div>

        {/* Department Tabs */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-4 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border transition-all ${
                activeDept === dept
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'text-neutral-400 bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Jobs list */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`bg-[#050508]/40 backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 shadow-md ${
                    activeJob === job.id ? 'border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.02)]' : 'border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-wide">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded">{job.department}</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded">{job.type}</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded">{job.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-4 shrink-0">
                      <button
                        onClick={() => setActiveJob(activeJob === job.id ? null : job.id)}
                        className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white cursor-pointer transition-colors font-mono"
                      >
                        {activeJob === job.id ? '[ Hide ]' : '[ Details ]'}
                      </button>
                      <button
                        onClick={() => handleApplyClick(job)}
                        className="text-xs uppercase tracking-wider text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors font-mono font-semibold"
                      >
                        [ Apply ]
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeJob === job.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/5 pt-5 flex flex-col gap-5 text-sm sm:text-base">
                          <p className="font-light text-neutral-400 leading-relaxed">{job.description}</p>
                          <div>
                            <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-300 mb-2">// Key Requirements:</h4>
                            <ul className="space-y-2 font-light text-neutral-400 pl-1">
                              {job.requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="pt-2">
                            <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-300 mb-3">// Interview Journey:</h4>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              {job.steps.map((step, idx) => (
                                <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                                  <span className="font-mono text-[11px] text-emerald-400 uppercase block mb-1">Step 0{idx + 1}</span>
                                  <span className="font-light text-neutral-300 text-xs sm:text-sm leading-snug">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredJobs.length === 0 && (
              <div className="text-center py-16 text-neutral-500 font-mono text-xs">
                No open positions in this department currently. Check back soon!
              </div>
            )}
          </div>

          {/* Application Form */}
          <div
            id="apply-form-container"
            className={`lg:col-span-5 bg-[#050508]/40 backdrop-blur-md border p-8 rounded-3xl shadow-lg transition-all duration-500 sticky top-32 ${
              highlightForm
                ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-[1.01]'
                : 'border-white/5 hover:border-white/10'
            }`}
          >
            <h2 className="font-display text-xl font-bold text-white tracking-tight mb-6">Quick Application</h2>

            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="font-display text-emerald-400 text-lg font-semibold block">Application Received!</span>
                <p className="font-light text-neutral-400 text-xs sm:text-sm">We will review your profile and reach out via email within 3-5 business days.</p>
                {/* Mini Status Tracker */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="font-mono text-[8px] text-emerald-400 uppercase">Received</span>
                  </div>
                  <div className="w-8 h-[1px] bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-white/10 animate-pulse" />
                    <span className="font-mono text-[8px] text-neutral-500 uppercase">Under Review</span>
                  </div>
                  <div className="w-8 h-[1px] bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-white/10" />
                    <span className="font-mono text-[8px] text-neutral-500 uppercase">Interview</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {jobFormFields.map((field) => {
                  if (field.type === 'file') {
                    return (
                      <div key={field.id} className="flex flex-col gap-1.5">
                        <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 text-left">
                          {field.label} {field.required && '*'}
                        </label>
                        
                        {/* Hidden File Input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => handleResumeFileChange(e, field.id)}
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          className="hidden"
                        />

                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-emerald-500/50'); }}
                          onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-emerald-500/50'); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-emerald-500/50');
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              uploadFile(
                                e.dataTransfer.files[0],
                                setUploadingResume,
                                setUploadedFilename,
                                (url) => setFormData(p => ({ ...p, [field.id]: url }))
                              );
                            }
                          }}
                          className="border border-dashed border-white/10 hover:border-white/30 rounded-xl p-6 bg-black/40 text-center transition-all cursor-pointer group flex flex-col items-center justify-center gap-2"
                        >
                          {uploadingResume ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                              <span className="font-mono text-[9px] text-white">Uploading file...</span>
                            </div>
                          ) : uploadedFilename ? (
                            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[9px]">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                              <span>Uploaded: {uploadedFilename}</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-neutral-500 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                <span className="font-mono text-[9px] text-neutral-500 group-hover:text-white transition-all">Click to upload or drag files</span>
                              </div>
                              <span className="text-[8px] text-neutral-600 font-mono mt-1">Accepts PDF, DOCX, PNG, JPG</span>
                            </>
                          )}
                        </div>

                        <input 
                          id={`job-app-${field.id}`} 
                          type="text" 
                          required={field.required} 
                          value={formData[field.id] || ''} 
                          onChange={(e) => {
                            setFormData({ ...formData, [field.id]: e.target.value });
                            if (!e.target.value) setUploadedFilename('');
                          }} 
                          placeholder={field.placeholder || "Or paste URL link"} 
                          className="bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-all mt-1 text-left" 
                        />
                      </div>
                    );
                  }

                  if (field.type === 'textarea') {
                    return (
                      <div key={field.id} className="flex flex-col gap-1.5">
                        <label htmlFor={`job-app-${field.id}`} className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 text-left">
                          {field.label} {field.required && '*'}
                        </label>
                        <textarea 
                          id={`job-app-${field.id}`} 
                          required={field.required}
                          value={formData[field.id] || ''} 
                          onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })} 
                          placeholder={field.placeholder} 
                          rows={3} 
                          className="bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-all resize-none text-left" 
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={field.id} className="flex flex-col gap-1.5">
                      <label htmlFor={`job-app-${field.id}`} className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 text-left">
                        {field.label} {field.required && '*'}
                      </label>
                      <input 
                        id={`job-app-${field.id}`} 
                        type={field.type} 
                        required={field.required} 
                        value={formData[field.id] || ''} 
                        onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })} 
                        placeholder={field.placeholder} 
                        className="bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-all text-left" 
                      />
                    </div>
                  );
                })}

                <button type="submit" disabled={submitting} className={`bg-white text-black px-6 py-4 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all mt-2 shadow-md cursor-pointer ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                {errorMsg && (
                  <div className="text-red-500 font-mono text-[10px] text-center mt-2">{errorMsg}</div>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          V. INTERNSHIP PROGRAM
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 mb-28 relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5 text-left">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-emerald-400">// For Students</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">Internship Program</h2>
              <p className="font-light text-neutral-400 text-sm leading-relaxed">
                Join our 3-month or 6-month internship program and work on real client projects alongside senior engineers and designers. Learn industry-standard tools, attend weekly mentorship sessions, and build a portfolio that stands out.
              </p>
              <div className="flex flex-wrap gap-3">
                {['React/Next.js', 'Flutter', 'Python/FastAPI', 'UI/UX Design', 'Digital Marketing', 'Content Writing'].map(track => (
                  <span key={track} className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/80 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-lg">{track}</span>
                ))}
              </div>
              <button 
                onClick={() => setShowInternshipForm(true)} 
                className="bg-emerald-500 text-black px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-md mt-2 inline-block cursor-pointer animate-pulse"
              >
                Apply for Internship
              </button>
            </div>
            
            <div className="space-y-4 relative min-h-[380px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {!showInternshipForm ? (
                  <motion.div
                    key="benefits"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {[
                      { icon: '🎓', title: 'Learn by Doing', desc: 'Work on live projects, not dummy assignments.' },
                      { icon: '👥', title: 'Mentorship', desc: 'Weekly 1-on-1 sessions with senior team leads.' },
                      { icon: '📜', title: 'Certification', desc: 'Receive an official completion certificate & letter.' },
                      { icon: '💼', title: 'PPO Opportunity', desc: 'Top performers get pre-placement offers.' }
                    ].map(item => (
                      <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="font-display font-bold text-white text-xs">{item.title}</h4>
                          <p className="font-light text-neutral-400 text-[11px] mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 rounded-2xl bg-[#09090d]/90 backdrop-blur-md border border-emerald-500/10 text-left"
                  >
                    {internSubmitted ? (
                      <div className="text-center py-10 space-y-4">
                        <span className="text-4xl">🎉</span>
                        <h4 className="font-display font-bold text-white text-lg">Application Submitted!</h4>
                        <p className="font-light text-neutral-400 text-xs leading-relaxed max-w-xs mx-auto">
                          Our talent acquisition team will review your academic background & portfolio. We will reach out via email within 3-5 business days.
                        </p>
                        <button
                          type="button"
                          onClick={() => { setInternSubmitted(false); setShowInternshipForm(false); }}
                          className="mt-4 text-xs font-mono text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                        >
                          Back to Benefits
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleInternSubmit} className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider text-emerald-400">// Apply for Internship</h4>
                          <button
                            type="button"
                            onClick={() => setShowInternshipForm(false)}
                            className="text-[10px] font-mono text-neutral-400 hover:text-white cursor-pointer"
                          >
                            [ Cancel ]
                          </button>
                        </div>

                        {internFormFields.map((field) => {
                          if (field.type === 'file') {
                            return (
                              <div key={field.id} className="space-y-2 text-left">
                                <label className="font-mono text-[9px] text-neutral-400 block mb-1">
                                  {field.label} {field.required && '*'}
                                </label>
                                
                                {/* Hidden File Input */}
                                <input
                                  type="file"
                                  ref={internFileInputRef}
                                  onChange={(e) => handleInternResumeFileChange(e, field.id)}
                                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                  className="hidden"
                                />

                                <div 
                                  onClick={() => internFileInputRef.current?.click()}
                                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-emerald-500/50'); }}
                                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-emerald-500/50'); }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.remove('border-emerald-500/50');
                                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                      uploadFile(
                                        e.dataTransfer.files[0],
                                        setUploadingInternResume,
                                        setUploadedInternFilename,
                                        (url) => setInternFormData(p => ({ ...p, [field.id]: url }))
                                      );
                                    }
                                  }}
                                  className="border border-dashed border-white/10 hover:border-emerald-500/30 rounded-xl p-4 bg-[#050508]/40 text-center transition-all cursor-pointer group flex flex-col items-center justify-center gap-1.5"
                                >
                                  {uploadingInternResume ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                      <span className="font-mono text-[8px] text-white">Uploading file...</span>
                                    </div>
                                  ) : uploadedInternFilename ? (
                                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[8px]">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                      <span>Uploaded: {uploadedInternFilename}</span>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center gap-2 justify-center">
                                        <svg className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        <span className="font-mono text-[8px] text-neutral-500 group-hover:text-white transition-all">Click to upload or drag files</span>
                                      </div>
                                      <span className="text-[7px] text-neutral-600 font-mono">Accepts PDF, DOCX, PNG, JPG</span>
                                    </>
                                  )}
                                </div>

                                <input 
                                  id={`intern-app-${field.id}`}
                                  type="text" 
                                  required={field.required}
                                  value={internFormData[field.id] || ''}
                                  onChange={(e) => {
                                    setInternFormData(p => ({ ...p, [field.id]: e.target.value }));
                                    if (!e.target.value) setUploadedInternFilename('');
                                  }}
                                  className="w-full bg-[#050508] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 text-left" 
                                  placeholder={field.placeholder || "Or paste link"}
                                />
                              </div>
                            );
                          }

                          if (field.type === 'textarea') {
                            return (
                              <div key={field.id} className="space-y-2 text-left">
                                <label htmlFor={`intern-app-${field.id}`} className="font-mono text-[9px] text-neutral-400 block mb-1">
                                  {field.label} {field.required && '*'}
                                </label>
                                <textarea 
                                  id={`intern-app-${field.id}`}
                                  required={field.required}
                                  value={internFormData[field.id] || ''}
                                  onChange={(e) => setInternFormData(p => ({ ...p, [field.id]: e.target.value }))}
                                  rows={3}
                                  className="w-full bg-[#050508] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none leading-relaxed text-left" 
                                  placeholder={field.placeholder}
                                />
                              </div>
                            );
                          }

                          if (field.id === 'track') {
                            return (
                              <div key={field.id} className="space-y-2 text-left">
                                <label htmlFor={`intern-app-${field.id}`} className="font-mono text-[9px] text-neutral-400 block mb-1">
                                  {field.label} {field.required && '*'}
                                </label>
                                <div className="relative">
                                  <select 
                                    id={`intern-app-${field.id}`}
                                    value={internFormData[field.id] || 'React/Next.js'}
                                    onChange={(e) => setInternFormData(p => ({ ...p, [field.id]: e.target.value }))}
                                    className="w-full bg-[#050508] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 appearance-none text-left"
                                  >
                                    {['React/Next.js', 'Flutter', 'Python/FastAPI', 'UI/UX Design', 'Digital Marketing', 'Content Writing'].map(t => (
                                      <option key={t} value={t} className="bg-[#0c0c12] text-white">{t}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div key={field.id} className="space-y-2 text-left">
                              <label htmlFor={`intern-app-${field.id}`} className="font-mono text-[9px] text-neutral-400 block mb-1">
                                {field.label} {field.required && '*'}
                              </label>
                              <input 
                                id={`intern-app-${field.id}`}
                                type={field.type} 
                                required={field.required}
                                value={internFormData[field.id] || ''}
                                onChange={(e) => setInternFormData(p => ({ ...p, [field.id]: e.target.value }))}
                                className="w-full bg-[#050508] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 text-left" 
                                placeholder={field.placeholder}
                              />
                            </div>
                          );
                        })}

                        <button 
                          type="submit"
                          disabled={internSubmitting}
                          className={`w-full bg-emerald-500 text-black px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-md mt-2 cursor-pointer ${internSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {internSubmitting ? 'Submitting...' : 'Submit Internship Application'}
                        </button>
                        {internErrorMsg && (
                          <div className="text-red-500 font-mono text-[9px] text-center mt-2">{internErrorMsg}</div>
                        )}
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          VI. CAREER GROWTH LADDER
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 mb-28 relative z-10 w-full">
        <div className="text-center mb-14">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block mb-3">// Your Journey</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Career Growth Path</h2>
          <p className="font-light text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto">A clear, structured progression from intern to leadership — with mentorship at every step.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-0">
          {careerLadder.map((step, idx) => (
            <div key={step.level} className="flex-1 relative">
              <div className="p-6 rounded-2xl bg-[#09090d]/60 border border-white/5 hover:border-white/15 transition-all h-full flex flex-col items-center text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <span className="font-mono text-xs font-bold text-emerald-400">{idx + 1}</span>
                </div>
                <h4 className="font-display font-bold text-white text-sm">{step.level}</h4>
                <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-400">{step.duration}</span>
                <p className="font-light text-neutral-400 text-[11px] leading-relaxed">{step.desc}</p>
              </div>
              {/* Connector arrow (hidden on last item & mobile) */}
              {idx < careerLadder.length - 1 && (
                <div className="hidden sm:block absolute top-1/2 -right-2 -translate-y-1/2 z-20">
                  <svg className="w-4 h-4 text-emerald-500/40" fill="currentColor" viewBox="0 0 24 24"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          VII. PERKS & BENEFITS
          ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 mb-28 relative z-10 w-full">
        <div className="text-center mb-14">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block mb-3">// Studio Culture</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">Perks & Studio Benefits</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk) => (
            <div key={perk.title} className={`bg-[#050508]/40 backdrop-blur-sm border border-${perk.color}-500/10 hover:border-${perk.color}-500/30 rounded-2xl p-6 transition-all duration-500 hover:shadow-lg`}>
              <div className={`w-10 h-10 rounded-xl bg-${perk.color}-500/10 border border-${perk.color}-500/20 flex items-center justify-center mb-4`}>
                <div className={`w-3 h-3 rounded-full bg-${perk.color}-400`} />
              </div>
              <h3 className="font-display text-base font-bold text-white tracking-wide mb-2">{perk.title}</h3>
              <p className="font-light text-neutral-400 text-xs sm:text-sm leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          VIII. EMPLOYEE TESTIMONIALS — 3D Carousel (Home Page Style)
          ══════════════════════════════════════════════════ */}
      <section className="py-28 px-4 sm:px-8 border-t border-b border-white/5 bg-black/30 relative overflow-hidden">
        {/* Dynamic ambient glow */}
        <div 
          className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none opacity-40 blur-[120px] z-0"
          style={{ background: `radial-gradient(circle at 50% 50%, ${testimonials[activeTestimonial].glowColor}, transparent 65%)` }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-20">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-8 h-[0.5px] bg-white opacity-40"></span>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">// Team Voices</p>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">What our team says.</h2>
            </div>
            <div className="max-w-xs text-neutral-400 font-light text-xs sm:text-sm leading-relaxed">
              Hear from real team members about their experience working at HariKrushn Digiverse.
            </div>
          </div>

          {/* 3D Stack Container */}
          <div className="relative flex items-center justify-center h-[460px] md:h-[420px] select-none w-full" style={{ perspective: '1200px' }}>
            {testimonials.map((t, idx) => {
              const isCenter = idx === activeTestimonial;
              const isPrev = idx === (activeTestimonial - 1 + testimonials.length) % testimonials.length;
              const isNext = idx === (activeTestimonial + 1) % testimonials.length;
              const position = isCenter ? 'center' : isPrev ? 'left' : isNext ? 'right' : 'hidden';

              return (
                <motion.div
                  key={t.id}
                  animate={{
                    x: position === 'center' ? '0%' : position === 'left' ? '-35%' : position === 'right' ? '35%' : '0%',
                    scale: position === 'center' ? 1 : position === 'hidden' ? 0.7 : 0.85,
                    rotateY: position === 'center' ? 0 : position === 'left' ? 25 : position === 'right' ? -25 : 0,
                    zIndex: position === 'center' ? 30 : position === 'hidden' ? 0 : 10,
                    opacity: position === 'center' ? 1 : position === 'hidden' ? 0 : 0.4,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  onClick={() => setActiveTestimonial(idx)}
                  className="absolute w-full max-w-[580px] p-8 md:p-10 rounded-3xl bg-[#0e0e13]/85 backdrop-blur-xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] flex flex-col justify-between group transition-shadow duration-500 cursor-pointer"
                  style={{
                    transformStyle: 'preserve-3d',
                    boxShadow: isCenter ? `0 25px 60px -15px ${t.glowColor}` : '0 25px 60px -15px rgba(0,0,0,0.8)',
                  }}
                >
                  {/* Glowing Accent */}
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${t.color} rounded-full filter blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none`} />

                  {/* Top Row: Quotes & Tag */}
                  <div className="flex justify-between items-start relative z-10">
                    <span className="font-serif text-6xl text-white/10 select-none -mt-4 transition-colors duration-500 group-hover:text-white/20">"</span>
                    <span className={`px-3.5 py-1 border rounded text-[9px] font-mono tracking-widest font-light transition-all duration-500 ${t.tagClass}`}>
                      {t.tag}
                    </span>
                  </div>

                  {/* Body Quote */}
                  <div className="my-6 relative z-10">
                    <p className="text-neutral-200 font-light text-sm sm:text-base leading-relaxed italic">
                      {t.quote}
                    </p>
                  </div>

                  {/* Bottom Row: Info & Stars */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 transition-all shadow-lg bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center">
                        <span className="font-display text-base font-bold text-white">{t.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold text-white group-hover:text-neutral-200 transition-colors">{t.name}</h4>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-light mt-0.5">{t.role} · {t.tenure}</p>
                      </div>
                    </div>
                    {/* Star Rating */}
                    <div className="flex gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 fill-current transition-colors duration-500 ${t.starClass}`} viewBox="0 0 20 20">
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
            <button 
              onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="w-12 h-12 rounded-full border border-white/10 bg-[#0a0a0f]/40 backdrop-blur-sm text-neutral-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center cursor-pointer group"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-300">←</span>
            </button>
            
            <div className="flex gap-2.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeTestimonial 
                      ? 'bg-white w-6 shadow-[0_0_8px_rgba(255,255,255,0.6)]' 
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="w-12 h-12 rounded-full border border-white/10 bg-[#0a0a0f]/40 backdrop-blur-sm text-neutral-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center cursor-pointer group"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          IX. FAQ SECTION
          ══════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 mb-28 relative z-10">
        <div className="text-center mb-14">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block mb-3">// Common Questions</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#050508]/40 border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-display font-bold text-white text-xs sm:text-sm pr-4">{faq.q}</span>
                <motion.span
                  animate={{ rotate: openFaq === idx ? 45 : 0 }}
                  className="text-neutral-400 text-lg shrink-0"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 font-light text-neutral-400 text-xs sm:text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>



    </div>
  );
}
