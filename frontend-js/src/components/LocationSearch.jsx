import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LocationSearch({ onLocationSelect, onUseMyLocation, isLoading = false }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLocations = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`/api/weather/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (response.ok) {
        setSuggestions(data.locations || []);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch {
      setSuggestions([]);
    }
  }, []);

  let debounceId = null;
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceId) clearTimeout(debounceId);
    debounceId = setTimeout(() => searchLocations(value), 300);
  };

  const handleSelect = (loc) => {
    setQuery(loc.address || `${loc.name}, ${loc.country}`);
    setShowSuggestions(false);
    onLocationSelect(loc);
  };

  return (
    <div className="location-search">
      <motion.div 
        className="search-input-container"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Enter city, zip code, or coordinates..."
          className="search-input"
          disabled={isLoading}
        />
        <button
          onClick={onUseMyLocation}
          className="location-button"
          disabled={isLoading}
          title="Use my current location"
        >
          📍
        </button>
      </motion.div>
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            className="suggestions-list"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
          >
            {suggestions.length > 0 ? (
              suggestions.map((location, idx) => (
                <motion.div
                  key={idx}
                  className="suggestion-item"
                  onClick={() => handleSelect(location)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="suggestion-name">
                    {location.name}
                    {location.state && `, ${location.state}`}
                  </div>
                  <div className="suggestion-country">{location.country}</div>
                </motion.div>
              ))
            ) : (
              <div className="suggestion-item">No results. Try a different query.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
