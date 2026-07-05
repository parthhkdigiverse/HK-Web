import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const ContentContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8008';

export const DEFAULT_CONTENT = {
  hero: {
    label: "// EST. 2019 — A DIGITAL ATELIER",
    title1: "Architecting the",
    title2: "infinite digital.",
    desc: "HariKrushn DigiVerse is an engineering & design partnership building custom software, AI systems and digital brand presence for ambitious global teams."
  },
  stats: [
    { value: "140+", label: "Projects Shipped" },
    { value: "46", label: "Engineers" },
    { value: "18", label: "Countries Served" },
    { value: "98%", label: "Client Retention" }
  ],
  services: [
    {
      num: "01/07",
      title: "Web Engineering",
      desc: "Creating high-fidelity, cinematic, and fast-loading web applications that captivate and convert.",
      tags: ["FRONTEND", "DESIGN"],
      href: "#service-web"
    },
    {
      num: "02/07",
      title: "Mobile Applications",
      desc: "Building bespoke native-feeling iOS and Android solutions with fluid gestures and offline sync.",
      tags: ["IOS", "ANDROID"],
      href: "#service-app"
    },
    {
      num: "03/07",
      title: "Custom Software",
      desc: "Constructing robust backend panels, CRM matrices, SaaS dashboards, and multi-tenant systems.",
      tags: ["CRM", "ERP"],
      href: "#service-custom-software"
    },
    {
      num: "04/07",
      title: "Digital Marketing",
      desc: "Driving traffic and client acquisitions using data-backed strategies, SEO, and paid ads.",
      tags: ["SEO", "GROWTH"],
      href: "#service-digital-marketing"
    },
    {
      num: "05/07",
      title: "Social Media Management",
      desc: "Crafting brand presence, graphic design guides, and content calendars to elevate recognition.",
      tags: ["BRANDING", "CONTENT"],
      href: "#service-social-media-management"
    },
    {
      num: "06/07",
      title: "AI Consulting",
      desc: "Developing automated AI agents, vector database search pipelines, and custom LLM integrations.",
      tags: ["LLM", "AGENTS"],
      href: "#service-ai-consulting"
    },
    {
      num: "07/07",
      title: "IT Consulting",
      desc: "Designing Cloud migrations, Docker orchestration files, hardened security, and CI/CD pipelines.",
      tags: ["CLOUD", "DEVOPS"],
      href: "#service-it-consulting"
    }
  ],
  caseStudy: {
    title: "Quantum Banking OS",
    desc: "Re-architecting the core infrastructure for a leading European fintech. We replaced legacy monolithic systems with a high-concurrency microservices mesh capable of processing millions of transactions per second.",
    metric1Value: "+340%",
    metric1Label: "Throughput",
    metric2Value: "$12M",
    metric2Label: "Infra Saved",
    image: "/images/quantum_banking.png"
  },
  sectors: ["FINTECH", "HEALTHTECH", "E-COMMERCE", "LOGISTICS", "EDTECH", "REAL ESTATE", "SAAS", "HOSPITALITY"],
  milestones: [
    {
      year: "2024",
      title: "Digital Craftsmanship Leader",
      description: "Established a premium reputation in cinematic web engineering, high-end AI automation integrations, and luxury UI design."
    },
    {
      year: "2023",
      title: "Scaling Enterprise Systems",
      description: "Expanded capabilities to construct complex custom CRMs, cloud architectures, and deep AI-driven process automations for global businesses."
    },
    {
      year: "2022",
      title: "The Growth Phase",
      description: "Built a team of elite designers and developers. Delivered over 50 custom websites, creating immersive user interfaces that set new industry standards."
    },
    {
      year: "2021",
      title: "The Spark of Innovation",
      description: "HariKrushn Digiverse LLP was founded with a single mission: to merge fine design aesthetics with robust software engineering."
    }
  ],
  gallery: [
    { title: "The Digiverse Workspace", category: "Studio", size: "col-span-2 row-span-1", image: "/images/gallery/digiverse_workspace.png" },
    { title: "Design Sprint Session", category: "Team", size: "col-span-1 row-span-1", image: "/images/gallery/design_sprint.png" },
    { title: "Hardware Calibration", category: "Equipment", size: "col-span-1 row-span-2", image: "/images/gallery/hardware_calibration.png" },
    { title: "AI Orchestrator Architecture", category: "Engineering", size: "col-span-2 row-span-1", image: "/images/gallery/ai_orchestrator.png" },
    { title: "Cinematic Review", category: "Studio", size: "col-span-1 row-span-1", image: "/images/gallery/cinematic_review.png" },
    { title: "Launch Celebration", category: "Team", size: "col-span-2 row-span-1", image: "/images/gallery/launch_celebration.png" }
  ],
  site_settings: {
    logo_text: "HK DIGIVERSE",
    navbar_styles: {
      fontSize: "12px",
      color: "#a3a3a3",
      hoverColor: "#ffffff",
      logoSize: "14px",
      logoColor: "#ffffff"
    },
    navbar_links: [
      {
        label: "Company",
        href: "#",
        show: true,
        dropdown: [
          { label: "Our Story", href: "#our-story", show: true },
          { label: "Our People", href: "#our-people", show: true },
          { label: "Our Culture", href: "#our-culture", show: true },
          { label: "About Us", href: "#about-us", show: true },
          { label: "Awards and Achievements", href: "#awards-achievements", show: true },
          { label: "Blogs", href: "#blogs", show: true },
          { label: "Our Gallery", href: "#our-gallery", show: true }
        ]
      },
      { label: "Services", href: "#services", show: true },
      { label: "Industry", href: "#industry", show: true },
      { label: "Career", href: "#career", show: true },
      { label: "Case Study", href: "#case-study", show: true },
      { label: "Portfolio", href: "#portfolio", show: true },
      { label: "Ventures", href: "#ventures", show: true },
      { label: "Contact", href: "#contact", show: true }
    ],
    footer: {
      address: "Silver Trade Center, 501 & 502, near Pragati IT Park, Mota Varachha, Surat, Gujarat 394101",
      email: "contact@hkdigiverse.com",
      phone: "+91 98765 43210",
      copyright: "© 2026 HariKrushn DigiVerse LLP. All rights reserved.",
      capabilities: [
        { label: "Engineering", href: "#service-web", show: true },
        { label: "AI & ML", href: "#service-ai-consulting", show: true },
        { label: "Branding", href: "#service-social-media-management", show: true },
        { label: "Product Strategy", href: "#service-custom-software", show: true }
      ],
      ecosystem: [
        { label: "Portfolio", href: "#portfolio", show: true },
        { label: "Ventures", href: "#ventures", show: true },
        { label: "Careers", href: "#career", show: true },
        { label: "Contact", href: "#contact", show: true }
      ],
      social_links: [
        {platform: "LinkedIn", url: "https://linkedin.com", show: true},
        {platform: "Twitter", url: "https://twitter.com", show: true},
        {platform: "GitHub", url: "https://github.com", show: true},
        {platform: "Instagram", url: "https://instagram.com", show: true}
      ]
    }
  },
  about_us: {
    philosophy: {
      title: "Why We Exist",
      quote: "We exist to simplify digital transformation and construct scalable, future-ready technology platforms that drive clear business value.",
      description: "In a landscape crowded with off-the-shelf templates and rigid software designs, HariKrushn DigiVerse stands for bespoke digital craftsmanship. We combine architectural-grade frontend graphics with secure, high-concurrency microservices, crafting products that elevate your brand and work reliably."
    },
    vision: {
      title: "Our Vision",
      text: "To stand as the international benchmark for bespoke digital craftsmanship, engineering high-concurrency cloud networks that empower enterprises to run reliably at scale."
    },
    mission: {
      title: "Our Mission",
      text: "Architect fully autonomous multi-agent networks that execute secure device-level tasks, rendering real-time responsive spatial grids."
    },
    dna_values: [
      {name: "Innovation", desc: "Pushing technical boundaries to create custom, forward-thinking architectures."},
      {name: "Ownership", desc: "Taking complete accountability for code execution, product quality, and business impact."},
      {name: "Transparency", desc: "Clear, open communication with no hidden costs, agendas, or black boxes."},
      {name: "Execution", desc: "Moving fast from design blueprints to high-availability production code."},
      {name: "Learning", desc: "Constant upskilling and integration of emerging technology and scientific paradigms."},
      {name: "Quality", desc: "Writing clean, test-driven, performant code that stands the test of time."},
      {name: "Speed", desc: "Launching software rapidly without compromising architectural integrity."},
      {name: "Impact", desc: "Aligning software decisions directly with measurable enterprise value."}
    ],
    workspace_rooms: [
      {title: "The Digiverse Workspace", desc: "Ergonomic layout optimized for developer flow, equipped with dual 4K monitors.", img: "/images/gallery/digiverse_workspace.png", size: "col-span-2 row-span-1"},
      {title: "Design Sprint Lounge", desc: "Collaborative sandbox where visual assets and wireframe mockups are mapped.", img: "/images/gallery/design_sprint.png", size: "col-span-1 row-span-1"},
      {title: "Hardware Calibration Lab", desc: "Testing and deploying edge-AI microcomputers and localized sensory controllers.", img: "/images/gallery/hardware_calibration.png", size: "col-span-1 row-span-2"},
      {title: "AI Orchestration Suite", desc: "Servers dedicated to caching prompts and hosting sandboxed local LLM loops.", img: "/images/gallery/ai_orchestrator.png", size: "col-span-2 row-span-1"},
      {title: "Cinematic Review Deck", desc: "High-fidelity screens configured to audit front-end animations at 120 FPS.", img: "/images/gallery/cinematic_review.png", size: "col-span-1 row-span-1"},
      {title: "Launch Celebration Area", desc: "Recreational space dedicated to team milestones and collaborative growth.", img: "/images/gallery/launch_celebration.png", size: "col-span-2 row-span-1"}
    ]
  },
  our_culture: [
    {title: "Continuous Learning", desc: "We encourage curiosity and continuous learning. From new technologies to emerging trends, we invest in our team to stay future-ready.", img: "/images/culture/learning.png", icon: "learning", sort_order: 0, status: "published"},
    {title: "Collaborative Environment", desc: "We believe the best ideas come from working together. Open communication and teamwork are at the heart of everything we do.", img: "/images/culture/collab.png", icon: "collab", sort_order: 1, status: "published"},
    {title: "Celebrate Every Moment", desc: "From birthdays to big wins, we celebrate every milestone together. Because memories built together, last forever.", img: "/images/culture/celebrate.png", icon: "celebrate", sort_order: 2, status: "published"},
    {title: "Client Success Mindset", desc: "Our clients' goals become our mission. We focus on delivering real value and long-term growth through every solution we build.", img: "/images/culture/client.png", icon: "client", sort_order: 3, status: "published"},
    {title: "Ownership & Accountability", desc: "We take pride in ownership. Every team member is empowered to take initiative and deliver quality with integrity.", img: "/images/culture/ownership.png", icon: "ownership", sort_order: 4, status: "published"},
    {title: "Grow Without Limits", desc: "We provide the platform, resources, and freedom to grow. Your progress drives our progress. Together, we scale new heights.", img: "/images/culture/grow.png", icon: "grow", sort_order: 5, status: "published"}
  ],
  people: [
    {name: "Radhe Patel", role: "Co-Founder & CEO", bio: "Leading strategic partnerships, vision, and growth. Radhe aligns complex commercial needs with exceptional digital delivery.", level: 1, icon: "⚡", dept: "FOUNDER", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", parent_id: null, sort_order: 0, status: "published"},
    {name: "Prince Patel", role: "Co-Founder & Managing Partner", bio: "Overseeing global operations, legal structures, and commercial growth strategy for HariKrushn DigiVerse.", level: 1, icon: "👑", dept: "FOUNDER", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", parent_id: null, sort_order: 1, status: "published"},
    {name: "Krushn Patel", role: "Chief Technology Officer", bio: "Pioneering system architectures, custom database layers, and robust AI orchestrations. Krushn codes systems that scale to millions.", level: 2, icon: "🛡️", dept: "C-SUITE / TECH", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Radhe Patel", sort_order: 2, status: "published"},
    {name: "Arjun Shah", role: "Chief Design Officer", bio: "Shaping the digital craftsmanship ethos. Arjun creates high-end interactive visuals, smooth motion layouts, and premium user flows.", level: 2, icon: "📐", dept: "C-SUITE / DESIGN", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Radhe Patel", sort_order: 3, status: "published"},
    {name: "Pooja Mehta", role: "Chief AI Officer", bio: "Integrating LLMs, custom training agent pipelines, and automated intelligence layers that streamline complex business workflows.", level: 2, icon: "🧠", dept: "C-SUITE / AI", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Prince Patel", sort_order: 4, status: "published"},
    {name: "Neha Sharma", role: "Chief Marketing Officer", bio: "Leading business scaling, operational excellence, client strategy, and product delivery management for international accounts.", level: 2, icon: "📈", dept: "C-SUITE / GROWTH", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Prince Patel", sort_order: 5, status: "published"},
    {name: "Vikram Rathod", role: "Software Dev Lead", bio: "Crafting fluid React interfaces and interactive visual layers with high-performance styling and custom motion graphics.", level: 3, icon: "💻", dept: "DEVELOPMENT", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Krushn Patel", sort_order: 6, status: "published"},
    {name: "Aarav Singhania", role: "Senior Fullstack Developer", bio: "Architecting secure RESTful/GraphQL APIs, database schemas, and microservice infrastructure for high availability.", level: 4, icon: "⚙️", dept: "DEVELOPMENT", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Vikram Rathod", sort_order: 7, status: "published"},
    {name: "Neil D'Souza", role: "Frontend Intern", bio: "Specializing in premium animations, user interactions, and CSS optimization across platforms.", level: 5, icon: "🎨", dept: "DEVELOPMENT", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Aarav Singhania", sort_order: 8, status: "published"}
  ],
  awards: [
    {
      slug: "digital-craftsmanship",
      title: "Best Digital Craftsmanship Studio",
      by: "Tech & Design Guild",
      year: "2024",
      description: "Awarded to HariKrushn DigiVerse for outstanding excellence in building bespoke, high-performance web systems and premium responsive animations.",
      category: "company",
      recipient: "HariKrushn DigiVerse LLP",
      img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&h=400&q=80",
      longDescription: "This award recognizes our studio's commitment to pushing the boundaries of web engineering and aesthetics. The Tech & Design Guild evaluated our projects based on visual supremacy, codebase clean-room metrics, and 120 FPS motion responses on high-concurrency portals.",
      impactStats: [
        {label: "Evaluation Score", value: "99.4%"},
        {label: "Performance Rank", value: "Top 1%"},
        {label: "Motion Frame Rate", value: "120 FPS"}
      ],
      highlights: [
        "Exceptional design engineering rating",
        "Bespoke web framework rendering standards",
        "Pioneering user interactivity paradigms"
      ],
      sort_order: 0,
      status: "published"
    }
  ],
  blogs: [
    {
      slug: "microservices",
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
      ],
      status: "published"
    },
    {
      slug: "cinematic-design",
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
      ],
      status: "published"
    },
    {
      slug: "ai-agents",
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
      ],
      status: "published"
    }
  ],
  portfolio: [
    {
      slug: "zenith",
      title: "Zenith CRM Platform",
      client: "Zenith Global",
      category: "platform",
      description: "An automation-rich CRM platform designed for global distribution and supply chains, featuring real-time analytical logs, automated email campaigns, and role-based dashboards.",
      tech: ["React", "FastAPI", "Docker", "PostgreSQL"],
      img: "/images/casestudies/corelogistics.png",
      color: "emerald",
      accentColor: "#10b981",
      sort_order: 0,
      status: "published"
    },
    {
      slug: "devpulse",
      title: "DevPulse Agentic System",
      client: "DevPulse Inc",
      category: "ai",
      description: "An automated developer metrics platform powered by custom LLM pipelines, pulling analytics directly from vector search and providing AI-generated code review summaries.",
      tech: ["Python", "Vector DB", "FastAPI", "LangChain"],
      img: "/images/casestudies/novadefi.png",
      color: "purple",
      accentColor: "#a855f7",
      sort_order: 1,
      status: "published"
    },
    {
      slug: "solis",
      title: "Solis Trading Portal",
      client: "Solis Ltd",
      category: "platform",
      description: "A responsive fintech dashboard delivering rapid metric updates, instant payment gates, multi-tenant scaling, and real-time portfolio tracking with Stripe integration.",
      tech: ["React", "Stripe API", "AWS", "Redis"],
      img: "/images/casestudies/vesper.png",
      color: "amber",
      accentColor: "#f59e0b",
      sort_order: 2,
      status: "published"
    }
  ],
  ventures: [
    {
      slug: "aisetu",
      name: "AI Setu",
      tagline: "Bridging India to AI",
      status: "Active",
      img: "/images/ventures/aisetu.png",
      color: "cyan",
      accentColor: "#06b6d4",
      glowColor: "rgba(6,182,212,0.20)",
      shortDesc: "A national-scale AI literacy and integration initiative designed to democratize artificial intelligence across Tier-2 and Tier-3 cities of India.",
      fullDescription: "AI Setu (meaning \"AI Bridge\") is our flagship social-impact venture aimed at making artificial intelligence accessible, understandable, and usable for every Indian citizen — regardless of their technical background. We believe AI should not remain an urban privilege. From local shopkeepers to rural entrepreneurs, AI Setu bridges the knowledge gap through vernacular workshops, ready-to-deploy AI toolkits, and community-driven learning hubs.",
      mission: "To create a seamless bridge between cutting-edge AI technology and India's diverse population, enabling 10 million people to leverage AI tools for business, education, and governance by 2030.",
      vision: "An India where every citizen, regardless of geography or language, can harness the power of AI to improve their livelihood, education, and community governance.",
      keyInitiatives: [
        {title: "Vernacular AI Workshops", desc: "Free monthly workshops in Hindi, Gujarati, Tamil, Telugu, and Marathi teaching AI basics, prompt engineering, and tool usage to local entrepreneurs and students."},
        {title: "AI Toolkit for SMEs", desc: "Pre-built AI templates for invoice processing, customer support chatbots, inventory prediction, and marketing automation — all in regional languages."},
        {title: "AI Setu Fellowship", desc: "A 6-month paid fellowship for graduates from Tier-2/3 cities to learn AI engineering and get placed in top tech companies."}
      ],
      impactStats: [
        {label: "Cities Reached", value: "25+"},
        {label: "Workshops Conducted", value: "100+"},
        {label: "Lives Impacted", value: "50K+"},
        {label: "AI Models Released", value: "15+"}
      ],
      techStack: ["Python", "FastAPI", "LangChain", "React Native", "PostgreSQL", "Hugging Face"],
      partners: ["IIT Research Labs", "State Skill Missions", "Google for Startups", "NASSCOM"],
      sort_order: 0,
      status: "published"
    }
  ],
  career_jobs: [
    {
      slug: "frontend",
      title: "Senior Frontend Architect",
      department: "Engineering",
      type: "Full-time / Hybrid",
      location: "Surat, Gujarat",
      description: "We are seeking an expert developer capable of building cinematic frontend experiences. Experience with custom Canvas, GSAP, WebGL, and Lenis smooth scrolling is highly desired.",
      requirements: ["4+ years of React development experience", "Extensive knowledge of DOM rendering performance", "Deep expertise in CSS transitions and canvas mechanics"],
      steps: ["Resume & Portfolio Screening", "30-Min Technical Sync", "Culture Fit & Offer"],
      status: "published"
    },
    {
      slug: "ai-eng",
      title: "Senior AI Systems Engineer",
      department: "AI & Data",
      type: "Full-time / Hybrid",
      location: "Surat, Gujarat",
      description: "You will orchestrate localized LLM middleware solutions, agent-to-agent architectures, vector search databases, and automated pipelines syncing CRMs with intelligence systems.",
      requirements: ["3+ years in Python, FastAPI, and Docker", "Strong background in prompt engineering and embeddings", "Experience deploying scalable async applications"],
      steps: ["Resume & Technical Briefing", "Sandbox Coding Test", "Architecture Discussion & Offer"],
      status: "published"
    }
  ],
  career_perks: [
    {title: "Elite Hardware", desc: "M3 Max MacBook Pro setups, dual 4K monitors, and custom layouts tailored to engineering speed.", color: "emerald"},
    {title: "Hybrid Autonomy", desc: "Flexible hours and fluid work-from-home options to support creative focus and lifestyle flow.", color: "blue"},
    {title: "20% R&D Labs", desc: "Dedicate every Friday afternoon exclusively to experimental tools, personal projects, or open source.", color: "purple"}
  ],
  career_testimonials: [
    {name: "Ravi Patel", role: "Frontend Developer", tenure: "2 years", quote: "The engineering culture here is unmatched. Every day I get to push the boundaries of what's possible with web animations and performance.", rating: 5, color: "from-emerald-500/10 to-teal-500/5", glowColor: "rgba(16,185,129,0.25)", tag: "ENGINEERING", tagClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", starClass: "text-emerald-500"}
  ],
  career_faqs: [
    {q: "What is the interview process like?", a: "Our process typically involves 3 stages: an initial resume/portfolio screening, a technical or creative assessment, and a final culture-fit discussion with the founders. The entire process takes 5-7 business days."},
    {q: "Is remote work allowed?", a: "Yes! Several roles support full remote work. For hybrid roles, we follow a flexible 3-days-in-office model at our Surat headquarters."}
  ],
  contact_offices: [
    {
      slug: "surat",
      city: "Surat",
      country: "INDIA",
      role: "Headquarters",
      address: "Silver Trade Center, 501 & 502, near Pragati IT Park, Mota Varachha, Surat, Gujarat 394101",
      phone: "+91 98765 43210",
      timeZone: "Asia/Kolkata",
      isHQ: true,
      color: "border-emerald-500/10 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    }
  ],
  contact_faqs: [
    {q: "How quickly do you respond to inquiries?", a: "We aim to respond to every inquiry within 2-4 business hours during working days (Mon-Sat)."},
    {q: "What is the minimum project budget?", a: "Our projects typically start from ₹50,000 for basic websites."}
  ],
  services_subpages: [
    {
      identifier: "service_web",
      title: "Web Engineering",
      description: "Crafting high-fidelity, cinematic, and fast-loading web applications using custom WebGL rendering, 120 FPS Framer Motion structures, and optimized server side rendering (SSR).",
      tech_stack: {
        react: {name: "React.js", role: "Frontend core framework that enables component reusability, quick routing, and reactive virtual DOM state updates.", badge: "Interactive UI"},
        nextjs: {name: "Next.js", role: "Server-side rendering (SSR), static site generation (SSG), and optimized image parameters for rapid load times.", badge: "SEO & Speed"}
      }
    }
  ]
};

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL + '/api/content');
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (e) {
      console.warn("Failed to fetch dynamic content from API, using defaults:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDraft = useCallback(async () => {
    try {
      const res = await fetch(API_URL + '/api/content/draft');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error("Failed to fetch draft:", e);
    }
    return null;
  }, []);

  const saveDraft = useCallback(async (contentData, password) => {
    try {
      const res = await fetch(API_URL + '/api/content/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, content: contentData })
      });
      return res.ok;
    } catch (e) {
      console.error("Failed to save draft:", e);
      return false;
    }
  }, []);

  const publishDraft = useCallback(async (contentData, password) => {
    try {
      const res = await fetch(API_URL + '/api/content/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, content: contentData })
      });
      if (res.ok) {
        fetchContent();
        return true;
      }
    } catch (e) {
      console.error("Failed to publish content:", e);
      return false;
    }
    return false;
  }, [fetchContent]);

  const getHistory = useCallback(async () => {
    try {
      const res = await fetch(API_URL + '/api/content/history');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error("Failed to get version history:", e);
    }
    return [];
  }, []);

  const restoreVersion = useCallback(async (versionId, password) => {
    try {
      const res = await fetch(API_URL + '/api/content/history/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, version_id: versionId })
      });
      if (res.ok) {
        const data = await res.json();
        return data.content;
      }
    } catch (e) {
      console.error("Failed to restore content version:", e);
    }
    return null;
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'UPDATE_CMS_PREVIEW') {
        setContent(event.data.content);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <ContentContext.Provider value={{ 
      content, 
      loading, 
      reloadContent: fetchContent,
      fetchDraft,
      saveDraft,
      publishDraft,
      getHistory,
      restoreVersion
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return ctx;
}
