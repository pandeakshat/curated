import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, Star, Calendar, Folder } from 'lucide-react';

// The 6 categories with specific col/row spans to create the asymmetrical Bento look on desktop
const categories = [
  { id: 'words', title: 'Words / Poetry', className: 'md:col-span-2 md:row-span-2' },
  { id: 'cinema', title: 'Cinema & Screen', className: 'md:col-span-2 md:row-span-1' },
  { id: 'systems', title: 'Systems & Philosophy', className: 'md:col-span-1 md:row-span-2' },
  { id: 'games', title: 'Interactive / Games', className: 'md:col-span-1 md:row-span-1' },
  { id: 'architecture', title: 'Tech & Architecture', className: 'md:col-span-2 md:row-span-1' },
  { id: 'aesthetics', title: 'Visuals & Aesthetics', className: 'md:col-span-1 md:row-span-1' },
];

export default function VaultGrid() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedCategory = categories.find((c) => c.id === selectedId);

  return (
    // The perspective class is crucial here to give the 3D flip a realistic depth
    <div className="h-full w-full relative perspective-[1200px]">
      <AnimatePresence mode="wait">
        
        {!selectedId ? (
          // --------------------------------------------------
          // STATE 1: THE BENTO GRID
          // --------------------------------------------------
          <motion.div 
            key="grid"
            className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 h-full gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            {categories.map((cat) => (
              <motion.div
                layoutId={`vault-tile-${cat.id}`}
                key={cat.id}
                onClick={() => setSelectedId(cat.id)}
                className={`group cursor-pointer rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 p-6 flex items-end relative overflow-hidden ${cat.className}`}
              >
                {/* Subtle hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h2 className="font-sans text-xl md:text-2xl font-medium tracking-tight relative z-10">
                  {cat.title}
                </h2>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // --------------------------------------------------
          // STATE 2: THE ANCHORED HEADER + FLIPPED CANVAS
          // --------------------------------------------------
          <div key="content" className="flex flex-col h-full gap-4">
            
            {/* The Anchored Header Tile */}
            <motion.div
              layoutId={`vault-tile-${selectedCategory.id}`}
              className="shrink-0 h-24 md:h-32 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex items-center justify-between"
            >
              <h2 className="font-sans text-2xl md:text-4xl font-medium tracking-tight">
                {selectedCategory.title}
              </h2>
              <button 
                onClick={() => setSelectedId(null)}
                className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </motion.div>

            {/* The Flipped Content Canvas */}
            <motion.div
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
              className="flex-1 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col"
            >
              {/* Filter Bar */}
              <div className="shrink-0 border-b border-zinc-800 p-4 flex items-center justify-between gap-4 overflow-x-auto">
                <div className="flex items-center gap-3 text-sm font-mono text-zinc-400">
                  <SlidersHorizontal size={16} />
                  <span>Filters:</span>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono transition-colors">
                    <Folder size={14} /> Type
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono transition-colors">
                    <Star size={14} /> Rating
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono transition-colors">
                    <Calendar size={14} /> Date
                  </button>
                </div>
              </div>

              {/* Curated Content Feed (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Placeholders for your Google Sheet items */}
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="p-4 rounded-xl border border-zinc-800/50 bg-zinc-950/50 hover:border-zinc-700 transition-colors cursor-pointer group">
                      <div className="h-32 rounded-lg bg-zinc-800/30 mb-4 group-hover:bg-zinc-800/50 transition-colors"></div>
                      <h3 className="font-medium text-zinc-200 mb-1">Curated Item {item}</h3>
                      <p className="text-xs font-mono text-zinc-500">Added Oct 2026</p>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
        
      </AnimatePresence>
    </div>
  );
}