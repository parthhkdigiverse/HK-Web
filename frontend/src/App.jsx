import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import ScrollIndicator from './components/ScrollIndicator';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';

// Import Provider
import { ContentProvider } from './context/ContentContext';

// Import Pages
import OurStory from './pages/OurStory';
import OurPeople from './pages/OurPeople';
import OurCulture from './pages/OurCulture';
import AboutUs from './pages/AboutUs';
import Awards from './pages/Awards';
import Blogs from './pages/Blogs';
import Gallery from './pages/Gallery';
import Services from './pages/Services';
import Industry from './pages/Industry';
import Career from './pages/Career';
import CaseStudy from './pages/CaseStudy';
import Portfolio from './pages/Portfolio';
import Ventures from './pages/Ventures';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';

// Service Subpages
import ServiceWeb from './pages/ServiceWeb';
import ServiceApp from './pages/ServiceApp';
import ServiceCustomSoftware from './pages/ServiceCustomSoftware';
import ServiceDigitalMarketing from './pages/ServiceDigitalMarketing';
import ServiceSocialMedia from './pages/ServiceSocialMedia';
import ServiceAiConsulting from './pages/ServiceAiConsulting';
import ServiceItConsulting from './pages/ServiceItConsulting';

import HomeSections from './sections/HomeSections';

