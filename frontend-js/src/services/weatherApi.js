const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const apiGet = async (path, params) => {
  const url = new URL(API_BASE_URL + path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.append(k, v);
      }
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('API error');
  return res.json();
};

const api = {
  searchLocations: async (query) => {
    const data = await apiGet('/weather/search', { query });
    return data.locations;
  },
  reverseGeocode: async (lat, lon) => {
    const data = await apiGet('/weather/search', { lat, lon });
    return data.locations;
  },
  getCurrentWeather: async (lat, lon) => {
    const data = await apiGet('/weather/current', { lat, lon });
    return data.weather;
  },
  getForecast: async (lat, lon, days = 5) => {
    const data = await apiGet('/weather/forecast', { lat, lon, days });
    return data.forecast;
  },
  getMapUrl: async (lat, lon, zoom, size) => {
    const data = await apiGet('/weather/map', { lat, lon, zoom, size });
    return data.mapUrl;
  },
  getWeatherRecords: async () => {
    const data = await apiGet('/weather/records');
    return data.records;
  },
  getWeatherRecord: async (id) => {
    const data = await apiGet(`/weather/records/${id}`);
    return data.record;
  },
  createWeatherRecord: async (location, dateRange) => {
    const payload = {
      location: {
        type: 'Point',
        coordinates: [location.lon, location.lat],
        address: location.address || `${location.name}, ${location.country}`,
        city: location.city || location.name,
        country: location.country
      },
      dateRange
    };
    const res = await fetch(API_BASE_URL + '/weather/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Create record failed');
    const data = await res.json();
    return data.record;
  },
  updateWeatherRecord: async (id, updates) => {
    const res = await fetch(API_BASE_URL + `/weather/records/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Update record failed');
    const data = await res.json();
    return data.record;
  },
  deleteWeatherRecord: async (id) => {
    const res = await fetch(API_BASE_URL + `/weather/records/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete record failed');
  }
};

export default api;
