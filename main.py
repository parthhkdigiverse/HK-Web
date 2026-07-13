import sys
import os
import json
import subprocess
import threading
import time
import shutil
import datetime
try:
    import cv2
except ImportError:
    cv2 = None

from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

try:
    from pymongo import MongoClient
except ImportError:
    MongoClient = None

# 1. Setup backend import path and load environment variables
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
os.environ["PYTHONPATH"] = backend_dir + os.pathsep + os.environ.get("PYTHONPATH", "")

load_dotenv(override=True)  # Loads .env from the root directory

from app.core.config import settings

# 2. Define FastAPI Application
app = FastAPI(
    title="HariKrushn Digiverse API",
    description="API Backend for HariKrushn Digiverse LLP Platform",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for admin auth and content
class VerifyRequest(BaseModel):
    password: str

class ContentUpdateRequest(BaseModel):
    password: str
    content: dict

# All content data is stored in MongoDB. DEFAULT_CONTENT (in-memory) is the fallback.

# Import defaults from seed module
from app.db.seed import (
    DEFAULT_SITE_SETTINGS, DEFAULT_ABOUT_US, DEFAULT_CULTURE, DEFAULT_PEOPLE,
    DEFAULT_AWARDS, DEFAULT_BLOGS, DEFAULT_PORTFOLIO, DEFAULT_VENTURES,
    DEFAULT_CAREER_JOBS, DEFAULT_CAREER_PERKS, DEFAULT_CAREER_TESTIMONIALS,
    DEFAULT_CAREER_FAQS, DEFAULT_CONTACT_OFFICES, DEFAULT_CONTACT_FAQS,
    DEFAULT_SERVICES_SUBPAGES
)

DEFAULT_STRATEGIC_DIRECTIVES = [
  {
    "year": "2026",
    "month": "",
    "theme": "Cognitive Ecosystem & Edge AI",
    "color": "from-blue-500/10 to-cyan-500/5 border-blue-500/20",
    "glowColor": "rgba(59, 130, 246, 0.15)",
    "badgeColor": "text-blue-400 bg-blue-500/10 border-blue-500/20",
    "vision": "Empower modern platforms with self-optimizing code nodes, localized LLMs, and zero-latency visual computing ecosystems.",
    "mission": "Deploy robust, edge-native micro-agents and visual rendering engines that sync in real-time across decentralized client networks.",
    "kpis": [
      "Autonomous prompt compilation loops",
      "Edge-native sub-10ms data sync",
      "Unified cognitive control panels"
    ]
  },
  {
    "year": "2025",
    "month": "",
    "theme": "Decentralized Autonomy & Spatial Web",
    "color": "from-emerald-500/10 to-teal-500/5 border-emerald-500/20",
    "glowColor": "rgba(16, 185, 129, 0.15)",
    "badgeColor": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "vision": "Lead the evolution of visual human-computer interaction by bridging decentralized visual nodes with spatial web computing frameworks.",
    "mission": "Architect fully autonomous multi-agent networks that execute secure device-level tasks, rendering real-time responsive spatial grids.",
    "kpis": [
      "Peer-to-peer visual state routers",
      "Responsive 3D viewport systems",
      "Local-first cryptographic databases"
    ]
  },
  {
    "year": "2024",
    "month": "",
    "theme": "Cognitive Intelligence & Cinematic Web",
    "color": "from-amber-500/10 to-orange-500/5 border-amber-500/20",
    "glowColor": "rgba(245, 158, 11, 0.15)",
    "badgeColor": "text-amber-400 bg-amber-500/10 border-amber-500/20",
    "vision": "Pioneer the application of customized LLM agents, vector database indexing pipelines, and fluid, high-fidelity user interfaces.",
    "mission": "Integrate context-aware AI automations directly into client product structures, accompanied by 3D gestures and cinematic front-end animations.",
    "kpis": [
      "Dynamic prompt-caching networks",
      "Framer Motion & WebGL fluid interfaces",
      "Vector-based cognitive search nodes"
    ]
  },
  {
    "year": "2023",
    "month": "",
    "theme": "Enterprise Integration & Core CRM",
    "color": "from-purple-500/10 to-indigo-500/5 border-purple-500/20",
    "glowColor": "rgba(168, 85, 247, 0.15)",
    "badgeColor": "text-purple-400 bg-purple-500/10 border-purple-500/20",
    "vision": "Establish HariKrushn as a leading architect of high-concurrency cloud ecosystems, custom CRM software, and data management matrices for global enterprises.",
    "mission": "Deploy secure, multi-tenant databases and automated signing portals that reduce human administrative overhead by 80% and scale operational speeds.",
    "kpis": [
      "Zero-downtime migration protocols",
      "Unified client management databases",
      "High-throughput microservices mesh"
    ]
  }
]

DEFAULT_CASE_STUDIES = [
  {
    "slug": "vesper",
    "client": "Vesper Luxury Living",
    "title": "Cinematic Visual Sales Engine",
    "industry": "Real Estate",
    "summary": "We transformed Vesper's high-end property portal by integrating custom canvas scrubbing transitions, rendering 4K frame sequences that scroll smoothly on desktop and mobile. The cinematic experience increased buyer engagement dramatically.",
    "challenge": "Vesper needed a property showcase that felt like a luxury brand experience, not a generic listing site. Their existing platform had poor mobile performance and lacked visual storytelling.",
    "solution": "Built a custom canvas-based scroll scrub engine with optimized frame preloading, lazy-loaded 4K imagery, and GPU-accelerated transitions. Integrated interactive floor plans and virtual walkthrough modules.",
    "tech": ["React", "Canvas API", "GSAP", "Vite", "Three.js"],
    "img": "/images/casestudies/vesper.png",
    "metrics": [
      { "label": "Conversion Rate", "value": "+142%" },
      { "label": "Avg. Time on Page", "value": "4m 12s" },
      { "label": "Load Time", "value": "0.8s" }
    ],
    "duration": "4 months",
    "color": "amber",
    "accentColor": "#f59e0b",
    "glowColor": "rgba(245,158,11,0.15)"
  },
  {
    "slug": "aerocrm",
    "client": "AeroCRM Aviation",
    "title": "Automated Operations Platform",
    "industry": "Aviation",
    "summary": "Replaced a fragmented array of legacy software sheets with a custom high-performance CRM, featuring automated emailers, booking schedules, vector notifications, and daily backups.",
    "challenge": "AeroCRM was managing fleet operations across spreadsheets and disconnected tools, causing booking conflicts, delayed communications, and zero audit trails.",
    "solution": "Architected a unified CRM with real-time booking conflict detection, automated email/SMS triggers, role-based dashboards, and end-to-end encrypted data backups running every 6 hours.",
    "tech": ["React", "FastAPI", "PostgreSQL", "Docker", "Redis"],
    "img": "/images/casestudies/aerocrm.png",
    "metrics": [
      { "label": "Operational Efficiency", "value": "+400%" },
      { "label": "Booking Failures", "value": "0%" },
      { "label": "Manual Input Time", "value": "-85%" }
    ],
    "duration": "6 months",
    "color": "blue",
    "accentColor": "#3b82f6",
    "glowColor": "rgba(59,130,246,0.15)"
  },
  {
    "slug": "novadefi",
    "client": "Nova DeFi",
    "title": "Web3 Trading Platform & UX Overhaul",
    "industry": "Fintech / Web3",
    "summary": "Co-architected the complete user flow for Nova's decentralized finance platform, designing intuitive swap interfaces, wallet connectivity, and real-time portfolio dashboards.",
    "challenge": "Nova's existing DeFi interface had a 60% user drop-off at the wallet connection step. Complex transaction flows confused first-time crypto users.",
    "solution": "Redesigned the entire UX flow with progressive disclosure patterns, one-click wallet connect, real-time gas estimation, and visual transaction confirmations with animated feedback.",
    "tech": ["Next.js", "Ethers.js", "Solidity", "The Graph", "Framer Motion"],
    "img": "/images/casestudies/novadefi.png",
    "metrics": [
      { "label": "Transaction Success", "value": "+40%" },
      { "label": "User Drop-off", "value": "-60%" },
      { "label": "Daily Active Users", "value": "3x" }
    ],
    "duration": "5 months",
    "color": "purple",
    "accentColor": "#a855f7",
    "glowColor": "rgba(168,85,247,0.15)"
  },
  {
    "slug": "corelogistics",
    "client": "Core Logistics",
    "title": "AI-Driven Supply Chain Matrix",
    "industry": "Logistics",
    "summary": "Constructed a custom supply chain optimization system from scratch, integrating AI-driven route prediction, real-time fleet tracking, and automated warehouse inventory management.",
    "challenge": "Core Logistics was losing 20% of delivery efficiency due to manual route planning and lack of real-time visibility into fleet locations and warehouse stock levels.",
    "solution": "Built an AI route optimizer using historical traffic and weather data, integrated GPS fleet tracking with geofence alerts, and automated inventory scanning with barcode/QR integration.",
    "tech": ["Python", "TensorFlow", "React", "Google Maps API", "PostgreSQL"],
    "img": "/images/casestudies/corelogistics.png",
    "metrics": [
      { "label": "Delivery Efficiency", "value": "+38%" },
      { "label": "Fuel Cost Savings", "value": "12L/yr" },
      { "label": "Real-time Accuracy", "value": "99.7%" }
    ],
    "duration": "7 months",
    "color": "emerald",
    "accentColor": "#10b981",
    "glowColor": "rgba(16,185,129,0.15)"
  },
  {
    "slug": "pulsehealth",
    "client": "Pulse MedTech",
    "title": "HIPAA-Compliant Patient Portal",
    "industry": "Healthcare",
    "summary": "Designed and built a secure doctor-patient portal with encrypted medical records, automated appointment scheduling, video consultations, and digital prescription management.",
    "challenge": "Pulse MedTech needed a patient management system that met strict HIPAA compliance while being intuitive enough for elderly patients to navigate without assistance.",
    "solution": "Created an accessibility-first portal with large-text modes, voice-guided navigation, E2E encrypted data at rest and in transit, and automated appointment reminders via SMS and WhatsApp.",
    "tech": ["React", "Express", "MongoDB", "WebGL", "Twilio"],
    "img": "/images/casestudies/pulsehealth.png",
    "metrics": [
      { "label": "Patient Satisfaction", "value": "4.9/5" },
      { "label": "Booking Efficiency", "value": "+200%" },
      { "label": "Data Breach Incidents", "value": "0" }
    ],
    "duration": "5 months",
    "color": "sky",
    "accentColor": "#0ea5e9",
    "glowColor": "rgba(14,165,233,0.15)"
  },
  {
    "slug": "learnverse",
    "client": "LearnVerse Academy",
    "title": "Full-Stack LMS with Live Classrooms",
    "industry": "EdTech",
    "summary": "Built a scalable Learning Management System with live video classrooms, adaptive quiz engines, real-time progress tracking, and automated certificate generation for 50,000+ students.",
    "challenge": "LearnVerse was using Zoom for classes and Google Sheets for tracking, losing student engagement data and unable to personalize the learning experience.",
    "solution": "Developed a custom LMS with WebRTC-based live classrooms, adaptive quizzing that adjusts difficulty based on performance, gamified progress dashboards, and auto-generated PDF certificates.",
    "tech": ["Next.js", "WebRTC", "FastAPI", "PostgreSQL", "Redis"],
    "img": "/images/casestudies/learnverse.png",
    "metrics": [
      { "label": "Student Retention", "value": "+65%" },
      { "label": "Course Completion", "value": "94%" },
      { "label": "Students Onboarded", "value": "50K+" }
    ],
    "duration": "6 months",
    "color": "rose",
    "accentColor": "#f43f5e",
    "glowColor": "rgba(244,63,94,0.15)"
  }
]

DEFAULT_CAREER_LADDER = [
  { "level": "Intern", "duration": "3-6 months", "desc": "Learn fundamentals, shadow senior team members, and contribute to live projects." },
  { "level": "Junior", "duration": "Year 1", "desc": "Own small features independently, participate in code reviews, and build domain expertise." },
  { "level": "Mid-Level", "duration": "Year 2-3", "desc": "Lead feature development, mentor juniors, and make architectural decisions." },
  { "level": "Senior", "duration": "Year 3-5", "desc": "Drive technical strategy, lead client engagements, and define engineering standards." },
  { "level": "Lead / Manager", "duration": "Year 5+", "desc": "Shape company direction, manage teams, and drive innovation across verticals." }
]

DEFAULT_JOB_FORM_FIELDS = [
  { "id": "name", "label": "Name", "type": "text", "placeholder": "Your name", "required": True },
  { "id": "phone", "label": "Phone", "type": "tel", "placeholder": "+91 XXXXX XXXXX", "required": False },
  { "id": "email", "label": "Email", "type": "email", "placeholder": "your@email.com", "required": True },
  { "id": "role", "label": "Target Role", "type": "text", "placeholder": "Select a role or specify", "required": True },
  { "id": "resume", "label": "Resume / Portfolio", "type": "file", "placeholder": "Or paste LinkedIn / GitHub / Portfolio URL", "required": True },
  { "id": "message", "label": "Cover Note", "type": "textarea", "placeholder": "Tell us why you'd be a great fit...", "required": False }
]

DEFAULT_INTERN_FORM_FIELDS = [
  { "id": "name", "label": "Your Name", "type": "text", "placeholder": "Radhe Patel", "required": True },
  { "id": "email", "label": "Email Address", "type": "email", "placeholder": "radhe@example.com", "required": True },
  { "id": "phone", "label": "Phone Number", "type": "tel", "placeholder": "+91 99999 99999", "required": True },
  { "id": "track", "label": "Select Track", "type": "text", "placeholder": "React/Next.js or specify track", "required": True },
  { "id": "college", "label": "College Name & Current Semester", "type": "text", "placeholder": "SCET, Surat - Sem 6", "required": True },
  { "id": "resume", "label": "Resume / Portfolio", "type": "file", "placeholder": "Or paste link (Google Drive, GitHub, etc.)", "required": True }
]

DEFAULT_INDUSTRIES = [
  {
    "slug": "fintech",
    "title": "Fintech & Banking",
    "description": "Securing transaction ledgers, analytics engines, and automated KYC pipelines.",
    "detailDescription": "We build high-concurrency ledger databases, encrypted trading platforms, and automated compliance routing networks capable of processing millions of transactions securely. We implement zero-latency transaction locking and strict audit logs.",
    "listImg": "/images/industries/fintech.png",
    "detailImg": "/images/industries/fintech.png",
    "bg": "from-emerald-500/10 to-teal-500/10",
    "colorClass": "text-emerald-400",
    "borderClass": "border-emerald-500/20",
    "glowClass": "rgba(16,185,129,0.06)",
    "accentColor": "#10b981",
    "metrics": [
      { "label": "Volume Secured", "value": "$50M+" },
      { "label": "KYC Compliance Rate", "value": "100%" }
    ],
    "sort_order": 1
  },
  {
    "slug": "realestate",
    "title": "Real Estate & Properties",
    "description": "Virtual walkthrough platforms, interactive mapping, and organizer systems.",
    "detailDescription": "We craft immersive digital walkthrough experiences, responsive vector-based property maps, and centralized CRM dashboards to streamline buyer-agent interactions and automate lead pipelines.",
    "listImg": "/images/industries/realestate.png",
    "detailImg": "/images/industries/realestate.png",
    "bg": "from-blue-500/10 to-indigo-500/10",
    "colorClass": "text-blue-400",
    "borderClass": "border-blue-500/20",
    "glowClass": "rgba(59,130,246,0.06)",
    "accentColor": "#3b82f6",
    "metrics": [
      { "label": "3D Renderings Served", "value": "2,500+" },
      { "label": "Agent Efficiency Boost", "value": "85%" }
    ],
    "sort_order": 2
  },
  {
    "slug": "ecommerce",
    "title": "Luxury E-Commerce",
    "description": "Immersive branding layouts, high-performance checkouts, and custom payment systems.",
    "detailDescription": "We develop ultra-premium headless shopping environments featuring 3D product previews, optimized image pipelines, and customized multi-currency Stripe checkouts that eliminate cart drop-offs.",
    "listImg": "/images/industries/ecommerce.png",
    "detailImg": "/images/industries/ecommerce.png",
    "bg": "from-amber-500/10 to-orange-500/10",
    "colorClass": "text-amber-400",
    "borderClass": "border-amber-500/20",
    "glowClass": "rgba(245,158,11,0.06)",
    "accentColor": "#f59e0b",
    "metrics": [
      { "label": "Checkout Load Time", "value": "0.8s" },
      { "label": "Cart Conversion Lift", "value": "32%" }
    ],
    "sort_order": 3
  },
  {
    "slug": "healthcare",
    "title": "Healthcare & Biotech",
    "description": "Doctor-patient portals, digital records grids, and encrypted backups.",
    "detailDescription": "We construct secure clinical dashboards, HIPAA-compliant patient communication networks, and end-to-end encrypted backup systems to protect patient data pipelines.",
    "listImg": "/images/industries/healthcare.png",
    "detailImg": "/images/industries/healthcare.png",
    "bg": "from-sky-500/10 to-cyan-500/10",
    "colorClass": "text-sky-400",
    "borderClass": "border-sky-500/20",
    "glowClass": "rgba(14,165,233,0.06)",
    "accentColor": "#0ea5e9",
    "metrics": [
      { "label": "HIPAA Encrypted Records", "value": "5M+" },
      { "label": "Portal Booking Uptime", "value": "100%" }
    ],
    "sort_order": 4
  },
  {
    "slug": "aisaas",
    "title": "AI SaaS Platforms",
    "description": "SaaS landing structures, multi-tenant databases, and custom agent integrations.",
    "detailDescription": "We engineer multi-tenant workspaces, custom semantic search caching networks, and automated prompt monitoring pipelines designed to reduce token cost overheads and scale agent runtimes.",
    "listImg": "/images/industries/aisaas.png",
    "detailImg": "/images/industries/aisaas.png",
    "bg": "from-purple-500/10 to-indigo-500/10",
    "colorClass": "text-purple-400",
    "borderClass": "border-purple-500/20",
    "glowClass": "rgba(168,85,247,0.06)",
    "accentColor": "#a855f7",
    "metrics": [
      { "label": "Inference Tokens Tracked", "value": "2B+" },
      { "label": "Multi-Tenant Scale", "value": "Unlimited" }
    ],
    "sort_order": 5
  },
  {
    "slug": "education",
    "title": "Education & EdTech",
    "description": "Learning management systems, live classroom portals, and student analytics dashboards.",
    "detailDescription": "We build scalable LMS platforms with real-time video streaming, adaptive quiz engines, progress tracking dashboards, and automated certificate generation pipelines for universities and coaching institutes.",
    "listImg": "/images/industries/education.png",
    "detailImg": "/images/industries/education.png",
    "bg": "from-rose-500/10 to-pink-500/10",
    "colorClass": "text-rose-400",
    "borderClass": "border-rose-500/20",
    "glowClass": "rgba(244,63,94,0.06)",
    "accentColor": "#f43f5e",
    "metrics": [
      { "label": "Students Onboarded", "value": "50K+" },
      { "label": "Course Completion Rate", "value": "94%" }
    ],
    "sort_order": 6
  },
  {
    "slug": "logistics",
    "title": "Logistics & Supply Chain",
    "description": "Fleet tracking systems, warehouse automation, and shipment routing optimizers.",
    "detailDescription": "We develop GPS-integrated fleet monitoring dashboards, automated warehouse inventory scanners, and intelligent route optimization engines that cut delivery times and fuel costs across distribution networks.",
    "listImg": "/images/industries/logistics.png",
    "detailImg": "/images/industries/logistics.png",
    "bg": "from-orange-500/10 to-red-500/10",
    "colorClass": "text-orange-400",
    "borderClass": "border-orange-500/20",
    "glowClass": "rgba(249,115,22,0.06)",
    "accentColor": "#f97316",
    "metrics": [
      { "label": "Shipments Tracked", "value": "1.2M+" },
      { "label": "Delivery Time Reduction", "value": "38%" }
    ],
    "sort_order": 7
  },
  {
    "slug": "hospitality",
    "title": "Hospitality & Travel",
    "description": "Hotel booking engines, guest experience apps, and revenue management tools.",
    "detailDescription": "We craft elegant reservation platforms, guest concierge mobile applications, dynamic pricing engines, and review aggregation dashboards that help hospitality brands deliver five-star digital experiences.",
    "listImg": "/images/industries/hospitality.png",
    "detailImg": "/images/industries/hospitality.png",
    "bg": "from-teal-500/10 to-emerald-500/10",
    "colorClass": "text-teal-400",
    "borderClass": "border-teal-500/20",
    "glowClass": "rgba(20,184,166,0.06)",
    "accentColor": "#14b8a6",
    "metrics": [
      { "label": "Bookings Processed", "value": "200K+" },
      { "label": "Guest Satisfaction Score", "value": "4.9/5" }
    ],
    "sort_order": 8
  }
]

DEFAULT_INDUSTRY_PROJECTS = [
  {
    "title": "Solis Trading Portal",
    "industryId": "fintech",
    "description": "A responsive fintech dashboard delivering rapid metric updates, instant payment gates, and multi-tenant scaling.",
    "tech": ["React", "Stripe API", "AWS"],
    "client": "Solis Ltd",
    "sort_order": 1
  },
  {
    "title": "Apex Ledger Engine",
    "industryId": "fintech",
    "description": "High-throughput transaction processing ledger built for institutional digital banking, handling 10k transactions/sec securely.",
    "tech": ["FastAPI", "Redis", "Docker"],
    "client": "Apex Capital",
    "sort_order": 2
  },
  {
    "title": "Vesper Luxury Homes",
    "industryId": "realestate",
    "description": "An immersive cinematic web experience built for high-end properties in London. Features high-frame-rate scroll scrub.",
    "tech": ["Canvas API", "GSAP", "Vite"],
    "client": "Vesper Estates",
    "sort_order": 3
  },
  {
    "title": "EstatesHub CRM",
    "industryId": "realestate",
    "description": "A virtual walkthrough dashboard and workflow coordinator built to align property metrics with agent pipelines.",
    "tech": ["Next.js", "Tailwind", "PostgreSQL"],
    "client": "EstatesHub Group",
    "sort_order": 4
  },
  {
    "title": "Aura Bespoke Checkout",
    "industryId": "ecommerce",
    "description": "Designing bespoke product layouts, high-performance checkout funnels, immersive branding pages, and robust Stripe payment logic.",
    "tech": ["React", "Stripe", "Framer Motion"],
    "client": "Aura Lifestyle",
    "sort_order": 5
  },
  {
    "title": "LuxeCart Engine",
    "industryId": "ecommerce",
    "description": "Tailor-made headless ecommerce store with multi-currency checkout, optimized product image load, and admin controls.",
    "tech": ["Node.js", "GraphQL", "Shopify API"],
    "client": "LuxeCart Global",
    "sort_order": 6
  },
  {
    "title": "Pulse Health Portal",
    "industryId": "healthcare",
    "description": "Constructing secure doctor-patient portals, digital record grids, automated booking queues, and encrypted data backups.",
    "tech": ["React", "Express", "MongoDB"],
    "client": "Pulse Medtech",
    "sort_order": 7
  },
  {
    "title": "GeneData Analyzer",
    "industryId": "healthcare",
    "description": "High-performance sequence visualization grid and encrypted biometric data storage complying with healthcare privacy standards.",
    "tech": ["Python", "Django", "PostgreSQL"],
    "client": "GeneData Labs",
    "sort_order": 8
  },
  {
    "title": "DevPulse Agentic System",
    "industryId": "aisaas",
    "description": "An automated developer metrics platform powered by custom LLM pipelines, pulling analytics directly from vector search.",
    "tech": ["Python", "Vector DB", "FastAPI"],
    "client": "DevPulse Inc",
    "sort_order": 9
  },
  {
    "title": "NeuroSaaS Grid",
    "industryId": "aisaas",
    "description": "Multi-tenant SaaS workspace integrated with custom agent orchestration, context management, and real-time usage metrics.",
    "tech": ["React", "FastAPI", "PostgreSQL"],
    "client": "NeuroSaaS Co",
    "sort_order": 10
  },
  {
    "title": "LearnVerse LMS",
    "industryId": "education",
    "description": "Full-stack learning management system with live video classrooms, adaptive quizzes, and automated progress certificates.",
    "tech": ["Next.js", "WebRTC", "PostgreSQL"],
    "client": "LearnVerse Academy",
    "sort_order": 11
  },
  {
    "title": "SkillPath Analytics",
    "industryId": "education",
    "description": "Student performance analytics dashboard tracking engagement metrics, quiz scores, and personalized learning recommendations.",
    "tech": ["React", "D3.js", "FastAPI"],
    "client": "SkillPath Institute",
    "sort_order": 12
  },
  {
    "title": "FreightPulse Tracker",
    "industryId": "logistics",
    "description": "Real-time GPS fleet monitoring dashboard with geofence alerts, driver performance logs, and fuel consumption analytics.",
    "tech": ["React", "Node.js", "Google Maps API"],
    "client": "FreightPulse Corp",
    "sort_order": 13
  },
  {
    "title": "ChainFlow Optimizer",
    "industryId": "logistics",
    "description": "AI-powered route optimization engine that reduces delivery times by analyzing traffic patterns, weather data, and load capacity.",
    "tech": ["Python", "TensorFlow", "Redis"],
    "client": "ChainFlow Logistics",
    "sort_order": 14
  },
  {
    "title": "StayLux Booking Engine",
    "industryId": "hospitality",
    "description": "Premium hotel reservation platform with dynamic pricing algorithms, room inventory sync, and multi-channel distribution.",
    "tech": ["Next.js", "Stripe", "PostgreSQL"],
    "client": "StayLux Resorts",
    "sort_order": 15
  },
  {
    "title": "GuestWave Concierge",
    "industryId": "hospitality",
    "description": "Mobile concierge application enabling guests to order room service, book spa sessions, and chat with hotel staff in real-time.",
    "tech": ["Flutter", "Firebase", "Node.js"],
    "client": "GuestWave Hotels",
    "sort_order": 16
  }
]

DEFAULT_CAREER_STATS = [
  { "value": "50+", "label": "Projects Delivered" },
  { "value": "8+", "label": "Industries Served" },
  { "value": "3+", "label": "Years of Excellence" },
  { "value": "30+", "label": "Team Members" }
]

DEFAULT_PHILOSOPHY_CARDS = [
  {
    "title": "Cutting-Edge Technology",
    "desc": "Work with React, Next.js, Flutter, FastAPI, LLMs, Vector DBs, and cloud-native infrastructure every single day.",
    "color": "emerald",
    "icon": "lightning"
  },
  {
    "title": "Collaborative Culture",
    "desc": "Flat hierarchy, open communication, weekly knowledge-sharing sessions, and a team that genuinely cares about each other's growth.",
    "color": "blue",
    "icon": "users"
  },
  {
    "title": "Real Client Impact",
    "desc": "No throwaway projects. Every task impacts real businesses across fintech, healthcare, e-commerce, and AI platforms globally.",
    "color": "purple",
    "icon": "eye"
  }
]

DEFAULT_CAREER_SETTINGS = {
    "title": "Build the Future",
    "subtitle": "We are always looking for exceptional engineers, designers, and strategists obsessed with visual, motion, and backend perfection.",
    "philosophy_eyebrow": "// Our Philosophy",
    "philosophy_title": "Why Join HariKrushn Digiverse?",
    "philosophy_desc": "We don't just build software — we engineer premium digital experiences that set industry benchmarks."
}

DEFAULT_VENTURES_SETTINGS = {
    "overline": "// Our Initiatives",
    "title": "Digiverse Ventures",
    "subtitle": "Beyond client work, we build, incubate, and run initiatives that create lasting social and economic impact across India."
}

DEFAULT_CULTURE_SETTINGS = {
    "subtitle": "// Where Code Meets Art",
    "title": "Our Culture",
    "description": "At HariKrushn DigiVerse LLP, our culture is the foundation of innovation, collaboration, and impact. We don't just build digital solutions, we build trust and long-term relationships.",
    "gridSubtitle": "Life at HK DigiVerse",
    "gridTitle": "More Than Work. It's Our Way of Life.",
    "gridDescription": "At HK DigiVerse LLP, we believe that a strong culture builds a strong team. Here's what makes our workplace inspiring, engaging, and truly our own.",
    "widgetSubtitle": "// Interactive Widget",
    "widgetTitle": "Art & Logic Equilibrium",
    "widgetDescription": "We operate at the intersection of fine digital art and deep system logic. Adjust the slider below to observe how the structures sync.",
    "manifestoSubtitle": "// Manifesto Protocol",
    "manifestoTitle": "The Culture Code",
    "manifestoFilename": "hk_culture_protocol.json",
    "manifestoCode": '{\n  "organization": "HariKrushn DigiVerse LLP",\n  "ethos": "Bespoke Digital Craftsmanship",\n  "foundationalRule": "Zero generic templates, 100% custom architectures",\n  "executionStandards": {\n    "designFrameRate": 120,\n    "backendQuality": "TDD + Strict API health parameters",\n    "deliveryPipeline": "Automated CI/CD gates"\n  },\n  "communicationCode": [\n    "High trust, absolute ownership",\n    "Low meetings, maximum coding flow",\n    "Constructive, transparent feedback loops"\n  ]\n}'
}

DEFAULT_CONTACT_SETTINGS = {
    "title": "Let's Create Together",
    "subtitle": "Have a project in mind, want to inquire about custom solutions, or simply want to say hello? We'd love to hear from you.",
    "email_hello": "hello@harikrushndigiverse.com",
    "email_join": "join@harikrushndigiverse.com",
    "phone": "+91 98765 43210",
    "stats": [
        {"label": "2-4 Hour Response", "value": "Mon — Sat", "icon": "time"},
        {"label": "Global Clients", "value": "India • USA • UK • UAE", "icon": "globe"},
        {"label": "Free Consultation", "value": "No obligation quote", "icon": "shield"}
    ]
}

# Default hardcoded content representing original site data
DEFAULT_CONTENT = {
    "hero": {
        "label": "// EST. 2019 — A DIGITAL ATELIER",
        "title1": "Architecting the",
        "title2": "infinite digital.",
        "desc": "HariKrushn DigiVerse is an engineering & design partnership building custom software, AI systems and digital brand presence for ambitious global teams."
    },
    "brands": {
        "show": True,
        "fontSize": "36px",
        "imageSize": "56px",
        "list": [
            { "name": "SAPHIRA", "logo": "/images/logos/saphira_logo.png" },
            { "name": "NOVA", "logo": "/images/logos/nova_logo.png" },
            { "name": "CORE", "logo": "/images/logos/core_logo.png" },
            { "name": "AETHER", "logo": "/images/logos/aether_logo.png" },
            { "name": "QUANTUM", "logo": "/images/logos/quantum_logo.png" },
            { "name": "VERTEX", "logo": "/images/logos/vertex_logo.png" },
            { "name": "HELIOS", "logo": "/images/logos/helios_logo.png" },
            { "name": "ORION", "logo": "/images/logos/orion_logo.png" },
            { "name": "AXIOM", "logo": "/images/logos/axiom_logo.png" }
        ]
    },
    "stats": [
        { "value": "140+", "label": "Projects Shipped" },
        { "value": "46", "label": "Engineers" },
        { "value": "18", "label": "Countries Served" },
        { "value": "98%", "label": "Client Retention" }
    ],
    "services": [
        { "num": "01/07", "title": "Web Engineering", "desc": "Creating high-fidelity, cinematic, and fast-loading web applications that captivate and convert.", "tags": ["FRONTEND", "DESIGN"], "href": "#service-web", "img": "/images/gallery/design_sprint.png", "gradient": "from-blue-500 via-indigo-500 to-cyan-500" },
        { "num": "02/07", "title": "Mobile Applications", "desc": "Building bespoke native-feeling iOS and Android solutions with fluid gestures and offline sync.", "tags": ["IOS", "ANDROID"], "href": "#service-app", "img": "/images/gallery/digiverse_workspace.png", "gradient": "from-emerald-500 via-teal-500 to-cyan-500" },
        { "num": "03/07", "title": "Custom Software", "desc": "Constructing robust backend panels, CRM matrices, SaaS dashboards, and multi-tenant systems.", "tags": ["CRM", "ERP"], "href": "#service-custom-software", "img": "/images/quantum_banking.png", "gradient": "from-amber-500 via-orange-500 to-yellow-500" },
        { "num": "04/07", "title": "Digital Marketing", "desc": "Driving traffic and client acquisitions using data-backed strategies, SEO, and paid ads.", "tags": ["SEO", "GROWTH"], "href": "#service-digital-marketing", "img": "/images/gallery/launch_celebration.png", "gradient": "from-rose-500 via-pink-500 to-purple-500" },
        { "num": "05/07", "title": "Social Media Management", "desc": "Crafting brand presence, graphic design guides, and content calendars to elevate recognition.", "tags": ["BRANDING", "CONTENT"], "href": "#service-social-media-management", "img": "/images/gallery/cinematic_review.png", "gradient": "from-pink-500 via-fuchsia-500 to-violet-500" },
        { "num": "06/07", "title": "AI Consulting", "desc": "Developing automated AI agents, vector database search pipelines, and custom LLM integrations.", "tags": ["LLM", "AGENTS"], "href": "#service-ai-consulting", "img": "/images/gallery/ai_orchestrator.png", "gradient": "from-purple-500 via-violet-500 to-indigo-500" },
        { "num": "07/07", "title": "IT Consulting", "desc": "Designing Cloud migrations, Docker orchestration files, hardened security, and CI/CD pipelines.", "tags": ["CLOUD", "DEVOPS"], "href": "#service-it-consulting", "img": "/images/gallery/hardware_calibration.png", "gradient": "from-sky-500 via-blue-500 to-indigo-500" }
    ],
    "caseStudy": {
        "show": True,
        "client": "AeroCRM Aviation",
        "logo": "/images/logos/aerocrm_logo.png",
        "title": "Custom Cloud CRM Platform",
        "label": "Simulation [CRM.v1]",
        "image": "/images/gallery/digiverse_workspace.png",
        "linkText": "View Case Study Details",
        "linkHref": "#case-study",
        "points": [
            "Constructed custom CRM dashboards with automated lead tracking pipelines",
            "Built secure client management portal and transaction records matrix",
            "Integrated automated contract signing and PDF invoice generators"
        ]
    },
    "testimonials": {
        "show": True,
        "title": "Trusted by pioneers.",
        "description": "Read what industry leaders say about our custom software engineering, high-fidelity interfaces, and digital architectures.",
        "list": [
            {
                "name": "Alexander Vance",
                "role": "VP of Engineering, Saphira Aviation",
                "quote": "HariKrushn DigiVerse completely transformed our fleet tracking CRM. Their engineering precision, combined with a meticulous design language, gave us a product that is both cinematic and lightning-fast. They operate at the highest level of craftsmanship.",
                "rating": 5,
                "avatar": "/images/gallery/avatar_alexander.png",
                "tag": "CUSTOM CRM",
                "color": "from-amber-500/10 to-orange-500/5",
                "glowColor": "rgba(245,158,11,0.25)",
                "tagClass": "text-amber-400 bg-amber-500/10 border-amber-500/20",
                "starClass": "text-amber-500"
            },
            {
                "name": "Elena Rostova",
                "role": "Co-Founder, Nova DeFi",
                "quote": "Building a Web3 platform requires absolute trust and flawless UX. The team didn't just build our interfaces; they co-architected the user flow. Our transaction success rate increased by 40% after launching the new interface.",
                "rating": 5,
                "avatar": "/images/gallery/avatar_elena.png",
                "tag": "WEB3 PLATFORM",
                "color": "from-purple-500/10 to-indigo-500/5",
                "glowColor": "rgba(168,85,247,0.25)",
                "tagClass": "text-purple-400 bg-purple-500/10 border-purple-500/20",
                "starClass": "text-purple-500"
            },
            {
                "name": "Marcus Thorn",
                "role": "Head of Product, Core Logistics",
                "quote": "Managing a global supply chain demands real-time data visibility. HariKrushn Digiverse built an AI-driven predictive dispatch matrix that integrated seamlessly with our legacy database. Their work is a masterclass in modern systems integration.",
                "rating": 5,
                "avatar": "/images/gallery/avatar_marcus.png",
                "tag": "AI LOGISTICS",
                "color": "from-emerald-500/10 to-teal-500/5",
                "glowColor": "rgba(16,185,129,0.25)",
                "tagClass": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                "starClass": "text-emerald-500"
            }
        ]
    },
    "bottomCta": {
        "show": True,
        "titleNormal": "Let's build the",
        "titleItalic": "future together.",
        "btnText": "Start a Project →",
        "btnLink": "#contact"
    },
    "sectors": ["FINTECH", "HEALTHTECH", "E-COMMERCE", "LOGISTICS", "EDTECH", "REAL ESTATE", "SAAS", "HOSPITALITY"],
    "milestones": [
        { "year": "2024", "title": "Digital Craftsmanship Leader", "description": "Established a premium reputation in cinematic web engineering, high-end AI automation integrations, and luxury UI design." },
        { "year": "2023", "title": "Scaling Enterprise Systems", "description": "Expanded capabilities to construct complex custom CRMs, cloud architectures, and deep AI-driven process automations for global businesses." },
        { "year": "2022", "title": "The Growth Phase", "description": "Built a team of elite designers and developers. Delivered over 50 custom websites, creating immersive user interfaces that set new industry standards." },
        { "year": "2021", "title": "The Spark of Innovation", "description": "HariKrushn Digiverse LLP was founded with a single mission: to merge fine design aesthetics with robust software engineering." }
    ],
    "gallery": [
        { "title": "The Digiverse Workspace", "category": "Studio", "size": "col-span-2 row-span-1", "image": "/images/gallery/digiverse_workspace.png" },
        { "title": "Design Sprint Session", "category": "Team", "size": "col-span-1 row-span-1", "image": "/images/gallery/design_sprint.png" },
        { "title": "Hardware Calibration", "category": "Equipment", "size": "col-span-1 row-span-2", "image": "/images/gallery/hardware_calibration.png" },
        { "title": "AI Orchestrator Architecture", "category": "Engineering", "size": "col-span-2 row-span-1", "image": "/images/gallery/ai_orchestrator.png" },
        { "title": "Cinematic Review", "category": "Studio", "size": "col-span-1 row-span-1", "image": "/images/gallery/cinematic_review.png" },
        { "title": "Launch Celebration", "category": "Team", "size": "col-span-2 row-span-1", "image": "/images/gallery/launch_celebration.png" }
    ],
    "site_settings": DEFAULT_SITE_SETTINGS,
    "about_us": DEFAULT_ABOUT_US,
    "our_culture": DEFAULT_CULTURE,
    "people": DEFAULT_PEOPLE,
    "awards": DEFAULT_AWARDS,
    "blogs": DEFAULT_BLOGS,
    "portfolio": DEFAULT_PORTFOLIO,
    "ventures": DEFAULT_VENTURES,
    "career_jobs": DEFAULT_CAREER_JOBS,
    "career_perks": DEFAULT_CAREER_PERKS,
    "career_testimonials": DEFAULT_CAREER_TESTIMONIALS,
    "career_faqs": DEFAULT_CAREER_FAQS,
    "contact_offices": DEFAULT_CONTACT_OFFICES,
    "contact_faqs": DEFAULT_CONTACT_FAQS,
    "services_subpages": DEFAULT_SERVICES_SUBPAGES,
    "contact_settings": DEFAULT_CONTACT_SETTINGS,
    "ventures_settings": DEFAULT_VENTURES_SETTINGS,
    "career_settings": DEFAULT_CAREER_SETTINGS,
    "career_job_form_fields": DEFAULT_JOB_FORM_FIELDS,
    "career_intern_form_fields": DEFAULT_INTERN_FORM_FIELDS,
    "career_philosophy_cards": DEFAULT_PHILOSOPHY_CARDS,
    "industries": DEFAULT_INDUSTRIES,
    "industry_projects": DEFAULT_INDUSTRY_PROJECTS,
    "strategic_directives": DEFAULT_STRATEGIC_DIRECTIVES,
    "culture_settings": DEFAULT_CULTURE_SETTINGS
}

# MongoDB connection cache
mongo_client = None
mongo_db = None
mongo_collection = None

def get_mongo_collection():
    global mongo_client, mongo_db, mongo_collection
    if mongo_collection is not None:
        return mongo_collection
        
    if MongoClient is None:
        print("[MongoDB] pymongo is not installed. Using local JSON fallback.")
        return None
        
    uri = os.getenv("MONGODB_URI")
    if not uri:
        print("[MongoDB] MONGODB_URI not found in env. Using local JSON fallback.")
        return None
        
    try:
        # Connect to MongoDB with 5s timeout
        mongo_client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        # Verify connection
        mongo_client.admin.command('ping')
        mongo_db = mongo_client["hk_digiverse"]
        mongo_collection = mongo_db["site_content"]
        print("[MongoDB] Connected to MongoDB successfully!")
        
        # Trigger seeding dynamically on connect
        try:
            from app.db.seed import seed_database
            seed_database()
        except Exception as e:
            print(f"[MongoDB] Seeding trigger warning: {e}")
            
        return mongo_collection
    except Exception as e:
        print(f"[MongoDB] Connection failed: {e}. Using local JSON fallback.")
        mongo_client = None
        mongo_db = None
        mongo_collection = None
        return None

def get_mongo_history_collection():
    global mongo_client, mongo_db
    if mongo_db is not None:
        return mongo_db["content_history"]
    coll = get_mongo_collection()
    if coll is not None and mongo_db is not None:
        return mongo_db["content_history"]
    return None

def verify_admin_password(password: str) -> bool:
    collection = get_mongo_collection()
    if collection is not None:
        try:
            doc = collection.find_one({"identifier": "admin_credentials"})
            if doc and "password" in doc:
                return password == doc["password"]
            else:
                collection.insert_one({"identifier": "admin_credentials", "password": "admin123"})
                return password == "admin123"
        except Exception as e:
            print(f"[MongoDB] Error verifying admin password: {e}")
    return password == os.getenv("ADMIN_PASSWORD", "admin123")

def compile_full_content(base_content: dict) -> dict:
    global mongo_db
    if mongo_db is None:
        return base_content
        
    compiled = {**base_content}
    
    collections_map = {
        "site_settings": ("site_settings", "identifier", "global_settings", DEFAULT_SITE_SETTINGS),
        "about_us": ("about_us", "identifier", "about_us_content", DEFAULT_ABOUT_US),
        "contact_settings": ("contact_settings", "identifier", "contact_page_settings", DEFAULT_CONTACT_SETTINGS),
        "ventures_settings": ("ventures_settings", "identifier", "ventures_page_settings", DEFAULT_VENTURES_SETTINGS),
        "career_settings": ("career_settings", "identifier", "career_page_settings", DEFAULT_CAREER_SETTINGS),
        "culture_settings": ("culture_settings", "identifier", "culture_page_settings", DEFAULT_CULTURE_SETTINGS)
    }
    
    for key, (coll_name, query_field, query_val, fallback) in collections_map.items():
        try:
            doc = mongo_db[coll_name].find_one({query_field: query_val}, {"_id": 0})
            compiled[key] = doc if doc else fallback
        except Exception:
            compiled[key] = base_content.get(key, fallback)
            
    # 2. List based collections to compile (filtered & sorted)
    list_collections_map = {
        "our_culture": ("our_culture", "sort_order", DEFAULT_CULTURE),
        "people": ("people", "sort_order", DEFAULT_PEOPLE),
        "awards": ("awards", "sort_order", DEFAULT_AWARDS),
        "blogs": ("blogs", "slug", DEFAULT_BLOGS),
        "portfolio": ("portfolio", "sort_order", DEFAULT_PORTFOLIO),
        "ventures": ("ventures", "sort_order", DEFAULT_VENTURES),
        "career_jobs": ("career_jobs", "slug", DEFAULT_CAREER_JOBS),
        "career_perks": ("career_perks", "title", DEFAULT_CAREER_PERKS),
        "career_testimonials": ("career_testimonials", "name", DEFAULT_CAREER_TESTIMONIALS),
        "career_faqs": ("career_faqs", "q", DEFAULT_CAREER_FAQS),
        "contact_offices": ("contact_offices", "slug", DEFAULT_CONTACT_OFFICES),
        "contact_faqs": ("contact_faqs", "q", DEFAULT_CONTACT_FAQS),
        "services_subpages": ("services_subpages", "identifier", DEFAULT_SERVICES_SUBPAGES),
        "case_studies": ("case_studies", "sort_order", DEFAULT_CASE_STUDIES),
        "career_ladder": ("career_ladder", "sort_order", DEFAULT_CAREER_LADDER),
        "career_stats": ("career_stats", "sort_order", DEFAULT_CAREER_STATS),
        "career_job_form_fields": ("career_job_form_fields", "sort_order", DEFAULT_JOB_FORM_FIELDS),
        "career_intern_form_fields": ("career_intern_form_fields", "sort_order", DEFAULT_INTERN_FORM_FIELDS),
        "career_philosophy_cards": ("career_philosophy_cards", "sort_order", DEFAULT_PHILOSOPHY_CARDS),
        "industries": ("industries", "sort_order", DEFAULT_INDUSTRIES),
        "industry_projects": ("industry_projects", "sort_order", DEFAULT_INDUSTRY_PROJECTS),
        "strategic_directives": ("strategic_directives", "sort_order", DEFAULT_STRATEGIC_DIRECTIVES)
    }
    
    for key, (coll_name, sort_field, fallback) in list_collections_map.items():
        try:
            cursor = mongo_db[coll_name].find({"deleted_at": None}, {"_id": 0}).sort(sort_field, 1)
            docs = list(cursor)
            compiled[key] = docs if docs else fallback
        except Exception:
            compiled[key] = base_content.get(key, fallback)
            
    return compiled

def load_content() -> dict:
    collection = get_mongo_collection()
    if collection is not None:
        try:
            # Check for published content
            doc = collection.find_one({"identifier": "website_content_published"})
            if not doc:
                # Compatibility check
                doc = collection.find_one({"identifier": "website_content"})
            if doc:
                content = dict(doc)
                content.pop("_id", None)
                content.pop("identifier", None)
                return compile_full_content(content)
            else:
                print("[MongoDB] Published document not found. Seeding base...")
                local_data = load_local_content()
                try:
                    collection.insert_one({"identifier": "website_content_published", **local_data})
                    collection.insert_one({"identifier": "website_content", **local_data})
                    print("[MongoDB] Base seeding completed.")
                except Exception as e:
                    print(f"[MongoDB] Base seeding failed: {e}")
                return compile_full_content(local_data)
        except Exception as e:
            print(f"[MongoDB] Error loading published content: {e}. Using local fallback.")
    return load_local_content()

def load_draft() -> dict:
    collection = get_mongo_collection()
    if collection is not None:
        try:
            doc = collection.find_one({"identifier": "website_content_draft"})
            if doc:
                content = dict(doc)
                content.pop("_id", None)
                content.pop("identifier", None)
                return compile_full_content(content)
            else:
                # Seed draft with published content
                print("[MongoDB] Draft not found. Creating draft from published content...")
                published = load_content()
                try:
                    collection.replace_one(
                        {"identifier": "website_content_draft"},
                        {"identifier": "website_content_draft", **published},
                        upsert=True
                    )
                except Exception as e:
                    print(f"[MongoDB] Failed to write initial draft: {e}")
                return published
        except Exception as e:
            print(f"[MongoDB] Error loading draft: {e}. Using DEFAULT_CONTENT fallback.")
    return load_content()

def load_local_content() -> dict:
    # All data now lives in MongoDB. This function returns in-memory defaults only.
    return DEFAULT_CONTENT

def save_normalized_draft(data: dict):
    global mongo_db
    if mongo_db is None:
        return
        
    # Save site settings
    if "site_settings" in data:
        mongo_db["site_settings"].replace_one(
            {"identifier": "global_settings"},
            {"identifier": "global_settings", **data["site_settings"]},
            upsert=True
        )
        
    # Save about_us
    if "about_us" in data:
        mongo_db["about_us"].replace_one(
            {"identifier": "about_us_content"},
            {"identifier": "about_us_content", **data["about_us"]},
            upsert=True
        )

    # Save contact_settings
    if "contact_settings" in data:
        mongo_db["contact_settings"].replace_one(
            {"identifier": "contact_page_settings"},
            {"identifier": "contact_page_settings", **data["contact_settings"]},
            upsert=True
        )

    # Save ventures_settings
    if "ventures_settings" in data:
        mongo_db["ventures_settings"].replace_one(
            {"identifier": "ventures_page_settings"},
            {"identifier": "ventures_page_settings", **data["ventures_settings"]},
            upsert=True
        )

    # Save career_settings
    if "career_settings" in data:
        mongo_db["career_settings"].replace_one(
            {"identifier": "career_page_settings"},
            {"identifier": "career_page_settings", **data["career_settings"]},
            upsert=True
        )
        
    # Save culture_settings
    if "culture_settings" in data:
        mongo_db["culture_settings"].replace_one(
            {"identifier": "culture_page_settings"},
            {"identifier": "culture_page_settings", **data["culture_settings"]},
            upsert=True
        )
        
    # Save list-based collections (clear and insert to keep sync)
    list_collections = {
        "our_culture": "our_culture",
        "people": "people",
        "awards": "awards",
        "blogs": "blogs",
        "portfolio": "portfolio",
        "ventures": "ventures",
        "career_jobs": "career_jobs",
        "career_perks": "career_perks",
        "career_testimonials": "career_testimonials",
        "career_faqs": "career_faqs",
        "contact_offices": "contact_offices",
        "contact_faqs": "contact_faqs",
        "services_subpages": "services_subpages",
        "case_studies": "case_studies",
        "career_ladder": "career_ladder",
        "career_stats": "career_stats",
        "career_job_form_fields": "career_job_form_fields",
        "career_intern_form_fields": "career_intern_form_fields",
        "career_philosophy_cards": "career_philosophy_cards",
        "industries": "industries",
        "industry_projects": "industry_projects",
        "strategic_directives": "strategic_directives"
    }
    
    for key, coll_name in list_collections.items():
        if key in data and isinstance(data[key], list):
            mongo_db[coll_name].delete_many({})
            if data[key]:
                # Assign sort_order dynamically to preserve order during fetch sorting
                for idx, item in enumerate(data[key]):
                    if isinstance(item, dict):
                        item["sort_order"] = idx
                mongo_db[coll_name].insert_many(data[key])

def save_draft_db(data: dict):
    # Save to MongoDB (single source of truth)
    collection = get_mongo_collection()
    if collection is not None:
        try:
            # 1. Save base content draft
            base_keys = ["hero", "stats", "services", "caseStudy", "sectors", "milestones", "gallery", "brands", "testimonials", "bottomCta"]
            base_doc = {k: data.get(k) for k in base_keys if k in data}
            
            result = collection.replace_one(
                {"identifier": "website_content_draft"},
                {"identifier": "website_content_draft", **base_doc},
                upsert=True
            )
            print(f"[MongoDB] Base Draft saved (matched={result.matched_count}, modified={result.modified_count})")
            
            # 2. Sync to normalized collections
            save_normalized_draft(data)
        except Exception as e:
            print(f"[MongoDB] Error saving draft: {e}")
    else:
        print("[WARNING] MongoDB unavailable. Draft NOT saved.")

def publish_db(data: dict):
    # Save to MongoDB (single source of truth)
    collection = get_mongo_collection()
    if collection is not None:
        try:
            # Save base content published
            base_keys = ["hero", "stats", "services", "caseStudy", "sectors", "milestones", "gallery", "brands", "testimonials", "bottomCta"]
            base_doc = {k: data.get(k) for k in base_keys if k in data}
            
            collection.replace_one(
                {"identifier": "website_content_published"},
                {"identifier": "website_content_published", **base_doc},
                upsert=True
            )
            # Sync standard identifier
            collection.replace_one(
                {"identifier": "website_content"},
                {"identifier": "website_content", **base_doc},
                upsert=True
            )
            
            # Sync to normalized collections
            save_normalized_draft(data)
            print("[MongoDB] Published successfully.")
        except Exception as e:
            print(f"[MongoDB] Error publishing to db: {e}")
    else:
        print("[WARNING] MongoDB unavailable. Content NOT published.")
            
    # Save to version history
    history_coll = get_mongo_history_collection()
    if history_coll is not None:
        try:
            version_doc = {
                "timestamp": datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None).isoformat() + "Z",
                "content": data
            }
            history_coll.insert_one(version_doc)
            print("[MongoDB] Version entry logged.")
        except Exception as e:
            print(f"[MongoDB] Error writing history: {e}")

