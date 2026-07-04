import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8008';

const DEFAULT_CONTENT = {
  hero: {
    label: "// EST. 2019 — A DIGITAL ATELIER",
    title1: "Architecting the",
    title2: "infinite digital.",
    desc: "HariKrushn DigiVerse is an engineering & design partnership building custom software, AI systems and digital brand presence for ambitious global teams.",
    primaryBtnText: "Start a Project →",
    primaryBtnLink: "#contact",
    secondaryBtnText: "View Work",
    secondaryBtnLink: "#portfolio",
    videoUrl: "/images/hero_video.mp4",
    frameCount: 315,
    height: "100vh",
    overlayColor: "#000000",
    overlayOpacity: 0.5,
    align: "left",
    show: true
  },
  stats: [
    { value: "140+", label: "Projects Shipped", show: true },
    { value: "46", label: "Engineers", show: true },
    { value: "18", label: "Countries Served", show: true },
    { value: "98%", label: "Client Retention", show: true }
  ],
  services: [
    {
      num: "01/07",
      title: "Web Engineering",
      desc: "Creating high-fidelity, cinematic, and fast-loading web applications that captivate and convert.",
      tags: ["FRONTEND", "DESIGN"],
      href: "#service-web",
      show: true
    },
    {
      num: "02/07",
      title: "Mobile Applications",
      desc: "Building bespoke native-feeling iOS and Android solutions with fluid gestures and offline sync.",
      tags: ["IOS", "ANDROID"],
      href: "#service-app",
      show: true
    },
    {
      num: "03/07",
      title: "Custom Software",
      desc: "Constructing robust backend panels, CRM matrices, SaaS dashboards, and multi-tenant systems.",
      tags: ["CRM", "ERP"],
      href: "#service-custom-software",
      show: true
    },
    {
      num: "04/07",
      title: "Digital Marketing",
      desc: "Driving traffic and client acquisitions using data-backed strategies, SEO, and paid ads.",
      tags: ["SEO", "GROWTH"],
      href: "#service-digital-marketing",
      show: true
    },
    {
      num: "05/07",
      title: "Social Media Management",
      desc: "Crafting brand presence, graphic design guides, and content calendars to elevate recognition.",
      tags: ["BRANDING", "CONTENT"],
      href: "#service-social-media-management",
      show: true
    },
    {
      num: "06/07",
      title: "AI Consulting",
      desc: "Developing automated AI agents, vector database search pipelines, and custom LLM integrations.",
      tags: ["LLM", "AGENTS"],
      href: "#service-ai-consulting",
      show: true
    },
    {
      num: "07/07",
      title: "IT Consulting",
      desc: "Designing Cloud migrations, Docker orchestration files, hardened security, and CI/CD pipelines.",
      tags: ["CLOUD", "DEVOPS"],
      href: "#service-it-consulting",
      show: true
    }
  ]
};

