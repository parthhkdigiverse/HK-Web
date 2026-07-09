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
  brands: {
    show: true,
    fontSize: "36px",
    imageSize: "56px",
    list: [
      { name: "SAPHIRA", logo: "/images/logos/saphira_logo.png" },
      { name: "NOVA", logo: "/images/logos/nova_logo.png" },
      { name: "CORE", logo: "/images/logos/core_logo.png" },
      { name: "AETHER", logo: "/images/logos/aether_logo.png" },
      { name: "QUANTUM", logo: "/images/logos/quantum_logo.png" },
      { name: "VERTEX", logo: "/images/logos/vertex_logo.png" },
      { name: "HELIOS", logo: "/images/logos/helios_logo.png" },
      { name: "ORION", logo: "/images/logos/orion_logo.png" },
      { name: "AXIOM", logo: "/images/logos/axiom_logo.png" }
    ]
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
      description: "Creating high-fidelity, cinematic, and fast-loading web applications that captivate and convert.",
      tags: ["FRONTEND", "DESIGN"],
      href: "#service-web",
      img: "/images/gallery/design_sprint.png",
      gradient: "from-blue-500 via-indigo-500 to-cyan-500"
    },
    {
      num: "02/07",
      title: "Mobile Applications",
      desc: "Building bespoke native-feeling iOS and Android solutions with fluid gestures and offline sync.",
      description: "Building bespoke native-feeling iOS and Android solutions with fluid gestures and offline sync.",
      tags: ["IOS", "ANDROID"],
      href: "#service-app",
      img: "/images/gallery/digiverse_workspace.png",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    {
      num: "03/07",
      title: "Custom Software",
      desc: "Constructing robust backend panels, CRM matrices, SaaS dashboards, and multi-tenant systems.",
      description: "Constructing robust backend panels, CRM matrices, SaaS dashboards, and multi-tenant systems.",
      tags: ["CRM", "ERP"],
      href: "#service-custom-software",
      img: "/images/quantum_banking.png",
      gradient: "from-amber-500 via-orange-500 to-yellow-500"
    },
    {
      num: "04/07",
      title: "Digital Marketing",
      desc: "Driving traffic and client acquisitions using data-backed strategies, SEO, and paid ads.",
      description: "Driving traffic and client acquisitions using data-backed strategies, SEO, and paid ads.",
      tags: ["SEO", "GROWTH"],
      href: "#service-digital-marketing",
      img: "/images/gallery/launch_celebration.png",
      gradient: "from-rose-500 via-pink-500 to-purple-500"
    },
    {
      num: "05/07",
      title: "Social Media Management",
      desc: "Crafting brand presence, graphic design guides, and content calendars to elevate recognition.",
      description: "Crafting brand presence, graphic design guides, and content calendars to elevate recognition.",
      tags: ["BRANDING", "CONTENT"],
      href: "#service-social-media-management",
      img: "/images/gallery/cinematic_review.png",
      gradient: "from-pink-500 via-fuchsia-500 to-violet-500"
    },
    {
      num: "06/07",
      title: "AI Consulting",
      desc: "Developing automated AI agents, vector database search pipelines, and custom LLM integrations.",
      description: "Developing automated AI agents, vector database search pipelines, and custom LLM integrations.",
      tags: ["LLM", "AGENTS"],
      href: "#service-ai-consulting",
      img: "/images/gallery/ai_orchestrator.png",
      gradient: "from-purple-500 via-violet-500 to-indigo-500"
    },
    {
      num: "07/07",
      title: "IT Consulting",
      desc: "Designing Cloud migrations, Docker orchestration files, hardened security, and CI/CD pipelines.",
      description: "Designing Cloud migrations, Docker orchestration files, hardened security, and CI/CD pipelines.",
      tags: ["CLOUD", "DEVOPS"],
      href: "#service-it-consulting",
      img: "/images/gallery/hardware_calibration.png",
      gradient: "from-sky-500 via-blue-500 to-indigo-500"
    }
  ],
  caseStudy: {
    show: true,
    client: "AeroCRM Aviation",
    logo: "/images/logos/aerocrm_logo.png",
    title: "Custom Cloud CRM Platform",
    label: "Simulation [CRM.v1]",
    image: "/images/gallery/digiverse_workspace.png",
    linkText: "View Case Study Details",
    linkHref: "#case-study",
    points: [
      "Constructed custom CRM dashboards with automated lead tracking pipelines",
      "Built secure client management portal and transaction records matrix",
      "Integrated automated contract signing and PDF invoice generators"
    ]
  },
  testimonials: {
    show: true,
    title: "Trusted by pioneers.",
    description: "Read what industry leaders say about our custom software engineering, high-fidelity interfaces, and digital architectures.",
    list: [
      {
        name: "Alexander Vance",
        role: "VP of Engineering, Saphira Aviation",
        quote: "HariKrushn DigiVerse completely transformed our fleet tracking CRM. Their engineering precision, combined with a meticulous design language, gave us a product that is both cinematic and lightning-fast. They operate at the highest level of craftsmanship.",
        rating: 5,
        avatar: "/images/gallery/avatar_alexander.png",
        tag: "CUSTOM CRM",
        color: "from-amber-500/10 to-orange-500/5",
        glowColor: "rgba(245,158,11,0.25)",
        tagClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        starClass: "text-amber-500"
      },
      {
        name: "Elena Rostova",
        role: "Co-Founder, Nova DeFi",
        quote: "Building a Web3 platform requires absolute trust and flawless UX. The team didn't just build our interfaces; they co-architected the user flow. Our transaction success rate increased by 40% after launching the new interface.",
        rating: 5,
        avatar: "/images/gallery/avatar_elena.png",
        tag: "WEB3 PLATFORM",
        color: "from-purple-500/10 to-indigo-500/5",
        glowColor: "rgba(168,85,247,0.25)",
        tagClass: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        starClass: "text-purple-500"
      },
      {
        name: "Marcus Thorn",
        role: "Head of Product, Core Logistics",
        quote: "Managing a global supply chain demands real-time data visibility. HariKrushn Digiverse built an AI-driven predictive dispatch matrix that integrated seamlessly with our legacy database. Their work is a masterclass in modern systems integration.",
        rating: 5,
        avatar: "/images/gallery/avatar_marcus.png",
        tag: "AI LOGISTICS",
        color: "from-emerald-500/10 to-teal-500/5",
        glowColor: "rgba(16,185,129,0.25)",
        tagClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        starClass: "text-emerald-500"
      }
    ]
  },
  bottomCta: {
    show: true,
    titleNormal: "Let's build the",
    titleItalic: "future together.",
    btnText: "Start a Project →",
    btnLink: "#contact"
  },
  sectors: ["FINTECH", "HEALTHTECH", "E-COMMERCE", "LOGISTICS", "EDTECH", "REAL ESTATE", "SAAS", "HOSPITALITY"],
  milestones: [
    {
      year: "2026",
      title: "The Cognitive Ecosystem",
      description: "Leading the global transition into edge-intelligence systems, autonomous visual frameworks, and secure multi-agent node coordination."
    },
    {
      year: "2025",
      title: "Spatial Web & Autonomous Agents",
      description: "Pioneered decentralized multi-agent architectures and immersive 3D spatial viewports that set new benchmarks for human-computer interaction."
    },
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
      logo_img: "/images/hk-logo.png",
      logo_text: "HARIKRUSHN DIGIVERSE LLP",
      description: "Architecting the infinite digital through precision engineering and editorial design.",
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
    ],
    personal_letter: {
      eyebrow: "// Personal Letter",
      title: "Crafting the Infinite Digital",
      founders: [
        {
          name: "Radhe Patel",
          role: "Co-Founder & CEO",
          img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=500&q=80",
          signatureTitle: "Radhe Patel, CEO"
        },
        {
          name: "Prince Patel",
          role: "Co-Founder & Partner",
          img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=500&q=80",
          signatureTitle: "Prince Patel, Partner"
        }
      ],
      paragraphs: [
        "Dear Partners & Clients,",
        "From the moment we envisioned HariKrushn DigiVerse, our goal was clear: to create corporate platforms that combine structural engineering with luxury aesthetics. Software should not just be functional; it should be an asset that inspires trust and is satisfying to interact with.",
        "We do not believe in taking shortcuts. Every system configuration, cloud setup, and animation path we build is designed with precision. We are committed to fostering deep engineering partnerships, helping your team scale into the next phase of digital business with confidence.",
        "Thank you for trusting us with your core technology architectures."
      ]
    },
    timeline_operational: {
      eyebrow: "// Operational Lifecycle",
      title: "Development Standards",
      steps: [
        {step: "Discovery", label: "01", desc: "Aligning business needs with technical deliverables, specifying database matrices and system blueprints."},
        {step: "Architecture", "label": "02", desc: "Drafting data models, serverless endpoint paths, caching grids, load handling, and folder schemas."},
        {step: "UI/UX Design", "label": "03", desc: "Crafting luxury glassmorphic layouts, customized typography matrices, responsive systems, and gestural motions."},
        {step: "Development", "label": "04", desc: "Coding responsive structures, clean React components, fast FastAPI routes, clean logic, and TDD validations."},
        {step: "Quality Assurance", "label": "05", desc: "Rigorous manual tests, automated Selenium scripts, concurrency validation, and memory leak analysis."},
        {step: "Deployment", "label": "06", desc: "Setting CI/CD integration checkpoints, cloud assets, and SSL certificates."},
        {step: "Continuous Improvement", "label": "07", desc: "Analyzing user telemetry, updating databases, tuning speeds, and updating emerging packages."}
      ]
    },
    office_locations: {
      eyebrow: "// Corporate Nodes",
      title: "Office Locations",
      offices: [
        {location: "Dubai Headquarters", code: "UAE-HQ", address: "Techno Hub, Silicon Oasis, Dubai, United Arab Emirates", contact: "hello@hkdigiverse.com"},
        {location: "Surat Development Hub", code: "IN-DEV", address: "401, HariKrushn Tower, VIP Road, Surat, GJ 395007, India", contact: "surat@hkdigiverse.com"},
        {location: "Future Expansion Nodes", code: "US/UK-EXP", address: "Planning operations hubs in London and New York tech hubs.", contact: "expansion@hkdigiverse.com"}
      ]
    },
    manifesto: {
      eyebrow: "// Company Manifesto",
      quote1: "We don't just build software. We build digital ecosystems.",
      quote2: "We don't follow technology. We create the future with it.",
      footnote: "// Every line of code should create measurable business value."
    }
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
    // Enterprise Root (Level 0)
    {name: "HariKrushn DigiVerse LLP", role: "Parent Organization", bio: "Empowering global enterprises through high-concurrency cloud systems, bespoke CRM software, and customized AI orchestrations.", level: 0, icon: "🏢", dept: "ENTERPRISE", image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=150&h=150&q=80", parent_id: null, sort_order: 0, status: "published", x: 550, y: 50},

    // Founders (Level 1)
    {name: "Radhe Patel", role: "Co-Founder & CEO", bio: "Leading strategic partnerships, vision, and growth. Radhe aligns complex commercial needs with exceptional digital delivery.", level: 1, icon: "⚡", dept: "FOUNDER", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "HariKrushn DigiVerse LLP", sort_order: 1, status: "published", x: 350, y: 180},
    {name: "Prince Patel", role: "Co-Founder & Managing Partner", bio: "Overseeing global operations, legal structures, and commercial growth strategy for HariKrushn DigiVerse.", level: 1, icon: "👑", dept: "FOUNDER", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "HariKrushn DigiVerse LLP", sort_order: 2, status: "published", x: 750, y: 180},
    
    // C-Suite (Level 2)
    {name: "Krushn Patel", role: "Chief Technology Officer", bio: "Pioneering system architectures, custom database layers, and robust AI orchestrations. Krushn codes systems that scale to millions.", level: 2, icon: "🛡️", dept: "C-SUITE / TECH", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Radhe Patel", sort_order: 3, status: "published", x: 200, y: 310},
    {name: "Arjun Shah", role: "Chief Design Officer", bio: "Shaping the digital craftsmanship ethos. Arjun creates high-end interactive visuals, smooth motion layouts, and premium user flows.", level: 2, icon: "📐", dept: "C-SUITE / DESIGN", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Radhe Patel", sort_order: 4, status: "published", x: 450, y: 310},
    {name: "Pooja Mehta", role: "Chief AI Officer", bio: "Integrating LLMs, custom training agent pipelines, and automated intelligence layers that streamline complex business workflows.", level: 2, icon: "🧠", dept: "C-SUITE / AI", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Prince Patel", sort_order: 5, status: "published", x: 700, y: 310},
    {name: "Neha Sharma", role: "Chief Marketing Officer", bio: "Leading business scaling, operational excellence, client strategy, and product delivery management for international accounts.", level: 2, icon: "📈", dept: "C-SUITE / GROWTH", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Prince Patel", sort_order: 6, status: "published", x: 950, y: 310},
    
    // Software Development Column (CTO)
    {name: "Vikram Rathod", role: "Software Dev Lead", bio: "Crafting fluid React interfaces and interactive visual layers with high-performance styling and custom motion graphics.", level: 3, icon: "💻", dept: "DEVELOPMENT", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Krushn Patel", sort_order: 6, status: "published", x: 100, y: 480},
    {name: "Aarav Singhania", role: "Senior Fullstack Developer", bio: "Architecting secure RESTful/GraphQL APIs, database schemas, and microservice infrastructure for high availability.", level: 4, icon: "⚙️", dept: "DEVELOPMENT", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Vikram Rathod", sort_order: 7, status: "published", x: 100, y: 660},
    {name: "Neil D'Souza", role: "Frontend Intern", bio: "Specializing in premium animations, user interactions, and CSS optimization across platforms.", level: 5, icon: "🎨", dept: "DEVELOPMENT", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Aarav Singhania", sort_order: 8, status: "published", x: 100, y: 840},
    
    // Product & QA Column (CTO)
    {name: "Simran Kaur", role: "Product & QA Lead", bio: "Managing strategic client communications, technical roadmaps, and cross-functional engineering deliverables.", level: 3, icon: "🤝", dept: "PRODUCT & QA", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Krushn Patel", sort_order: 9, status: "published", x: 350, y: 480},
    {name: "Dev Patel", role: "Senior QA Engineer", bio: "Optimizing server load, DevOps CI/CD deployments, and cloud scalability across multi-region networks.", level: 4, icon: "🚀", dept: "PRODUCT & QA", image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Simran Kaur", sort_order: 10, status: "published", x: 350, y: 660},
    {name: "Meera Nair", role: "Product Testing Intern", bio: "Structuring internal workflows, employee onboarding automation, and resource loading metrics.", level: 5, icon: "📋", dept: "PRODUCT & QA", image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Dev Patel", sort_order: 11, status: "published", x: 350, y: 840},
    
    // UI/UX & Design Column (CDO)
    {name: "Diya Joshi", role: "Creative & UI/UX Lead", bio: "Designing user-centered product flows, high-fidelity mockups, and unified design system architectures.", level: 3, icon: "✏️", dept: "CREATIVE & DESIGN", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Arjun Shah", sort_order: 12, status: "published", x: 600, y: 480},
    {name: "Isha Verma", role: "Senior UI Designer", bio: "Creating cinematic transitions, svg web animations, and premium micro-interactions that make interfaces feel alive.", level: 4, icon: "🎨", dept: "CREATIVE & DESIGN", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Diya Joshi", sort_order: 13, status: "published", x: 600, y: 660},
    {name: "Zara Khan", role: "UI/UX Intern", bio: "Collaborating on luxury layout frames, high-end vector branding assets, and client prototypes.", level: 5, icon: "📐", dept: "CREATIVE & DESIGN", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Isha Verma", sort_order: 14, status: "published", x: 600, y: 840},
    
    // AI Research Column (CAIO)
    {name: "Kabir Malhotra", role: "AI Research Lead", bio: "Directing multi-agent network strategies, prompt compiler layers, and local vector indexing pipelines.", level: 3, icon: "🧠", dept: "AI RESEARCH", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Pooja Mehta", sort_order: 15, status: "published", x: 850, y: 480},
    {name: "Rohan Das", role: "Senior AI Engineer", bio: "Tuning localized RAG models, semantic embedding matrices, and device-level agent routines.", level: 4, icon: "⚡", dept: "AI RESEARCH", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Kabir Malhotra", sort_order: 16, status: "published", x: 850, y: 660},
    {name: "Kabir Das", role: "AI Intern", bio: "Testing cognitive automation flows, custom dataset compilation, and prompt evaluation tests.", level: 5, icon: "💡", dept: "AI RESEARCH", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Rohan Das", sort_order: 17, status: "published", x: 850, y: 840},
    
    // Marketing & Brand Column (CMO)
    {name: "Yash Wardhan", role: "Marketing & Brand Lead", bio: "Coordinating international accounts, brand identity scaling, and digital narrative distributions.", level: 3, icon: "📈", dept: "MARKETING", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Neha Sharma", sort_order: 18, status: "published", x: 1100, y: 480},
    {name: "Ananya Sen", role: "Senior Digital Marketer", bio: "Designing analytics campaigns, conversion optimization charts, and luxury social marketing briefs.", level: 4, icon: "🎯", dept: "MARKETING", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Yash Wardhan", sort_order: 19, status: "published", x: 1100, y: 660},
    {name: "Simran Sen", role: "Digital Marketing Intern", bio: "Managing content placement tracking, SEO campaign metrics, and press distribution logs.", level: 5, icon: "📣", dept: "MARKETING", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80", parent_id: "Ananya Sen", sort_order: 20, status: "published", x: 1100, y: 840}
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
  ventures_settings: {
    overline: "// Our Initiatives",
    title: "Digiverse Ventures",
    subtitle: "Beyond client work, we build, incubate, and run initiatives that create lasting social and economic impact across India."
  },
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
    { title: 'Elite Hardware', desc: 'M3 Max MacBook Pro setups, dual 4K monitors, and custom layouts tailored to engineering speed.', color: 'emerald' },
    { title: 'Hybrid Autonomy', desc: 'Flexible hours and fluid work-from-home options to support creative focus and lifestyle flow.', color: 'blue' },
    { title: '20% R&D Labs', desc: 'Dedicate every Friday afternoon exclusively to experimental tools, personal projects, or open source.', color: 'purple' },
    { title: 'Elite Workspace', desc: 'Ergonomic seating, unlimited custom beans, and a high-frequency architectural design culture.', color: 'amber' },
    { title: 'Health Insurance', desc: 'Comprehensive medical insurance coverage for you and your family from day one of joining.', color: 'rose' },
    { title: 'Learning Budget', desc: '₹50,000 annual budget for courses, conferences, certifications, and technical book subscriptions.', color: 'cyan' }
  ],
  career_testimonials: [
    {
      name: 'Ravi Patel',
      role: 'Frontend Developer',
      tenure: '2 years',
      quote: "The engineering culture here is unmatched. Every day I get to push the boundaries of what's possible with web animations and performance. The team genuinely supports innovation.",
      rating: 5,
      color: 'from-emerald-500/10 to-teal-500/5',
      glowColor: 'rgba(16,185,129,0.25)',
      tag: 'ENGINEERING',
      tagClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      starClass: 'text-emerald-500'
    },
    {
      name: 'Priya Shah',
      role: 'UI/UX Designer',
      tenure: '1.5 years',
      quote: "I've grown more in 18 months here than in 4 years at my previous company. The design standards are world-class and inspiring. Every project is a new creative challenge.",
      rating: 5,
      color: 'from-purple-500/10 to-indigo-500/5',
      glowColor: 'rgba(168,85,247,0.25)',
      tag: 'DESIGN',
      tagClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      starClass: 'text-purple-500'
    },
    {
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
  ],
  career_faqs: [
    { q: 'What is the interview process like?', a: 'Our process typically involves 3 stages: an initial resume/portfolio screening, a technical or creative assessment, and a final culture-fit discussion with the founders. The entire process takes 5-7 business days.' },
    { q: 'Is remote work allowed?', a: 'Yes! Several roles support full remote work. For hybrid roles, we follow a flexible 3-days-in-office model at our Surat headquarters, with the remaining days being work-from-home.' },
    { q: 'What tech stack does HK use?', a: 'We primarily work with React, Next.js, FastAPI (Python), PostgreSQL, Docker, Flutter, and various AI/ML frameworks including LangChain, OpenAI APIs, and vector databases.' },
    { q: 'Do you offer internships?', a: 'Absolutely! We run 3-month and 6-month internship programs for college students. Interns work on real client projects alongside senior engineers and designers.' },
    { q: 'What is the salary range?', a: 'Compensation is competitive and depends on role, experience, and skills. We also offer performance bonuses, equity participation for senior roles, and annual increments.' },
    { q: 'How do I prepare for the interview?', a: 'Review our website portfolio, understand our design philosophy, and be ready to discuss your past projects in depth. For technical roles, practice system design and coding challenges.' }
  ],
  career_ladder: [
    { level: 'Intern', duration: '3-6 months', desc: 'Learn fundamentals, shadow senior team members, and contribute to live projects.' },
    { level: 'Junior', duration: 'Year 1', desc: 'Own small features independently, participate in code reviews, and build domain expertise.' },
    { level: 'Mid-Level', duration: 'Year 2-3', desc: 'Lead feature development, mentor juniors, and make architectural decisions.' },
    { level: 'Senior', duration: 'Year 3-5', desc: 'Drive technical strategy, lead client engagements, and define engineering standards.' },
    { level: 'Lead / Manager', duration: 'Year 5+', desc: 'Shape company direction, manage teams, and drive innovation across verticals.' }
  ],
  career_stats: [
    { value: '50+', label: 'Projects Delivered' },
    { value: '8+', label: 'Industries Served' },
    { value: '3+', label: 'Years of Excellence' },
    { value: '30+', label: 'Team Members' }
  ],
  career_settings: {
    title: "Build the Future",
    subtitle: "We are always looking for exceptional engineers, designers, and strategists obsessed with visual, motion, and backend perfection.",
    philosophy_eyebrow: "// Our Philosophy",
    philosophy_title: "Why Join HariKrushn Digiverse?",
    philosophy_desc: "We don't just build software — we engineer premium digital experiences that set industry benchmarks."
  },
  career_philosophy_cards: [
    {
      title: "Cutting-Edge Technology",
      desc: "Work with React, Next.js, Flutter, FastAPI, LLMs, Vector DBs, and cloud-native infrastructure every single day.",
      color: "emerald",
      icon: "lightning"
    },
    {
      title: "Collaborative Culture",
      desc: "Flat hierarchy, open communication, weekly knowledge-sharing sessions, and a team that genuinely cares about each other's growth.",
      color: "blue",
      icon: "users"
    },
    {
      title: "Real Client Impact",
      desc: "No throwaway projects. Every task impacts real businesses across fintech, healthcare, e-commerce, and AI platforms globally.",
      color: "purple",
      icon: "eye"
    }
  ],
  career_job_form_fields: [
    { id: "name", label: "Name", type: "text", placeholder: "Your name", required: true },
    { id: "phone", label: "Phone", type: "tel", placeholder: "+91 XXXXX XXXXX", required: false },
    { id: "email", label: "Email", type: "email", placeholder: "your@email.com", required: true },
    { id: "role", label: "Target Role", type: "text", placeholder: "Select a role or specify", required: true },
    { id: "resume", label: "Resume / Portfolio", type: "file", placeholder: "Or paste LinkedIn / GitHub / Portfolio URL", required: true },
    { id: "message", label: "Cover Note", type: "textarea", placeholder: "Tell us why you'd be a great fit...", required: false }
  ],
  career_intern_form_fields: [
    { id: "name", label: "Your Name", type: "text", placeholder: "Radhe Patel", required: true },
    { id: "email", label: "Email Address", type: "email", placeholder: "radhe@example.com", required: true },
    { id: "phone", label: "Phone Number", type: "tel", placeholder: "+91 99999 99999", required: true },
    { id: "track", label: "Select Track", type: "text", placeholder: "React/Next.js or specify track", required: true },
    { id: "college", label: "College Name & Current Semester", type: "text", placeholder: "SCET, Surat - Sem 6", required: true },
    { id: "resume", label: "Resume / Portfolio", type: "file", placeholder: "Or paste link (Google Drive, GitHub, etc.)", required: true }
  ],
  contact_settings: {
    title: "Let's Create Together",
    subtitle: "Have a project in mind, want to inquire about custom solutions, or simply want to say hello? We'd love to hear from you.",
    email_hello: "hello@harikrushndigiverse.com",
    email_join: "join@harikrushndigiverse.com",
    phone: "+91 98765 43210",
    stats: [
      { label: "2-4 Hour Response", value: "Mon — Sat", icon: "time" },
      { label: "Global Clients", value: "India • USA • UK • UAE", icon: "globe" },
      { label: "Free Consultation", value: "No obligation quote", icon: "shield" }
    ]
  },
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
  ],
  case_studies: [
    {
      slug: "vesper",
      client: "Vesper Luxury Living",
      title: "Cinematic Visual Sales Engine",
      industry: "Real Estate",
      summary: "We transformed Vesper's high-end property portal by integrating custom canvas scrubbing transitions, rendering 4K frame sequences that scroll smoothly on desktop and mobile. The cinematic experience increased buyer engagement dramatically.",
      challenge: "Vesper needed a property showcase that felt like a luxury brand experience, not a generic listing site. Their existing platform had poor mobile performance and lacked visual storytelling.",
      solution: "Built a custom canvas-based scroll scrub engine with optimized frame preloading, lazy-loaded 4K imagery, and GPU-accelerated transitions. Integrated interactive floor plans and virtual walkthrough modules.",
      tech: ["React", "Canvas API", "GSAP", "Vite", "Three.js"],
      img: "/images/casestudies/vesper.png",
      metrics: [
        { label: "Conversion Rate", value: "+142%" },
        { label: "Avg. Time on Page", value: "4m 12s" },
        { label: "Load Time", value: "0.8s" }
      ],
      duration: "4 months",
      color: "amber",
      accentColor: "#f59e0b",
      glowColor: "rgba(245,158,11,0.15)",
      sort_order: 0,
      status: "published"
    },
    {
      slug: "aerocrm",
      client: "AeroCRM Aviation",
      title: "Automated Operations Platform",
      industry: "Aviation",
      summary: "Replaced a fragmented array of legacy software sheets with a custom high-performance CRM, featuring automated emailers, booking schedules, vector notifications, and daily backups.",
      challenge: "AeroCRM was managing fleet operations across spreadsheets and disconnected tools, causing booking conflicts, delayed communications, and zero audit trails.",
      solution: "Architected a unified CRM with real-time booking conflict detection, automated email/SMS triggers, role-based dashboards, and end-to-end encrypted data backups running every 6 hours.",
      tech: ["React", "FastAPI", "PostgreSQL", "Docker", "Redis"],
      img: "/images/casestudies/aerocrm.png",
      metrics: [
        { label: "Operational Efficiency", value: "+400%" },
        { label: "Booking Failures", value: "0%" },
        { label: "Manual Input Time", value: "-85%" }
      ],
      duration: "6 months",
      color: "blue",
      accentColor: "#3b82f6",
      glowColor: "rgba(59,130,246,0.15)",
      sort_order: 1,
      status: "published"
    },
    {
      slug: "novadefi",
      client: "Nova DeFi",
      title: "Web3 Trading Platform & UX Overhaul",
      industry: "Fintech / Web3",
      summary: "Co-architected the complete user flow for Nova's decentralized finance platform, designing intuitive swap interfaces, wallet connectivity, and real-time portfolio dashboards.",
      challenge: "Nova's existing DeFi interface had a 60% user drop-off at the wallet connection step. Complex transaction flows confused first-time crypto users.",
      solution: "Redesigned the entire UX flow with progressive disclosure patterns, one-click wallet connect, real-time gas estimation, and visual transaction confirmations with animated feedback.",
      tech: ["Next.js", "Ethers.js", "Solidity", "The Graph", "Framer Motion"],
      img: "/images/casestudies/novadefi.png",
      metrics: [
        { label: "Transaction Success", value: "+40%" },
        { label: "User Drop-off", value: "-60%" },
        { label: "Daily Active Users", value: "3x" }
      ],
      duration: "5 months",
      color: "purple",
      accentColor: "#a855f7",
      glowColor: "rgba(168,85,247,0.15)",
      sort_order: 2,
      status: "published"
    },
    {
      slug: "corelogistics",
      client: "Core Logistics",
      title: "AI-Driven Supply Chain Matrix",
      industry: "Logistics",
      summary: "Constructed a custom supply chain optimization system from scratch, integrating AI-driven route prediction, real-time fleet tracking, and automated warehouse inventory management.",
      challenge: "Core Logistics was losing 20% of delivery efficiency due to manual route planning and lack of real-time visibility into fleet locations and warehouse stock levels.",
      solution: "Built an AI route optimizer using historical traffic and weather data, integrated GPS fleet tracking with geofence alerts, and automated inventory scanning with barcode/QR integration.",
      tech: ["Python", "TensorFlow", "React", "Google Maps API", "PostgreSQL"],
      img: "/images/casestudies/corelogistics.png",
      metrics: [
        { label: "Delivery Efficiency", value: "+38%" },
        { label: "Fuel Cost Savings", value: "12L/yr" },
        { label: "Real-time Accuracy", value: "99.7%" }
      ],
      duration: "7 months",
      color: "emerald",
      accentColor: "#10b981",
      glowColor: "rgba(16,185,129,0.15)",
      sort_order: 3,
      status: "published"
    },
    {
      slug: "pulsehealth",
      client: "Pulse MedTech",
      title: "HIPAA-Compliant Patient Portal",
      industry: "Healthcare",
      summary: "Designed and built a secure doctor-patient portal with encrypted medical records, automated appointment scheduling, video consultations, and digital prescription management.",
      challenge: "Pulse MedTech needed a patient management system that met strict HIPAA compliance while being intuitive enough for elderly patients to navigate without assistance.",
      solution: "Created an accessibility-first portal with large-text modes, voice-guided navigation, E2E encrypted data at rest and in transit, and automated appointment reminders via SMS and WhatsApp.",
      tech: ["React", "Express", "MongoDB", "WebGL", "Twilio"],
      img: "/images/casestudies/pulsehealth.png",
      metrics: [
        { label: "Patient Satisfaction", value: "4.9/5" },
        { label: "Booking Efficiency", value: "+200%" },
        { label: "Data Breach Incidents", value: "0" }
      ],
      duration: "5 months",
      color: "sky",
      accentColor: "#0ea5e9",
      glowColor: "rgba(14,165,233,0.15)",
      sort_order: 4,
      status: "published"
    },
    {
      slug: "learnverse",
      client: "LearnVerse Academy",
      title: "Full-Stack LMS with Live Classrooms",
      industry: "EdTech",
      summary: "Built a scalable Learning Management System with live video classrooms, adaptive quiz engines, real-time progress tracking, and automated certificate generation for 50,000+ students.",
      challenge: "LearnVerse was using Zoom for classes and Google Sheets for tracking, losing student engagement data and unable to personalize the learning experience.",
      solution: "Developed a custom LMS with WebRTC-based live classrooms, adaptive quizzing that adjusts difficulty based on performance, gamified progress dashboards, and auto-generated PDF certificates.",
      tech: ["Next.js", "WebRTC", "FastAPI", "PostgreSQL", "Redis"],
      img: "/images/casestudies/learnverse.png",
      metrics: [
        { label: "Student Retention", value: "+65%" },
        { label: "Course Completion", value: "94%" },
        { label: "Students Onboarded", value: "50K+" }
      ],
      duration: "6 months",
      color: "rose",
      accentColor: "#f43f5e",
      glowColor: "rgba(244,63,94,0.15)",
      sort_order: 5,
      status: "published"
    }
  ],
  industries: [
    {
      id: 'fintech',
      title: 'Fintech & Banking',
      description: 'Securing transaction ledgers, analytics engines, and automated KYC pipelines.',
      detailDescription: 'We build high-concurrency ledger databases, encrypted trading platforms, and automated compliance routing networks capable of processing millions of transactions securely. We implement zero-latency transaction locking and strict audit logs.',
      listImg: '/images/industries/fintech.png',
      detailImg: '/images/industries/fintech.png',
      bg: 'from-emerald-500/10 to-teal-500/10',
      colorClass: 'text-emerald-400',
      borderClass: 'border-emerald-500/20',
      glowClass: 'rgba(16,185,129,0.06)',
      accentColor: '#10b981',
      metrics: [
        { label: 'Volume Secured', value: '$50M+' },
        { label: 'KYC Compliance Rate', value: '100%' }
      ],
      sort_order: 1
    },
    {
      id: 'realestate',
      title: 'Real Estate & Properties',
      description: 'Virtual walkthrough platforms, interactive mapping, and organizer systems.',
      detailDescription: 'We craft immersive digital walkthrough experiences, responsive vector-based property maps, and centralized CRM dashboards to streamline buyer-agent interactions and automate lead pipelines.',
      listImg: '/images/industries/realestate.png',
      detailImg: '/images/industries/realestate.png',
      bg: 'from-blue-500/10 to-indigo-500/10',
      colorClass: 'text-blue-400',
      borderClass: 'border-blue-500/20',
      glowClass: 'rgba(59,130,246,0.06)',
      accentColor: '#3b82f6',
      metrics: [
        { label: '3D Renderings Served', value: '2,500+' },
        { label: 'Agent Efficiency Boost', value: '85%' }
      ],
      sort_order: 2
    },
    {
      id: 'ecommerce',
      title: 'Luxury E-Commerce',
      description: 'Immersive branding layouts, high-performance checkouts, and custom payment systems.',
      detailDescription: 'We develop ultra-premium headless shopping environments featuring 3D product previews, optimized image pipelines, and customized multi-currency Stripe checkouts that eliminate cart drop-offs.',
      listImg: '/images/industries/ecommerce.png',
      detailImg: '/images/industries/ecommerce.png',
      bg: 'from-amber-500/10 to-orange-500/10',
      colorClass: 'text-amber-400',
      borderClass: 'border-amber-500/20',
      glowClass: 'rgba(245,158,11,0.06)',
      accentColor: '#f59e0b',
      metrics: [
        { label: 'Checkout Load Time', value: '0.8s' },
        { label: 'Cart Conversion Lift', value: '32%' }
      ],
      sort_order: 3
    },
    {
      id: 'healthcare',
      title: 'Healthcare & Biotech',
      description: 'Doctor-patient portals, digital records grids, and encrypted backups.',
      detailDescription: 'We construct secure clinical dashboards, HIPAA-compliant patient communication networks, and end-to-end encrypted backup systems to protect patient data pipelines.',
      listImg: '/images/industries/healthcare.png',
      detailImg: '/images/industries/healthcare.png',
      bg: 'from-sky-500/10 to-cyan-500/10',
      colorClass: 'text-sky-400',
      borderClass: 'border-sky-500/20',
      glowClass: 'rgba(14,165,233,0.06)',
      accentColor: '#0ea5e9',
      metrics: [
        { label: 'HIPAA Encrypted Records', value: '5M+' },
        { label: 'Portal Booking Uptime', value: '100%' }
      ],
      sort_order: 4
    },
    {
      id: 'aisaas',
      title: 'AI SaaS Platforms',
      description: 'SaaS landing structures, multi-tenant databases, and custom agent integrations.',
      detailDescription: 'We engineer multi-tenant workspaces, custom semantic search caching networks, and automated prompt monitoring pipelines designed to reduce token cost overheads and scale agent runtimes.',
      listImg: '/images/industries/aisaas.png',
      detailImg: '/images/industries/aisaas.png',
      bg: 'from-purple-500/10 to-indigo-500/10',
      colorClass: 'text-purple-400',
      borderClass: 'border-purple-500/20',
      glowClass: 'rgba(168,85,247,0.06)',
      accentColor: '#a855f7',
      metrics: [
        { label: 'Inference Tokens Tracked', value: '2B+' },
        { label: 'Multi-Tenant Scale', value: 'Unlimited' }
      ],
      sort_order: 5
    },
    {
      id: 'education',
      title: 'Education & EdTech',
      description: 'Learning management systems, live classroom portals, and student analytics dashboards.',
      detailDescription: 'We build scalable LMS platforms with real-time video streaming, adaptive quiz engines, progress tracking dashboards, and automated certificate generation pipelines for universities and coaching institutes.',
      listImg: '/images/industries/education.png',
      detailImg: '/images/industries/education.png',
      bg: 'from-rose-500/10 to-pink-500/10',
      colorClass: 'text-rose-400',
      borderClass: 'border-rose-500/20',
      glowClass: 'rgba(244,63,94,0.06)',
      accentColor: '#f43f5e',
      metrics: [
        { label: 'Students Onboarded', value: '50K+' },
        { label: 'Course Completion Rate', value: '94%' }
      ],
      sort_order: 6
    },
    {
      id: 'logistics',
      title: 'Logistics & Supply Chain',
      description: 'Fleet tracking systems, warehouse automation, and shipment routing optimizers.',
      detailDescription: 'We develop GPS-integrated fleet monitoring dashboards, automated warehouse inventory scanners, and intelligent route optimization engines that cut delivery times and fuel costs across distribution networks.',
      listImg: '/images/industries/logistics.png',
      detailImg: '/images/industries/logistics.png',
      bg: 'from-orange-500/10 to-red-500/10',
      colorClass: 'text-orange-400',
      borderClass: 'border-orange-500/20',
      glowClass: 'rgba(249,115,22,0.06)',
      accentColor: '#f97316',
      metrics: [
        { label: 'Shipments Tracked', value: '1.2M+' },
        { label: 'Delivery Time Reduction', value: '38%' }
      ],
      sort_order: 7
    },
    {
      id: 'hospitality',
      title: 'Hospitality & Travel',
      description: 'Hotel booking engines, guest experience apps, and revenue management tools.',
      detailDescription: 'We craft elegant reservation platforms, guest concierge mobile applications, dynamic pricing engines, and review aggregation dashboards that help hospitality brands deliver five-star digital experiences.',
      listImg: '/images/industries/hospitality.png',
      detailImg: '/images/industries/hospitality.png',
      bg: 'from-teal-500/10 to-emerald-500/10',
      colorClass: 'text-teal-400',
      borderClass: 'border-teal-500/20',
      glowClass: 'rgba(20,184,166,0.06)',
      accentColor: '#14b8a6',
      metrics: [
        { label: 'Bookings Processed', value: '200K+' },
        { label: 'Guest Satisfaction Score', value: '4.9/5' }
      ],
      sort_order: 8
    }
  ],
  industry_projects: [
    {
      title: "Solis Trading Portal",
      industryId: "fintech",
      description: "A responsive fintech dashboard delivering rapid metric updates, instant payment gates, and multi-tenant scaling.",
      tech: ["React", "Stripe API", "AWS"],
      client: "Solis Ltd",
      sort_order: 1
    },
    {
      title: "Apex Ledger Engine",
      industryId: "fintech",
      description: "High-throughput transaction processing ledger built for institutional digital banking, handling 10k transactions/sec securely.",
      tech: ["FastAPI", "Redis", "Docker"],
      client: "Apex Capital",
      sort_order: 2
    },
    {
      title: "Vesper Luxury Homes",
      industryId: "realestate",
      description: "An immersive cinematic web experience built for high-end properties in London. Features high-frame-rate scroll scrub.",
      tech: ["Canvas API", "GSAP", "Vite"],
      client: "Vesper Estates",
      sort_order: 3
    },
    {
      title: "EstatesHub CRM",
      industryId: "realestate",
      description: "A virtual walkthrough dashboard and workflow coordinator built to align property metrics with agent pipelines.",
      tech: ["Next.js", "Tailwind", "PostgreSQL"],
      client: "EstatesHub Group",
      sort_order: 4
    },
    {
      title: "Aura Bespoke Checkout",
      industryId: "ecommerce",
      description: "Designing bespoke product layouts, high-performance checkout funnels, immersive branding pages, and robust Stripe payment logic.",
      tech: ["React", "Stripe", "Framer Motion"],
      client: "Aura Lifestyle",
      sort_order: 5
    },
    {
      title: "LuxeCart Engine",
      industryId: "ecommerce",
      description: "Tailor-made headless ecommerce store with multi-currency checkout, optimized product image load, and admin controls.",
      tech: ["Node.js", "GraphQL", "Shopify API"],
      client: "LuxeCart Global",
      sort_order: 6
    },
    {
      title: "Pulse Health Portal",
      industryId: "healthcare",
      description: "Constructing secure doctor-patient portals, digital record grids, automated booking queues, and encrypted data backups.",
      tech: ["React", "Express", "MongoDB"],
      client: "Pulse Medtech",
      sort_order: 7
    },
    {
      title: "GeneData Analyzer",
      industryId: "healthcare",
      description: "High-performance sequence visualization grid and encrypted biometric data storage complying with healthcare privacy standards.",
      tech: ["Python", "Django", "PostgreSQL"],
      client: "GeneData Labs",
      sort_order: 8
    },
    {
      title: "DevPulse Agentic System",
      industryId: "aisaas",
      description: "An automated developer metrics platform powered by custom LLM pipelines, pulling analytics directly from vector search.",
      tech: ["Python", "Vector DB", "FastAPI"],
      client: "DevPulse Inc",
      sort_order: 9
    },
    {
      title: "NeuroSaaS Grid",
      industryId: "aisaas",
      description: "Multi-tenant SaaS workspace integrated with custom agent orchestration, context management, and real-time usage metrics.",
      tech: ["React", "FastAPI", "PostgreSQL"],
      client: "NeuroSaaS Co",
      sort_order: 10
    },
    {
      title: "LearnVerse LMS",
      industryId: "education",
      description: "Full-stack learning management system with live video classrooms, adaptive quizzes, and automated progress certificates.",
      tech: ["Next.js", "WebRTC", "PostgreSQL"],
      client: "LearnVerse Academy",
      sort_order: 11
    },
    {
      title: "SkillPath Analytics",
      industryId: "education",
      description: "Student performance analytics dashboard tracking engagement metrics, quiz scores, and personalized learning recommendations.",
      tech: ["React", "D3.js", "FastAPI"],
      client: "SkillPath Institute",
      sort_order: 12
    },
    {
      title: "FreightPulse Tracker",
      industryId: "logistics",
      description: "Real-time GPS fleet monitoring dashboard with geofence alerts, driver performance logs, and fuel consumption analytics.",
      tech: ["React", "Node.js", "Google Maps API"],
      client: "FreightPulse Corp",
      sort_order: 13
    },
    {
      title: "ChainFlow Optimizer",
      industryId: "logistics",
      description: "AI-powered route optimization engine that reduces delivery times by analyzing traffic patterns, weather data, and load capacity.",
      tech: ["Python", "TensorFlow", "Redis"],
      client: "ChainFlow Logistics",
      sort_order: 14
    },
    {
      title: "StayLux Booking Engine",
      industryId: "hospitality",
      description: "Premium hotel reservation platform with dynamic pricing algorithms, room inventory sync, and multi-channel distribution.",
      tech: ["Next.js", "Stripe", "PostgreSQL"],
      client: "StayLux Resorts",
      sort_order: 15
    },
    {
      title: "GuestWave Concierge",
      industryId: "hospitality",
      description: "Mobile concierge application enabling guests to order room service, book spa sessions, and chat with hotel staff in real-time.",
      tech: ["Flutter", "Firebase", "Node.js"],
      client: "GuestWave Hotels",
      sort_order: 16
    }
  ],
  culture_settings: {
    subtitle: "// Where Code Meets Art",
    title: "Our Culture",
    description: "At HariKrushn DigiVerse LLP, our culture is the foundation of innovation, collaboration, and impact. We don't just build digital solutions, we build trust and long-term relationships.",
    gridSubtitle: "Life at HK DigiVerse",
    gridTitle: "More Than Work. It's Our Way of Life.",
    gridDescription: "At HK DigiVerse LLP, we believe that a strong culture builds a strong team. Here's what makes our workplace inspiring, engaging, and truly our own.",
    widgetSubtitle: "// Interactive Widget",
    widgetTitle: "Art & Logic Equilibrium",
    widgetDescription: "We operate at the intersection of fine digital art and deep system logic. Adjust the slider below to observe how the structures sync.",
    manifestoSubtitle: "// Manifesto Protocol",
    manifestoTitle: "The Culture Code",
    manifestoFilename: "hk_culture_protocol.json",
    manifestoCode: '{\n  "organization": "HariKrushn DigiVerse LLP",\n  "ethos": "Bespoke Digital Craftsmanship",\n  "foundationalRule": "Zero generic templates, 100% custom architectures",\n  "executionStandards": {\n    "designFrameRate": 120,\n    "backendQuality": "TDD + Strict API health parameters",\n    "deliveryPipeline": "Automated CI/CD gates"\n  },\n  "communicationCode": [\n    "High trust, absolute ownership",\n    "Low meetings, maximum coding flow",\n    "Constructive, transparent feedback loops"\n  ]\n}'
  }
};

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL + '/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data.career_jobs) data.careers = data.career_jobs;
        if (data.services) {
          data.services = data.services.map(s => ({
            ...s,
            description: s.description || s.desc || ''
          }));
        }
        setContent(data);
      } else {
        // API returned error, use defaults
        setContent(prev => prev || DEFAULT_CONTENT);
      }
    } catch (e) {
      console.warn("Failed to fetch dynamic content from API, using defaults:", e);
      // Only fall back to defaults if we don't have content yet
      setContent(prev => prev || DEFAULT_CONTENT);
    } finally {
      setLoading(false);
      setInitialLoadDone(true);
    }
  }, []);

  const fetchDraft = useCallback(async () => {
    try {
      const res = await fetch(API_URL + '/api/content/draft');
      if (res.ok) {
        const data = await res.json();
        if (data.career_jobs) data.careers = data.career_jobs;
        return data;
      }
    } catch (e) {
      console.error("Failed to fetch draft:", e);
    }
    return null;
  }, []);

  const saveDraft = useCallback(async (contentData, password) => {
    try {
      const payload = { ...contentData };
      if (payload.careers) payload.career_jobs = payload.careers;
      const res = await fetch(API_URL + '/api/content/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, content: payload })
      });
      return res.ok;
    } catch (e) {
      console.error("Failed to save draft:", e);
      return false;
    }
  }, []);

  const publishDraft = useCallback(async (contentData, password) => {
    try {
      const payload = { ...contentData };
      if (payload.careers) payload.career_jobs = payload.careers;
      const res = await fetch(API_URL + '/api/content/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, content: payload })
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

  // Don't render children until initial API fetch completes
  // This prevents the flash of default/static content
  if (!initialLoadDone) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        zIndex: 9999
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: '#a855f7',
            borderRadius: '50%',
            animation: 'hk-spin 0.8s linear infinite'
          }} />
          <span style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '13px',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}>Loading</span>
          <style>{`@keyframes hk-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

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
