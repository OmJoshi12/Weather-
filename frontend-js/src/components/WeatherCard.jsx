import React from 'react';
import { motion } from 'framer-motion';

export default function WeatherCard({ weather, title = 'Current Weather' }) {
  const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;
  return (
    <motion.div 
      className="weather-card"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h3>{title}</h3>
      <div className="weather-main">
        <div className="temperature">
          <span className="temp-value">{Math.round(weather.temperature)}°C</span>
          <motion.img 
            src={iconUrl(weather.icon)} 
            alt={weather.description}
            className="weather-icon"
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.1 }}
          />
        </div>
        <div className="weather-details">
          <p className="condition">{weather.condition}</p>
          <p className="description">{weather.description}</p>
          <p className="feels-like">Feels like {Math.round(weather.feelsLike)}°C</p>
        </div>
      </div>
      <div className="weather-stats">
        <div className="stat">
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{weather.humidity}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Wind Speed</span>
          <span className="stat-value">{weather.windSpeed} m/s</span>
        </div>
        <div className="stat">
          <span className="stat-label">Pressure</span>
          <span className="stat-value">{weather.pressure} hPa</span>
        </div>
        {weather.visibility !== undefined && (
          <div className="stat">
            <span className="stat-label">Visibility</span>
            <span className="stat-value">{(weather.visibility / 1000).toFixed(1)} km</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
