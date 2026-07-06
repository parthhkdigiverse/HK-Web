import React from 'react';
import { useContent } from '../context/ContentContext';

export default function Footer() {
  const { content } = useContent();
  const footerData = content?.site_settings?.footer || {};
  const logoText = content?.site_settings?.logo_text || "HariKrushn DigiVerse LLP";

  return (
    <footer className="border-t border-white/5 bg-black px-4 sm:px-6 md:px-8 lg:px-12 py-20 text-sm sm:text-[15px] font-light text-neutral-400 relative z-10">
      <div className="max-w-[1600px] w-full mx-auto grid grid-cols-12 gap-8 lg:gap-12">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3">
            <img src={footerData.logo_img || "/images/hk-logo.png"} alt="HariKrushn DigiVerse Logo" className="w-10 h-10 object-contain" />
            <span className="font-display text-xl font-bold text-white tracking-tight">{footerData.logo_text || logoText}</span>
          </div>
          <p className="leading-relaxed max-w-xs text-neutral-400 text-sm sm:text-[15px] whitespace-pre-line">
            {footerData.description || "Architecting the infinite digital through precision engineering and editorial design."}
          </p>
        </div>
        <div className="col-span-6 lg:col-span-2 space-y-4">
          <div className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-white font-bold">// Capabilities</div>
          <ul className="space-y-2.5">
            {(footerData.capabilities || [])
              .filter(link => link.show !== false)
              .map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
                </li>
              ))}
          </ul>
        </div>
        <div className="col-span-6 lg:col-span-2 space-y-4">
          <div className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-white font-bold">// Ecosystem</div>
          <ul className="space-y-2.5">
            {(footerData.ecosystem || [])
              .filter(link => link.show !== false)
              .map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
                </li>
              ))}
          </ul>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-4 lg:text-right">
          <div className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-white font-bold">// Office</div>
          <p className="leading-relaxed text-neutral-400 text-sm sm:text-[15px] whitespace-pre-line">
            {footerData.address || "Techno Hub, Silicon Oasis\nDubai, United Arab Emirates"}
          </p>
          {footerData.email && (
            <p className="text-white font-semibold mt-2 text-sm sm:text-[15px]">
              <a href={`mailto:${footerData.email}`} className="hover:underline">{footerData.email}</a>
            </p>
          )}
          {footerData.phone && (
            <p className="text-neutral-400 text-xs mt-1">
              <a href={`tel:${footerData.phone}`} className="hover:underline">{footerData.phone}</a>
            </p>
          )}
        </div>
        
        <div className="col-span-12 pt-16 mt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-500 text-xs sm:text-sm">
            {footerData.copyright || "© 2026 HariKrushn DigiVerse LLP. Architecting the Infinite Digital."}
          </p>
          <div className="flex gap-6 text-neutral-500 text-xs sm:text-sm">
            {(footerData.social_links || [])
              .filter(link => link.show !== false)
              .map(link => (
                <a 
                  key={link.platform} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  {link.platform}
                </a>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