# schemas for API
class AdminPasswordReq(BaseModel):
    password: str

class PublishRequest(BaseModel):
    password: str
    content: dict

class DraftRequest(BaseModel):
    password: str
    content: dict

class RestoreRequest(BaseModel):
    password: str
    version_id: str

@app.get("/health", tags=["Health"])
async def health_check():
    db_status = "disconnected"
    collection = get_mongo_collection()
    if collection is not None:
        try:
            global mongo_client
            if mongo_client:
                mongo_client.admin.command('ping')
                db_status = "connected"
        except Exception:
            db_status = "error"
            
    return {
        "status": "healthy",
        "database": db_status,
        "service": "HariKrushn Digiverse Core API",
        "version": "1.0.0"
    }

@app.get("/api/content")
async def get_site_content():
    return load_content()

@app.get("/api/content/draft")
async def get_draft_content():
    return load_draft()

@app.post("/api/content/draft")
async def update_draft_content(req: DraftRequest):
    if not verify_admin_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    try:
        save_draft_db(req.content)
        return {"status": "success", "message": "Draft saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/content/publish")
async def publish_content(req: PublishRequest):
    if not verify_admin_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    try:
        publish_db(req.content)
        # Sync draft workspace with published state
        save_draft_db(req.content)
        return {"status": "success", "message": "Content published successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/content/history")
