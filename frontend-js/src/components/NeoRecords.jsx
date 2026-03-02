import React, { useEffect, useState } from 'react';
import api from '../services/weatherApi';

export default function NeoRecords({ refreshTrigger }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await api.getWeatherRecords();
      setRecords(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.deleteWeatherRecord(id);
      fetchRecords();
    } catch (e) {
      alert('Delete failed');
    }
  };

  const handleExport = async (format) => {
    try {
      const blob = await api.exportData(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather-records.${format}`;
      a.click();
    } catch (e) {
      alert('Export failed');
    }
  };

  if (loading && records.length === 0) return <div className="p-4 text-center opacity-60">Loading records...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end mb-4">
        <button onClick={() => handleExport('json')} className="text-xs px-2 py-1 glass-card hover:bg-gray-100 dark:hover:bg-gray-800 transition">JSON</button>
        <button onClick={() => handleExport('csv')} className="text-xs px-2 py-1 glass-card hover:bg-gray-100 dark:hover:bg-gray-800 transition">CSV</button>
      </div>

      {records.length === 0 ? (
        <div className="p-10 text-center glass-card opacity-50 italic">No records saved yet.</div>
      ) : (
        <div className="grid gap-4">
          {records.map((rec) => (
            <div key={rec._id} className="p-4 glass-card flex justify-between items-center group">
              <div>
                <h4 className="font-bold">{rec.location.address}</h4>
                <div className="flex gap-4 text-xs opacity-60 mt-1">
                  <span>{Math.round(rec.weatherData.current.temperature)}°C</span>
                  <span>{rec.weatherData.current.condition}</span>
                  <span>{new Date(rec.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(rec._id)}
                className="p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
