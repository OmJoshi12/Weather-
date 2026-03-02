import React from 'react';

export default function NeoNow({ weather }) {
  const icon = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;
  
  return (
    <div className="glass-card p-10 flex flex-col items-center text-center">
      <div className="mb-2">
        <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] opacity-30 mb-4">Live Conditions</p>
        <div className="flex items-center justify-center -space-x-4">
          <h3 className="text-8xl font-black tracking-tighter">{Math.round(weather.temperature)}°</h3>
          <img src={icon} alt={weather.condition} className="w-32 h-32 select-none pointer-events-none drop-shadow-2xl" />
        </div>
      </div>
      
      <div className="space-y-1 mb-8">
        <p className="text-2xl font-bold tracking-tight">{weather.condition}</p>
        <p className="text-sm font-medium opacity-40 capitalize">{weather.description}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-8 w-full pt-8 border-t border-gray-100 dark:border-gray-800">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-1">Feels</p>
          <p className="text-lg font-bold">{Math.round(weather.feelsLike)}°</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-1">Humidity</p>
          <p className="text-lg font-bold">{weather.humidity}%</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-1">Wind</p>
          <p className="text-lg font-bold">{weather.windSpeed} <span className="text-[10px] opacity-40">m/s</span></p>
        </div>
      </div>
    </div>
  );
}
