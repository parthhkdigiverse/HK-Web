import React, { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Logo clicking authentication state
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if we have scrolled past a threshold to apply styling
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Determine scrolling direction to show/hide navbar
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true); // Scrolling down - hide
      } else {
        setIsHidden(false); // Scrolling up - show
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Click handler to trigger admin panel after 7 clicks
  const handleLogoClick = (e) => {
    e.preventDefault();
    window.location.hash = '#';
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (newClicks >= 7) {
      setLogoClicks(0);
      setShowAuthModal(true);
    }
  };

  // Reset logo click count after 4s inactivity
  useEffect(() => {
    if (logoClicks > 0) {
      const timer = setTimeout(() => setLogoClicks(0), 4000);
      return () => clearTimeout(timer);
    }
  }, [logoClicks]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const res = await fetch('http://localhost:8008/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: passwordInput })
      });

      if (res.ok) {
        sessionStorage.setItem('adminPassword', passwordInput);
        setShowAuthModal(false);
        setPasswordInput('');
        window.location.hash = '#admin';
      } else {
        const errData = await res.json();
        setAuthError(errData.detail || 'Invalid credentials');
      }
    } catch {
      setAuthError('Connection failed. Is the API backend running?');
    } finally {
      setIsVerifying(false);
    }
  };

  const [mobileDropdowns, setMobileDropdowns] = useState({});

  const toggleMobileDropdown = (name) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleLinkClick = (href) => {
    setIsMobileMenuOpen(false);
    setMobileDropdowns({});
    if (window.location.hash === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  const navigationItems = [
    {
      name: 'Company',
      dropdown: [
        { name: 'Our Story', href: '#our-story' },
        { name: 'Our People', href: '#our-people' },
        { name: 'Our Culture', href: '#our-culture' },
        { name: 'About Us', href: '#about-us' },
        { name: 'Awards and Achievements', href: '#awards-achievements' },
        { name: 'Blogs', href: '#blogs' },
        { name: 'Our Gallery', href: '#our-gallery' },
      ],
    },
    { name: 'Services', href: '#services' },
    { name: 'Industry', href: '#industry' },
    { name: 'Career', href: '#career' },
    { name: 'Case Study', href: '#case-study' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Ventures', href: '#ventures' },
    { name: 'Contact Us', href: '#contact' },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[1600px] z-50 transition-all duration-500 ease-out",
          isHidden ? "-translate-y-[150%] opacity-0" : "translate-y-0 opacity-100",
          isScrolled 
            ? "bg-[#050505]/40 backdrop-blur-md border border-white/5 py-4 px-6 md:px-8 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
            : "bg-transparent py-6 px-4 rounded-none border-transparent"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" onClick={handleLogoClick} aria-label="Homepage and Admin Portal Trigger" className="flex items-center gap-3 group relative cursor-pointer z-50">
            <img 
              src="/images/hk-logo.png" 
              alt="HK Logo" 
              className="w-9 h-9 object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <span className="font-display tracking-[0.15em] text-sm font-semibold text-white">
              HariKrushn <span className="font-light text-neutral-400 text-xs hidden md:inline">DigiVerse LLP</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center md:gap-4 lg:gap-6 xl:gap-8">
            {navigationItems.map((item) => {
              if (item.dropdown) {
                return (
                  <div key={item.name} className="relative group py-1">
                    <button 
                      aria-haspopup="true" 
                      aria-expanded="false" 
                      className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-light text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      <span>{item.name}</span>
                      <svg className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Glassmorphic Dropdown Wrapper (Bridges hover gap) */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50">
                      {/* Actual Styled Dropdown Box */}
                      <div className="bg-[#050505]/95 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-1">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => handleLinkClick(subItem.href)}
                            className="text-[11px] uppercase tracking-[0.15em] font-light text-neutral-400 hover:text-white transition-all duration-200 py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer block text-left"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className="relative text-xs uppercase tracking-[0.15em] font-light text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[6px] relative z-50 cursor-pointer focus:outline-none"
            aria-label="Toggle Menu"
          >
            <span
              className={cn(
                "w-6 h-[1.5px] bg-white transition-all duration-300 origin-center",
                isMobileMenuOpen ? "rotate-45 translate-y-[4px]" : ""
              )}
            />
            <span
              className={cn(
                "w-6 h-[1.5px] bg-white transition-all duration-300 origin-center",
                isMobileMenuOpen ? "-rotate-45 -translate-y-[4px]" : ""
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 w-full h-screen bg-[#050505] z-40 flex flex-col items-center justify-start pt-28 pb-10 overflow-y-auto transition-all duration-700 ease-in-out",
          isMobileMenuOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-6 w-full max-w-sm px-6 text-center">
          {navigationItems.map((item, index) => {
            if (item.dropdown) {
              const isDropdownOpen = !!mobileDropdowns[item.name];
              return (
                <div 
                  key={item.name} 
                  className="flex flex-col items-center"
                  style={{ 
                    transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                    transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(30px)',
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transition: 'all 0.5s ease-out'
                  }}
                >
                  <button 
                    onClick={() => toggleMobileDropdown(item.name)}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    className="flex items-center justify-center gap-2 text-2xl uppercase tracking-[0.25em] font-light text-neutral-400 hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    <span>{item.name}</span>
                    <svg 
                      className={cn(
                        "w-4 h-4 transition-transform duration-300", 
                        isDropdownOpen ? "rotate-180 text-white" : "text-neutral-500"
                      )} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div 
                    className={cn(
                      "flex flex-col gap-3 transition-all duration-500 ease-in-out overflow-hidden mt-3 w-full bg-white/[0.02] border border-white/5 rounded-xl px-4",
                      isDropdownOpen ? "max-h-[350px] py-4 opacity-100" : "max-h-0 py-0 opacity-0 border-none"
                    )}
                  >
                    {item.dropdown.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => handleLinkClick(subItem.href)}
                        className="text-xs uppercase tracking-[0.2em] font-light text-neutral-500 hover:text-white transition-colors duration-300 py-2 cursor-pointer block"
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => handleLinkClick(item.href)}
                style={{ 
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                  transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transition: 'all 0.5s ease-out'
                }}
                className="text-2xl uppercase tracking-[0.25em] font-light text-neutral-400 hover:text-white transition-all duration-500 cursor-pointer block"
              >
                {item.name}
              </a>
            );
          })}
        </div>
      </div>

      {/* Admin Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="w-[90%] max-w-md bg-[#080808]/90 border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.05)] relative overflow-hidden group">
            {/* Glow accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full filter blur-2xl pointer-events-none group-hover:bg-white/10 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col space-y-6">
              <div className="text-center space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-light block mb-2">// ACCESS PORTAL</span>
                <h3 className="font-display text-xl font-bold text-white tracking-tight">Enter credentials</h3>
                <p className="text-xs text-neutral-400 font-light">Administrative access to HariKrushn Digiverse system.</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="PASSWORD"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-[#101010]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-all duration-300 font-mono tracking-widest text-center"
                    autoFocus
                  />
                </div>

                {authError && (
                  <p className="text-xs text-red-500 font-mono text-center">{authError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAuthModal(false);
                      setPasswordInput('');
                      setAuthError('');
                    }}
                    className="w-1/2 px-6 py-3 border border-white/5 bg-white/[0.01] hover:bg-white/[0.05] rounded-xl text-neutral-400 hover:text-white transition-all duration-300 text-xs font-mono tracking-widest uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-1/2 px-6 py-3 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-600 transition-all duration-300 rounded-xl text-xs font-mono tracking-widest uppercase font-semibold cursor-pointer"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
