import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, SlidersHorizontal, Maximize2, X, Loader2 } from 'lucide-react';
import Papa from 'papaparse';

const categories = [
  { id: 'words', title: 'Words / Poetry', color: '#eab308', image: 'https://assets.pandeakshat.com/curated/word-poetry.jpg' },
  { id: 'cinema', title: 'Cinema & Screen', color: '#3b82f6', image: 'https://assets.pandeakshat.com/curated/cinema-screen.jpg' },
  { id: 'systems', title: 'Systems & Philosophy', color: '#f59e0b', image: 'https://assets.pandeakshat.com/curated/system-philosophy.jpg' },
  { id: 'games', title: 'Interactive / Games', color: '#ef4444', image: 'https://assets.pandeakshat.com/curated/interactive-games.jpg' },
  { id: 'architecture', title: 'Tech & Architecture', color: '#0ea5e9', image: 'https://assets.pandeakshat.com/curated/tech-architecture.jpg' },
  { id: 'aesthetics', title: 'Visuals & Aesthetics', color: '#a855f7', image: 'https://assets.pandeakshat.com/curated/vibe-aesthetic.jpg' },
];

export default function DeckVaultGrid() {
  const [selectedId, setSelectedId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Live data states
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch from published Google Sheet CSV
  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        // Fetches from your Astro .env file
        const sheetUrl = import.meta.env.PUBLIC_SHEET_CSV_URL;
        
        if (!sheetUrl) {
          console.error("PUBLIC_SHEET_CSV_URL is missing from .env");
          setIsLoading(false);
          return;
        }

        const response = await fetch(sheetUrl);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setItems(results.data);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching vault data:", error);
        setIsLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  const originalIndex = categories.findIndex(c => c.id === selectedId);
  const selectedCategory = categories[originalIndex];
  
  let displayGrid = [];
  if (selectedId) {
    // Filter live items from Google Sheet
    const categoryItems = items.filter(item => item.category === selectedId);
    displayGrid = [...categoryItems];
    // Re-insert the category anchor block in its original spot
    displayGrid.splice(originalIndex, 0, { isCategoryAnchor: true, ...selectedCategory });
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-zinc-950 text-zinc-500 flex-col gap-4">
         <Loader2 className="animate-spin text-zinc-600" size={32} />
         <p className="font-mono text-xs tracking-widest uppercase">Unlocking Vault...</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-zinc-950 text-zinc-50 font-sans">
      
      {/* LEFT EDGE: GO BACK */}
      <AnimatePresence>
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => setSelectedId(null)}
            className="fixed left-0 top-0 bottom-0 w-12 md:w-16 hover:w-20 bg-zinc-950/80 backdrop-blur-md border-r border-zinc-800 flex items-center justify-center cursor-pointer transition-all z-40 group"
          >
            <ChevronLeft className="text-zinc-500 group-hover:text-zinc-100 transition-colors" />
            <span className="absolute left-14 opacity-0 group-hover:opacity-100 font-mono text-xs text-zinc-300 pointer-events-none transition-opacity">Back</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIGHT EDGE: FILTERS */}
      <AnimatePresence>
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="fixed right-0 top-0 bottom-0 w-12 md:w-16 hover:w-20 bg-zinc-950/80 backdrop-blur-md border-l border-zinc-800 flex items-center justify-center cursor-pointer transition-all z-40 group"
          >
            <SlidersHorizontal className="text-zinc-500 group-hover:text-zinc-100 transition-colors" size={20} />
            <span className="absolute right-14 opacity-0 group-hover:opacity-100 font-mono text-xs text-zinc-300 pointer-events-none transition-opacity">Filter</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN GRID - Centered & Responsive */}
      <div className="w-full h-full overflow-y-auto overflow-x-hidden perspective-[1200px]">
        <div className="min-h-full flex flex-col items-center justify-center py-16 md:py-24 px-16 md:px-24">
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl auto-rows-auto"
          >
            <AnimatePresence mode="popLayout">
              {!selectedId ? (
                // STATE 1: THE 6 CATEGORIES
                categories.map((cat, index) => (
                  <motion.div
                    layoutId={`tile-${cat.id}`}
                    key={cat.id}
                    onClick={() => setSelectedId(cat.id)}
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    style={{ '--theme-color': cat.color }}
                    className="aspect-square cursor-pointer rounded-2xl bg-zinc-900 border-2 border-zinc-800 p-6 flex flex-col justify-end group transition-all overflow-hidden relative hover:shadow-[0_0_30px_var(--theme-color)] hover:border-[var(--theme-color)]"
                  >
                    <img src={cat.image} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700" alt={cat.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-transparent" />
                    
                    <h2 className="font-sans text-xl md:text-2xl font-medium tracking-tight text-zinc-300 group-hover:text-white relative z-10 transition-colors">
                      {cat.title}
                    </h2>
                  </motion.div>
                ))
              ) : (
                // STATE 2: THE ANCHORED CATEGORY + ITEM CARDS
                displayGrid.map((item, index) => {
                  
                  // Render the Anchor Tile
                  if (item.isCategoryAnchor) {
                    return (
                      <motion.div
                        layoutId={`tile-${item.id}`}
                        key={item.id}
                        onClick={() => setSelectedId(null)}
                        style={{ '--theme-color': item.color }}
                        className="aspect-square cursor-pointer rounded-2xl border-2 border-[var(--theme-color)] bg-zinc-900 p-6 flex flex-col justify-end relative shadow-[0_0_30px_var(--theme-color)] overflow-hidden"
                      >
                        <img src={item.image} className="absolute inset-0 w-full h-full object-cover opacity-30" alt={item.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-transparent" />
                        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-white animate-pulse" />
                        <h2 className="font-sans text-xl md:text-2xl font-medium tracking-tight text-white relative z-10">
                          {item.title}
                        </h2>
                      </motion.div>
                    );
                  }

                  // Render the Spreadsheeet Items
                  return (
                    <motion.div
                      key={item.id}
                      onClick={() => setActiveItem(item)}
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      style={{ '--item-color': item.color || '#52525b' }}
                      className="aspect-square cursor-pointer rounded-2xl border border-zinc-800 overflow-hidden relative group hover:border-[var(--item-color)] hover:shadow-[0_0_20px_var(--item-color)] transition-all"
                    >
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-transparent" />
                      
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <Maximize2 className="absolute top-4 right-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                        <h3 className="font-sans text-lg font-medium text-zinc-100 relative z-10 leading-tight">
                          {item.title}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ITEM MODAL */}
      <AnimatePresence>
        {activeItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
            className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
              style={{ '--modal-accent': activeItem.color || '#52525b' }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative cursor-default border-t-4 border-t-[var(--modal-accent)]"
            >
              <button onClick={() => setActiveItem(null)} className="absolute top-6 right-6 p-2 bg-zinc-950/50 hover:bg-zinc-800 rounded-full text-zinc-300 hover:text-white transition-colors z-20 backdrop-blur-md">
                <X size={20} />
              </button>
              
              {/* Image Header */}
              <div className="h-48 md:h-64 w-full relative shrink-0">
                <img src={activeItem.image} className="w-full h-full object-cover" alt={activeItem.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                <div className="absolute bottom-6 left-8 md:left-12">
                  <span className="px-3 py-1 rounded-full bg-[var(--modal-accent)]/20 text-[var(--modal-accent)] text-xs font-mono mb-3 inline-block border border-[var(--modal-accent)]/30">
                    {activeItem.date || 'Curated'}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">{activeItem.title}</h2>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-8 md:p-12 overflow-y-auto">
                {/* whitespace-pre-wrap ensures poems keep their line breaks from the CSV */}
                <p className="text-zinc-300 font-sans text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                  {activeItem.content}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}