export default function AdminPanel() {
  const { 
    fetchDraft, 
    saveDraft, 
    publishDraft, 
    getHistory, 
    restoreVersion, 
    loading: globalLoading 
  } = useContent();

  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Workspace and History state
  const [history, setHistory] = useState([DEFAULT_CONTENT]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('hero');
  const [previewDevice, setPreviewDevice] = useState('desktop'); // desktop, tablet, mobile
  const [isDirty, setIsDirty] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(true);

  // Status and Modals
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetType, setResetType] = useState(''); // 'section' or 'default'
  const [versionList, setVersionList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Upload states
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const iframeRef = useRef(null);

  // Active state content is pulled from our history stack
  const currentContent = history[historyIndex] || DEFAULT_CONTENT;

  // Verify stored credentials on mount
  useEffect(() => {
    const savedPassword = sessionStorage.getItem('adminPassword');
    if (savedPassword) {
      setPassword(savedPassword);
      verifyPassword(savedPassword);
    } else {
      setLoadingDraft(false);
    }
  }, []);

  const verifyPassword = async (passToVerify) => {
    setIsVerifying(true);
    setAuthError('');
    try {
      const res = await fetch(API_URL + '/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passToVerify })
      });
      if (res.ok) {
        setAuthorized(true);
        sessionStorage.setItem('adminPassword', passToVerify);
        // Load working draft after successful auth
        loadDraft(passToVerify);
      } else {
        setAuthError('Access Denied. Incorrect admin password.');
        sessionStorage.removeItem('adminPassword');
      }
    } catch (err) {
      setAuthError('Connection failed. Verify if the API server is active.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      verifyPassword(password.trim());
    }
  };

  const loadDraft = async (pass) => {
    setLoadingDraft(true);
    try {
      const res = await fetch(API_URL + '/api/content/draft');
      if (res.ok) {
        const draft = await res.json();
        // Fallbacks for draft schema compatibility
        const sanitized = {
          ...DEFAULT_CONTENT,
          ...draft,
          hero: { ...DEFAULT_CONTENT.hero, ...(draft.hero || {}) },
          stats: (draft.stats || DEFAULT_CONTENT.stats).map(s => ({ show: true, ...s })),
          services: (draft.services || DEFAULT_CONTENT.services).map(s => ({ show: true, ...s }))
        };
        setHistory([sanitized]);
        setHistoryIndex(0);
        setIsDirty(false);
      }
    } catch (e) {
      console.error("Failed to load draft from database:", e);
    } finally {
      setLoadingDraft(false);
    }
  };

  // Push new state onto history stack and notify iframe
  const pushState = (newContent) => {
    const cleanHistory = history.slice(0, historyIndex + 1);
    if (cleanHistory.length >= 50) {
      cleanHistory.shift();
    }
    const updatedHistory = [...cleanHistory, newContent];
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setIsDirty(true);
    syncIframe(newContent);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      syncIframe(history[prevIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      syncIframe(history[nextIndex]);
    }
  };

  // Send state updates to preview iframe
  const syncIframe = (contentToSend) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'UPDATE_CMS_PREVIEW', content: contentToSend },
        window.location.origin
      );
    }
  };

  // Handle message listener from preview iframe
  useEffect(() => {
    const handlePreviewMessages = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'CMS_PREVIEW_READY') {
        // Iframe is ready, push current state immediately
        syncIframe(currentContent);
      }
    };
    window.addEventListener('message', handlePreviewMessages);
    return () => window.removeEventListener('message', handlePreviewMessages);
  }, [currentContent]);

  // CMS state modifiers
  const updateHeroField = (field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.hero[field] = value;
    pushState(nextContent);
  };

  const updateStatCard = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.stats[index][field] = value;
    pushState(nextContent);
  };

  const addStatCard = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.stats.push({ value: '100+', label: 'New Metric', show: true });
    pushState(nextContent);
  };

  const duplicateStatCard = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const card = { ...nextContent.stats[index] };
    nextContent.stats.splice(index + 1, 0, card);
    pushState(nextContent);
  };

  const deleteStatCard = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.stats.splice(index, 1);
    pushState(nextContent);
  };

  const moveStatCard = (index, direction) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const targetIdx = index + direction;
    if (targetIdx >= 0 && targetIdx < nextContent.stats.length) {
      const temp = nextContent.stats[index];
      nextContent.stats[index] = nextContent.stats[targetIdx];
      nextContent.stats[targetIdx] = temp;
      pushState(nextContent);
    }
  };

  const updateServiceItem = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (field === 'tags') {
      nextContent.services[index].tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    } else {
      nextContent.services[index][field] = value;
    }
    pushState(nextContent);
  };

  const addServiceItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const num = `0${nextContent.services.length + 1}/07`;
    nextContent.services.push({
      num,
      title: 'New Service Capability',
      desc: 'Describe this service capability here.',
      tags: ['TAG'],
      href: '#',
      show: true
    });
    pushState(nextContent);
  };

  const duplicateServiceItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const service = { ...nextContent.services[index] };
    nextContent.services.splice(index + 1, 0, service);
    pushState(nextContent);
  };

  const deleteServiceItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.services.splice(index, 1);
    pushState(nextContent);
  };

  const moveServiceItem = (index, direction) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const targetIdx = index + direction;
    if (targetIdx >= 0 && targetIdx < nextContent.services.length) {
      const temp = nextContent.services[index];
      nextContent.services[index] = nextContent.services[targetIdx];
      nextContent.services[targetIdx] = temp;
      pushState(nextContent);
    }
  };

  // Upload handlers
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(API_URL + '/api/upload/image', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        updateHeroField('videoUrl', ''); // Override video if choosing poster
        updateHeroField('videoPoster', data.imageUrl);
        setSaveStatus({ type: 'success', message: 'Poster image uploaded successfully!' });
      } else {
        const err = await res.json();
        setSaveStatus({ type: 'error', message: err.detail || 'Upload failed' });
      }
    } catch {
      setSaveStatus({ type: 'error', message: 'Network error uploading image' });
    } finally {
      setIsUploadingImage(false);
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
    }
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingVideo(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(API_URL + '/api/upload/video', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        const nextContent = JSON.parse(JSON.stringify(currentContent));
        nextContent.hero.videoUrl = data.videoUrl;
        nextContent.hero.frameCount = data.frameCount;
        pushState(nextContent);
        setSaveStatus({ type: 'success', message: `Video uploaded and ${data.frameCount} frames extracted successfully!` });
      } else {
        const err = await res.json();
        setSaveStatus({ type: 'error', message: err.detail || 'Video processing failed' });
      }
    } catch {
      setSaveStatus({ type: 'error', message: 'Network error uploading video' });
    } finally {
      setIsUploadingVideo(false);
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 4000);
    }
  };

  // Draft & Publish Actions
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setSaveStatus({ type: '', message: '' });
    const success = await saveDraft(currentContent, password);
    if (success) {
      setIsDirty(false);
      setSaveStatus({ type: 'success', message: 'Draft saved successfully to MongoDB.' });
    } else {
      setSaveStatus({ type: 'error', message: 'Failed to save draft content.' });
    }
    setIsSaving(false);
    setTimeout(() => setSaveStatus({ type: '', message: '' }), 4000);
  };

  const handlePublish = async () => {
    setIsSaving(true);
    setSaveStatus({ type: '', message: '' });
    const success = await publishDraft(currentContent, password);
    if (success) {
      setIsDirty(false);
      setSaveStatus({ type: 'success', message: 'Website published successfully! Changes are live.' });
    } else {
      setSaveStatus({ type: 'error', message: 'Failed to publish changes.' });
    }
    setIsSaving(false);
    setTimeout(() => setSaveStatus({ type: '', message: '' }), 4000);
  };

  const handleDiscardChanges = () => {
    // Reload draft content to discard current stack changes
    loadDraft(password);
    setSaveStatus({ type: 'success', message: 'Discarded workspace changes.' });
    setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
  };

  // Resets
  const triggerReset = (type) => {
    setResetType(type);
    setShowResetModal(true);
  };

  const confirmReset = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    
    if (resetType === 'section') {
      // Reset active section to default hardcoded config
      nextContent[activeTab] = JSON.parse(JSON.stringify(DEFAULT_CONTENT[activeTab]));
      pushState(nextContent);
      setSaveStatus({ type: 'success', message: `Reset ${activeTab} section to default template.` });
    } else if (resetType === 'default') {
      // Full restore to hardcoded DEFAULT_CONTENT
      pushState(DEFAULT_CONTENT);
      setSaveStatus({ type: 'success', message: 'Restored all sections to default template.' });
    }
    
    setShowResetModal(false);
    setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
  };

  // Version history operations
  const openHistoryList = async () => {
    setLoadingHistory(true);
    setShowHistoryModal(true);
    const historyList = await getHistory();
    setVersionList(historyList);
    setLoadingHistory(false);
  };

  const handleRestoreVersion = async (versionTimestamp) => {
    const restoredData = await restoreVersion(versionTimestamp, password);
    if (restoredData) {
      pushState(restoredData);
      setSaveStatus({ type: 'success', message: `Restored workspace to version from ${new Date(versionTimestamp).toLocaleString()}` });
      setShowHistoryModal(false);
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 4000);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminPassword');
    setAuthorized(false);
    window.location.hash = '#home';
  };

  // Form view before authorization
  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-[#e5e2e1] px-6">
        <div className="w-full max-w-md bg-[#0c0c0c] border border-white/5 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.01),transparent)] pointer-events-none" />
          
          <div className="text-center mb-8 space-y-2">
            <svg className="w-12 h-12 text-white mx-auto mb-4" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M35 50 L65 50 M50 35 L50 65" stroke="currentColor" strokeWidth="2.5" />
            </svg>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">Admin CMS Authorization</h2>
            <p className="font-light text-neutral-500 text-xs tracking-wider uppercase font-mono">System Verification Required</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block font-light">CLEARANCE PASSWORD</label>
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
                required
              />
            </div>

            {authError && (
              <div className="text-red-400 text-xs font-mono text-center bg-red-500/5 py-3 rounded-lg border border-red-500/10">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-4 bg-white text-black font-semibold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-200 transition-colors duration-300 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Authenticate'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button 
              onClick={() => { window.location.hash = '#home'; }}
              className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest transition-colors cursor-pointer"
            >
              Cancel & Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loadingDraft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-[#e5e2e1]">
        <span className="font-mono text-xs text-neutral-400 animate-pulse">// LOADING WORKSPACE SCHEMATICS...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black text-[#e5e2e1] overflow-hidden select-none">
      
      {/* LEFT PANEL: CMS CONTROLS (35% Width on desktop, full width on mobile) */}
      <aside className="w-full lg:w-[35%] lg:min-w-[380px] lg:max-w-[500px] border-b lg:border-b-0 lg:border-r border-white/5 bg-[#070707] flex flex-col h-[50vh] lg:h-full relative z-20 overflow-y-auto">
        
        {/* Editor Title */}
        <header className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="font-display text-sm font-bold tracking-widest text-white uppercase">HK DIGIVERSE</h1>
            <p className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-light">// VISUAL CMS BUILDER</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="text-[9px] font-mono tracking-widest text-neutral-400 hover:text-red-400 uppercase transition-colors duration-300 border border-white/10 rounded-full px-3 py-1.5 hover:border-red-500/20 cursor-pointer"
          >
            Logout
          </button>
        </header>

        {/* Tab Selector Accordions */}
        <nav className="flex border-b border-white/5 bg-black/30">
          {['hero', 'stats', 'services'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-[9px] uppercase tracking-widest font-mono font-medium border-b-2 cursor-pointer transition-all duration-300 ${
                activeTab === tab 
                  ? 'border-white text-white bg-white/[0.01]' 
                  : 'border-transparent text-neutral-500 hover:text-white'
              }`}
            >
              {tab === 'hero' ? 'Hero Section' : tab === 'stats' ? 'Statistics' : 'Capabilities'}
            </button>
          ))}
        </nav>

        {/* CMS Configuration Panels */}
        <section className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          
          {/* 1. HERO CMS PANEL */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              
              {/* Section Show Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">Show Hero Section</span>
                <button
                  onClick={() => updateHeroField('show', currentContent.hero.show !== false ? false : true)}
                  className={`w-12 h-6 rounded-full transition-colors duration-300 relative cursor-pointer ${
                    currentContent.hero.show !== false ? 'bg-white' : 'bg-neutral-800'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform duration-300 ${
                    currentContent.hero.show !== false ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Label & Texts */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block font-light">Small Label</label>
                  <input
                    type="text"
                    value={currentContent.hero.label}
                    onChange={(e) => updateHeroField('label', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block font-light">Main Title Line 1</label>
                    <input
                      type="text"
                      value={currentContent.hero.title1}
                      onChange={(e) => updateHeroField('title1', e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block font-light">Main Title Line 2 (Italic)</label>
                    <input
                      type="text"
                      value={currentContent.hero.title2}
                      onChange={(e) => updateHeroField('title2', e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block font-light">Hero Description</label>
                  <textarea
                    rows={4}
                    value={currentContent.hero.desc}
                    onChange={(e) => updateHeroField('desc', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none focus:border-white/30 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Layout Alignment & Dimensions */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-white">// Layout & Dimensions</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block font-light">Text Alignment</label>
                    <div className="flex border border-white/10 rounded-lg overflow-hidden">
                      {['left', 'center', 'right'].map(alignOpt => (
                        <button
                          key={alignOpt}
                          type="button"
                          onClick={() => updateHeroField('align', alignOpt)}
                          className={`flex-1 py-2 text-[9px] uppercase font-mono tracking-widest cursor-pointer hover:bg-white/5 transition-colors ${
                            currentContent.hero.align === alignOpt ? 'bg-white text-black font-semibold hover:bg-white' : 'text-neutral-400'
                          }`}
                        >
                          {alignOpt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block font-light">Section Height</label>
                    <select
                      value={currentContent.hero.height || '100vh'}
                      onChange={(e) => updateHeroField('height', e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none focus:border-white/30"
                    >
                      <option value="100vh">100vh (Full Window)</option>
                      <option value="90vh">90vh</option>
                      <option value="80vh">80vh</option>
                      <option value="70vh">70vh</option>
                    </select>
                  </div>
                </div>

                {/* Overlay Opacity & Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block font-light">Overlay Opacity</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={currentContent.hero.overlayOpacity !== undefined ? currentContent.hero.overlayOpacity : 0.5}
                        onChange={(e) => updateHeroField('overlayOpacity', parseFloat(e.target.value))}
                        className="flex-1 accent-white bg-neutral-800"
                      />
                      <span className="font-mono text-[9px] text-neutral-400 w-8 text-right">
                        {Math.round((currentContent.hero.overlayOpacity !== undefined ? currentContent.hero.overlayOpacity : 0.5) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 block font-light">Overlay Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={currentContent.hero.overlayColor || '#000000'}
                        onChange={(e) => updateHeroField('overlayColor', e.target.value)}
                        className="w-10 h-10 border border-white/10 bg-black rounded-lg cursor-pointer p-1"
                      />
                      <input
                        type="text"
                        value={currentContent.hero.overlayColor || '#000000'}
                        onChange={(e) => updateHeroField('overlayColor', e.target.value)}
                        className="flex-1 px-4 py-3 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none focus:border-white/30 uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Actions buttons */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-white">// Call to Action Buttons</h3>
                
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Primary Btn Label</label>
                      <input
                        type="text"
                        value={currentContent.hero.primaryBtnText}
                        onChange={(e) => updateHeroField('primaryBtnText', e.target.value)}
                        className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Primary Btn Link</label>
                      <input
                        type="text"
                        value={currentContent.hero.primaryBtnLink}
                        onChange={(e) => updateHeroField('primaryBtnLink', e.target.value)}
                        className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Secondary Btn Label</label>
                      <input
                        type="text"
                        value={currentContent.hero.secondaryBtnText}
                        onChange={(e) => updateHeroField('secondaryBtnText', e.target.value)}
                        className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Secondary Btn Link</label>
                      <input
                        type="text"
                        value={currentContent.hero.secondaryBtnLink}
                        onChange={(e) => updateHeroField('secondaryBtnLink', e.target.value)}
                        className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Asset Management */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-white">// Video Asset Management</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Active MP4 Video File</label>
                    <div className="text-[10px] font-mono text-neutral-500 break-all mb-2">
                      URL: {currentContent.hero.videoUrl || 'Default local asset'}
                    </div>
                    
                    <div className="flex gap-4">
                      <label className="flex-1 py-3 border border-white/10 hover:border-white/30 text-center rounded-xl bg-white/5 text-[9px] uppercase tracking-widest font-mono cursor-pointer hover:bg-white/10 transition-all text-white font-semibold">
                        {isUploadingVideo ? 'Processing File...' : 'Upload Video File'}
                        <input
                          type="file"
                          accept="video/mp4"
                          onChange={handleUploadVideo}
                          disabled={isUploadingVideo}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {isUploadingVideo && (
                      <div className="text-[9px] font-mono text-neutral-400 animate-pulse mt-2 block text-center">
                        ⚠️ Processing video. Extracting frames via OpenCV (Headless).
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Dynamic Canvas Frame Count</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={currentContent.hero.frameCount || 315}
                        onChange={(e) => updateHeroField('frameCount', parseInt(e.target.value) || 315)}
                        className="w-24 px-4 py-2.5 bg-black border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none"
                      />
                      <span className="font-mono text-[9px] text-neutral-500 leading-relaxed">
                        Determines the number of scroll images cached (typically 100-500 frames).
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 2. STATISTICS CMS PANEL */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">// Active Metric Cards ({currentContent.stats.length})</span>
                <button
                  onClick={addStatCard}
                  className="px-4 py-2 bg-white text-black font-semibold text-[9px] uppercase tracking-widest rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  + Add Card
                </button>
              </div>

              <div className="space-y-4">
                {currentContent.stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 relative group"
                  >
                    {/* Position controls & delete */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">Metric Card #{index + 1}</span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          disabled={index === 0}
                          onClick={() => moveStatCard(index, -1)}
                          className="w-6 h-6 border border-white/10 hover:border-white/30 rounded flex items-center justify-center text-xs text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          disabled={index === currentContent.stats.length - 1}
                          onClick={() => moveStatCard(index, 1)}
                          className="w-6 h-6 border border-white/10 hover:border-white/30 rounded flex items-center justify-center text-xs text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => duplicateStatCard(index)}
                          className="w-6 h-6 border border-white/10 hover:border-white/30 rounded flex items-center justify-center text-[10px] text-neutral-400 hover:text-white cursor-pointer"
                          title="Duplicate"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => deleteStatCard(index)}
                          className="w-6 h-6 border border-red-500/10 hover:border-red-500/30 rounded flex items-center justify-center text-[9px] text-red-500 bg-red-500/5 hover:bg-red-500/10 cursor-pointer"
                          title="Delete Card"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Stat Value</label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => updateStatCard(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Visibility</label>
                        <button
                          type="button"
                          onClick={() => updateStatCard(index, 'show', stat.show !== false ? false : true)}
                          className={`w-full py-2 border rounded-lg text-[9px] uppercase tracking-widest font-mono cursor-pointer transition-colors duration-300 ${
                            stat.show !== false 
                              ? 'bg-white text-black font-semibold' 
                              : 'bg-neutral-800 text-neutral-500 border-transparent'
                          }`}
                        >
                          {stat.show !== false ? 'Show' : 'Hide'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Label Description</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStatCard(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 3. CAPABILITIES CMS PANEL */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">// Capabilities Registry ({currentContent.services.length})</span>
                <button
                  onClick={addServiceItem}
                  className="px-4 py-2 bg-white text-black font-semibold text-[9px] uppercase tracking-widest rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  + Add Capability
                </button>
              </div>

              <div className="space-y-4">
                {currentContent.services.map((service, index) => (
                  <div 
                    key={index} 
                    className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 relative group"
                  >
                    {/* Position controls & delete */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">Capability #{index + 1}</span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          disabled={index === 0}
                          onClick={() => moveServiceItem(index, -1)}
                          className="w-6 h-6 border border-white/10 hover:border-white/30 rounded flex items-center justify-center text-xs text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          disabled={index === currentContent.services.length - 1}
                          onClick={() => moveServiceItem(index, 1)}
                          className="w-6 h-6 border border-white/10 hover:border-white/30 rounded flex items-center justify-center text-xs text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => duplicateServiceItem(index)}
                          className="w-6 h-6 border border-white/10 hover:border-white/30 rounded flex items-center justify-center text-[10px] text-neutral-400 hover:text-white cursor-pointer"
                          title="Duplicate"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => deleteServiceItem(index)}
                          className="w-6 h-6 border border-red-500/10 hover:border-red-500/30 rounded flex items-center justify-center text-[9px] text-red-500 bg-red-500/5 hover:bg-red-500/10 cursor-pointer"
                          title="Delete Service"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-1 col-span-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Index</label>
                        <input
                          type="text"
                          value={service.num}
                          onChange={(e) => updateServiceItem(index, 'num', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Service Title</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => updateServiceItem(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1 col-span-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Visibility</label>
                        <button
                          type="button"
                          onClick={() => updateServiceItem(index, 'show', service.show !== false ? false : true)}
                          className={`w-full py-2 border rounded-lg text-[8px] uppercase tracking-widest font-mono cursor-pointer transition-colors duration-300 ${
                            service.show !== false 
                              ? 'bg-white text-black font-semibold' 
                              : 'bg-neutral-800 text-neutral-500 border-transparent'
                          }`}
                        >
                          {service.show !== false ? 'Show' : 'Hide'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={service.tags ? service.tags.join(', ') : ''}
                          onChange={(e) => updateServiceItem(index, 'tags', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Service Anchor Link</label>
                        <input
                          type="text"
                          value={service.href}
                          onChange={(e) => updateServiceItem(index, 'href', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Capability description</label>
                      <textarea
                        rows={3}
                        value={service.desc}
                        onChange={(e) => updateServiceItem(index, 'desc', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </section>

        {/* Global Operations Panel */}
        <footer className="p-6 border-t border-white/5 bg-black/60 space-y-4">
          
          {/* Draft modifications info */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">Workspace Status:</span>
            <span className={`font-mono text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded ${
              isDirty ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15 animate-pulse' : 'bg-green-500/10 text-green-400 border border-green-500/15'
            }`}>
              {isDirty ? 'Unsaved Changes' : 'Synced'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="py-3.5 border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl font-mono text-[9px] uppercase tracking-widest text-neutral-300 cursor-pointer disabled:opacity-50 transition-colors font-medium text-center"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isSaving}
              className="py-3.5 bg-white text-black font-semibold text-[9px] uppercase tracking-widest rounded-xl hover:bg-neutral-200 cursor-pointer disabled:opacity-50 transition-colors text-center"
            >
              {isSaving ? 'Publishing...' : 'Publish'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDiscardChanges}
              disabled={!isDirty || isSaving}
              className="py-2.5 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/5 rounded-xl font-mono text-[8px] uppercase tracking-widest text-red-500 cursor-pointer disabled:opacity-20 transition-colors text-center"
            >
              Discard Changes
            </button>
            <button
              onClick={openHistoryList}
              className="py-2.5 border border-white/5 hover:border-white/10 bg-white/[0.01] rounded-xl font-mono text-[8px] uppercase tracking-widest text-neutral-400 hover:text-white cursor-pointer transition-colors text-center"
            >
              Version Log
            </button>
          </div>

          {/* Reset buttons */}
          <div className="flex border-t border-white/5 pt-4 justify-between gap-4">
            <button
              onClick={() => triggerReset('section')}
              className="text-[8px] font-mono tracking-widest text-neutral-500 hover:text-white uppercase transition-colors cursor-pointer"
            >
              Reset {activeTab}
            </button>
            <button
              onClick={() => triggerReset('default')}
              className="text-[8px] font-mono tracking-widest text-neutral-500 hover:text-white uppercase transition-colors cursor-pointer"
            >
              Restore Defaults
            </button>
          </div>
        </footer>

      </aside>

      {/* RIGHT PANEL: LIVE PREVIEW CONTAINER (65% Width) */}
      <main className="flex-1 bg-[#101010] flex flex-col h-full overflow-hidden relative z-10">
        
        {/* Preview Control Toolbar */}
        <div className="h-16 px-6 border-b border-white/5 bg-[#0a0a0a] flex items-center justify-between select-none">
          
          {/* Iframe size selectors */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mr-2">Preview Size:</span>
            {[
              { id: 'desktop', label: 'Desktop', icon: '🖥️' },
              { id: 'tablet', label: '768px', icon: '📱' },
              { id: 'mobile', label: '375px', icon: '📱' }
            ].map(device => (
              <button
                key={device.id}
                onClick={() => setPreviewDevice(device.id)}
                className={`px-3 py-1.5 border rounded-lg font-mono text-[9px] uppercase tracking-widest flex items-center gap-1.5 cursor-pointer transition-colors ${
                  previewDevice === device.id 
                    ? 'bg-white text-black font-semibold border-white' 
                    : 'bg-white/5 text-neutral-400 border-white/5 hover:text-white'
                }`}
              >
                <span>{device.icon}</span>
                <span>{device.label}</span>
              </button>
            ))}
          </div>

          {/* History Stack Controls */}
          <div className="flex items-center gap-4">
            <div className="flex border border-white/10 rounded-lg overflow-hidden bg-black">
              <button
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white disabled:opacity-20 transition-colors border-r border-white/10 cursor-pointer"
                title="Undo (Ctrl+Z)"
              >
                ↩ Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                title="Redo (Ctrl+Y)"
              >
                Redo ↪
              </button>
            </div>
            
            <button 
              onClick={() => { window.location.hash = '#home'; }}
              className="px-4 py-2 border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-lg font-mono text-[9px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Exit Editor
            </button>
          </div>

        </div>

        {/* Live Website Iframe Canvas Frame wrapper */}
        <div className="flex-1 p-8 overflow-auto flex items-center justify-center relative bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:16px_16px]">
          
          <div 
            className="h-full bg-black shadow-2xl rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 relative flex flex-col"
            style={{
              width: previewDevice === 'mobile' ? '375px' : previewDevice === 'tablet' ? '768px' : '100%',
              maxWidth: '100%',
              aspectRatio: previewDevice === 'mobile' ? '9/16' : previewDevice === 'tablet' ? '3/4' : 'auto'
            }}
          >
            {/* Device mock header */}
            <div className="h-8 bg-neutral-900 border-b border-white/5 flex items-center px-4 justify-between select-none">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="font-mono text-[8px] text-neutral-600 tracking-wider">
                {window.location.origin}/#preview ({previewDevice})
              </span>
              <span className="w-12" />
            </div>

            {/* Iframe element */}
            <iframe
              ref={iframeRef}
              src={`${window.location.origin}${window.location.pathname}#preview`}
              className="flex-1 w-full border-none bg-black select-none pointer-events-auto"
              title="Live CMS Web Preview"
            />
          </div>

        </div>

        {/* Console logs / alerts */}
        {saveStatus.message && (
          <div className="absolute bottom-6 right-6 z-[999]">
            <div className={`px-6 py-4 rounded-xl border shadow-2xl flex items-center gap-3 backdrop-blur-md transition-all duration-300 font-sans text-xs ${
              saveStatus.type === 'success' 
                ? 'bg-green-500/10 border-green-500/25 text-green-400' 
                : 'bg-red-500/10 border-red-500/25 text-red-400'
            }`}>
              <span className="text-sm font-semibold">{saveStatus.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{saveStatus.message}</span>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: VERSION HISTORY LOG LIST */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6 select-none">
          <div className="w-full max-w-lg bg-[#0c0c0c] border border-white/5 rounded-2xl shadow-2xl p-6 relative overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">MongoDB Published Log History</h3>
                <p className="font-mono text-[8px] text-neutral-500 tracking-wider">// SELECT A VERSION TO RESTORE AS WORKSPACE DRAFT</p>
              </div>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="w-6 h-6 border border-white/10 hover:border-white/30 rounded flex items-center justify-center text-xs hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {loadingHistory ? (
                <div className="text-center py-10 font-mono text-[10px] text-neutral-400 animate-pulse">
                  // RETRIEVING PUBLICATION SCHEMAS...
                </div>
              ) : versionList.length === 0 ? (
                <div className="text-center py-10 font-mono text-[10px] text-neutral-500">
                  No published version logs found in MongoDB.
                </div>
              ) : (
                versionList.map((ver, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-white">
                        {new Date(ver.timestamp).toLocaleString()}
                      </div>
                      <div className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                        Index: v{versionList.length - idx} • Timestamp: {ver.timestamp}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRestoreVersion(ver.timestamp)}
                      className="px-4 py-2 border border-white/10 hover:bg-white hover:text-black rounded-lg font-mono text-[9px] uppercase tracking-widest text-neutral-400 hover:border-white transition-all cursor-pointer font-medium"
                    >
                      Restore Draft
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET CONFIRMATION DIALOG */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-6 select-none">
          <div className="w-full max-w-sm bg-[#0c0c0c] border border-white/5 rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 bg-red-500/5 border border-red-500/25 rounded-full flex items-center justify-center text-red-500 text-lg font-bold mx-auto mb-4">
                ⚠️
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">Confirm Reset Action</h3>
              <p className="font-light text-neutral-400 text-xs leading-relaxed">
                {resetType === 'section'
                  ? `Are you sure you want to restore the ${activeTab} section back to its original default config? Any unsaved edits will be discarded.`
                  : 'Are you sure you want to restore all editable sections back to their factory default template? This will replace your current workspace content.'
                }
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-3 border border-white/10 hover:bg-white/5 rounded-xl font-mono text-[9px] uppercase tracking-widest text-neutral-400 hover:text-white cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 py-3 bg-red-500 text-white font-semibold text-[9px] uppercase tracking-widest rounded-xl hover:bg-red-600 cursor-pointer transition-colors"
              >
                Reset Content
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
