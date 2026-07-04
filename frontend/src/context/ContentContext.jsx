import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const ContentContext = createContext(null);

const DEFAULT_CONTENT = {
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
  ]
};

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8008/api/content');
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
      const res = await fetch('http://localhost:8008/api/content/draft');
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
      const res = await fetch('http://localhost:8008/api/content/draft', {
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
      const res = await fetch('http://localhost:8008/api/content/publish', {
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
      const res = await fetch('http://localhost:8008/api/content/history');
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
      const res = await fetch('http://localhost:8008/api/content/history/restore', {
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
