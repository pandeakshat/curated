import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashOverlay() {
  const [isVisible, setIsVisible] = useState(true);

  // Prevent scrolling while the splash is active, just as a safety measure
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          // Click anywhere to dismiss
          onClick={() => setIsVisible(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 cursor-pointer"
          // Animation definitions
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05, // Slight zoom effect as it disappears
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
          }}
        >
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <motion.h1 
              className="font-sans text-2xl md:text-4xl tracking-tight font-medium text-zinc-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome to Akshat's Curated Gallery
            </motion.h1>
            <motion.p
              className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              [ Click to enter the vault ]
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}