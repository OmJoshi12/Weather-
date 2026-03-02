import React, { useEffect, useState } from 'react';

export default function WeatherRecords({ refreshTrigger }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/weather/records');
      const data = await response.json();
      if (response.ok) {
        setRecords(data.records || []);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch records');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      const response = await fetch(`/api/weather/records/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setRecords((recs) => recs.filter((r) => r._id !== id));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete record');
      }
    } catch {
      setError('Network error occurred');
    }
  };

  const exportData = async (format) => {
    try {
      const response = await fetch(`/api/export/${format}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `weather-records.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to export data');
      }
    } catch {
      setError('Network error occurred');
    }
  };

  useEffect(() => { fetchRecords(); }, [refreshTrigger]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  if (loading) return <div className="loading">Loading weather records...</div>;
  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchRecords} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="weather-records">
      <div className="records-header">
        <h3>Saved Weather Records</h3>
        <div className="export-buttons">
          <button onClick={() => exportData('json')} className="export-button">Export JSON</button>
          <button onClick={() => exportData('csv')} className="export-button">Export CSV</button>
          <button onClick={() => exportData('markdown')} className="export-button">Export MD</button>
        </div>
      </div>
      {records.length === 0 ? (
        <div className="no-records">
          <p>No weather records saved yet. Search for a location and save the weather data!</p>
        </div>
      ) : (
        <div className="records-list">
          {records.map((record) => (
            <div key={record._id} className="record-item">
              <div className="record-header">
                <div className="record-location">
                  <h4>{record.location.address}</h4>
                  <p className="record-date">{formatDate(record.createdAt)}</p>
                </div>
                <button onClick={() => deleteRecord(record._id)} className="delete-button" title="Delete record">🗑️</button>
              </div>
              <div className="record-weather">
                <div className="current-weather">
                  <span className="temperature">{Math.round(record.weatherData.current.temperature)}°C</span>
                  <span className="condition">{record.weatherData.current.condition}</span>
                </div>
                <div className="weather-stats">
                  <span>💧 {record.weatherData.current.humidity}%</span>
                  <span>💨 {record.weatherData.current.windSpeed} m/s</span>
                </div>
              </div>
              <div className="record-forecast">
                <p>5-day forecast available</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
