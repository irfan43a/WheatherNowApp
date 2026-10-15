import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { searchLocations } from '../services/weatherApi';

export default function SearchBar({ onSelectLocation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef(null);

  // Debounced search logic
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const locations = await searchLocations(query);
        setResults(locations);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location) => {
    onSelectLocation(location);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0]);
    }
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-2xl mx-auto mb-6 z-30">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Cari nama kota, daerah, atau provinsi (contoh: Jakarta, Bandung, Bali, Tokyo)..."
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl glass-input text-slate-100 placeholder:text-slate-500 text-sm md:text-base outline-none transition-all shadow-lg shadow-black/20"
        />

        <div className="absolute right-4 flex items-center gap-1.5">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
          ) : query ? (
            <button
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl glass-card border border-white/10 shadow-2xl overflow-hidden divide-y divide-slate-800/80 z-40 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            results.map((loc) => (
              <button
                key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                onClick={() => handleSelect(loc)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-slate-800/60 transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:bg-sky-500/20 transition">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-100 group-hover:text-sky-300 transition">
                      {loc.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50">
                  {loc.countryCode || 'ID'}
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              Tidak ada hasil ditemukan untuk "{query}". Coba periksa ejaan nama daerah.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
