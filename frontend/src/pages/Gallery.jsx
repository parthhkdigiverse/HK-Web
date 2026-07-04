import React, { useState, useEffect, useCallback } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Gallery() {
  const { content } = useContent();
  const items = content.gallery;
  const [selectedIdx, setSelectedIdx] = useState(null);

  const handleNext = useCallback(() => {
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev + 1) % items.length);
  }, [selectedIdx, items.length]);

  const handlePrev = useCallback(() => {
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev - 1 + items.length) % items.length);
  }, [selectedIdx, items.length]);

  const handleClose = useCallback(() => {
    setSelectedIdx(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIdx === null) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIdx, handleNext, handlePrev, handleClose]);

  return (
    <div className="relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full filter blur-[120px] pointer-events-none" />
      
      <div className="text-center mb-16 pt-8">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-neutral-500 font-light block mb-3">
          // Company
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">Our Gallery</h1>
        <p className="font-light text-neutral-400 text-base max-w-xl mx-auto leading-relaxed">
          A glimpse into the digital craftsmanship laboratory where logic merges with luxury aesthetics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px] px-4">
        {items.map((item, index) => (
          <div 
            key={item.title + '-' + index} 
            onClick={() => setSelectedIdx(index)}
            className={`bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-2xl hover:border-white/20 transition-all duration-500 group overflow-hidden relative shadow-lg cursor-pointer ${item.size || 'col-span-1 row-span-1'}`}
          >
            {/* Gallery Image */}
            <img 
              src={item.image} 
              alt={item.title} 
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-45 group-hover:grayscale-0 group-hover:opacity-75 group-hover:scale-[1.05] transition-all duration-750"
            />
            
            {/* Ambient digital grid aesthetic background overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.02),transparent)] opacity-100 pointer-events-none" />
            
            {/* Visual tech-accent line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-white/20 transition-colors pointer-events-none" />

            {/* Bottom text overlay */}
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end z-10 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5 block">{item.category}</span>
              <h3 className="font-display text-base font-semibold text-white group-hover:text-neutral-200 transition-colors">{item.title}</h3>
            </div>
            
            {/* Outer hover scale border shadow */}
            <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-2xl transition-all duration-500 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Lightbox Slider Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-2xl flex items-center justify-center select-none"
            onClick={handleClose}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 z-[1000] text-neutral-400 hover:text-white transition-colors p-3 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Left Navigation Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 sm:left-8 z-[1000] text-neutral-400 hover:text-white transition-colors p-4 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Main Image Viewport */}
            <div 
              className="relative w-full max-w-5xl h-full max-h-[75vh] px-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="relative max-w-full max-h-full flex flex-col items-center"
                >
                  <img
                    src={items[selectedIdx].image}
                    alt={items[selectedIdx].title}
                    className="max-w-full max-h-[65vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
                  />
                  
                  {/* Photo Title and Counter Caption */}
                  <div className="mt-6 text-center space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                      {items[selectedIdx].category}
                    </span>
                    <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                      {items[selectedIdx].title}
                    </h2>
                    <span className="font-mono text-xs text-neutral-500 block mt-2">
                      {selectedIdx + 1} / {items.length}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Navigation Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 sm:right-8 z-[1000] text-neutral-400 hover:text-white transition-colors p-4 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
