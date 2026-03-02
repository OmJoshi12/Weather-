import React, { useEffect, useState } from 'react';
import api from './services/weatherApi.js';
import NeoSearch from './components/NeoSearch.jsx';
import NeoNow from './components/NeoNow.jsx';
import NeoForecast from './components/NeoForecast.jsx';
import NeoRecords from './components/NeoRecords.jsx';
import Footer from './components/Footer.jsx';
import './index.css';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recordsRefreshTrigger, setRecordsRefreshTrigger] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const preload = async () => {
      const defaultLocation = {
        name: 'London',
        country: 'United Kingdom',
        lat: 51.5074,
        lon: -0.1278,
        address: 'London, United Kingdom'
      };
      try {
        setLoading(true);
        setSelectedLocation(defaultLocation);
        const [weather, forecastData] = await Promise.all([
          api.getCurrentWeather(defaultLocation.lat, defaultLocation.lon),
          api.getForecast(defaultLocation.lat, defaultLocation.lon)
        ]);
        setCurrentWeather(weather);
        setForecast(forecastData);
      } catch (e) {
        console.error('Preload failed', e);
      } finally {
        setLoading(false);
      }
    };
    preload();
  }, []);

  const handleLocationSelect = async (location) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedLocation(location);
      const [weather, forecastData] = await Promise.all([
        api.getCurrentWeather(location.lat, location.lon),
        api.getForecast(location.lat, location.lon)
      ]);
      setCurrentWeather(weather);
      setForecast(forecastData);
    } catch (err) {
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locations = await api.reverseGeocode(latitude, longitude);
          if (locations.length > 0) handleLocationSelect(locations[0]);
        } catch (err) {
          setError('Failed to get location.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location access denied.');
        setLoading(false);
      }
    );
  };

  const handleSaveRecord = async () => {
    if (!selectedLocation || !currentWeather) return;
    try {
      await api.createWeatherRecord(selectedLocation, {
        start: new Date(),
        end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      });
      setRecordsRefreshTrigger(p => p + 1);
      setError(null);
      alert('Saved successfully!');
    } catch {
      setError('Failed to save.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <nav className="border-b border-gray-100 dark:border-gray-800 bg-[var(--card-bg)] sticky top-0 z-50 transition-colors">
        <div className="max-w-4xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight">Weather Intelligence</h1>
          </div>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12 space-y-12 flex-grow">
        <section className="space-y-4">
          <div className="pro-card p-1 shadow-sm overflow-visible">
            <NeoSearch onSelect={handleLocationSelect} onUseMyLocation={handleUseMyLocation} loading={loading} />
          </div>
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 p-3.5 rounded-lg text-sm font-medium flex justify-between items-center animate-fade">
              <div className="flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
              <button onClick={() => setError(null)} className="text-lg leading-none opacity-60 hover:opacity-100">×</button>
            </div>
          )}
        </section>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Fetching latest data</p>
          </div>
        ) : currentWeather && (
          <section className="space-y-8 animate-fade">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-900 pb-6">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Current conditions for</p>
                <h2 className="text-3xl font-bold tracking-tight">{selectedLocation?.address}</h2>
              </div>
              <button onClick={handleSaveRecord} className="btn-pro whitespace-nowrap">
                Save for later
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <NeoNow weather={currentWeather} />
              <NeoForecast forecast={forecast} />
            </div>
          </section>
        )}

        <section className="space-y-6 pb-12">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-400">Archived Records</h2>
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-900"></div>
          </div>
          <NeoRecords refreshTrigger={recordsRefreshTrigger} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
