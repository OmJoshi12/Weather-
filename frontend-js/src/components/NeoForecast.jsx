import React from 'react';

const fmt = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short' });

export default function NeoForecast({ forecast }) {
  return (
    <div className="glass-card p-10">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] opacity-30 text-center mb-8">5-Day Forecast</p>
      <div className="grid grid-cols-5 gap-4">
        {forecast.map((day, i) => (
          <div key={i} className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/5 dark:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-colors">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2">{fmt(day.date)}</p>
            <img 
              src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
              alt={day.condition} 
              className="w-10 h-10 mb-2 select-none pointer-events-none"
            />
            <div className="space-y-0.5">
              <p className="text-sm font-black tracking-tighter">{Math.round(day.temperature.max)}°</p>
              <p className="text-[10px] font-bold opacity-30">{Math.round(day.temperature.min)}°</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
