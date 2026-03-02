import React, { useEffect, useRef, useState } from 'react';
import api from '../services/weatherApi';

export default function NeoSearch({ onSelect, onUseMyLocation, loading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        try {
          setIsSearching(true);
          setShowSuggestions(true);
          const results = await api.searchLocations(query);
          setSuggestions(results || []);
        } catch (e) {
          console.error(e);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex items-center bg-[var(--card-bg)] rounded-xl overflow-hidden transition-colors border border-transparent focus-within:border-blue-500/50">
        <div className="pl-4 text-gray-400">🔍</div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
          placeholder="Search for a city or zip code..."
          className="flex-1 bg-transparent border-none py-3 px-3 text-sm focus:outline-none focus:ring-0 text-[var(--text)]"
        />
        <button
          onClick={onUseMyLocation}
          disabled={loading}
          className="px-4 py-3 border-l border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-lg disabled:opacity-50"
          title="Use current location"
        >
          📍
        </button>
      </div>

      {showSuggestions && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 z-[100] mt-2 pro-card shadow-2xl overflow-hidden max-h-64 overflow-y-auto bg-[var(--card-bg)]">
          {isSearching ? (
            <div className="px-4 py-8 text-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Searching Database...</p>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((loc, i) => (
              <button
                key={i}
                className="w-full text-left px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 border-b last:border-0 border-gray-100 dark:border-gray-800 transition-colors"
                onClick={() => {
                  onSelect(loc);
                  setQuery('');
                  setShowSuggestions(false);
                }}
              >
                <div className="font-bold text-sm text-[var(--text)]">{loc.name}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{loc.state ? `${loc.state}, ` : ''}{loc.country}</div>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-gray-400 text-xs italic">
              No matching locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
