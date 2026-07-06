import React, { useState, useEffect, useRef } from 'react';
import { useContent, DEFAULT_CONTENT } from '../context/ContentContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8008';

const getServiceDefaultPreview = (num, index) => {
  const defaults = {
    "01/07": { img: "/images/gallery/design_sprint.png", gradient: "from-blue-500 via-indigo-500 to-cyan-500" },
    "02/07": { img: "/images/gallery/digiverse_workspace.png", gradient: "from-emerald-500 via-teal-500 to-cyan-500" },
    "03/07": { img: "/images/quantum_banking.png", gradient: "from-amber-500 via-orange-500 to-yellow-500" },
    "04/07": { img: "/images/gallery/launch_celebration.png", gradient: "from-rose-500 via-pink-500 to-purple-500" },
    "05/07": { img: "/images/gallery/cinematic_review.png", gradient: "from-pink-500 via-fuchsia-500 to-violet-500" },
    "06/07": { img: "/images/gallery/ai_orchestrator.png", gradient: "from-purple-500 via-violet-500 to-indigo-500" },
    "07/07": { img: "/images/gallery/hardware_calibration.png", gradient: "from-sky-500 via-blue-500 to-indigo-500" }
  };
  if (defaults[num]) return defaults[num];
  const keys = Object.keys(defaults);
  const fallbackKey = keys[index % keys.length];
  return defaults[fallbackKey];
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
  const [adminView, setAdminView] = useState('pages'); // 'pages' or 'edit'
  const [iframeHash, setIframeHash] = useState('#preview');
  const [previewDevice, setPreviewDevice] = useState('desktop'); // desktop, tablet, mobile
  const [isDirty, setIsDirty] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({
    "Global Layout Elements": true,
    "Home Page Sections": true,
    "Company Inner Pages": true,
    "Capabilities Pages (Static)": false,
    "Ecosystem Admin Logs": true
  });

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

  // States for adding a new navbar link
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkHref, setNewLinkHref] = useState('');
  const [newLinkType, setNewLinkType] = useState('link'); // 'link' or 'dropdown'

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
          caseStudy: {
            ...DEFAULT_CONTENT.caseStudy,
            ...(draft.caseStudy || {}),
            points: draft.caseStudy?.points || DEFAULT_CONTENT.caseStudy.points
          },
          testimonials: {
            ...DEFAULT_CONTENT.testimonials,
            ...(draft.testimonials || {}),
            list: (draft.testimonials?.list || DEFAULT_CONTENT.testimonials.list).map((t, i) => ({
              id: t.id || i + 1,
              show: true,
              ...t
            }))
          },
          bottomCta: {
            ...DEFAULT_CONTENT.bottomCta,
            ...(draft.bottomCta || {})
          },
          contact_settings: {
            ...DEFAULT_CONTENT.contact_settings,
            ...(draft.contact_settings || {}),
            stats: draft.contact_settings?.stats || DEFAULT_CONTENT.contact_settings.stats,
            business_hours: draft.contact_settings?.business_hours || DEFAULT_CONTENT.contact_settings.business_hours,
            whatsapp_numbers: draft.contact_settings?.whatsapp_numbers || DEFAULT_CONTENT.contact_settings.whatsapp_numbers,
            contact_map: {
              ...DEFAULT_CONTENT.contact_settings.contact_map,
              ...(draft.contact_settings?.contact_map || {})
            },
            form_fields: draft.contact_settings?.form_fields || DEFAULT_CONTENT.contact_settings.form_fields
          },
          stats: (draft.stats || DEFAULT_CONTENT.stats).map(s => ({ show: true, ...s })),
          services: (draft.services || DEFAULT_CONTENT.services).map((s, idx) => {
            const defaults = getServiceDefaultPreview(s.num, idx);
            return {
              show: true,
              img: defaults.img,
              gradient: defaults.gradient,
              ...s
            };
          }),
          about_us: {
            philosophy: { ...DEFAULT_CONTENT.about_us.philosophy, ...(draft.about_us?.philosophy || {}) },
            vision: { ...DEFAULT_CONTENT.about_us.vision, ...(draft.about_us?.vision || {}) },
            mission: { ...DEFAULT_CONTENT.about_us.mission, ...(draft.about_us?.mission || {}) },
            dna_values: draft.about_us?.dna_values || DEFAULT_CONTENT.about_us.dna_values,
            workspace_rooms: draft.about_us?.workspace_rooms || DEFAULT_CONTENT.about_us.workspace_rooms
          },
          site_settings: {
            ...DEFAULT_CONTENT.site_settings,
            ...(draft.site_settings || {}),
            footer: {
              ...DEFAULT_CONTENT.site_settings.footer,
              ...(draft.site_settings?.footer || {})
            }
          },
          brands: {
            ...DEFAULT_CONTENT.brands,
            ...(draft.brands || {}),
            list: draft.brands?.list || DEFAULT_CONTENT.brands.list
          },
          our_culture: draft.our_culture || DEFAULT_CONTENT.our_culture,
          people: draft.people || DEFAULT_CONTENT.people,
          awards: draft.awards || DEFAULT_CONTENT.awards,
          blogs: draft.blogs || DEFAULT_CONTENT.blogs,
          gallery: draft.gallery || DEFAULT_CONTENT.gallery,
          portfolio: draft.portfolio || DEFAULT_CONTENT.portfolio,
          ventures: draft.ventures || DEFAULT_CONTENT.ventures,
          ventures_settings: draft.ventures_settings || DEFAULT_CONTENT.ventures_settings,
          careers: draft.careers || DEFAULT_CONTENT.careers
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
        { type: 'UPDATE_CMS_PREVIEW', content: contentToSend, activeTab: activeTab },
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

  // Send a message to scroll the iframe when the active tab changes
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'CMS_SCROLL_TO', section: activeTab },
        window.location.origin
      );
    }
  }, [activeTab]);

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

  // Navbar editing helper functions
  const updateNavbarStyles = (field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.site_settings) nextContent.site_settings = {};
    if (!nextContent.site_settings.navbar_styles) {
      nextContent.site_settings.navbar_styles = {
        fontSize: "12px",
        color: "#a3a3a3",
        hoverColor: "#ffffff",
        logoSize: "14px",
        logoColor: "#ffffff"
      };
    }
    nextContent.site_settings.navbar_styles[field] = value;
    pushState(nextContent);
  };

  const addNavbarLink = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.site_settings) nextContent.site_settings = {};
    if (!nextContent.site_settings.navbar_links) nextContent.site_settings.navbar_links = [];
    
    const label = newLinkName.trim() || "New Link";
    const href = newLinkType === 'dropdown' ? "#" : (newLinkHref.trim() || "#new-route");
    
    const newItem = {
      label: label,
      href: href,
      show: true
    };
    
    if (newLinkType === 'dropdown') {
      newItem.dropdown = [
        { label: "Sub Link 1", href: "#sub-route", show: true }
      ];
    }
    
    nextContent.site_settings.navbar_links.push(newItem);
    pushState(nextContent);
    
    // Reset input fields
    setNewLinkName('');
    setNewLinkHref('');
    setNewLinkType('link');
  };

  const deleteNavbarLink = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.site_settings.navbar_links.splice(index, 1);
    pushState(nextContent);
  };

  const moveNavbarLink = (index, direction) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const targetIdx = index + direction;
    if (targetIdx >= 0 && targetIdx < nextContent.site_settings.navbar_links.length) {
      const temp = nextContent.site_settings.navbar_links[index];
      nextContent.site_settings.navbar_links[index] = nextContent.site_settings.navbar_links[targetIdx];
      nextContent.site_settings.navbar_links[targetIdx] = temp;
      pushState(nextContent);
    }
  };

  const updateNavbarLink = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.site_settings.navbar_links[index][field] = value;
    pushState(nextContent);
  };

  const convertToDropdown = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const item = nextContent.site_settings.navbar_links[index];
    item.dropdown = [
      { label: "Sub Link 1", href: item.href || "#", show: true }
    ];
    item.href = "#"; // Disable top level href for dropdowns
    pushState(nextContent);
  };

  const convertToSimpleLink = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const item = nextContent.site_settings.navbar_links[index];
    delete item.dropdown;
    item.href = "#new-route";
    pushState(nextContent);
  };

  const addNavbarSubLink = (parentIdx) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const item = nextContent.site_settings.navbar_links[parentIdx];
    if (!item.dropdown) item.dropdown = [];
    item.dropdown.push({
      label: "New Sub Link",
      href: "#new-sub-route",
      show: true
    });
    pushState(nextContent);
  };

  const updateNavbarSubLink = (parentIdx, subIdx, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.site_settings.navbar_links[parentIdx].dropdown[subIdx][field] = value;
    pushState(nextContent);
  };

  const deleteNavbarSubLink = (parentIdx, subIdx) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.site_settings.navbar_links[parentIdx].dropdown.splice(subIdx, 1);
    pushState(nextContent);
  };

  const moveNavbarSubLink = (parentIdx, subIdx, direction) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const dropdown = nextContent.site_settings.navbar_links[parentIdx].dropdown;
    const targetIdx = subIdx + direction;
    if (targetIdx >= 0 && targetIdx < dropdown.length) {
      const temp = dropdown[subIdx];
      dropdown[subIdx] = dropdown[targetIdx];
      dropdown[targetIdx] = temp;
      pushState(nextContent);
    }
  };

  // Footer Link Helpers
  const addFooterCapabilityLink = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.site_settings) nextContent.site_settings = {};
    if (!nextContent.site_settings.footer) nextContent.site_settings.footer = {};
    if (!nextContent.site_settings.footer.capabilities) nextContent.site_settings.footer.capabilities = [];
    nextContent.site_settings.footer.capabilities.push({ label: 'New Capability Link', href: '#', show: true });
    pushState(nextContent);
  };

  const deleteFooterCapabilityLink = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.site_settings.footer.capabilities.splice(index, 1);
    pushState(nextContent);
  };

  const moveFooterCapabilityLink = (index, direction) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const list = nextContent.site_settings.footer.capabilities;
    const targetIdx = index + direction;
    if (targetIdx >= 0 && targetIdx < list.length) {
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      pushState(nextContent);
    }
  };

  const updateFooterCapabilityLink = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.site_settings.footer.capabilities[index][field] = value;
    pushState(nextContent);
  };

  const addFooterEcosystemLink = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.site_settings) nextContent.site_settings = {};
    if (!nextContent.site_settings.footer) nextContent.site_settings.footer = {};
    if (!nextContent.site_settings.footer.ecosystem) nextContent.site_settings.footer.ecosystem = [];
    nextContent.site_settings.footer.ecosystem.push({ label: 'New Ecosystem Link', href: '#', show: true });
    pushState(nextContent);
  };

  const deleteFooterEcosystemLink = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.site_settings.footer.ecosystem.splice(index, 1);
    pushState(nextContent);
  };

  const moveFooterEcosystemLink = (index, direction) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const list = nextContent.site_settings.footer.ecosystem;
    const targetIdx = index + direction;
    if (targetIdx >= 0 && targetIdx < list.length) {
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      pushState(nextContent);
    }
  };

  const updateFooterEcosystemLink = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.site_settings.footer.ecosystem[index][field] = value;
    pushState(nextContent);
  };

  const addFooterSocialLink = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.site_settings) nextContent.site_settings = {};
    if (!nextContent.site_settings.footer) nextContent.site_settings.footer = {};
    if (!nextContent.site_settings.footer.social_links) nextContent.site_settings.footer.social_links = [];
    nextContent.site_settings.footer.social_links.push({ platform: 'New Platform', url: '#', show: true });
    pushState(nextContent);
  };

  const deleteFooterSocialLink = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.site_settings.footer.social_links.splice(index, 1);
    pushState(nextContent);
  };

  const moveFooterSocialLink = (index, direction) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const list = nextContent.site_settings.footer.social_links;
    const targetIdx = index + direction;
    if (targetIdx >= 0 && targetIdx < list.length) {
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      pushState(nextContent);
    }
  };

  const updateFooterSocialLink = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.site_settings.footer.social_links[index][field] = value;
    pushState(nextContent);
  };

  const handleUploadFooterLogo = async (e) => {
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
        const nextContent = JSON.parse(JSON.stringify(currentContent));
        if (!nextContent.site_settings) nextContent.site_settings = {};
        if (!nextContent.site_settings.footer) nextContent.site_settings.footer = {};
        nextContent.site_settings.footer.logo_img = data.imageUrl;
        pushState(nextContent);
        setSaveStatus({ type: 'success', message: 'Footer logo uploaded successfully!' });
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

  const updateBrandsConfig = (field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.brands) nextContent.brands = { show: true, fontSize: "36px", imageSize: "56px", list: [] };
    nextContent.brands[field] = value;
    pushState(nextContent);
  };

  const addBrandItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.brands) nextContent.brands = { show: true, fontSize: "36px", imageSize: "56px", list: [] };
    if (!nextContent.brands.list) nextContent.brands.list = [];
    nextContent.brands.list.push({ name: "NEW PARTNER", logo: "/images/logos/saphira_logo.png" });
    pushState(nextContent);
  };

  const deleteBrandItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (nextContent.brands && nextContent.brands.list) {
      nextContent.brands.list.splice(index, 1);
      pushState(nextContent);
    }
  };

  const moveBrandItem = (index, direction) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (nextContent.brands && nextContent.brands.list) {
      const list = nextContent.brands.list;
      const targetIdx = index + direction;
      if (targetIdx >= 0 && targetIdx < list.length) {
        const temp = list[index];
        list[index] = list[targetIdx];
        list[targetIdx] = temp;
        pushState(nextContent);
      }
    }
  };

  const updateBrandItemField = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (nextContent.brands && nextContent.brands.list) {
      nextContent.brands.list[index][field] = value;
      pushState(nextContent);
    }
  };

  const handleUploadBrandLogo = async (index, e) => {
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
        const nextContent = JSON.parse(JSON.stringify(currentContent));
        if (!nextContent.brands) nextContent.brands = { show: true, fontSize: "36px", imageSize: "56px", list: [] };
        if (!nextContent.brands.list) nextContent.brands.list = [];
        nextContent.brands.list[index].logo = data.imageUrl;
        pushState(nextContent);
        setSaveStatus({ type: 'success', message: 'Partner logo uploaded successfully!' });
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

  const updateServiceItem = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (field === 'tags') {
      nextContent.services[index].tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    } else {
      nextContent.services[index][field] = value;
    }
    pushState(nextContent);
  };

  const handleUploadServiceHoverImage = async (index, e) => {
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
        const nextContent = JSON.parse(JSON.stringify(currentContent));
        if (!nextContent.services) nextContent.services = [];
        nextContent.services[index].img = data.imageUrl;
        pushState(nextContent);
        setSaveStatus({ type: 'success', message: 'Hover image uploaded successfully!' });
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

  const addServiceItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    const num = `0${nextContent.services.length + 1}/07`;
    const defaults = getServiceDefaultPreview(num, nextContent.services.length);
    nextContent.services.push({
      num,
      title: 'New Service Capability',
      desc: 'Describe this service capability here.',
      tags: ['TAG'],
      href: '#',
      show: true,
      img: defaults.img,
      gradient: defaults.gradient
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

  // Submissions Log states
  const [inquiries, setInquiries] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    if (activeTab === 'submissions' && authorized) {
      loadSubmissions();
    }
  }, [activeTab, authorized]);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const inqRes = await fetch(API_URL + '/api/admin/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const appRes = await fetch(API_URL + '/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (appRes.ok) setApplications(await appRes.json());
    } catch (e) {
      console.error("Failed to load submissions log:", e);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // About Us handlers
  const updateAboutUsField = (section, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.about_us) nextContent.about_us = {};
    if (!nextContent.about_us[section]) nextContent.about_us[section] = {};
    nextContent.about_us[section][field] = value;
    pushState(nextContent);
  };

  const updateWorkspaceRoom = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.about_us.workspace_rooms) {
      nextContent.about_us.workspace_rooms = [];
    }
    nextContent.about_us.workspace_rooms[index][field] = value;
    pushState(nextContent);
  };

  const addWorkspaceRoom = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.about_us.workspace_rooms) {
      nextContent.about_us.workspace_rooms = [];
    }
    nextContent.about_us.workspace_rooms.push({
      title: 'New Workspace Room',
      desc: 'Describe the room setup...',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      size: 'col-span-1 row-span-1'
    });
    pushState(nextContent);
  };

  const deleteWorkspaceRoom = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.about_us.workspace_rooms.splice(index, 1);
    pushState(nextContent);
  };

  // Culture handlers
  const updateCultureItem = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.our_culture[index][field] = value;
    pushState(nextContent);
  };

  const addCultureItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.our_culture) nextContent.our_culture = [];
    nextContent.our_culture.push({
      title: 'New Culture Aspect',
      desc: 'Detail this cultural aspect...',
      img: '/images/culture/learning.png',
      icon: 'learning'
    });
    pushState(nextContent);
  };

  const deleteCultureItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.our_culture.splice(index, 1);
    pushState(nextContent);
  };

  // People handlers
  const updatePeopleItem = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (field === 'level') {
      nextContent.people[index][field] = parseInt(value) || 1;
    } else {
      nextContent.people[index][field] = value;
    }
    pushState(nextContent);
  };

  const addPeopleItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.people) nextContent.people = [];
    nextContent.people.push({
      name: 'New Member',
      role: 'Engineer / Designer',
      bio: 'Detail bio...',
      level: 4,
      icon: '💻',
      dept: 'DEVELOPMENT',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
      parent_id: 'Vikram Rathod'
    });
    pushState(nextContent);
  };

  const deletePeopleItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.people.splice(index, 1);
    pushState(nextContent);
  };

  // Awards handlers
  const updateAwardItem = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.awards[index][field] = value;
    pushState(nextContent);
  };

  const addAwardItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.awards) nextContent.awards = [];
    nextContent.awards.push({
      slug: 'new-award',
      title: 'New Award Title',
      by: 'Guild/Association',
      year: '2026',
      description: 'Short summary...',
      category: 'company',
      recipient: 'HariKrushn DigiVerse LLP',
      img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&h=400&q=80',
      longDescription: 'Expanded detail...'
    });
    pushState(nextContent);
  };

  const deleteAwardItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.awards.splice(index, 1);
    pushState(nextContent);
  };

  // Blogs handlers
  const updateBlogItem = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (field === 'longContent') {
      nextContent.blogs[index].longContent = value.split('\n\n').map(p => p.trim()).filter(Boolean);
    } else if (field === 'highlights') {
      nextContent.blogs[index].highlights = value.split('\n').map(h => h.trim()).filter(Boolean);
    } else {
      nextContent.blogs[index][field] = value;
    }
    pushState(nextContent);
  };

  const addBlogItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.blogs) nextContent.blogs = [];
    nextContent.blogs.push({
      slug: 'new-blog-post',
      title: 'New Blog Post Title',
      desc: 'Short preview description...',
      date: 'JULY 05, 2026',
      category: 'ENGINEERING',
      readTime: '5 MIN READ',
      image: '/images/gallery/ai_orchestrator.png',
      author: 'Radhe Patel (CEO)',
      longContent: ['Full paragraph narrative here...'],
      highlights: ['Key takeaway highlight...']
    });
    pushState(nextContent);
  };

  const deleteBlogItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.blogs.splice(index, 1);
    pushState(nextContent);
  };

  // Gallery handlers
  const updateGalleryItem = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.gallery[index][field] = value;
    pushState(nextContent);
  };

  const addGalleryItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.gallery) nextContent.gallery = [];
    nextContent.gallery.push({
      title: 'New Image',
      category: 'Studio',
      size: 'col-span-1 row-span-1',
      image: '/images/gallery/cinematic_review.png'
    });
    pushState(nextContent);
  };

  const deleteGalleryItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.gallery.splice(index, 1);
    pushState(nextContent);
  };

  // Portfolio handlers
  const updatePortfolioItem = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (field === 'tech') {
      nextContent.portfolio[index].tech = value.split(',').map(t => t.trim()).filter(Boolean);
    } else {
      nextContent.portfolio[index][field] = value;
    }
    pushState(nextContent);
  };

  const addPortfolioItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.portfolio) nextContent.portfolio = [];
    nextContent.portfolio.push({
      slug: 'new-project',
      title: 'New Project Title',
      client: 'Client Name',
      category: 'web',
      description: 'Detail description...',
      tech: ['React', 'FastAPI'],
      img: '/images/casestudies/novadefi.png',
      color: 'blue',
      accentColor: '#3b82f6'
    });
    pushState(nextContent);
  };

  const deletePortfolioItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.portfolio.splice(index, 1);
    pushState(nextContent);
  };

  // Ventures handlers
  const updateVentureItem = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.ventures[index][field] = value;
    pushState(nextContent);
  };

  const addVentureItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.ventures) nextContent.ventures = [];
    nextContent.ventures.push({
      slug: 'new-venture-' + Date.now(),
      name: 'New Venture Name',
      tagline: 'Venture Tagline',
      status: 'Active',
      img: '/images/ventures/aisetu.png',
      color: 'cyan',
      accentColor: '#06b6d4',
      glowColor: 'rgba(6,182,212,0.20)',
      shortDesc: 'Short description...',
      fullDescription: 'Full detailed description...',
      mission: 'Venture mission...',
      vision: 'Venture vision...',
      keyInitiatives: [
        { title: 'First Initiative', desc: 'Describe the initiative here...' }
      ],
      impactStats: [
        { label: 'Stat Label', value: '10k+' }
      ],
      techStack: ['React', 'Python'],
      partners: ['Partner Org']
    });
    pushState(nextContent);
  };

  const deleteVentureItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.ventures.splice(index, 1);
    pushState(nextContent);
  };

  // Careers handlers
  const updateCareerItem = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (field === 'requirements') {
      nextContent.careers[index].requirements = value.split('\n').map(r => r.trim()).filter(Boolean);
    } else if (field === 'steps') {
      nextContent.careers[index].steps = value.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      nextContent.careers[index][field] = value;
    }
    pushState(nextContent);
  };

  const addCareerItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.careers) nextContent.careers = [];
    nextContent.careers.push({
      slug: 'new-open-role',
      title: 'New Open Role Title',
      department: 'Engineering',
      type: 'Full-time / Hybrid',
      location: 'Surat, Gujarat',
      description: 'Detail job description...',
      requirements: ['Requirement listing...'],
      steps: ['Resume Screening', 'Technical Sync', 'Offer']
    });
    pushState(nextContent);
  };

  const deleteCareerItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.careers.splice(index, 1);
    pushState(nextContent);
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

  // Contact page helpers
  const updateOfficeItem = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.contact_offices) nextContent.contact_offices = [];
    nextContent.contact_offices[index][field] = value;
    pushState(nextContent);
  };

  const addOfficeItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.contact_offices) nextContent.contact_offices = [];
    nextContent.contact_offices.push({
      slug: "office-" + Date.now(),
      city: "New City",
      country: "INDIA",
      role: "Branch Office",
      address: "Address details...",
      phone: "+91 99999 88888",
      timeZone: "Asia/Kolkata",
      isHQ: false,
      color: "border-blue-500/10 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    });
    pushState(nextContent);
  };

  const deleteOfficeItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.contact_offices.splice(index, 1);
    pushState(nextContent);
  };

  const moveOfficeItem = (index, direction) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.contact_offices) return;
    const items = nextContent.contact_offices;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    pushState(nextContent);
  };

  const updateFaqItem = (index, field, value) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.contact_faqs) nextContent.contact_faqs = [];
    nextContent.contact_faqs[index][field] = value;
    pushState(nextContent);
  };

  const addFaqItem = () => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    if (!nextContent.contact_faqs) nextContent.contact_faqs = [];
    nextContent.contact_faqs.push({
      q: "New Question?",
      a: "Answer content goes here..."
    });
    pushState(nextContent);
  };

  const deleteFaqItem = (index) => {
    const nextContent = JSON.parse(JSON.stringify(currentContent));
    nextContent.contact_faqs.splice(index, 1);
    pushState(nextContent);
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

  const pageNavGroups = [
    {
      title: "Global Layout Elements",
      items: [
        { label: "Navigation Bar", tab: "navbar", route: "#preview/navbar", icon: "💎", badge: "GLOBAL", badgeStyle: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
        { label: "Footer Details", tab: "footer", route: "#preview/footer", icon: "👣", badge: "GLOBAL", badgeStyle: "bg-blue-500/10 text-blue-400 border border-blue-500/20" }
      ]
    },
    {
      title: "Home Page Sections",
      items: [
        { label: "Hero Canvas Section", tab: "hero", route: "#preview/home", icon: "⚡", badge: "LIVE", badgeStyle: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
        { label: "Statistics & Metrics", tab: "stats", route: "#preview/home", icon: "📊", badge: "LIVE", badgeStyle: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
        { label: "Partner Brand Ticker", tab: "brands", route: "#preview/home", icon: "🤝", badge: "LIVE", badgeStyle: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
        { label: "Services Preview Index", tab: "services", route: "#preview/home", icon: "💼", badge: "LIVE", badgeStyle: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
        { label: "Featured Case Study", tab: "caseStudy", route: "#preview/home", icon: "🚀", badge: "LIVE", badgeStyle: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
        { label: "Client Testimonials", tab: "testimonials", route: "#preview/home", icon: "💬", badge: "LIVE", badgeStyle: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
        { label: "Bottom CTA Section", tab: "bottomCta", route: "#preview/home", icon: "📢", badge: "LIVE", badgeStyle: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" }
      ]
    },
    {
      title: "Company Inner Pages",
      items: [
        { label: "Our Story", tab: "our_story", route: "#preview/our-story", icon: "📖", badge: "PAGE", badgeStyle: "bg-white/5 text-neutral-400 border border-white/10" },
        { label: "Team Members", tab: "people", route: "#preview/our-people", icon: "👥", badge: "PAGE", badgeStyle: "bg-white/5 text-neutral-400 border border-white/10" },
        { label: "Life & Culture", tab: "our_culture", route: "#preview/our-culture", icon: "🌟", badge: "PAGE", badgeStyle: "bg-white/5 text-neutral-400 border border-white/10" },
        { label: "About Us Details", tab: "about_us", route: "#preview/about-us", icon: "🏢", badge: "PAGE", badgeStyle: "bg-white/5 text-neutral-400 border border-white/10" },
        { label: "Awards & Trophies", tab: "awards", route: "#preview/awards-achievements", icon: "🏆", badge: "PAGE", badgeStyle: "bg-white/5 text-neutral-400 border border-white/10" },
        { label: "Insights / Blogs", tab: "blogs", route: "#preview/blogs", icon: "📝", badge: "PAGE", badgeStyle: "bg-white/5 text-neutral-400 border border-white/10" },
        { label: "Our Gallery", tab: "gallery", route: "#preview/our-gallery", icon: "🖼️", badge: "PAGE", badgeStyle: "bg-white/5 text-neutral-400 border border-white/10" },
        { label: "Portfolio Work", tab: "portfolio", route: "#preview/portfolio", icon: "🚀", badge: "PAGE", badgeStyle: "bg-white/5 text-neutral-400 border border-white/10" },
        { label: "Ventures", tab: "ventures", route: "#preview/ventures", icon: "💡", badge: "PAGE", badgeStyle: "bg-white/5 text-neutral-400 border border-white/10" },
        { label: "Careers & Jobs", tab: "careers", route: "#preview/career", icon: "🤝", badge: "PAGE", badgeStyle: "bg-white/5 text-neutral-400 border border-white/10" },
        { label: "Contact Us", tab: "contact", route: "#preview/contact", icon: "✉️", badge: "PAGE", badgeStyle: "bg-white/5 text-neutral-400 border border-white/10" }
      ]
    },
    {
      title: "Capabilities Pages (Static)",
      items: [
        { label: "Services Main Page", tab: "services_main", route: "#preview/services", icon: "⚙️", badge: "STATIC", badgeStyle: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
        { label: "Web Engineering", tab: "service_web", route: "#preview/service-web", icon: "💻", badge: "STATIC", badgeStyle: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
        { label: "Mobile Applications", tab: "service_app", route: "#preview/service-app", icon: "📱", badge: "STATIC", badgeStyle: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
        { label: "Custom Software", tab: "service_custom_software", route: "#preview/service-custom-software", icon: "🛠️", badge: "STATIC", badgeStyle: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
        { label: "Digital Marketing", tab: "service_digital_marketing", route: "#preview/service-digital-marketing", icon: "📈", badge: "STATIC", badgeStyle: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
        { label: "Social Media", tab: "service_social_media", route: "#preview/service-social-media-management", icon: "📣", badge: "STATIC", badgeStyle: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
        { label: "AI Consulting", tab: "service_ai_consulting", route: "#preview/service-ai-consulting", icon: "🧠", badge: "STATIC", badgeStyle: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
        { label: "IT Consulting", tab: "service_it_consulting", route: "#preview/service-it-consulting", icon: "🛡️", badge: "STATIC", badgeStyle: "bg-purple-500/10 text-purple-400 border border-purple-500/20" }
      ]
    },
    {
      title: "Ecosystem Admin Logs",
      items: [
        { label: "Form Submissions Log", tab: "submissions", route: "#preview/home", icon: "📨", badge: "LOGS", badgeStyle: "bg-rose-500/10 text-rose-400 border border-rose-500/20" }
      ]
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black text-[#e5e2e1] overflow-hidden select-none">
      
      {/* LEFT PANEL: CMS CONTROLS (35% Width on desktop, full width on mobile) */}
      <aside className="w-full lg:w-[35%] lg:min-w-[380px] lg:max-w-[500px] border-b lg:border-b-0 lg:border-r border-white/10 bg-[#060608]/90 backdrop-blur-xl flex flex-col h-[50vh] lg:h-full relative z-20 overflow-y-auto">
        
        {/* Editor Title */}
        <header className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
          <div className="space-y-1">
            <h1 className="font-display text-sm font-bold tracking-widest text-white uppercase bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">HK DIGIVERSE</h1>
            <p className="font-mono text-[8px] text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              // VISUAL CMS BUILDER
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="text-[9px] font-mono tracking-widest text-neutral-400 hover:text-red-400 uppercase transition-colors duration-300 border border-white/10 rounded-full px-3 py-1.5 hover:border-red-500/20 cursor-pointer"
          >
            Logout
          </button>
        </header>

        {/* Content Area based on adminView */}
        {adminView === 'pages' ? (
          /* Pages List View */
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            <div className="space-y-1 px-2 mb-4">
              <h2 className="font-display text-xs font-bold text-white uppercase tracking-wider">Pages & Components</h2>
              <p className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-light">// Select a page or layout block to edit in real time</p>
            </div>

            <div className="space-y-6">
              {pageNavGroups.map((group, groupIdx) => {
                const isExpanded = expandedGroups[group.title] !== false;
                return (
                  <div key={groupIdx} className="space-y-2 border-b border-white/[0.03] pb-4 last:border-b-0 last:pb-0">
                    <button
                      onClick={() => setExpandedGroups(prev => ({ ...prev, [group.title]: !prev[group.title] }))}
                      className="w-full flex items-center justify-between py-1 px-2 font-mono text-[9px] uppercase tracking-widest text-neutral-400 hover:text-white font-bold transition-colors text-left cursor-pointer select-none"
                    >
                      <span>{group.title}</span>
                      <span className={`text-[8px] transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    
                    <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                      <div className="overflow-hidden space-y-1.5 px-1">
                        {group.items.map((item, itemIdx) => {
                          const isActive = activeTab === item.tab;
                          return (
                            <button
                              key={itemIdx}
                              onClick={() => {
                                setActiveTab(item.tab);
                                setIframeHash(item.route);
                                setAdminView('edit');
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-lg border flex items-center gap-3 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                                isActive
                                  ? 'bg-emerald-500/[0.04] border-emerald-500/20 text-white shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                                  : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/5 hover:border-white/10 text-neutral-300 hover:text-white'
                              }`}
                            >
                              {/* Left active line glow indicator */}
                              {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyan-400 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                              )}
                              
                              <span className={`text-sm transition-all duration-300 ${
                                isActive ? 'scale-110 grayscale-0' : 'filter grayscale group-hover:grayscale-0 group-hover:scale-110'
                              }`}>{item.icon}</span>
                              
                              <div className="flex flex-col">
                                <span className={`text-xs font-semibold font-sans tracking-wide transition-colors ${
                                  isActive ? 'text-white' : 'text-neutral-300 group-hover:text-white'
                                }`}>
                                  {item.label}
                                </span>
                                <span className="font-mono text-[8px] text-neutral-500/80 group-hover:text-neutral-400/80 transition-colors mt-0.5 tracking-wider font-light">
                                  route: {item.route.replace('#preview', '') || '/'}
                                </span>
                              </div>
                              
                              <div className="ml-auto flex items-center gap-2">
                                <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${item.badgeStyle}`}>
                                  {item.badge}
                                </span>
                                <span className="text-[8px] font-mono text-neutral-600 group-hover:text-neutral-400 transition-colors uppercase font-light">
                                  Edit →
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Editor Panels View */
          <>
            <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAdminView('pages')}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-mono text-[8px] uppercase tracking-widest text-neutral-400 hover:text-white cursor-pointer transition-colors"
                >
                  ← Back to Pages
                </button>
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest font-light">// Editing Module</span>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                    {activeTab.replace('_', ' ')}
                  </h2>
                </div>
              </div>
              
              {/* Connected Pulse Badge */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[7px] text-emerald-400 uppercase tracking-widest">Connected</span>
              </div>
            </div>

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

                    {/* Hover Image & Gradient Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/[0.03]">
                      {/* Gradient */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Underline Neon Gradient (Tailwind classes)</label>
                        <input
                          type="text"
                          value={service.gradient || ''}
                          onChange={(e) => updateServiceItem(index, 'gradient', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none"
                          placeholder="from-blue-500 via-indigo-500 to-cyan-500"
                        />
                      </div>

                      {/* Hover image */}
                      <div className="space-y-2">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block">Hover Preview Image</label>
                        <div className="space-y-2">
                          {service.img && (
                            <div className="flex items-center gap-3">
                              <img 
                                src={service.img} 
                                alt="Hover Preview" 
                                className="w-16 h-10 object-cover border border-white/10 rounded-lg bg-neutral-900"
                              />
                              <span className="text-[9px] text-neutral-500 font-mono">Current Preview</span>
                            </div>
                          )}
                          <input
                            type="text"
                            value={service.img || ''}
                            onChange={(e) => updateServiceItem(index, 'img', e.target.value)}
                            className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-white/20"
                            placeholder="Image URL"
                          />
                        </div>
                        <div className="flex gap-4">
                          <label className="flex-1 py-2 border border-white/10 hover:border-white/30 text-center rounded-xl bg-white/5 text-[9px] uppercase tracking-widest font-mono cursor-pointer hover:bg-white/10 transition-all text-white font-semibold block">
                            {isUploadingImage ? 'Uploading Image...' : 'Upload Hover Image'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUploadServiceHoverImage(index, e)}
                              disabled={isUploadingImage}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* PARTNER BRAND TICKER CMS PANEL */}
          {activeTab === 'brands' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-white">// Partner Brand Ticker Settings</h3>
                <button
                  onClick={addBrandItem}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg text-[9px] font-mono text-neutral-300 hover:text-white cursor-pointer transition-all flex items-center gap-1.5 font-semibold"
                >
                  <span>+ Add Partner</span>
                </button>
              </div>

              {/* General Ticker Configuration */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">General Display Config</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Show/Hide Ticker */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Show Ticker</label>
                    <button
                      type="button"
                      onClick={() => updateBrandsConfig('show', (currentContent.brands?.show !== false ? false : true))}
                      className={`w-full py-2 border rounded-lg text-[8px] uppercase tracking-widest font-mono cursor-pointer transition-all duration-300 ${
                        (currentContent.brands?.show !== false) 
                          ? 'bg-white text-black font-semibold' 
                          : 'bg-neutral-800 text-neutral-500 border-transparent'
                      }`}
                    >
                      {(currentContent.brands?.show !== false) ? 'Show' : 'Hide'}
                    </button>
                  </div>

                  {/* Name Font Size */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Name Font Size (e.g. 36px, 2rem)</label>
                    <input
                      type="text"
                      value={currentContent.brands?.fontSize ?? '36px'}
                      onChange={(e) => updateBrandsConfig('fontSize', e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-white/20"
                      placeholder="36px"
                    />
                  </div>

                  {/* Logo Image Size */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Logo Image Size (e.g. 56px, 3.5rem)</label>
                    <input
                      type="text"
                      value={currentContent.brands?.imageSize ?? '56px'}
                      onChange={(e) => updateBrandsConfig('imageSize', e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-white/20"
                      placeholder="56px"
                    />
                  </div>
                </div>
              </div>

              {/* Partners List */}
              <div className="space-y-4">
                {(currentContent.brands?.list || []).map((brand, index) => (
                  <div 
                    key={index} 
                    className="p-5 bg-white/[0.01] border border-white/5 rounded-xl space-y-4 hover:border-white/10 transition-colors"
                  >
                    {/* Header with Control Buttons */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">Partner #{index + 1}</span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => moveBrandItem(index, -1)}
                          disabled={index === 0}
                          className="w-6 h-6 border border-white/10 hover:border-white/20 rounded flex items-center justify-center text-[10px] text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveBrandItem(index, 1)}
                          disabled={index === (currentContent.brands?.list || []).length - 1}
                          className="w-6 h-6 border border-white/10 hover:border-white/20 rounded flex items-center justify-center text-[10px] text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          title="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => deleteBrandItem(index)}
                          className="w-6 h-6 border border-red-500/10 hover:border-red-500/30 rounded flex items-center justify-center text-[9px] text-red-500 bg-red-500/5 hover:bg-red-500/10 cursor-pointer"
                          title="Delete Partner"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Partner Name</label>
                        <input
                          type="text"
                          value={brand.name || ''}
                          onChange={(e) => updateBrandItemField(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                          placeholder="Name next to logo"
                        />
                      </div>

                      {/* Logo URL input */}
                      <div className="space-y-1 text-left">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Logo Image URL</label>
                        <input
                          type="text"
                          value={brand.logo || ''}
                          onChange={(e) => updateBrandItemField(index, 'logo', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                          placeholder="Logo URL"
                        />
                      </div>
                    </div>

                    {/* Image Preview & Upload */}
                    <div className="flex gap-4 items-center pt-2 border-t border-white/[0.03]">
                      <div className="w-12 h-12 bg-black/40 border border-white/10 rounded-lg flex items-center justify-center p-1.5">
                        <img 
                          src={brand.logo || "/images/logos/saphira_logo.png"} 
                          alt="Logo Preview" 
                          className="w-full h-full object-contain mix-blend-screen opacity-80"
                        />
                      </div>
                      <label className="flex-1 max-w-[200px] py-2 border border-white/10 hover:border-white/30 text-center rounded-xl bg-white/5 text-[9px] uppercase tracking-widest font-mono cursor-pointer hover:bg-white/10 transition-all text-white font-semibold">
                        {isUploadingImage ? 'Uploading...' : 'Upload Logo'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadBrandLogo(index, e)}
                          disabled={isUploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FEATURED CASE STUDY CMS PANEL */}
          {activeTab === 'caseStudy' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-white">// Featured Case Study Settings</h3>
              </div>

              {/* Show/Hide Case Study */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Section Visibility</h4>
                <div className="w-full md:w-1/3">
                  <button
                    type="button"
                    onClick={() => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      nextContent.caseStudy.show = nextContent.caseStudy.show !== false ? false : true;
                      pushState(nextContent);
                    }}
                    className={`w-full py-2 border rounded-lg text-[8px] uppercase tracking-widest font-mono cursor-pointer transition-all duration-300 ${
                      (currentContent.caseStudy?.show !== false) 
                        ? 'bg-white text-black font-semibold' 
                        : 'bg-neutral-800 text-neutral-500 border-transparent'
                    }`}
                  >
                    {(currentContent.caseStudy?.show !== false) ? 'Show Section' : 'Hide Section'}
                  </button>
                </div>
              </div>

              {/* General Metadata */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Case Study Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Client Name */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Client / Company Name</label>
                    <input
                      type="text"
                      value={currentContent.caseStudy?.client || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.caseStudy.client = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      placeholder="e.g. AeroCRM Aviation"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Project Title</label>
                    <input
                      type="text"
                      value={currentContent.caseStudy?.title || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.caseStudy.title = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      placeholder="e.g. Custom Cloud CRM Platform"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Simulation label */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Simulation / Version Label</label>
                    <input
                      type="text"
                      value={currentContent.caseStudy?.label || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.caseStudy.label = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      placeholder="e.g. Simulation [CRM.v1]"
                    />
                  </div>

                  {/* Link Text */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Link Label Text</label>
                    <input
                      type="text"
                      value={currentContent.caseStudy?.linkText || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.caseStudy.linkText = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      placeholder="e.g. View Case Study Details"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Link Href */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Link Destination URL</label>
                    <input
                      type="text"
                      value={currentContent.caseStudy?.linkHref || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.caseStudy.linkHref = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      placeholder="e.g. #case-study"
                    />
                  </div>
                </div>

                {/* Client Logo URL & Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-2">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Client Logo URL</label>
                    <input
                      type="text"
                      value={currentContent.caseStudy?.logo || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.caseStudy.logo = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      placeholder="Logo image URL"
                    />
                    <label className="w-full py-2 border border-white/10 hover:border-white/30 text-center rounded-xl bg-white/5 text-[9px] uppercase tracking-widest font-mono cursor-pointer hover:bg-white/10 transition-all text-white font-semibold block">
                      {isUploadingImage ? 'Uploading...' : 'Upload Client Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setIsUploadingImage(true);
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await fetch(API_URL + '/api/upload/image', { method: 'POST', body: formData });
                            if (res.ok) {
                              const data = await res.json();
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.caseStudy.logo = data.imageUrl;
                              pushState(nextContent);
                            }
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setIsUploadingImage(false);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {currentContent.caseStudy?.logo && (
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-[#15151a] border border-white/10 rounded-lg p-2 flex items-center justify-center">
                        <img src={currentContent.caseStudy.logo} alt="Client Logo" className="max-w-full max-h-full object-contain mix-blend-screen" />
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500">Logo Preview</span>
                    </div>
                  )}
                </div>

                {/* Main Case Study Mockup Image URL & Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-2">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Main Case Study Image URL</label>
                    <input
                      type="text"
                      value={currentContent.caseStudy?.image || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.caseStudy.image = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      placeholder="Main image URL"
                    />
                    <label className="w-full py-2 border border-white/10 hover:border-white/30 text-center rounded-xl bg-white/5 text-[9px] uppercase tracking-widest font-mono cursor-pointer hover:bg-white/10 transition-all text-white font-semibold block">
                      {isUploadingImage ? 'Uploading...' : 'Upload Main Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setIsUploadingImage(true);
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await fetch(API_URL + '/api/upload/image', { method: 'POST', body: formData });
                            if (res.ok) {
                              const data = await res.json();
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.caseStudy.image = data.imageUrl;
                              pushState(nextContent);
                            }
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setIsUploadingImage(false);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {currentContent.caseStudy?.image && (
                    <div className="flex items-center gap-3">
                      <img src={currentContent.caseStudy.image} alt="Case Study Main" className="w-24 h-24 object-cover border border-white/10 rounded-lg bg-[#15151a]" />
                      <span className="text-[9px] font-mono text-neutral-500">Image Preview</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Case Study Points (Bullet Points) */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Features / Points Built ({currentContent.caseStudy?.points?.length || 0})</h4>
                  <button
                    onClick={() => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      if (!nextContent.caseStudy.points) nextContent.caseStudy.points = [];
                      nextContent.caseStudy.points.push("Describe a custom feature or milestone here.");
                      pushState(nextContent);
                    }}
                    className="px-2 py-1 bg-white/5 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white rounded text-[8px] font-mono font-semibold"
                  >
                    + Add Point
                  </button>
                </div>

                <div className="space-y-3">
                  {(currentContent.caseStudy?.points || []).map((point, index) => (
                    <div key={index} className="flex gap-3 items-center bg-black/20 p-3 rounded-lg border border-white/[0.03]">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => {
                            if (index === 0) return;
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            const temp = nextContent.caseStudy.points[index];
                            nextContent.caseStudy.points[index] = nextContent.caseStudy.points[index - 1];
                            nextContent.caseStudy.points[index - 1] = temp;
                            pushState(nextContent);
                          }}
                          className="text-neutral-500 hover:text-white text-[8px]"
                          disabled={index === 0}
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => {
                            if (index === currentContent.caseStudy.points.length - 1) return;
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            const temp = nextContent.caseStudy.points[index];
                            nextContent.caseStudy.points[index] = nextContent.caseStudy.points[index + 1];
                            nextContent.caseStudy.points[index + 1] = temp;
                            pushState(nextContent);
                          }}
                          className="text-neutral-500 hover:text-white text-[8px]"
                          disabled={index === currentContent.caseStudy.points.length - 1}
                        >
                          ▼
                        </button>
                      </div>

                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const nextContent = JSON.parse(JSON.stringify(currentContent));
                          nextContent.caseStudy.points[index] = e.target.value;
                          pushState(nextContent);
                        }}
                        className="flex-1 px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />

                      <button
                        onClick={() => {
                          const nextContent = JSON.parse(JSON.stringify(currentContent));
                          nextContent.caseStudy.points.splice(index, 1);
                          pushState(nextContent);
                        }}
                        className="w-6 h-6 border border-red-500/10 hover:border-red-500/30 rounded flex items-center justify-center text-[9px] text-red-500 bg-red-500/5 hover:bg-red-500/10 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CLIENT TESTIMONIALS CMS PANEL */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-white">// Client Testimonials</h3>
                <button
                  onClick={() => {
                    const nextContent = JSON.parse(JSON.stringify(currentContent));
                    if (!nextContent.testimonials) nextContent.testimonials = { list: [] };
                    if (!nextContent.testimonials.list) nextContent.testimonials.list = [];
                    nextContent.testimonials.list.push({
                      id: Date.now(),
                      name: "New Client",
                      role: "CEO, Pioneer Corp",
                      quote: "Describe the client's perspective here.",
                      rating: 5,
                      tag: "CUSTOM WORK",
                      avatar: "/images/gallery/avatar_alexander.png",
                      color: "from-amber-500/10 to-orange-500/5",
                      glowColor: "rgba(245,158,11,0.25)",
                      tagClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                      starClass: "text-amber-500"
                    });
                    pushState(nextContent);
                  }}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg text-[9px] font-mono text-neutral-300 hover:text-white cursor-pointer transition-all flex items-center gap-1.5 font-semibold"
                >
                  <span>+ Add Testimonial</span>
                </button>
              </div>

              {/* General Testimonial Header Settings */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Header Text & Visibility</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Show Section</label>
                    <button
                      type="button"
                      onClick={() => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.testimonials.show = nextContent.testimonials.show !== false ? false : true;
                        pushState(nextContent);
                      }}
                      className={`w-full py-2 border rounded-lg text-[8px] uppercase tracking-widest font-mono cursor-pointer transition-all duration-300 ${
                        (currentContent.testimonials?.show !== false) 
                          ? 'bg-white text-black font-semibold' 
                          : 'bg-neutral-800 text-neutral-500 border-transparent'
                      }`}
                    >
                      {(currentContent.testimonials?.show !== false) ? 'Show' : 'Hide'}
                    </button>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Section Title</label>
                    <input
                      type="text"
                      value={currentContent.testimonials?.title || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.testimonials.title = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Section Description</label>
                  <textarea
                    rows={2}
                    value={currentContent.testimonials?.description || ''}
                    onChange={(e) => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      nextContent.testimonials.description = e.target.value;
                      pushState(nextContent);
                    }}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Testimonials List */}
              <div className="space-y-4">
                {(currentContent.testimonials?.list || []).map((item, index) => (
                  <div key={item.id || index} className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left relative">
                    
                    {/* Header Controls */}
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Testimonial #{index + 1}</span>
                      
                      <div className="flex gap-2">
                        {/* Reorder Buttons */}
                        <button
                          onClick={() => {
                            if (index === 0) return;
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            const temp = nextContent.testimonials.list[index];
                            nextContent.testimonials.list[index] = nextContent.testimonials.list[index - 1];
                            nextContent.testimonials.list[index - 1] = temp;
                            pushState(nextContent);
                          }}
                          className="w-6 h-6 border border-white/10 hover:border-white/20 rounded flex items-center justify-center text-[9px] text-neutral-400 hover:text-white bg-black/20"
                          disabled={index === 0}
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => {
                            if (index === currentContent.testimonials.list.length - 1) return;
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            const temp = nextContent.testimonials.list[index];
                            nextContent.testimonials.list[index] = nextContent.testimonials.list[index + 1];
                            nextContent.testimonials.list[index + 1] = temp;
                            pushState(nextContent);
                          }}
                          className="w-6 h-6 border border-white/10 hover:border-white/20 rounded flex items-center justify-center text-[9px] text-neutral-400 hover:text-white bg-black/20"
                          disabled={index === currentContent.testimonials.list.length - 1}
                        >
                          ▼
                        </button>

                        <button
                          onClick={() => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.testimonials.list.splice(index, 1);
                            pushState(nextContent);
                          }}
                          className="w-6 h-6 border border-red-500/10 hover:border-red-500/30 rounded flex items-center justify-center text-[9px] text-red-500 bg-red-500/5 hover:bg-red-500/10 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Client Name</label>
                        <input
                          type="text"
                          value={item.name || ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.testimonials.list[index].name = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>

                      {/* Role */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Client Designation / Company</label>
                        <input
                          type="text"
                          value={item.role || ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.testimonials.list[index].role = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>

                      {/* Project tag */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Project Tag</label>
                        <input
                          type="text"
                          value={item.tag || ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.testimonials.list[index].tag = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Body Quote */}
                    <div className="space-y-1">
                      <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Quote Message</label>
                      <textarea
                        rows={3}
                        value={item.quote || ''}
                        onChange={(e) => {
                          const nextContent = JSON.parse(JSON.stringify(currentContent));
                          nextContent.testimonials.list[index].quote = e.target.value;
                          pushState(nextContent);
                        }}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-sans text-xs focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    {/* Star Rating & Styling Colors */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Rating select */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Rating Stars (1-5)</label>
                        <select
                          value={item.rating || 5}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.testimonials.list[index].rating = Number(e.target.value);
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        >
                          <option value="1">1 Star</option>
                          <option value="2">2 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="5">5 Stars</option>
                        </select>
                      </div>

                      {/* Card Gradient bg class */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Glow Bg Gradient (Tailwind)</label>
                        <input
                          type="text"
                          value={item.color || ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.testimonials.list[index].color = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none"
                        />
                      </div>

                      {/* Glow Shadow Color */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Glow Shadow (rgba/hex)</label>
                        <input
                          type="text"
                          value={item.glowColor || ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.testimonials.list[index].glowColor = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none"
                        />
                      </div>

                      {/* Badge Class */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Tag Class (Tailwind)</label>
                        <input
                          type="text"
                          value={item.tagClass || ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.testimonials.list[index].tagClass = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Avatar Upload */}
                    <div className="flex gap-4 items-center pt-3 border-t border-white/[0.03]">
                      {item.avatar && (
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                          <img src={item.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Avatar Image URL</label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={item.avatar || ''}
                            onChange={(e) => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.testimonials.list[index].avatar = e.target.value;
                              pushState(nextContent);
                            }}
                            className="flex-1 px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                          />
                          <label className="py-2 px-4 border border-white/10 hover:border-white/30 text-center rounded-xl bg-white/5 text-[9px] uppercase tracking-widest font-mono cursor-pointer hover:bg-white/10 transition-all text-white font-semibold block">
                            {isUploadingImage ? 'Uploading...' : 'Upload Avatar'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setIsUploadingImage(true);
                                const formData = new FormData();
                                formData.append('file', file);
                                try {
                                  const res = await fetch(API_URL + '/api/upload/image', { method: 'POST', body: formData });
                                  if (res.ok) {
                                    const data = await res.json();
                                    const nextContent = JSON.parse(JSON.stringify(currentContent));
                                    nextContent.testimonials.list[index].avatar = data.imageUrl;
                                    pushState(nextContent);
                                  }
                                } catch (err) {
                                  console.error(err);
                                } finally {
                                  setIsUploadingImage(false);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOTTOM CTA SECTION CMS PANEL */}
          {activeTab === 'bottomCta' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-white">// Bottom CTA Section Settings</h3>
              </div>

              {/* Show/Hide CTA */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Section Visibility</h4>
                <div className="w-full md:w-1/3">
                  <button
                    type="button"
                    onClick={() => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      nextContent.bottomCta.show = nextContent.bottomCta.show !== false ? false : true;
                      pushState(nextContent);
                    }}
                    className={`w-full py-2 border rounded-lg text-[8px] uppercase tracking-widest font-mono cursor-pointer transition-all duration-300 ${
                      (currentContent.bottomCta?.show !== false) 
                        ? 'bg-white text-black font-semibold' 
                        : 'bg-neutral-800 text-neutral-500 border-transparent'
                    }`}
                  >
                    {(currentContent.bottomCta?.show !== false) ? 'Show Section' : 'Hide Section'}
                  </button>
                </div>
              </div>

              {/* Content Config */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">CTA Content Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Normal Title Text */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Title (Normal Text)</label>
                    <input
                      type="text"
                      value={currentContent.bottomCta?.titleNormal || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.bottomCta.titleNormal = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      placeholder="e.g. Let's build the"
                    />
                  </div>

                  {/* Italic Title Text */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Title Accent (Italic Text)</label>
                    <input
                      type="text"
                      value={currentContent.bottomCta?.titleItalic || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.bottomCta.titleItalic = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      placeholder="e.g. future together."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Button Action Text */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Button Label Text</label>
                    <input
                      type="text"
                      value={currentContent.bottomCta?.btnText || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.bottomCta.btnText = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      placeholder="e.g. Start a Project →"
                    />
                  </div>

                  {/* Button Destination URL */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Button Destination Link</label>
                    <input
                      type="text"
                      value={currentContent.bottomCta?.btnLink || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        nextContent.bottomCta.btnLink = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      placeholder="e.g. #contact"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. ABOUT US CMS PANEL */}
          {activeTab === 'about_us' && currentContent.about_us && (
            <div className="space-y-6">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-white">// About Us Overview</h3>
              
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Philosophy</h4>
                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Title</label>
                  <input
                    type="text"
                    value={currentContent.about_us.philosophy?.title || ''}
                    onChange={(e) => updateAboutUsField('philosophy', 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Quote</label>
                  <textarea
                    rows={3}
                    value={currentContent.about_us.philosophy?.quote || ''}
                    onChange={(e) => updateAboutUsField('philosophy', 'quote', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Description</label>
                  <textarea
                    rows={4}
                    value={currentContent.about_us.philosophy?.description || ''}
                    onChange={(e) => updateAboutUsField('philosophy', 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Vision & Mission</h4>
                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Vision Title</label>
                  <input
                    type="text"
                    value={currentContent.about_us.vision?.title || ''}
                    onChange={(e) => updateAboutUsField('vision', 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Vision Text</label>
                  <textarea
                    rows={3}
                    value={currentContent.about_us.vision?.text || ''}
                    onChange={(e) => updateAboutUsField('vision', 'text', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Mission Title</label>
                  <input
                    type="text"
                    value={currentContent.about_us.mission?.title || ''}
                    onChange={(e) => updateAboutUsField('mission', 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Mission Text</label>
                  <textarea
                    rows={3}
                    value={currentContent.about_us.mission?.text || ''}
                    onChange={(e) => updateAboutUsField('mission', 'text', e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Workspace Rooms ({currentContent.about_us.workspace_rooms?.length || 0})</h4>
                  <button
                    onClick={addWorkspaceRoom}
                    className="px-3 py-1.5 bg-white text-black font-semibold text-[8px] uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors"
                  >
                    + Add Room
                  </button>
                </div>
                <div className="space-y-4">
                  {(currentContent.about_us.workspace_rooms || []).map((room, index) => (
                    <div key={index} className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3 text-left">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="font-mono text-[9px] text-neutral-500">Room #{index + 1}</span>
                        <button
                          onClick={() => deleteWorkspaceRoom(index)}
                          className="px-2 py-0.5 text-[8px] text-red-500 hover:text-red-400 font-mono border border-red-500/10 hover:border-red-500/20 rounded"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Room Title"
                          value={room.title}
                          onChange={(e) => updateWorkspaceRoom(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={room.img}
                          onChange={(e) => updateWorkspaceRoom(index, 'img', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                        <textarea
                          placeholder="Description"
                          rows={2}
                          value={room.desc}
                          onChange={(e) => updateWorkspaceRoom(index, 'desc', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. LIFE & CULTURE CMS PANEL */}
          {activeTab === 'our_culture' && currentContent.our_culture && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">// Culture Aspects Registry ({currentContent.our_culture.length})</span>
                <button
                  onClick={addCultureItem}
                  className="px-3 py-1.5 bg-white text-black font-semibold text-[8px] uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors"
                >
                  + Add Culture Aspect
                </button>
              </div>

              <div className="space-y-4">
                {currentContent.our_culture.map((item, index) => (
                  <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] text-neutral-500 font-bold">{item.title || 'New Culture Aspect'}</span>
                      <button
                        onClick={() => deleteCultureItem(index)}
                        className="px-2 py-0.5 text-[8px] text-red-500 hover:text-red-400 font-mono border border-red-500/10 hover:border-red-500/20 rounded"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => updateCultureItem(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Icon Identifier (learning, collab, celebrate, client, ownership, grow)"
                        value={item.icon}
                        onChange={(e) => updateCultureItem(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={item.img}
                        onChange={(e) => updateCultureItem(index, 'img', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                      <textarea
                        placeholder="Description"
                        rows={2}
                        value={item.desc}
                        onChange={(e) => updateCultureItem(index, 'desc', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. TEAM MEMBERS CMS PANEL */}
          {activeTab === 'people' && currentContent.people && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">// Organigram Team Registry ({currentContent.people.length})</span>
                <button
                  onClick={addPeopleItem}
                  className="px-3 py-1.5 bg-white text-black font-semibold text-[8px] uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors"
                >
                  + Add Member
                </button>
              </div>

              <div className="space-y-4">
                {currentContent.people.map((item, index) => (
                  <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] text-neutral-500 font-bold">{item.name || 'New Member'}</span>
                      <button
                        onClick={() => deletePeopleItem(index)}
                        className="px-2 py-0.5 text-[8px] text-red-500 hover:text-red-400 font-mono border border-red-500/10 hover:border-red-500/20 rounded"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updatePeopleItem(index, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Role</label>
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => updatePeopleItem(index, 'role', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Level (1-5)</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={item.level}
                          onChange={(e) => updatePeopleItem(index, 'level', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Icon / Emoji</label>
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => updatePeopleItem(index, 'icon', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Department</label>
                        <input
                          type="text"
                          value={item.dept}
                          onChange={(e) => updatePeopleItem(index, 'dept', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Manager ID (Name)</label>
                        <input
                          type="text"
                          value={item.parent_id || ''}
                          onChange={(e) => updatePeopleItem(index, 'parent_id', e.target.value || null)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                          placeholder="e.g. Radhe Patel"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Avatar Image URL</label>
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => updatePeopleItem(index, 'image', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Short Bio</label>
                      <textarea
                        rows={2}
                        value={item.bio}
                        onChange={(e) => updatePeopleItem(index, 'bio', e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. AWARDS & ACHIEVEMENTS CMS PANEL */}
          {activeTab === 'awards' && currentContent.awards && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">// Awards Registry ({currentContent.awards.length})</span>
                <button
                  onClick={addAwardItem}
                  className="px-3 py-1.5 bg-white text-black font-semibold text-[8px] uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors"
                >
                  + Add Award
                </button>
              </div>

              <div className="space-y-4">
                {currentContent.awards.map((item, index) => (
                  <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] text-neutral-500 font-bold">{item.title || 'New Award'}</span>
                      <button
                        onClick={() => deleteAwardItem(index)}
                        className="px-2 py-0.5 text-[8px] text-red-500 hover:text-red-400 font-mono border border-red-500/10 hover:border-red-500/20 rounded"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Slug ID</label>
                        <input
                          type="text"
                          value={item.slug}
                          onChange={(e) => updateAwardItem(index, 'slug', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Year</label>
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => updateAwardItem(index, 'year', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Awarded By</label>
                        <input
                          type="text"
                          value={item.by}
                          onChange={(e) => updateAwardItem(index, 'by', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Recipient</label>
                        <input
                          type="text"
                          value={item.recipient}
                          onChange={(e) => updateAwardItem(index, 'recipient', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Category (company / founders)</label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updateAwardItem(index, 'category', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Banner Image URL</label>
                        <input
                          type="text"
                          value={item.img}
                          onChange={(e) => updateAwardItem(index, 'img', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Short Summary</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => updateAwardItem(index, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Detailed Narrative</label>
                      <textarea
                        rows={3}
                        value={item.longDescription}
                        onChange={(e) => updateAwardItem(index, 'longDescription', e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. INSIGHTS / BLOGS CMS PANEL */}
          {activeTab === 'blogs' && currentContent.blogs && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">// Blogs Registry ({currentContent.blogs.length})</span>
                <button
                  onClick={addBlogItem}
                  className="px-3 py-1.5 bg-white text-black font-semibold text-[8px] uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors"
                >
                  + Add Post
                </button>
              </div>

              <div className="space-y-4">
                {currentContent.blogs.map((item, index) => (
                  <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] text-neutral-500 font-bold">{item.title || 'New Post'}</span>
                      <button
                        onClick={() => deleteBlogItem(index)}
                        className="px-2 py-0.5 text-[8px] text-red-500 hover:text-red-400 font-mono border border-red-500/10 hover:border-red-500/20 rounded"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Slug URL ID</label>
                        <input
                          type="text"
                          value={item.slug}
                          onChange={(e) => updateBlogItem(index, 'slug', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Publish Date</label>
                        <input
                          type="text"
                          value={item.date}
                          onChange={(e) => updateBlogItem(index, 'date', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Author</label>
                        <input
                          type="text"
                          value={item.author}
                          onChange={(e) => updateBlogItem(index, 'author', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Category</label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updateBlogItem(index, 'category', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Read Time</label>
                        <input
                          type="text"
                          value={item.readTime}
                          onChange={(e) => updateBlogItem(index, 'readTime', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Post Image URL</label>
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => updateBlogItem(index, 'image', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Short Preview Description</label>
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => updateBlogItem(index, 'desc', e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Narrative Paragraphs (separate by double newlines \n\n)</label>
                      <textarea
                        rows={4}
                        value={item.longContent ? item.longContent.join('\n\n') : ''}
                        onChange={(e) => updateBlogItem(index, 'longContent', e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Key Takeaways (one per line)</label>
                      <textarea
                        rows={2}
                        value={item.highlights ? item.highlights.join('\n') : ''}
                        onChange={(e) => updateBlogItem(index, 'highlights', e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. VISUAL GALLERY CMS PANEL */}
          {activeTab === 'gallery' && currentContent.gallery && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">// Gallery Registry ({currentContent.gallery.length})</span>
                <button
                  onClick={addGalleryItem}
                  className="px-3 py-1.5 bg-white text-black font-semibold text-[8px] uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors"
                >
                  + Add Image
                </button>
              </div>

              <div className="space-y-4">
                {currentContent.gallery.map((item, index) => (
                  <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] text-neutral-500 font-bold">{item.title || 'New Gallery Image'}</span>
                      <button
                        onClick={() => deleteGalleryItem(index)}
                        className="px-2 py-0.5 text-[8px] text-red-500 hover:text-red-400 font-mono border border-red-500/10 hover:border-red-500/20 rounded"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Image Title"
                        value={item.title}
                        onChange={(e) => updateGalleryItem(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Category"
                        value={item.category}
                        onChange={(e) => updateGalleryItem(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Masonry Size Class (e.g. col-span-1 row-span-1 / col-span-2 row-span-1)"
                        value={item.size}
                        onChange={(e) => updateGalleryItem(index, 'size', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={item.image}
                        onChange={(e) => updateGalleryItem(index, 'image', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. PORTFOLIO WORK CMS PANEL */}
          {activeTab === 'portfolio' && currentContent.portfolio && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">// Portfolio Work Registry ({currentContent.portfolio.length})</span>
                <button
                  onClick={addPortfolioItem}
                  className="px-3 py-1.5 bg-white text-black font-semibold text-[8px] uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors"
                >
                  + Add Project
                </button>
              </div>

              <div className="space-y-4">
                {currentContent.portfolio.map((item, index) => (
                  <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] text-neutral-500 font-bold">{item.title || 'New Project'}</span>
                      <button
                        onClick={() => deletePortfolioItem(index)}
                        className="px-2 py-0.5 text-[8px] text-red-500 hover:text-red-400 font-mono border border-red-500/10 hover:border-red-500/20 rounded"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Project Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updatePortfolioItem(index, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Slug ID</label>
                        <input
                          type="text"
                          value={item.slug}
                          onChange={(e) => updatePortfolioItem(index, 'slug', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Client Name</label>
                        <input
                          type="text"
                          value={item.client}
                          onChange={(e) => updatePortfolioItem(index, 'client', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Category (web / platform / ai / ecommerce)</label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updatePortfolioItem(index, 'category', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Project Image URL</label>
                        <input
                          type="text"
                          value={item.img}
                          onChange={(e) => updatePortfolioItem(index, 'img', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Theme Color (emerald, purple, amber, red, blue, etc)</label>
                        <input
                          type="text"
                          value={item.color}
                          onChange={(e) => updatePortfolioItem(index, 'color', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Accent Color Hex Code</label>
                        <input
                          type="text"
                          value={item.accentColor}
                          onChange={(e) => updatePortfolioItem(index, 'accentColor', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                          placeholder="#3b82f6"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          value={item.tech ? item.tech.join(', ') : ''}
                          onChange={(e) => updatePortfolioItem(index, 'tech', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Short Project Description</label>
                      <textarea
                        rows={3}
                        value={item.description}
                        onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. VENTURES CMS PANEL */}
          {activeTab === 'ventures' && currentContent.ventures && (
            <div className="space-y-6">
              {/* Ventures Main Header/Banner Customizer */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Ventures Page Title & Subtitle</h4>
                <div className="space-y-3">
                  <div>
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Overline</label>
                    <input
                      type="text"
                      value={currentContent.ventures_settings?.overline || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.ventures_settings) nextContent.ventures_settings = {};
                        nextContent.ventures_settings.overline = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Title</label>
                    <input
                      type="text"
                      value={currentContent.ventures_settings?.title || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.ventures_settings) nextContent.ventures_settings = {};
                        nextContent.ventures_settings.title = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Subtitle</label>
                    <textarea
                      rows={2}
                      value={currentContent.ventures_settings?.subtitle || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.ventures_settings) nextContent.ventures_settings = {};
                        nextContent.ventures_settings.subtitle = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">// Ventures Registry ({currentContent.ventures.length})</span>
                <button
                  onClick={addVentureItem}
                  className="px-3 py-1.5 bg-white text-black font-semibold text-[8px] uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  + Add Venture
                </button>
              </div>

              <div className="space-y-4">
                {currentContent.ventures.map((item, index) => (
                  <div key={item.slug || index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] text-neutral-500 font-bold">{item.name || 'New Venture'}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={index === 0}
                          onClick={() => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            const arr = nextContent.ventures;
                            const temp = arr[index];
                            arr[index] = arr[index - 1];
                            arr[index - 1] = temp;
                            pushState(nextContent);
                          }}
                          className="w-5 h-5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center text-[8px] text-neutral-400 hover:text-white cursor-pointer disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <button
                          disabled={index === currentContent.ventures.length - 1}
                          onClick={() => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            const arr = nextContent.ventures;
                            const temp = arr[index];
                            arr[index] = arr[index + 1];
                            arr[index + 1] = temp;
                            pushState(nextContent);
                          }}
                          className="w-5 h-5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center text-[8px] text-neutral-400 hover:text-white cursor-pointer disabled:opacity-30"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => deleteVentureItem(index)}
                          className="px-2 py-0.5 text-[8px] text-red-500 hover:text-red-400 font-mono border border-red-500/10 hover:border-red-500/20 rounded cursor-pointer ml-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Venture Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateVentureItem(index, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Slug ID</label>
                        <input
                          type="text"
                          value={item.slug}
                          onChange={(e) => updateVentureItem(index, 'slug', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Tagline</label>
                        <input
                          type="text"
                          value={item.tagline}
                          onChange={(e) => updateVentureItem(index, 'tagline', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Status</label>
                        <input
                          type="text"
                          value={item.status}
                          onChange={(e) => updateVentureItem(index, 'status', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Logo/Poster Image with Preview and Upload */}
                    <div className="space-y-2">
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Logo/Poster Image</label>
                      {item.img && (
                        <div className="w-full h-32 bg-black rounded-lg overflow-hidden border border-white/10 relative group mb-2">
                          <img src={API_URL + item.img} alt="Venture Poster" className="w-full h-full object-cover" onError={(e) => {
                            e.target.src = item.img;
                          }} />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.img || ''}
                          onChange={(e) => updateVentureItem(index, 'img', e.target.value)}
                          placeholder="/images/ventures/..."
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                        <label className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded text-[9px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors flex items-center justify-center shrink-0 cursor-pointer">
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                const formData = new FormData();
                                formData.append('file', file);
                                try {
                                  const res = await fetch(API_URL + '/api/upload/image', {
                                    method: 'POST',
                                    body: formData
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    updateVentureItem(index, 'img', data.imageUrl);
                                  }
                                } catch (err) {
                                  console.error("Upload error:", err);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Theme Color (cyan, amber, emerald, etc)</label>
                        <input
                          type="text"
                          value={item.color}
                          onChange={(e) => updateVentureItem(index, 'color', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Accent Color (Hex Code)</label>
                        <input
                          type="text"
                          value={item.accentColor || ''}
                          onChange={(e) => updateVentureItem(index, 'accentColor', e.target.value)}
                          placeholder="#06b6d4"
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Glow Color (RGBA shadow)</label>
                        <input
                          type="text"
                          value={item.glowColor || ''}
                          onChange={(e) => updateVentureItem(index, 'glowColor', e.target.value)}
                          placeholder="rgba(6,182,212,0.20)"
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Short Summary Description</label>
                      <textarea
                        rows={2}
                        value={item.shortDesc}
                        onChange={(e) => updateVentureItem(index, 'shortDesc', e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Full Venture Narrative Description</label>
                      <textarea
                        rows={3}
                        value={item.fullDescription}
                        onChange={(e) => updateVentureItem(index, 'fullDescription', e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Mission</label>
                        <textarea
                          rows={2}
                          value={item.mission}
                          onChange={(e) => updateVentureItem(index, 'mission', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Vision</label>
                        <textarea
                          rows={2}
                          value={item.vision}
                          onChange={(e) => updateVentureItem(index, 'vision', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    {/* Collapsible Key Initiatives */}
                    <div className="border border-white/5 rounded-lg p-3 space-y-2 bg-white/[0.01]">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Key Initiatives</span>
                        <button
                          onClick={() => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            if (!nextContent.ventures[index].keyInitiatives) nextContent.ventures[index].keyInitiatives = [];
                            nextContent.ventures[index].keyInitiatives.push({ title: "New Initiative", desc: "Initiative details..." });
                            pushState(nextContent);
                          }}
                          className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded text-[7px] font-mono text-emerald-400 cursor-pointer"
                        >
                          + Add Initiative
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(item.keyInitiatives || []).map((init, initIdx) => (
                          <div key={initIdx} className="p-2.5 bg-black/30 border border-white/5 rounded space-y-2 relative">
                            <button
                              onClick={() => {
                                const nextContent = JSON.parse(JSON.stringify(currentContent));
                                nextContent.ventures[index].keyInitiatives.splice(initIdx, 1);
                                pushState(nextContent);
                              }}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-400 text-[8px] font-mono cursor-pointer"
                            >
                              ✕
                            </button>
                            <div>
                              <label className="font-mono text-[7px] text-neutral-500 block mb-0.5">Title</label>
                              <input
                                type="text"
                                value={init.title || ''}
                                onChange={(e) => {
                                  const nextContent = JSON.parse(JSON.stringify(currentContent));
                                  nextContent.ventures[index].keyInitiatives[initIdx].title = e.target.value;
                                  pushState(nextContent);
                                }}
                                className="w-full px-2 py-1 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="font-mono text-[7px] text-neutral-500 block mb-0.5">Description</label>
                              <textarea
                                rows={2}
                                value={init.desc || ''}
                                onChange={(e) => {
                                  const nextContent = JSON.parse(JSON.stringify(currentContent));
                                  nextContent.ventures[index].keyInitiatives[initIdx].desc = e.target.value;
                                  pushState(nextContent);
                                }}
                                className="w-full px-2 py-1 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none leading-relaxed"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Collapsible Impact Stats */}
                    <div className="border border-white/5 rounded-lg p-3 space-y-2 bg-white/[0.01]">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Impact Stats</span>
                        <button
                          onClick={() => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            if (!nextContent.ventures[index].impactStats) nextContent.ventures[index].impactStats = [];
                            nextContent.ventures[index].impactStats.push({ label: "Stat Label", value: "10k+" });
                            pushState(nextContent);
                          }}
                          className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded text-[7px] font-mono text-emerald-400 cursor-pointer"
                        >
                          + Add Stat
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(item.impactStats || []).map((stat, statIdx) => (
                          <div key={statIdx} className="p-2.5 bg-black/30 border border-white/5 rounded relative space-y-1">
                            <button
                              onClick={() => {
                                const nextContent = JSON.parse(JSON.stringify(currentContent));
                                nextContent.ventures[index].impactStats.splice(statIdx, 1);
                                pushState(nextContent);
                              }}
                              className="absolute top-1 right-1.5 text-red-500 hover:text-red-400 text-[8px] font-mono cursor-pointer"
                            >
                              ✕
                            </button>
                            <div>
                              <label className="font-mono text-[7px] text-neutral-500 block mb-0.5">Value</label>
                              <input
                                type="text"
                                value={stat.value || ''}
                                onChange={(e) => {
                                  const nextContent = JSON.parse(JSON.stringify(currentContent));
                                  nextContent.ventures[index].impactStats[statIdx].value = e.target.value;
                                  pushState(nextContent);
                                }}
                                className="w-full px-2 py-0.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="font-mono text-[7px] text-neutral-500 block mb-0.5">Label</label>
                              <input
                                type="text"
                                value={stat.label || ''}
                                onChange={(e) => {
                                  const nextContent = JSON.parse(JSON.stringify(currentContent));
                                  nextContent.ventures[index].impactStats[statIdx].label = e.target.value;
                                  pushState(nextContent);
                                }}
                                className="w-full px-2 py-0.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack & Partners */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          value={item.techStack ? item.techStack.join(', ') : ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.ventures[index].techStack = e.target.value.split(',').map(s => s.trim());
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Partners (comma separated)</label>
                        <input
                          type="text"
                          value={item.partners ? item.partners.join(', ') : ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.ventures[index].partners = e.target.value.split(',').map(s => s.trim());
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. CAREERS & OPEN ROLES CMS PANEL */}
          {activeTab === 'careers' && currentContent.careers && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">// Careers Registry ({currentContent.careers.length})</span>
                <button
                  onClick={addCareerItem}
                  className="px-3 py-1.5 bg-white text-black font-semibold text-[8px] uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors"
                >
                  + Add Job Role
                </button>
              </div>

              <div className="space-y-4">
                {currentContent.careers.map((item, index) => (
                  <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] text-neutral-500 font-bold">{item.title || 'New Job Role'}</span>
                      <button
                        onClick={() => deleteCareerItem(index)}
                        className="px-2 py-0.5 text-[8px] text-red-500 hover:text-red-400 font-mono border border-red-500/10 hover:border-red-500/20 rounded"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Job Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateCareerItem(index, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Slug ID</label>
                        <input
                          type="text"
                          value={item.slug}
                          onChange={(e) => updateCareerItem(index, 'slug', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Department</label>
                        <input
                          type="text"
                          value={item.department}
                          onChange={(e) => updateCareerItem(index, 'department', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Type (Full-time / Part-time)</label>
                        <input
                          type="text"
                          value={item.type}
                          onChange={(e) => updateCareerItem(index, 'type', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Location</label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) => updateCareerItem(index, 'location', e.target.value)}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Description Summary</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => updateCareerItem(index, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Requirements (one per line)</label>
                      <textarea
                        rows={3}
                        value={item.requirements ? item.requirements.join('\n') : ''}
                        onChange={(e) => updateCareerItem(index, 'requirements', e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Interview Steps (comma separated)</label>
                      <input
                        type="text"
                        value={item.steps ? item.steps.join(', ') : ''}
                        onChange={(e) => updateCareerItem(index, 'steps', e.target.value)}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT PAGE CMS PANEL */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setActiveTab('submissions');
                    loadSubmissions();
                  }}
                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-[9px] font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer transition-all flex items-center gap-1.5 font-semibold"
                >
                  <span>✉ View Form Submissions Log</span>
                </button>
              </div>

              {/* General Contact Info & Hero */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Hero Header & Info Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hero Title */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Hero Title</label>
                    <input
                      type="text"
                      value={currentContent.contact_settings?.title || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.contact_settings) nextContent.contact_settings = {};
                        nextContent.contact_settings.title = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Direct Phone Number</label>
                    <input
                      type="text"
                      value={currentContent.contact_settings?.phone || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.contact_settings) nextContent.contact_settings = {};
                        nextContent.contact_settings.phone = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Hero Subtitle */}
                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={currentContent.contact_settings?.subtitle || ''}
                    onChange={(e) => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      if (!nextContent.contact_settings) nextContent.contact_settings = {};
                      nextContent.contact_settings.subtitle = e.target.value;
                      pushState(nextContent);
                    }}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hello Email */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Hello/Business Email</label>
                    <input
                      type="text"
                      value={currentContent.contact_settings?.email_hello || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.contact_settings) nextContent.contact_settings = {};
                        nextContent.contact_settings.email_hello = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                    />
                  </div>

                  {/* Careers Email */}
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Careers/Join Email</label>
                    <input
                      type="text"
                      value={currentContent.contact_settings?.email_join || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.contact_settings) nextContent.contact_settings = {};
                        nextContent.contact_settings.email_join = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Stat Cards Editor */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Response Promise Badges / Stats</h4>
                <div className="space-y-4">
                  {(currentContent.contact_settings?.stats || [
                    { label: "2-4 Hour Response", value: "Mon — Sat", icon: "time" },
                    { label: "Global Clients", value: "India • USA • UK • UAE", icon: "globe" },
                    { label: "Free Consultation", value: "No obligation quote", icon: "shield" }
                  ]).map((stat, index) => (
                    <div key={index} className="p-4 bg-black/40 border border-white/5 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Badge Title</label>
                        <input
                          type="text"
                          value={stat.label || ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            if (!nextContent.contact_settings) nextContent.contact_settings = {};
                            if (!nextContent.contact_settings.stats) nextContent.contact_settings.stats = [];
                            nextContent.contact_settings.stats[index].label = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Value Subtext</label>
                        <input
                          type="text"
                          value={stat.value || ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            if (!nextContent.contact_settings) nextContent.contact_settings = {};
                            if (!nextContent.contact_settings.stats) nextContent.contact_settings.stats = [];
                            nextContent.contact_settings.stats[index].value = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Icon Class (time, globe, shield)</label>
                        <select
                          value={stat.icon || 'time'}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            if (!nextContent.contact_settings) nextContent.contact_settings = {};
                            if (!nextContent.contact_settings.stats) nextContent.contact_settings.stats = [];
                            nextContent.contact_settings.stats[index].icon = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        >
                          <option value="time">Time / Clock Icon</option>
                          <option value="globe">Globe Icon</option>
                          <option value="shield">Shield / Check Icon</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form Fields Editor */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Contact Form Fields Builder</h4>
                  <button
                    onClick={() => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      if (!nextContent.contact_settings) nextContent.contact_settings = {};
                      if (!nextContent.contact_settings.form_fields) nextContent.contact_settings.form_fields = [];
                      const id = "field_" + Date.now();
                      nextContent.contact_settings.form_fields.push({
                        id: id,
                        label: "Custom Field",
                        type: "text",
                        placeholder: "Enter details...",
                        required: false,
                        halfWidth: true
                      });
                      pushState(nextContent);
                    }}
                    className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded text-[8px] font-mono text-emerald-400 cursor-pointer"
                  >
                    + Add Field
                  </button>
                </div>

                <div className="space-y-4">
                  {(currentContent.contact_settings?.form_fields || []).map((field, index) => (
                    <div key={field.id || index} className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-3 relative">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="font-mono text-[8px] text-neutral-400">Form Field #{index + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={index === 0}
                            onClick={() => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              const arr = nextContent.contact_settings.form_fields;
                              const temp = arr[index];
                              arr[index] = arr[index - 1];
                              arr[index - 1] = temp;
                              pushState(nextContent);
                            }}
                            className="w-5 h-5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center text-[8px] text-neutral-400 hover:text-white cursor-pointer disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            disabled={index === (currentContent.contact_settings?.form_fields || []).length - 1}
                            onClick={() => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              const arr = nextContent.contact_settings.form_fields;
                              const temp = arr[index];
                              arr[index] = arr[index + 1];
                              arr[index + 1] = temp;
                              pushState(nextContent);
                            }}
                            className="w-5 h-5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center text-[8px] text-neutral-400 hover:text-white cursor-pointer disabled:opacity-30"
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.contact_settings.form_fields.splice(index, 1);
                              pushState(nextContent);
                            }}
                            className="w-5 h-5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded flex items-center justify-center text-[8px] cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Field Unique Key (ID)</label>
                          <input
                            type="text"
                            value={field.id || ''}
                            onChange={(e) => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.contact_settings.form_fields[index].id = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                              pushState(nextContent);
                            }}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Field Label / Title</label>
                          <input
                            type="text"
                            value={field.label || ''}
                            onChange={(e) => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.contact_settings.form_fields[index].label = e.target.value;
                              pushState(nextContent);
                            }}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Field Placeholder</label>
                          <input
                            type="text"
                            value={field.placeholder || ''}
                            onChange={(e) => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.contact_settings.form_fields[index].placeholder = e.target.value;
                              pushState(nextContent);
                            }}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                        <div>
                          <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Input Type</label>
                          <select
                            value={field.type || 'text'}
                            onChange={(e) => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.contact_settings.form_fields[index].type = e.target.value;
                              if (e.target.value === 'select' && !nextContent.contact_settings.form_fields[index].options) {
                                nextContent.contact_settings.form_fields[index].options = ["Option 1", "Option 2"];
                              }
                              pushState(nextContent);
                            }}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                          >
                            <option value="text">Text Input</option>
                            <option value="email">Email Input</option>
                            <option value="tel">Telephone / Phone</option>
                            <option value="select">Dropdown (Select)</option>
                            <option value="textarea">Textarea (Long Message)</option>
                          </select>
                        </div>

                        <div className="flex gap-4 pt-3 col-span-2 md:col-span-1">
                          <label className="flex items-center gap-1.5 text-[10px] text-neutral-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.required === true}
                              onChange={(e) => {
                                const nextContent = JSON.parse(JSON.stringify(currentContent));
                                nextContent.contact_settings.form_fields[index].required = e.target.checked;
                                pushState(nextContent);
                              }}
                              className="w-3 h-3 accent-emerald-500 rounded"
                            />
                            <span>Required</span>
                          </label>

                          <label className="flex items-center gap-1.5 text-[10px] text-neutral-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.halfWidth === true}
                              onChange={(e) => {
                                const nextContent = JSON.parse(JSON.stringify(currentContent));
                                nextContent.contact_settings.form_fields[index].halfWidth = e.target.checked;
                                pushState(nextContent);
                              }}
                              className="w-3 h-3 accent-emerald-500 rounded"
                            />
                            <span>Half Width (50%)</span>
                          </label>
                        </div>

                        {field.type === 'select' && (
                          <div>
                            <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Dropdown Options (comma separated)</label>
                            <input
                              type="text"
                              value={field.options ? field.options.join(', ') : ''}
                              onChange={(e) => {
                                const nextContent = JSON.parse(JSON.stringify(currentContent));
                                nextContent.contact_settings.form_fields[index].options = e.target.value.split(',').map(s => s.trim());
                                pushState(nextContent);
                              }}
                              className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offices Section */}
              <div className="flex justify-between items-center">
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-white">// Contact Offices & Branches</h3>
                <button
                  onClick={addOfficeItem}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg text-[9px] font-mono text-neutral-300 hover:text-white cursor-pointer transition-all flex items-center gap-1.5 font-semibold"
                >
                  <span>+ Add Office</span>
                </button>
              </div>

              <div className="space-y-4">
                {(currentContent.contact_offices || []).map((office, index) => (
                  <div key={office.slug || index} className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left relative">
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Office Branch #{index + 1}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={index === 0}
                          onClick={() => moveOfficeItem(index, 'up')}
                          className="w-6 h-6 border border-white/10 hover:border-white/20 rounded flex items-center justify-center text-[9px] text-neutral-400 hover:text-white bg-white/5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          disabled={index === (currentContent.contact_offices || []).length - 1}
                          onClick={() => moveOfficeItem(index, 'down')}
                          className="w-6 h-6 border border-white/10 hover:border-white/20 rounded flex items-center justify-center text-[9px] text-neutral-400 hover:text-white bg-white/5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => deleteOfficeItem(index)}
                          className="w-6 h-6 border border-red-500/10 hover:border-red-500/30 rounded flex items-center justify-center text-[9px] text-red-500 bg-red-500/5 hover:bg-red-500/10 cursor-pointer ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* City */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">City Name</label>
                        <input
                          type="text"
                          value={office.city || ''}
                          onChange={(e) => updateOfficeItem(index, 'city', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>

                      {/* Country */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Country</label>
                        <input
                          type="text"
                          value={office.country || ''}
                          onChange={(e) => updateOfficeItem(index, 'country', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>

                      {/* Role */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Office Role (e.g. Headquarters)</label>
                        <input
                          type="text"
                          value={office.role || ''}
                          onChange={(e) => updateOfficeItem(index, 'role', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Address & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Address</label>
                        <input
                          type="text"
                          value={office.address || ''}
                          onChange={(e) => updateOfficeItem(index, 'address', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Phone</label>
                        <input
                          type="text"
                          value={office.phone || ''}
                          onChange={(e) => updateOfficeItem(index, 'phone', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Timezone */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">TimeZone (e.g. Asia/Kolkata)</label>
                        <input
                          type="text"
                          value={office.timeZone || ''}
                          onChange={(e) => updateOfficeItem(index, 'timeZone', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>

                      {/* HQ status */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">HQ status</label>
                        <button
                          type="button"
                          onClick={() => updateOfficeItem(index, 'isHQ', !office.isHQ)}
                          className={`w-full py-2 border rounded-lg text-[8px] uppercase tracking-widest font-mono cursor-pointer transition-all duration-300 ${
                            office.isHQ 
                              ? 'bg-white text-black font-semibold' 
                              : 'bg-neutral-800 text-neutral-500 border-transparent'
                          }`}
                        >
                          {office.isHQ ? 'Is Headquarters' : 'Not Headquarters'}
                        </button>
                      </div>

                      {/* Slug */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Slug / Unique ID</label>
                        <input
                          type="text"
                          value={office.slug || ''}
                          onChange={(e) => updateOfficeItem(index, 'slug', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Styling properties */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Border / Hover Glow classes</label>
                        <input
                          type="text"
                          value={office.color || ''}
                          onChange={(e) => updateOfficeItem(index, 'color', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Badge Style classes</label>
                        <input
                          type="text"
                          value={office.badge || ''}
                          onChange={(e) => updateOfficeItem(index, 'badge', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp Numbers Editor */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">WhatsApp Help Lines / Chats</h4>
                  <button
                    onClick={() => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      if (!nextContent.contact_settings) nextContent.contact_settings = {};
                      if (!nextContent.contact_settings.whatsapp_numbers) nextContent.contact_settings.whatsapp_numbers = [];
                      nextContent.contact_settings.whatsapp_numbers.push({
                        label: "Support Desk",
                        subtext: "Usually replies in under 15 minutes",
                        number: "919876543210"
                      });
                      pushState(nextContent);
                    }}
                    className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded text-[8px] font-mono text-emerald-400 cursor-pointer"
                  >
                    + Add WhatsApp
                  </button>
                </div>

                <div className="space-y-4">
                  {(currentContent.contact_settings?.whatsapp_numbers || []).map((wa, index) => (
                    <div key={index} className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="font-mono text-[8px] text-neutral-400">WhatsApp Channel #{index + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={index === 0}
                            onClick={() => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              const arr = nextContent.contact_settings.whatsapp_numbers;
                              const temp = arr[index];
                              arr[index] = arr[index - 1];
                              arr[index - 1] = temp;
                              pushState(nextContent);
                            }}
                            className="w-5 h-5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center text-[8px] text-neutral-400 hover:text-white cursor-pointer disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            disabled={index === (currentContent.contact_settings?.whatsapp_numbers || []).length - 1}
                            onClick={() => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              const arr = nextContent.contact_settings.whatsapp_numbers;
                              const temp = arr[index];
                              arr[index] = arr[index + 1];
                              arr[index + 1] = temp;
                              pushState(nextContent);
                            }}
                            className="w-5 h-5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center text-[8px] text-neutral-400 hover:text-white cursor-pointer disabled:opacity-30"
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.contact_settings.whatsapp_numbers.splice(index, 1);
                              pushState(nextContent);
                            }}
                            className="w-5 h-5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded flex items-center justify-center text-[8px] cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Label / Title</label>
                          <input
                            type="text"
                            value={wa.label || ''}
                            onChange={(e) => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.contact_settings.whatsapp_numbers[index].label = e.target.value;
                              pushState(nextContent);
                            }}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Subtext / Availability</label>
                          <input
                            type="text"
                            value={wa.subtext || ''}
                            onChange={(e) => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.contact_settings.whatsapp_numbers[index].subtext = e.target.value;
                              pushState(nextContent);
                            }}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">WhatsApp Number (e.g. 919876543210)</label>
                          <input
                            type="text"
                            value={wa.number || ''}
                            onChange={(e) => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.contact_settings.whatsapp_numbers[index].number = e.target.value;
                              pushState(nextContent);
                            }}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Hours Editor */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Business Hours Schedule</h4>
                <div className="space-y-3">
                  {(currentContent.contact_settings?.business_hours || []).map((hours, index) => (
                    <div key={index} className="p-4 bg-black/40 border border-white/5 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Day range</label>
                        <input
                          type="text"
                          value={hours.day || ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.contact_settings.business_hours[index].day = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Timing details</label>
                        <input
                          type="text"
                          value={hours.time || ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.contact_settings.business_hours[index].time = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Card Color Style</label>
                        <input
                          type="text"
                          value={hours.color || ''}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.contact_settings.business_hours[index].color = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center pt-4 justify-end">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400">
                          <input
                            type="checkbox"
                            checked={hours.active !== false}
                            onChange={(e) => {
                              const nextContent = JSON.parse(JSON.stringify(currentContent));
                              nextContent.contact_settings.business_hours[index].active = e.target.checked;
                              pushState(nextContent);
                            }}
                            className="w-3.5 h-3.5 rounded border-white/10 accent-emerald-500"
                          />
                          <span>Show on page</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Location Section Editor */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Google Map Block & directions</h4>
                  <label className="flex items-center gap-1.5 text-[10px] text-neutral-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentContent.contact_settings?.contact_map?.show !== false}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.contact_settings.contact_map) nextContent.contact_settings.contact_map = {};
                        nextContent.contact_settings.contact_map.show = e.target.checked;
                        pushState(nextContent);
                      }}
                      className="w-3 h-3 accent-emerald-500 rounded"
                    />
                    <span>Visible</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Section Title</label>
                    <input
                      type="text"
                      value={currentContent.contact_settings?.contact_map?.title || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.contact_settings.contact_map) nextContent.contact_settings.contact_map = {};
                        nextContent.contact_settings.contact_map.title = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Section Subtitle</label>
                    <input
                      type="text"
                      value={currentContent.contact_settings?.contact_map?.subtitle || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.contact_settings.contact_map) nextContent.contact_settings.contact_map = {};
                        nextContent.contact_settings.contact_map.subtitle = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Card Company/HQ name</label>
                    <input
                      type="text"
                      value={currentContent.contact_settings?.contact_map?.card_title || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.contact_settings.contact_map) nextContent.contact_settings.contact_map = {};
                        nextContent.contact_settings.contact_map.card_title = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Google Maps Embed URL (iframe src)</label>
                    <input
                      type="text"
                      value={currentContent.contact_settings?.contact_map?.map_iframe_url || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.contact_settings.contact_map) nextContent.contact_settings.contact_map = {};
                        nextContent.contact_settings.contact_map.map_iframe_url = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Full Office Address</label>
                  <input
                    type="text"
                    value={currentContent.contact_settings?.contact_map?.address || ''}
                    onChange={(e) => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      if (!nextContent.contact_settings.contact_map) nextContent.contact_settings.contact_map = {};
                      nextContent.contact_settings.contact_map.address = e.target.value;
                      pushState(nextContent);
                    }}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Get Directions Link / URL</label>
                  <input
                    type="text"
                    value={currentContent.contact_settings?.contact_map?.directions_url || ''}
                    onChange={(e) => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      if (!nextContent.contact_settings.contact_map) nextContent.contact_settings.contact_map = {};
                      nextContent.contact_settings.contact_map.directions_url = e.target.value;
                      pushState(nextContent);
                    }}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* FAQs Section */}
              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-white">// Contact FAQ List</h3>
                <button
                  onClick={addFaqItem}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg text-[9px] font-mono text-neutral-300 hover:text-white cursor-pointer transition-all flex items-center gap-1.5 font-semibold"
                >
                  <span>+ Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {(currentContent.contact_faqs || []).map((faq, index) => (
                  <div key={index} className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left relative">
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">FAQ Question #{index + 1}</span>
                      <button
                        onClick={() => deleteFaqItem(index)}
                        className="w-6 h-6 border border-red-500/10 hover:border-red-500/30 rounded flex items-center justify-center text-[9px] text-red-500 bg-red-500/5 hover:bg-red-500/10 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Question */}
                    <div className="space-y-1">
                      <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Question</label>
                      <input
                        type="text"
                        value={faq.q || ''}
                        onChange={(e) => updateFaqItem(index, 'q', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      />
                    </div>

                    {/* Answer */}
                    <div className="space-y-1">
                      <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Answer Description</label>
                      <textarea
                        rows={3}
                        value={faq.a || ''}
                        onChange={(e) => updateFaqItem(index, 'a', e.target.value)}
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NAVBAR CMS PANEL */}
          {activeTab === 'navbar' && (
            <div className="space-y-6">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-white">// Navbar Layout Settings</h3>
              
              {/* Logo Styles */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Logo Styling</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Logo Text</label>
                    <input
                      type="text"
                      value={currentContent.site_settings?.logo_text || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.site_settings) nextContent.site_settings = {};
                        nextContent.site_settings.logo_text = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Logo Font Size</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="10"
                          max="28"
                          value={parseInt(currentContent.site_settings?.navbar_styles?.logoSize || '14')}
                          onChange={(e) => updateNavbarStyles('logoSize', e.target.value + 'px')}
                          className="w-full accent-emerald-500"
                        />
                        <span className="font-mono text-[10px] text-neutral-400 w-10 text-right">
                          {currentContent.site_settings?.navbar_styles?.logoSize || '14px'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Logo Color</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={currentContent.site_settings?.navbar_styles?.logoColor || '#ffffff'}
                          onChange={(e) => updateNavbarStyles('logoColor', e.target.value)}
                          className="w-7 h-7 bg-transparent border-0 cursor-pointer rounded-full overflow-hidden"
                        />
                        <input
                          type="text"
                          value={currentContent.site_settings?.navbar_styles?.logoColor || '#ffffff'}
                          onChange={(e) => updateNavbarStyles('logoColor', e.target.value)}
                          className="w-full px-2 py-1 bg-black border border-white/10 rounded text-white font-mono text-[10px] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Links Styling */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Links Typography & Colors</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Font Size</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="range"
                        min="9"
                        max="16"
                        value={parseInt(currentContent.site_settings?.navbar_styles?.fontSize || '12')}
                        onChange={(e) => updateNavbarStyles('fontSize', e.target.value + 'px')}
                        className="w-full accent-emerald-500"
                      />
                      <span className="font-mono text-[9px] text-neutral-400 min-w-[26px]">
                        {currentContent.site_settings?.navbar_styles?.fontSize || '12px'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Text Color</label>
                    <div className="flex gap-1 items-center">
                      <input
                        type="color"
                        value={currentContent.site_settings?.navbar_styles?.color || '#a3a3a3'}
                        onChange={(e) => updateNavbarStyles('color', e.target.value)}
                        className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded-full overflow-hidden"
                      />
                      <input
                        type="text"
                        value={currentContent.site_settings?.navbar_styles?.color || '#a3a3a3'}
                        onChange={(e) => updateNavbarStyles('color', e.target.value)}
                        className="w-full px-1.5 py-0.5 bg-black border border-white/10 rounded text-white font-mono text-[9px] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Hover Color</label>
                    <div className="flex gap-1 items-center">
                      <input
                        type="color"
                        value={currentContent.site_settings?.navbar_styles?.hoverColor || '#ffffff'}
                        onChange={(e) => updateNavbarStyles('hoverColor', e.target.value)}
                        className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded-full overflow-hidden"
                      />
                      <input
                        type="text"
                        value={currentContent.site_settings?.navbar_styles?.hoverColor || '#ffffff'}
                        onChange={(e) => updateNavbarStyles('hoverColor', e.target.value)}
                        className="w-full px-1.5 py-0.5 bg-black border border-white/10 rounded text-white font-mono text-[9px] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Add Menu Item Form */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Add New Navigation Item</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Link Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Services"
                      value={newLinkName}
                      onChange={(e) => setNewLinkName(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Link Type</label>
                    <select
                      value={newLinkType}
                      onChange={(e) => setNewLinkType(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-white/20 cursor-pointer"
                    >
                      <option value="link">Simple Link</option>
                      <option value="dropdown">Dropdown Menu</option>
                    </select>
                  </div>
                </div>
                {newLinkType === 'link' && (
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Href / Anchor Route</label>
                    <input
                      type="text"
                      placeholder="e.g. #services or /contact"
                      value={newLinkHref}
                      onChange={(e) => setNewLinkHref(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-white/20"
                    />
                  </div>
                )}
                <button
                  onClick={addNavbarLink}
                  className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/30 rounded font-mono text-[9px] uppercase tracking-widest text-emerald-400 hover:text-white cursor-pointer transition-colors"
                >
                  + Add Item to Navbar
                </button>
              </div>

              {/* Navigation Links Registry */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Navigation Menu Items</h4>
                  <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                    Manage & Reorder
                  </span>
                </div>

                <div className="space-y-3">
                  {(currentContent.site_settings?.navbar_links || []).map((link, idx) => (
                    <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 relative group">
                      
                      {/* Link Header / Operations */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                          Item #{idx + 1} {link.dropdown ? '(Dropdown)' : '(Link)'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {/* Reordering */}
                          <button
                            onClick={() => moveNavbarLink(idx, -1)}
                            disabled={idx === 0}
                            className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500 font-mono text-[9px] cursor-pointer"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveNavbarLink(idx, 1)}
                            disabled={idx === (currentContent.site_settings?.navbar_links || []).length - 1}
                            className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500 font-mono text-[9px] cursor-pointer"
                          >
                            ▼
                          </button>
                          
                          {/* Show/Hide */}
                          <button
                            onClick={() => updateNavbarLink(idx, 'show', link.show !== false ? false : true)}
                            className={`px-2 py-0.5 text-[8px] font-mono rounded uppercase tracking-wider border ${
                              link.show !== false 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' 
                                : 'bg-neutral-800 border-transparent text-neutral-500'
                            }`}
                          >
                            {link.show !== false ? 'Show' : 'Hide'}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => deleteNavbarLink(idx)}
                            className="p-1 hover:bg-red-500/10 rounded group/del cursor-pointer"
                          >
                            <span className="text-neutral-500 group-hover/del:text-red-400 font-mono text-[9px]">🗑️</span>
                          </button>
                        </div>
                      </div>

                      {/* Link Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                          <label className="font-mono text-[8px] text-neutral-500 block">Link Label</label>
                          <input
                            type="text"
                            value={link.label || ''}
                            onChange={(e) => updateNavbarLink(idx, 'label', e.target.value)}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="font-mono text-[8px] text-neutral-500 block">Href (Anchor/Path)</label>
                          <input
                            type="text"
                            value={link.href || ''}
                            disabled={!!link.dropdown}
                            onChange={(e) => updateNavbarLink(idx, 'href', e.target.value)}
                            className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none disabled:opacity-50"
                          />
                        </div>
                      </div>

                      {/* Dropdown Links Editor (if nested) */}
                      {link.dropdown ? (
                        <div className="mt-4 p-3 bg-black/50 border border-white/5 rounded-lg space-y-3">
                          <div className="flex items-center justify-between border-b border-white/5 pb-1">
                            <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Nested Dropdown Links</span>
                            <button
                              onClick={() => addNavbarSubLink(idx)}
                              className="px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded text-[8px] font-mono text-neutral-300 hover:text-white cursor-pointer"
                            >
                              + Add Sub Link
                            </button>
                          </div>

                          <div className="space-y-2">
                            {link.dropdown.map((sub, subIdx) => (
                              <div key={subIdx} className="flex items-center gap-2 p-2 bg-white/[0.01] border border-white/5 rounded-md">
                                <input
                                  type="text"
                                  placeholder="Sub Label"
                                  value={sub.label || ''}
                                  onChange={(e) => updateNavbarSubLink(idx, subIdx, 'label', e.target.value)}
                                  className="w-[35%] px-2 py-1 bg-black border border-white/10 rounded text-white text-[10px] focus:outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="Sub Href"
                                  value={sub.href || ''}
                                  onChange={(e) => updateNavbarSubLink(idx, subIdx, 'href', e.target.value)}
                                  className="w-[35%] px-2 py-1 bg-black border border-white/10 rounded text-white text-[10px] focus:outline-none"
                                />
                                
                                <div className="flex items-center gap-1 ml-auto">
                                  {/* Sub show/hide */}
                                  <button
                                    onClick={() => updateNavbarSubLink(idx, subIdx, 'show', sub.show !== false ? false : true)}
                                    className={`px-1.5 py-0.5 text-[7px] font-mono rounded border uppercase ${
                                      sub.show !== false 
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' 
                                        : 'bg-neutral-800 border-transparent text-neutral-500'
                                    }`}
                                  >
                                    {sub.show !== false ? 'Show' : 'Hide'}
                                  </button>

                                  {/* Move Sub link */}
                                  <button
                                    onClick={() => moveNavbarSubLink(idx, subIdx, -1)}
                                    disabled={subIdx === 0}
                                    className="text-[9px] font-mono text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    onClick={() => moveNavbarSubLink(idx, subIdx, 1)}
                                    disabled={subIdx === link.dropdown.length - 1}
                                    className="text-[9px] font-mono text-neutral-500 hover:text-white disabled:opacity-30 cursor-pointer"
                                  >
                                    ▼
                                  </button>

                                  {/* Delete Sub Link */}
                                  <button
                                    onClick={() => deleteNavbarSubLink(idx, subIdx)}
                                    className="p-1 text-neutral-500 hover:text-red-400 cursor-pointer"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => convertToSimpleLink(idx)}
                            className="w-full py-1 text-center bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 font-mono text-[8px] uppercase tracking-wider rounded transition-colors cursor-pointer"
                          >
                            Convert to Simple Link
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => convertToDropdown(idx)}
                          className="w-full py-1 text-center bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-mono text-[8px] uppercase tracking-wider rounded transition-colors cursor-pointer"
                        >
                          Convert to Nested Dropdown
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FOOTER CMS PANEL */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-white">// Footer Layout Settings</h3>
              
              {/* Brand Logo & Description */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                        {/* Logo Text */}
                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Footer Logo Text</label>
                  <input
                    type="text"
                    value={currentContent.site_settings?.footer?.logo_text ?? 'HARIKRUSHN DIGIVERSE LLP'}
                    onChange={(e) => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      if (!nextContent.site_settings) nextContent.site_settings = {};
                      if (!nextContent.site_settings.footer) nextContent.site_settings.footer = {};
                      nextContent.site_settings.footer.logo_text = e.target.value;
                      pushState(nextContent);
                    }}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-white/20"
                  />
                </div>

                {/* Brand Description */}
                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Footer Brand Description</label>
                  <textarea
                    rows={2}
                    value={currentContent.site_settings?.footer?.description ?? 'Architecting the infinite digital through precision engineering and editorial design.'}
                    onChange={(e) => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      if (!nextContent.site_settings) nextContent.site_settings = {};
                      if (!nextContent.site_settings.footer) nextContent.site_settings.footer = {};
                      nextContent.site_settings.footer.description = e.target.value;
                      pushState(nextContent);
                    }}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Logo Image URL & Upload */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Logo Image</label>
                  <div className="flex gap-3 items-center">
                    <img 
                      src={currentContent.site_settings?.footer?.logo_img ?? "/images/hk-logo.png"} 
                      alt="Footer Logo Preview" 
                      className="w-10 h-10 object-contain bg-neutral-900 border border-white/10 rounded p-1"
                    />
                    <input
                      type="text"
                      value={currentContent.site_settings?.footer?.logo_img ?? '/images/hk-logo.png'}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.site_settings) nextContent.site_settings = {};
                        if (!nextContent.site_settings.footer) nextContent.site_settings.footer = {};
                        nextContent.site_settings.footer.logo_img = e.target.value;
                        pushState(nextContent);
                      }}
                      className="flex-1 px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                      placeholder="Logo Image URL"
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex-1 py-2.5 border border-white/10 hover:border-white/30 text-center rounded-xl bg-white/5 text-[9px] uppercase tracking-widest font-mono cursor-pointer hover:bg-white/10 transition-all text-white font-semibold">
                      {isUploadingImage ? 'Uploading Logo...' : 'Upload New Logo Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadFooterLogo}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Office Contact Info */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Office Details</h4>
                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Address</label>
                  <textarea
                    rows={2}
                    value={currentContent.site_settings?.footer?.address || ''}
                    onChange={(e) => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      if (!nextContent.site_settings) nextContent.site_settings = {};
                      if (!nextContent.site_settings.footer) nextContent.site_settings.footer = {};
                      nextContent.site_settings.footer.address = e.target.value;
                      pushState(nextContent);
                    }}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Email</label>
                    <input
                      type="text"
                      value={currentContent.site_settings?.footer?.email || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.site_settings) nextContent.site_settings = {};
                        if (!nextContent.site_settings.footer) nextContent.site_settings.footer = {};
                        nextContent.site_settings.footer.email = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Phone</label>
                    <input
                      type="text"
                      value={currentContent.site_settings?.footer?.phone || ''}
                      onChange={(e) => {
                        const nextContent = JSON.parse(JSON.stringify(currentContent));
                        if (!nextContent.site_settings) nextContent.site_settings = {};
                        if (!nextContent.site_settings.footer) nextContent.site_settings.footer = {};
                        nextContent.site_settings.footer.phone = e.target.value;
                        pushState(nextContent);
                      }}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 block">Copyright Info</label>
                  <input
                    type="text"
                    value={currentContent.site_settings?.footer?.copyright || ''}
                    onChange={(e) => {
                      const nextContent = JSON.parse(JSON.stringify(currentContent));
                      if (!nextContent.site_settings) nextContent.site_settings = {};
                      if (!nextContent.site_settings.footer) nextContent.site_settings.footer = {};
                      nextContent.site_settings.footer.copyright = e.target.value;
                      pushState(nextContent);
                    }}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Capabilities Column Links */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Capabilities Links</h4>
                  <button
                    onClick={addFooterCapabilityLink}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/15 rounded text-[8px] font-mono text-neutral-300 hover:text-white cursor-pointer"
                  >
                    + Add Link
                  </button>
                </div>
                <div className="space-y-3">
                  {(currentContent.site_settings?.footer?.capabilities || []).map((link, idx) => (
                    <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-2 text-left">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1">
                        <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">Link #{idx + 1}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => moveFooterCapabilityLink(idx, -1)}
                            disabled={idx === 0}
                            className="p-0.5 text-neutral-500 hover:text-white disabled:opacity-30 font-mono text-[9px] cursor-pointer"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveFooterCapabilityLink(idx, 1)}
                            disabled={idx === (currentContent.site_settings?.footer?.capabilities || []).length - 1}
                            className="p-0.5 text-neutral-500 hover:text-white disabled:opacity-30 font-mono text-[9px] cursor-pointer"
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => updateFooterCapabilityLink(idx, 'show', link.show !== false ? false : true)}
                            className={`px-1.5 py-0.5 text-[7px] border rounded font-mono uppercase tracking-widest ${
                              link.show !== false ? 'bg-white text-black font-semibold' : 'bg-neutral-800 text-neutral-500 border-transparent'
                            }`}
                          >
                            {link.show !== false ? 'Show' : 'Hide'}
                          </button>
                          <button
                            onClick={() => deleteFooterCapabilityLink(idx)}
                            className="p-0.5 hover:bg-red-500/10 rounded cursor-pointer"
                            title="Delete"
                          >
                            <span className="text-neutral-500 hover:text-red-400 font-mono text-[9px]">✕</span>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateFooterCapabilityLink(idx, 'label', e.target.value)}
                          className="w-full px-2.5 py-1 bg-black border border-white/10 rounded text-white text-[10px] focus:outline-none"
                          placeholder="Link Label"
                        />
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => updateFooterCapabilityLink(idx, 'href', e.target.value)}
                          className="w-full px-2.5 py-1 bg-black border border-white/10 rounded text-white text-[10px] focus:outline-none"
                          placeholder="Link Href"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ecosystem Column Links */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Ecosystem Links</h4>
                  <button
                    onClick={addFooterEcosystemLink}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/15 rounded text-[8px] font-mono text-neutral-300 hover:text-white cursor-pointer"
                  >
                    + Add Link
                  </button>
                </div>
                <div className="space-y-3">
                  {(currentContent.site_settings?.footer?.ecosystem || []).map((link, idx) => (
                    <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-2 text-left">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1">
                        <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">Link #{idx + 1}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => moveFooterEcosystemLink(idx, -1)}
                            disabled={idx === 0}
                            className="p-0.5 text-neutral-500 hover:text-white disabled:opacity-30 font-mono text-[9px] cursor-pointer"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveFooterEcosystemLink(idx, 1)}
                            disabled={idx === (currentContent.site_settings?.footer?.ecosystem || []).length - 1}
                            className="p-0.5 text-neutral-500 hover:text-white disabled:opacity-30 font-mono text-[9px] cursor-pointer"
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => updateFooterEcosystemLink(idx, 'show', link.show !== false ? false : true)}
                            className={`px-1.5 py-0.5 text-[7px] border rounded font-mono uppercase tracking-widest ${
                              link.show !== false ? 'bg-white text-black font-semibold' : 'bg-neutral-800 text-neutral-500 border-transparent'
                            }`}
                          >
                            {link.show !== false ? 'Show' : 'Hide'}
                          </button>
                          <button
                            onClick={() => deleteFooterEcosystemLink(idx)}
                            className="p-0.5 hover:bg-red-500/10 rounded cursor-pointer"
                            title="Delete"
                          >
                            <span className="text-neutral-500 hover:text-red-400 font-mono text-[9px]">✕</span>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateFooterEcosystemLink(idx, 'label', e.target.value)}
                          className="w-full px-2.5 py-1 bg-black border border-white/10 rounded text-white text-[10px] focus:outline-none"
                          placeholder="Link Label"
                        />
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => updateFooterEcosystemLink(idx, 'href', e.target.value)}
                          className="w-full px-2.5 py-1 bg-black border border-white/10 rounded text-white text-[10px] focus:outline-none"
                          placeholder="Link Href"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Social Media Links</h4>
                  <button
                    onClick={addFooterSocialLink}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/15 rounded text-[8px] font-mono text-neutral-300 hover:text-white cursor-pointer"
                  >
                    + Add Social Link
                  </button>
                </div>
                <div className="space-y-3">
                  {(currentContent.site_settings?.footer?.social_links || []).map((link, idx) => (
                    <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-2 text-left">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1">
                        <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">{link.platform || 'New Platform'}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => moveFooterSocialLink(idx, -1)}
                            disabled={idx === 0}
                            className="p-0.5 text-neutral-500 hover:text-white disabled:opacity-30 font-mono text-[9px] cursor-pointer"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveFooterSocialLink(idx, 1)}
                            disabled={idx === (currentContent.site_settings?.footer?.social_links || []).length - 1}
                            className="p-0.5 text-neutral-500 hover:text-white disabled:opacity-30 font-mono text-[9px] cursor-pointer"
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => updateFooterSocialLink(idx, 'show', link.show !== false ? false : true)}
                            className={`px-1.5 py-0.5 text-[7px] border rounded font-mono uppercase tracking-widest ${
                              link.show !== false ? 'bg-white text-black font-semibold' : 'bg-neutral-800 text-neutral-500 border-transparent'
                            }`}
                          >
                            {link.show !== false ? 'Show' : 'Hide'}
                          </button>
                          <button
                            onClick={() => deleteFooterSocialLink(idx)}
                            className="p-0.5 hover:bg-red-500/10 rounded cursor-pointer"
                            title="Delete"
                          >
                            <span className="text-neutral-500 hover:text-red-400 font-mono text-[9px]">✕</span>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={link.platform || ''}
                          onChange={(e) => updateFooterSocialLink(idx, 'platform', e.target.value)}
                          className="w-full px-2.5 py-1 bg-black border border-white/10 rounded text-white text-[10px] focus:outline-none"
                          placeholder="Platform Name"
                        />
                        <input
                          type="text"
                          value={link.url || ''}
                          onChange={(e) => updateFooterSocialLink(idx, 'url', e.target.value)}
                          className="w-full px-2.5 py-1 bg-black border border-white/10 rounded text-white text-[10px] focus:outline-none"
                          placeholder="Link URL"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OUR STORY CMS PANEL */}
          {activeTab === 'our_story' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">// Timeline Milestones ({currentContent.milestones?.length || 0})</span>
                <button
                  onClick={() => {
                    const nextContent = JSON.parse(JSON.stringify(currentContent));
                    if (!nextContent.milestones) nextContent.milestones = [];
                    nextContent.milestones.unshift({ year: '2027', title: 'New Milestone', description: 'Description of milestone...' });
                    pushState(nextContent);
                  }}
                  className="px-3 py-1.5 bg-white text-black font-semibold text-[8px] uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors"
                >
                  + Add Milestone
                </button>
              </div>

              <div className="space-y-4">
                {(currentContent.milestones || []).map((item, index) => (
                  <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] text-neutral-500 font-bold">{item.year || 'New Milestone'}</span>
                      <button
                        onClick={() => {
                          const nextContent = JSON.parse(JSON.stringify(currentContent));
                          nextContent.milestones.splice(index, 1);
                          pushState(nextContent);
                        }}
                        className="px-2 py-0.5 text-[8px] text-red-500 hover:text-red-400 font-mono border border-red-500/10 hover:border-red-500/20 rounded"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Year</label>
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.milestones[index].year = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Milestone Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const nextContent = JSON.parse(JSON.stringify(currentContent));
                            nextContent.milestones[index].title = e.target.value;
                            pushState(nextContent);
                          }}
                          className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-mono text-[8px] text-neutral-500 block mb-0.5">Milestone Description</label>
                      <textarea
                        rows={3}
                        value={item.description}
                        onChange={(e) => {
                          const nextContent = JSON.parse(JSON.stringify(currentContent));
                          nextContent.milestones[index].description = e.target.value;
                          pushState(nextContent);
                        }}
                        className="w-full px-3 py-1.5 bg-black border border-white/10 rounded text-white text-xs focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SERVICES MAIN PAGE MESSAGE PANEL */}
          {activeTab === 'services_main' && (
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">// Services Overview Page</span>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                This page displays all capabilities and service indices. You can preview it live in the viewport.
              </p>
              <p className="text-[10px] text-neutral-500 font-mono leading-relaxed">
                * You can modify individual service descriptions, titles, and tags under "Services Preview Index" on the Home Page.
              </p>
            </div>
          )}

          {/* CAPABILITIES SUB-PAGES MSG PANEL */}
          {['service_web', 'service_app', 'service_custom_software', 'service_digital_marketing', 'service_social_media', 'service_ai_consulting', 'service_it_consulting'].includes(activeTab) && (
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4 text-left">
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">// Visual Interactive Page</span>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                This page displays advanced visual mockups, 3D spring layouts, and client-interactive checklists designed directly in React.
              </p>
              <p className="text-[10px] text-neutral-500 font-mono leading-relaxed">
                * You can modify the main index cards under "Services Preview Index" on the Home Page, and update individual service attributes in code.
              </p>
            </div>
          )}

          {/* 13. SUBMISSIONS LOG VIEW */}
          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white">// Form Submissions Log</span>
                <button
                  onClick={loadSubmissions}
                  className="px-4 py-2 bg-white text-black font-semibold text-[9px] uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors"
                >
                  Refresh
                </button>
              </div>

              {loadingSubmissions ? (
                <div className="text-center py-10 font-mono text-xs text-neutral-500">Loading logs from database...</div>
              ) : (
                <div className="space-y-8">
                  {/* Inquiries */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">// Client Inquiries ({inquiries.length})</h4>
                    <div className="space-y-3">
                      {inquiries.map((inq, idx) => {
                        const inqNum = inquiries.length - idx;
                        const dateStr = inq.created_at ? new Date(inq.created_at).toLocaleString() : 'N/A';
                        const dynamicFields = Object.entries(inq).filter(
                          ([k]) => !['created_at', '_id'].includes(k)
                        );
                        return (
                          <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3.5 text-left relative hover:border-white/10 transition-all duration-300">
                            <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
                              <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider">// Inquiry #{inqNum}</span>
                              <span className="font-mono text-[8px] text-neutral-500 bg-neutral-900 border border-white/5 px-2 py-0.5 rounded">
                                {dateStr}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                              {dynamicFields.map(([key, val]) => (
                                <div key={key} className="flex flex-col gap-0.5">
                                  <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">{key}:</span>
                                  <span className="text-neutral-200 font-light whitespace-pre-wrap">{String(val || 'N/A')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      {inquiries.length === 0 && <div className="text-center py-6 text-neutral-500 font-mono text-[10px]">No inquiries received yet.</div>}
                    </div>
                  </div>

                  {/* Applications */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-blue-400">// Job & Intern Applications ({applications.length})</h4>
                    <div className="space-y-3">
                      {applications.map((app, idx) => (
                        <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2 text-left">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-white font-bold text-xs">{app.name}</span>
                              <span className="text-neutral-500 text-[10px] font-mono ml-2">({app.email} | {app.phone})</span>
                            </div>
                            <span className="font-mono text-[8px] text-neutral-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase">{app.type || 'job'}</span>
                          </div>
                          <div className="text-xs text-neutral-300">
                            <strong>Role/Track:</strong> {app.role || app.track} <br/>
                            {app.college && <><strong>College:</strong> {app.college} <br/></>}
                            <strong>Resume URL:</strong> <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{app.resume}</a>
                          </div>
                          {app.message && <p className="text-xs text-neutral-400 leading-relaxed font-light mt-1">"{app.message}"</p>}
                          <div className="font-mono text-[8px] text-neutral-500">Date: {app.created_at ? new Date(app.created_at).toLocaleString() : 'N/A'}</div>
                        </div>
                      ))}
                      {applications.length === 0 && <div className="text-center py-6 text-neutral-500 font-mono text-[10px]">No applications received yet.</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

            </section>
          </>
        )}

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
              src={`${window.location.origin}${window.location.pathname}${iframeHash}`}
              className="flex-1 w-full border-none bg-black select-none pointer-events-auto"
              title="Live CMS Web Preview"
              key={iframeHash}
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
