import React from 'react';
import { motion } from 'framer-motion';

export default function ForecastCard({ forecast }) {
  const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return (
    <motion.div 
      className="forecast-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, i) => (
          <motion.div
            key={i}
            className="forecast-day"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 140, damping: 15 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <div className="forecast-date">{formatDate(day.date)}</div>
            <img src={iconUrl(day.icon)} alt={day.description} className="forecast-icon" />
            <div className="forecast-temps">
              <span className="temp-high">{Math.round(day.temperature.max)}°</span>
              <span className="temp-low">{Math.round(day.temperature.min)}°</span>
            </div>
            <div className="forecast-condition">{day.condition}</div>
            <div className="forecast-details">
              <div className="detail">
                <span className="detail-label">💧</span>
                <span className="detail-value">{day.humidity}%</span>
              </div>
              <div className="detail">
                <span className="detail-label">💨</span>
                <span className="detail-value">{day.windSpeed} m/s</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