async def get_content_history():
    history_coll = get_mongo_history_collection()
    if history_coll is not None:
        try:
            cursor = history_coll.find({}, {"_id": 0}).sort("timestamp", -1).limit(20)
            return list(cursor)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return []

@app.post("/api/content/history/restore")
async def restore_content_version(req: RestoreRequest):
    if not verify_admin_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    history_coll = get_mongo_history_collection()
    if history_coll is None:
        raise HTTPException(status_code=500, detail="Database not available")
        
    try:
        doc = history_coll.find_one({"timestamp": req.version_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Version not found")
        content = doc["content"]
        save_draft_db(content)
        return {"status": "success", "message": f"Draft restored to version {req.version_id}", "content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload/resume")
async def upload_resume(file: UploadFile = File(...)):
    filename = file.filename or ""
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"]:
        raise HTTPException(status_code=400, detail="Only PDF, Word documents (.doc/.docx), or image formats are allowed.")
        
    uploads_dir = os.path.join("frontend", "public", "uploads", "resumes")
    os.makedirs(uploads_dir, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    resume_filename = f"resume_{timestamp}{ext}"
    resume_path = os.path.join(uploads_dir, resume_filename)
    
    with open(resume_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    resume_url = f"/uploads/resumes/{resume_filename}"
    return {
        "status": "success",
        "resumeUrl": resume_url,
        "filename": filename
    }

@app.post("/api/upload/image")
async def upload_image(file: UploadFile = File(...)):
    filename = file.filename or ""
    if not filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg")):
        raise HTTPException(status_code=400, detail="Only standard image files are allowed.")
        
    uploads_dir = os.path.join("frontend", "public", "images", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    ext = os.path.splitext(filename)[1]
    image_filename = f"img_{timestamp}{ext}"
    image_path = os.path.join(uploads_dir, image_filename)
    
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    image_url = f"/images/uploads/{image_filename}"
    return {
        "status": "success",
        "imageUrl": image_url
    }

@app.post("/api/upload/video")
async def upload_video(file: UploadFile = File(...)):
    filename = file.filename or ""
    if not filename.lower().endswith(".mp4"):
        raise HTTPException(status_code=400, detail="Only MP4 video files are allowed.")
        
    uploads_dir = os.path.join("frontend", "public", "images", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    video_filename = f"video_{timestamp}.mp4"
    video_path = os.path.join(uploads_dir, video_filename)
    
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Extract frames using OpenCV
    frames_dir = os.path.join("frontend", "public", "images", "frames")
    os.makedirs(frames_dir, exist_ok=True)
    
    # Clear old frames
    for filename in os.listdir(frames_dir):
        file_path = os.path.join(frames_dir, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception:
            pass
            
    if cv2 is None:
        raise HTTPException(status_code=500, detail="OpenCV not loaded in Python backend.")
        
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail="Failed to open uploaded MP4 video.")
        
    frame_count = 0
    max_frames = 500
    
    while cap.isOpened() and frame_count < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        frame_name = f"frame_{frame_count:04d}.jpg"
        frame_path = os.path.join(frames_dir, frame_name)
        cv2.imwrite(frame_path, frame, [cv2.IMWRITE_JPEG_QUALITY, 90])
        frame_count += 1
        
    cap.release()
    
    video_url = f"/images/uploads/{video_filename}"
    return {
        "status": "success",
        "videoUrl": video_url,
        "frameCount": frame_count
    }

class InquirySubmission(BaseModel):
    name: str
    email: str
    phone: str
    service: str
    budget: str
    message: str

class JobApplicationSubmission(BaseModel):
    job_id: str
    name: str
    email: str
    phone: str
    role: str
    resume: str
    message: str

class InternApplicationSubmission(BaseModel):
    name: str
    email: str
    phone: str
    track: str
    college: str
    resume: str
    message: str

def get_collection(name: str):
    global mongo_db
    if mongo_db is not None:
        return mongo_db[name]
    get_mongo_collection()
    if mongo_db is not None:
        return mongo_db[name]
    return None

@app.post("/api/inquiries")
async def create_inquiry(req: dict):
    coll = get_collection("inquiries")
    if coll is not None:
        try:
            doc = {**req}
            doc["created_at"] = datetime.datetime.now().isoformat()
            coll.insert_one(doc)
            return {"status": "success", "message": "Inquiry submitted successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=500, detail="Database not available")

@app.post("/api/applications/job")
async def apply_job(req: dict):
    coll = get_collection("career_applications")
    if coll is not None:
        try:
            doc = {**req}
            doc["type"] = "job"
            doc["applied_at"] = datetime.datetime.now().isoformat()
            coll.insert_one(doc)
            return {"status": "success", "message": "Application submitted successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=500, detail="Database not available")

@app.post("/api/applications/intern")
async def apply_intern(req: dict):
    coll = get_collection("career_applications")
    if coll is not None:
        try:
            doc = {**req}
            doc["type"] = "internship"
            doc["applied_at"] = datetime.datetime.now().isoformat()
            coll.insert_one(doc)
            return {"status": "success", "message": "Internship application submitted successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=500, detail="Database not available")

@app.post("/api/admin/inquiries")
async def get_inquiries(req: VerifyRequest):
    if not verify_admin_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    coll = get_collection("inquiries")
    if coll is not None:
        try:
            cursor = coll.find({}).sort("created_at", -1)
            results = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                results.append(doc)
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return []

@app.post("/api/admin/applications")
async def get_applications(req: VerifyRequest):
    if not verify_admin_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    coll = get_collection("career_applications")
    if coll is not None:
        try:
            cursor = coll.find({}).sort("applied_at", -1)
            results = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                results.append(doc)
            return results
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return []

class DeleteSubmissionRequest(BaseModel):
    password: str
    id: str
    type: str # 'inquiry' or 'application'

@app.post("/api/admin/submissions/delete")
async def delete_submission(req: DeleteSubmissionRequest):
    if not verify_admin_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    collection_name = "inquiries" if req.type == "inquiry" else "career_applications"
    coll = get_collection(collection_name)
    if coll is not None:
        try:
            from bson import ObjectId
            result = coll.delete_one({"_id": ObjectId(req.id)})
            if result.deleted_count > 0:
                return {"status": "success", "message": "Submission deleted successfully"}
            raise HTTPException(status_code=404, detail="Submission not found")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=500, detail="Database not available")

class ClearSubmissionsRequest(BaseModel):
    password: str
    type: str # 'inquiry' or 'application' or 'all'

@app.post("/api/admin/submissions/clear-all")
async def clear_all_submissions(req: ClearSubmissionsRequest):
    if not verify_admin_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    try:
        deleted_count = 0
        if req.type in ["inquiry", "all"]:
            coll_inq = get_collection("inquiries")
            if coll_inq is not None:
                res = coll_inq.delete_many({})
                deleted_count += res.deleted_count
        if req.type in ["application", "all"]:
            coll_app = get_collection("career_applications")
            if coll_app is not None:
                res = coll_app.delete_many({})
                deleted_count += res.deleted_count
        return {"status": "success", "message": f"Successfully deleted {deleted_count} submissions"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from app.core.security import verify_password, create_session_token, verify_session_token

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    token = authorization.replace("Bearer ", "")
    user = verify_session_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    return user

# Helper to write activity log
def log_action(username: str, role: str, action: str, details: dict):
    logs_coll = get_collection("activity_logs")
    if logs_coll is not None:
        try:
            logs_coll.insert_one({
                "username": username,
                "role": role,
                "action": action,
                "details": details,
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
            })
        except Exception as e:
            print(f"[Logs] Failed to write log: {e}")

class LoginRequest(BaseModel):
    username: str = "admin"
    password: str

@app.post("/api/auth/login")
async def login_api(req: LoginRequest):
    # 1. First verify against users collection
    users_coll = get_collection("users")
    if users_coll is not None:
        user = users_coll.find_one({"username": req.username, "deleted_at": None})
        if user and verify_password(req.password, user["hashed_password"]):
            role_name = user.get("role", "viewer")
            roles_coll = get_collection("roles")
            permissions = []
            if roles_coll is not None:
                role_doc = roles_coll.find_one({"name": role_name})
                if role_doc:
                    permissions = role_doc.get("permissions", [])
            
            token = create_session_token({
                "username": user["username"],
                "role": role_name,
                "permissions": permissions
            })
            return {
                "status": "success",
                "token": token,
                "user": {
                    "username": user["username"],
                    "role": role_name,
                    "permissions": permissions
                }
            }
            
    # 2. Legacy fallback
    if verify_admin_password(req.password):
        permissions = ["all"]
        token = create_session_token({
            "username": "admin",
            "role": "super_admin",
            "permissions": permissions
        })
        return {
            "status": "success",
            "token": token,
            "user": {
                "username": "admin",
                "role": "super_admin",
                "permissions": permissions
            }
        }
    raise HTTPException(status_code=401, detail="Invalid username or password")

@app.post("/api/auth/verify")
async def verify_auth(req: VerifyRequest):
    if verify_admin_password(req.password):
        return {"status": "success", "message": "Authentication successful"}
    raise HTTPException(status_code=401, detail="Invalid password")

@app.post("/api/content")
async def update_site_content(req: ContentUpdateRequest):
    if not verify_admin_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    try:
        publish_db(req.content)
        save_draft_db(req.content)
        return {"status": "success", "message": "Content updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save content: {str(e)}")

# GET collection items (Read)
@app.get("/api/collections/{collection_name}")
async def get_collection_items(
    collection_name: str,
    search: str | None = None,
    status: str | None = None,
    page: int = 1,
    limit: int = 100,
    user: dict = Depends(get_current_user)
):
    coll = get_collection(collection_name)
    if coll is None:
        raise HTTPException(status_code=404, detail="Collection not found")
        
    query = {"deleted_at": None}
    if status:
        query["status"] = status
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"name": {"$regex": search, "$options": "i"}},
            {"slug": {"$regex": search, "$options": "i"}},
            {"q": {"$regex": search, "$options": "i"}}
        ]
        
    try:
        cursor = coll.find(query, {"_id": 0})
        docs = list(cursor.sort("sort_order", 1).skip((page - 1) * limit).limit(limit))
        if not docs:
            cursor = coll.find(query, {"_id": 0})
            docs = list(cursor.sort("created_at", -1).skip((page - 1) * limit).limit(limit))
        return {
            "status": "success",
            "data": docs,
            "page": page,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# POST create collection item
@app.post("/api/collections/{collection_name}")
async def create_collection_item(
    collection_name: str,
    item: dict,
    user: dict = Depends(get_current_user)
):
    if "all" not in user["permissions"] and "content:write" not in user["permissions"]:
        raise HTTPException(status_code=403, detail="Permission denied")
        
    coll = get_collection(collection_name)
    if coll is None:
        raise HTTPException(status_code=404, detail="Collection not found")
        
    try:
        item["created_at"] = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None).isoformat() + "Z"
        item["updated_at"] = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None).isoformat() + "Z"
        item["created_by"] = user["username"]
        item["updated_by"] = user["username"]
        item["deleted_at"] = None
        if "status" not in item:
            item["status"] = "draft"
            
        if "sort_order" not in item:
            count = coll.count_documents({"deleted_at": None})
            item["sort_order"] = count
            
        coll.insert_one(item)
        item.pop("_id", None)
        log_action(user["username"], user["role"], f"create_{collection_name}", {"item": item})
        return {"status": "success", "message": "Item created successfully", "data": item}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PUT update collection item
@app.put("/api/collections/{collection_name}/{key_field}/{key_value}")
async def update_collection_item(
    collection_name: str,
    key_field: str,
    key_value: str,
    item: dict,
    user: dict = Depends(get_current_user)
):
    if "all" not in user["permissions"] and "content:write" not in user["permissions"]:
        raise HTTPException(status_code=403, detail="Permission denied")
        
    coll = get_collection(collection_name)
    if coll is None:
        raise HTTPException(status_code=404, detail="Collection not found")
        
    try:
        item.pop("_id", None)
        item["updated_at"] = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None).isoformat() + "Z"
        item["updated_by"] = user["username"]
        
        original = coll.find_one({key_field: key_value, "deleted_at": None})
        if not original:
            # Upsert fallback
            original = {}
            
        new_doc = {**original, **item}
        # Keep identifier fields immutable if they are dict keys
        coll.replace_one({key_field: key_value}, new_doc, upsert=True)
        log_action(user["username"], user["role"], f"update_{collection_name}", {"key": key_value, "changes": item})
        return {"status": "success", "message": "Item updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# DELETE soft delete item
@app.delete("/api/collections/{collection_name}/{key_field}/{key_value}")
async def delete_collection_item(
    collection_name: str,
    key_field: str,
    key_value: str,
    user: dict = Depends(get_current_user)
):
    if "all" not in user["permissions"] and "content:write" not in user["permissions"]:
        raise HTTPException(status_code=403, detail="Permission denied")
        
    coll = get_collection(collection_name)
    if coll is None:
        raise HTTPException(status_code=404, detail="Collection not found")
        
    try:
        original = coll.find_one({key_field: key_value, "deleted_at": None})
        if not original:
            raise HTTPException(status_code=404, detail="Item not found")
            
        coll.update_one(
            {key_field: key_value},
            {"$set": {"deleted_at": datetime.datetime.utcnow().isoformat() + "Z"}}
        )
        log_action(user["username"], user["role"], f"delete_{collection_name}", {"key": key_value})
        return {"status": "success", "message": "Item soft-deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# POST bulk reorder items
@app.post("/api/collections/{collection_name}/reorder")
async def reorder_collection(
    collection_name: str,
    req: dict,
    user: dict = Depends(get_current_user)
):
    if "all" not in user["permissions"] and "content:write" not in user["permissions"]:
        raise HTTPException(status_code=403, detail="Permission denied")
        
    coll = get_collection(collection_name)
    if coll is None:
        raise HTTPException(status_code=404, detail="Collection not found")
        
    orders = req.get("orders", [])
    key_field = req.get("key_field", "slug")
    try:
        for entry in orders:
            val = entry.get("key_value")
            order_idx = entry.get("order")
            coll.update_one(
                {key_field: val},
                {"$set": {"sort_order": order_idx, "updated_at": datetime.datetime.utcnow().isoformat() + "Z"}}
            )
        log_action(user["username"], user["role"], f"reorder_{collection_name}", {"count": len(orders)})
        return {"status": "success", "message": "Reordering synchronized successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET Media items
@app.get("/api/media")
async def get_media_items(
    folder: str = "/",
    user: dict = Depends(get_current_user)
):
    coll = get_collection("media_library")
    if coll is None:
        return {"status": "success", "data": []}
    try:
        cursor = coll.find({"folder_path": folder, "deleted_at": None}, {"_id": 0})
        return {"status": "success", "data": list(cursor)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Upload media with registration
@app.post("/api/media/upload")
async def upload_media_file(
    file: UploadFile = File(...),
    folder: str = "/",
    tags: str = "",
    user: dict = Depends(get_current_user)
):
    if "all" not in user["permissions"] and "media:upload" not in user["permissions"]:
        raise HTTPException(status_code=403, detail="Permission denied")
        
    allowed = (".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".mp4", ".pdf", ".zip", ".doc", ".docx")
    filename = file.filename or ""
    if not filename.lower().endswith(allowed):
        raise HTTPException(status_code=400, detail="Unsupported file format.")
        
    uploads_dir = os.path.join("frontend", "public", "images", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    ext = os.path.splitext(filename)[1]
    clean_name = "".join(c for c in os.path.splitext(filename)[0] if c.isalnum() or c in ("-", "_")).strip()
    saved_filename = f"{clean_name}_{timestamp}{ext}"
    saved_path = os.path.join(uploads_dir, saved_filename)
    
    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_url = f"/images/uploads/{saved_filename}"
    file_size = os.path.getsize(saved_path)
    
    coll = get_collection("media_library")
    if coll is not None:
        try:
            doc = {
                "filename": filename,
                "file_url": file_url,
                "file_type": file.content_type,
                "size_bytes": file_size,
                "folder_path": folder,
                "tags": [t.strip() for t in tags.split(",") if t.strip()],
                "created_by": user["username"],
                "created_at": datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None).isoformat() + "Z",
                "deleted_at": None
            }
            coll.replace_one({"file_url": file_url}, doc, upsert=True)
        except Exception as e:
            print(f"[Media] DB registration warning: {e}")
            
    return {
        "status": "success",
        "fileUrl": file_url,
        "filename": file.filename,
        "sizeBytes": file_size
    }

# DELETE media file
@app.delete("/api/media")
async def delete_media_file(
    file_url: str,
    user: dict = Depends(get_current_user)
):
    if "all" not in user["permissions"] and "media:delete" not in user["permissions"]:
        raise HTTPException(status_code=403, detail="Permission denied")
        
    coll = get_collection("media_library")
    if coll is not None:
        coll.update_one(
            {"file_url": file_url},
            {"$set": {"deleted_at": datetime.datetime.utcnow().isoformat() + "Z"}}
        )
        
    filename = file_url.split("/")[-1]
    saved_path = os.path.join("frontend", "public", "images", "uploads", filename)
    if os.path.exists(saved_path):
        try:
            os.remove(saved_path)
        except Exception:
            pass
            
    log_action(user["username"], user["role"], "delete_media", {"file_url": file_url})
    return {"status": "success", "message": "File deleted successfully"}

# GET Activity logs
@app.get("/api/admin/logs")
async def get_activity_logs(
    page: int = 1,
    limit: int = 50,
    user: dict = Depends(get_current_user)
):
    if "all" not in user["permissions"] and "logs:read" not in user["permissions"]:
        raise HTTPException(status_code=403, detail="Permission denied")
        
    coll = get_collection("activity_logs")
    if coll is None:
        return {"status": "success", "data": []}
    try:
        cursor = coll.find({}, {"_id": 0}).sort("timestamp", -1).skip((page - 1) * limit).limit(limit)
        return {"status": "success", "data": list(cursor)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Create backups JSON file
@app.post("/api/admin/backups/create")
async def create_backup(user: dict = Depends(get_current_user)):
    if "all" not in user["permissions"] and "backups:manage" not in user["permissions"]:
        raise HTTPException(status_code=403, detail="Permission denied")
        
    backup_dir = os.path.join(backend_dir, "backups")
    os.makedirs(backup_dir, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"backup_{timestamp}.json"
    backup_path = os.path.join(backup_dir, backup_filename)
    
    content = load_draft()
    try:
        with open(backup_path, "w", encoding="utf-8") as f:
            json.dump(content, f, indent=4, ensure_ascii=False)
            
        log_action(user["username"], user["role"], "create_backup", {"filename": backup_filename})
        return {"status": "success", "message": f"Backup created successfully: {backup_filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# List backups
@app.get("/api/admin/backups")
async def list_backups(user: dict = Depends(get_current_user)):
    if "all" not in user["permissions"] and "backups:manage" not in user["permissions"]:
        raise HTTPException(status_code=403, detail="Permission denied")
        
    backup_dir = os.path.join(backend_dir, "backups")
    os.makedirs(backup_dir, exist_ok=True)
    
    backups = []
    for f in os.listdir(backup_dir):
        if f.endswith(".json"):
            fp = os.path.join(backup_dir, f)
            backups.append({
                "filename": f,
                "size_bytes": os.path.getsize(fp),
                "created_at": datetime.datetime.fromtimestamp(os.path.getctime(fp)).isoformat()
            })
    return {"status": "success", "data": sorted(backups, key=lambda x: x["created_at"], reverse=True)}

# Restore from backup
@app.post("/api/admin/backups/restore")
async def restore_backup(req: dict, user: dict = Depends(get_current_user)):
    if "all" not in user["permissions"] and "backups:manage" not in user["permissions"]:
        raise HTTPException(status_code=403, detail="Permission denied")
        
    filename = req.get("filename")
    if not filename:
        raise HTTPException(status_code=400, detail="Missing filename")
        
    backup_path = os.path.join(backend_dir, "backups", filename)
    if not os.path.exists(backup_path):
        raise HTTPException(status_code=404, detail="Backup file not found")
        
    try:
        with open(backup_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        save_draft_db(data)
        publish_db(data)
        log_action(user["username"], user["role"], "restore_backup", {"filename": filename})
        return {"status": "success", "message": f"System successfully restored from {filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. Production Frontend SPA Server Setup
env_mode = os.getenv("ENV", "development")
if env_mode == "production":
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse

    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "frontend", "dist"))
    if os.path.exists(dist_dir):
        # Serve compiled static assets
        assets_dir = os.path.join(dist_dir, "assets")
        if os.path.exists(assets_dir):
            app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

        # Serve static public files (images, uploads) from dist
        images_dir = os.path.join(dist_dir, "images")
        if os.path.exists(images_dir):
            app.mount("/images", StaticFiles(directory=images_dir), name="images")

        uploads_dir = os.path.join(dist_dir, "uploads")
        if os.path.exists(uploads_dir):
            app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

        # Catch-all fallback route to support React SPA Routing (e.g. /our-people, /about-us)
        @app.get("/{catchall:path}")
        async def serve_spa_frontend(catchall: str):
            if catchall.startswith("api/") or catchall == "api" or catchall == "health" or catchall.startswith("docs") or catchall.startswith("openapi.json"):
                raise HTTPException(status_code=404)
            index_file = os.path.join(dist_dir, "index.html")
            if os.path.exists(index_file):
                return FileResponse(index_file)
            raise HTTPException(status_code=404)

# 4. Process Runner Orchestrator
if __name__ == "__main__":
    import signal

    print("\n" + "=" * 60)
    print("      HariKrushn Digiverse LLP - Service Orchestrator")
    print("=" * 60)

    # Determine Python executable
    def get_python_executable():
        paths = [
            os.path.join(backend_dir, "venv", "Scripts", "python.exe"),
            os.path.join(backend_dir, "venv", "bin", "python"),
        ]
        for p in paths:
            if os.path.exists(p):
                print(f"[System] Found virtual environment python: {p}")
                return p
        print(f"[System] Virtual environment python not found. Using system python: {sys.executable}")
        return sys.executable

    python_exe = get_python_executable()

    # Determine npm executable
    npm_cmd = "npm.cmd" if os.name == 'nt' else "npm"
    frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")

    # Write frontend env dynamically to sync backend port (only in development)
    if os.getenv("ENV", "development") != "production":
        backend_port = os.getenv("PORT", "8008")
        try:
            with open(os.path.join(frontend_dir, ".env"), "w") as f:
                f.write(f"VITE_API_URL=http://localhost:{backend_port}\n")
        except Exception as e:
            print(f"[System] Warning: Could not write frontend .env ({e})")

    # Run build synchronously first
    print("[System] Generating frontend production build...")
    try:
        subprocess.run([npm_cmd, "run", "build"], cwd=frontend_dir, check=True, shell=(os.name == 'nt'))
        print("[System] Production build created successfully!")
    except Exception as e:
        print(f"[System] Warning: Production build failed ({e}). Starting dev services anyway...")

    # Define commands
    # Use reload, but ignore frontend files to prevent restart loops
    backend_port = os.getenv("PORT", "8008")
    frontend_port = os.getenv("FRONTEND_PORT", "5173")
    backend_cmd = [
        python_exe, "-m", "uvicorn", "main:app",
        "--host", "0.0.0.0",
        "--port", backend_port,
        "--reload"
    ]
    frontend_cmd = [npm_cmd, "run", "dev", "--", "--port", frontend_port]

    processes = []

    def log_stream(stream, prefix):
        try:
            for line in iter(stream.readline, ''):
                if line:
                    sys.stdout.write(f"{prefix} {line}")
                    sys.stdout.flush()
        except Exception:
            pass

    def run_service(cmd, cwd, prefix):
        # We start the process using shell=False for direct signals and cleaner shutdown
        p = subprocess.Popen(
            cmd,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes.append(p)
        t = threading.Thread(target=log_stream, args=(p.stdout, prefix), daemon=True)
        t.start()
        return p

    def cleanup():
        print("\n[System] Shutting down all services...")
        for p in processes:
            try:
                if os.name == 'nt':
                    # Use taskkill on Windows to kill the process and its child processes cleanly
                    subprocess.run(
                        ["taskkill", "/F", "/T", "/PID", str(p.pid)],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL
                    )
                else:
                    p.terminate()
            except Exception:
                pass

    # Register signals for graceful termination (non-Windows)
    try:
        signal.signal(signal.SIGINT, lambda sig, frame: sys.exit(0))
        signal.signal(signal.SIGTERM, lambda sig, frame: sys.exit(0))
    except Exception:
        pass

    try:
        print("[System] Starting Backend (FastAPI)...")
        backend_proc = run_service(backend_cmd, os.path.dirname(__file__), "[Backend]")

        print("[System] Starting Frontend (Vite)...")
        frontend_proc = run_service(frontend_cmd, os.path.join(os.path.dirname(__file__), "frontend"), "[Frontend]")

        print("\n" + "=" * 60)
        print(f"  - Backend:  http://localhost:{backend_port}")
        print(f"  - Frontend: http://localhost:{frontend_port}")
        print("  - CTRL+C to terminate both servers")
        print("=" * 60 + "\n")

        # Monitor processes
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print(f"[System] Backend stopped with code {backend_proc.returncode}")
                break
            if frontend_proc.poll() is not None:
                print(f"[System] Frontend stopped with code {frontend_proc.returncode}")
                break

    except KeyboardInterrupt:
        pass
    finally:
        cleanup()