// Live Iframe Preview Container Component
function PreviewContainer({ currentHash }) {
  const [previewContent, setPreviewContent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const previewContentRef = React.useRef(previewContent);

  const handlePreloadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const scrollToActiveTab = useCallback((tab) => {
    if (tab === 'hero' || tab === 'navbar') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'footer') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      const targetId = tab === 'stats' ? 'stats-section' : tab === 'services' ? 'services-section' : tab === 'brands' ? 'brands-section' : tab === 'caseStudy' ? 'case-study-section' : tab === 'testimonials' ? 'testimonials-section' : tab === 'bottomCta' ? 'bottom-cta-section' : null;
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    }
  }, []);

  useEffect(() => {
    previewContentRef.current = previewContent;
  }, [previewContent]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'UPDATE_CMS_PREVIEW') {
        const nextContent = event.data.content;
        const currentContent = previewContentRef.current;
        setPreviewContent(nextContent);
        // If the video URL changed, we need to trigger re-loading
        if (currentContent && currentContent.hero && nextContent.hero && nextContent.hero.videoUrl !== currentContent.hero.videoUrl) {
          setIsLoaded(false);
        }
        if (event.data.activeTab) {
          scrollToActiveTab(event.data.activeTab);
        }
      } else if (event.data && event.data.type === 'CMS_SCROLL_TO') {
        scrollToActiveTab(event.data.section);
      }
    };

    window.addEventListener('message', handleMessage);

    if (window.parent) {
      window.parent.postMessage({ type: 'CMS_PREVIEW_READY' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [scrollToActiveTab]);

  if (!previewContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-neutral-400 font-mono text-xs select-none">
        <span className="animate-pulse">// CONNECTING TO BUILDER CANVAS...</span>
      </div>
    );
  }

  // Determine what page to render inside the preview container
  const subpage = currentHash.replace('#preview', ''); // e.g. "/about-us", "/our-story" or empty/slash

  const renderPreviewPage = () => {
    switch (subpage) {
      case '':
      case '/':
      case '/home':
        return (
          <>
            <HeroSection isLoaded={isLoaded} overrideContent={previewContent} />
            <HomeSections overrideContent={previewContent} />
          </>
        );
      case '/our-story':
        return <OurStory />;
      case '/our-people':
        return <OurPeople />;
      case '/our-culture':
        return <OurCulture />;
      case '/about-us':
        return <AboutUs />;
      case '/awards-achievements':
        return <Awards />;
      case '/blogs':
        return <Blogs />;
      case '/our-gallery':
        return <Gallery />;
      case '/services':
        return <Services />;
      case '/industry':
        return <Industry />;
      case '/career':
        return <Career />;
      case '/case-study':
        return <CaseStudy />;
      case '/portfolio':
        return <Portfolio />;
      case '/ventures':
        return <Ventures />;
      case '/contact':
        return <Contact />;
      case '/service-web':
        return <ServiceWeb />;
      case '/service-app':
        return <ServiceApp />;
      case '/service-custom-software':
        return <ServiceCustomSoftware />;
      case '/service-digital-marketing':
        return <ServiceDigitalMarketing />;
      case '/service-social-media-management':
        return <ServiceSocialMedia />;
      case '/service-ai-consulting':
        return <ServiceAiConsulting />;
      case '/service-it-consulting':
        return <ServiceItConsulting />;
      default:
        return (
          <>
            <HeroSection isLoaded={isLoaded} overrideContent={previewContent} />
            <HomeSections overrideContent={previewContent} />
          </>
        );
    }
  };

  const isNavbarOnly = subpage === '/navbar';
  const isFooterOnly = subpage === '/footer';

  if (isNavbarOnly) {
    return (
      <div className="bg-black min-h-screen w-full relative flex flex-col items-center justify-center pt-24">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <Navbar overrideContent={previewContent} />
        <div className="mt-40 text-center max-w-md px-6 z-10 select-none">
          <p className="font-mono text-[9px] text-[#10B981] uppercase tracking-widest">// NAVBAR ISOLATION CANVAS</p>
          <p className="text-[11px] text-neutral-400 font-sans mt-2">
            This mode isolates the header layout. Test hovering, logo, and page links. Any font size or color settings modified in the CMS editor will propagate directly here.
          </p>
        </div>
      </div>
    );
  }

  if (isFooterOnly) {
    return (
      <div className="bg-black min-h-screen w-full relative flex flex-col justify-end">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="flex-1 flex items-center justify-center select-none z-10 p-6 text-center">
          <div className="max-w-md">
            <p className="font-mono text-[9px] text-[#10B981] uppercase tracking-widest">// FOOTER ISOLATION CANVAS</p>
            <p className="text-[11px] text-neutral-400 font-sans mt-2">
              This mode isolates the footer layout. Any changes made to addresses, contact details, social links, and copyright text in the CMS editor will render below in real time.
            </p>
          </div>
        </div>
        <Footer overrideContent={previewContent} />
      </div>
    );
  }

  const isHomePreview = subpage === '' || subpage === '/' || subpage === '/home';

  return (
    <>
      {!isLoaded && <Preloader onComplete={handlePreloadComplete} />}
      <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar overrideContent={previewContent} />
        {isHomePreview ? (
          renderPreviewPage()
        ) : (
          <main className="pt-36 sm:pt-40 lg:pt-44 xl:pt-48 pb-24 w-full mx-auto min-h-screen relative z-10">
            {renderPreviewPage()}
          </main>
        )}
        <Footer overrideContent={previewContent} />
      </div>
    </>
  );
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#');

  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash || '#';
      setCurrentHash((prevHash) => {
        const prevBase = prevHash.split('?')[0];
        const newBase = newHash.split('?')[0];
        if (prevBase !== newBase) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
        return newHash;
      });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handlePreloadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Extract base hash without query params
  const baseHash = currentHash.split('?')[0];

  // Check if current hash is for preview mode
  const isPreviewMode = baseHash.startsWith('#preview');

  // Check if current hash is for a subpage
  const isSubpage = baseHash !== '#' && baseHash !== '#home' && baseHash !== '#admin' && !isPreviewMode;

  const renderPageContent = () => {
    if (baseHash.startsWith('#preview')) {
      return <PreviewContainer currentHash={baseHash} />;
    }
    switch (baseHash) {
      case '#admin':
        return <AdminPanel />;
      case '#our-story':
        return <OurStory />;
      case '#our-people':
        return <OurPeople />;
      case '#our-culture':
        return <OurCulture />;
      case '#about-us':
        return <AboutUs />;
      case '#awards-achievements':
        return <Awards />;
      case '#blogs':
        return <Blogs />;
      case '#our-gallery':
        return <Gallery />;
      case '#services':
        return <Services />;
      case '#industry':
        return <Industry />;
      case '#career':
        return <Career />;
      case '#case-study':
        return <CaseStudy />;
      case '#portfolio':
        return <Portfolio />;
      case '#ventures':
        return <Ventures />;
      case '#contact':
        return <Contact />;
      case '#service-web':
        return <ServiceWeb />;
      case '#service-app':
        return <ServiceApp />;
      case '#service-custom-software':
        return <ServiceCustomSoftware />;
      case '#service-digital-marketing':
        return <ServiceDigitalMarketing />;
      case '#service-social-media-management':
        return <ServiceSocialMedia />;
      case '#service-ai-consulting':
        return <ServiceAiConsulting />;
      case '#service-it-consulting':
        return <ServiceItConsulting />;
      default:
        return null;
    }
  };

  const isAdminOrPreview = baseHash === '#admin' || isPreviewMode;

  return (
    <ContentProvider>
      {/* Desktop custom cursor - hidden in admin and preview modes for cleaner UX */}
      {!isAdminOrPreview && <CustomCursor />}

      {/* Cinematic preloader screen - bypassed in preview mode */}
      {!isLoaded && currentHash !== '#preview' && <Preloader onComplete={handlePreloadComplete} />}

      {/* Main website layout */}
      <div className={`transition-opacity duration-1000 ${(isLoaded || currentHash === '#preview') ? 'opacity-100' : 'opacity-0'}`}>
        {!isAdminOrPreview && <Navbar />}

        {isSubpage ? (
          /* Subpages Layout Wrapper */
          <main className="pt-36 sm:pt-40 lg:pt-44 xl:pt-48 pb-24 w-full mx-auto min-h-screen relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={baseHash}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {renderPageContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        ) : isAdminOrPreview ? (
          /* Fullscreen Admin Panel or Preview container */
          renderPageContent()
        ) : (
          /* Home Page Cinematic Hero & Sections */
          <>
            <HeroSection isLoaded={isLoaded} />
            <HomeSections />
          </>
        )}

        {!isAdminOrPreview && <Footer />}

        {/* Sleek bottom scroll hint - only shown on Home page */}
        {!isSubpage && !isAdminOrPreview && <ScrollIndicator />}
      </div>
    </ContentProvider>
  );
}

export default App;
