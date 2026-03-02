const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async nominatimSearch(query) {
    const url = 'https://nominatim.openstreetmap.org/search';
    const response = await axios.get(url, {
      params: { q: query, format: 'json', addressdetails: 1, limit: 5 },
      headers: { 'User-Agent': 'WeatherApp/1.0 (education)' }
    });
    return response.data.map(item => ({
      name: item.address?.city || item.address?.town || item.address?.village || item.display_name.split(',')[0],
      country: item.address?.country_code?.toUpperCase() || item.address?.country || '',
      state: item.address?.state || '',
      lat: Number(item.lat),
      lon: Number(item.lon),
      address: item.display_name
    }));
  }

  async nominatimReverse(lat, lon) {
    const url = 'https://nominatim.openstreetmap.org/reverse';
    const response = await axios.get(url, {
      params: { lat, lon, format: 'json', addressdetails: 1 },
      headers: { 'User-Agent': 'WeatherApp/1.0 (education)' }
    });
    const item = response.data;
    return {
      address: item.display_name,
      city: item.address?.city || item.address?.town || item.address?.village || '',
      country: item.address?.country_code?.toUpperCase() || item.address?.country || '',
      lat,
      lon
    };
  }

  sampleCurrentWeather() {
    return {
      temperature: 18.5,
      feelsLike: 17.2,
      humidity: 65,
      pressure: 1013,
      windSpeed: 4.2,
      windDirection: 230,
      visibility: 10000,
      condition: 'Clouds',
      description: 'partly cloudy',
      icon: '02d'
    };
  }

  sampleForecast(days = 5) {
    return Array.from({ length: days }).map((_, i) => ({
      date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
      temperature: { min: 12 + i, max: 18 + i },
      humidity: 60 + i,
      windSpeed: 3 + i * 0.5,
      condition: i % 2 === 0 ? 'Clouds' : 'Clear',
      description: i % 2 === 0 ? 'scattered clouds' : 'clear sky',
      icon: i % 2 === 0 ? '03d' : '01d'
    }));
  }

  sampleLocations(query = '') {
    const catalog = [
      { name: 'London', country: 'GB', state: 'England', lat: 51.5074, lon: -0.1278 },
      { name: 'New York', country: 'US', state: 'NY', lat: 40.7128, lon: -74.0060 },
      { name: 'Mumbai', country: 'IN', state: 'MH', lat: 19.0760, lon: 72.8777 },
      { name: 'Tokyo', country: 'JP', state: 'Tokyo', lat: 35.6762, lon: 139.6503 },
      { name: 'Paris', country: 'FR', state: 'Île-de-France', lat: 48.8566, lon: 2.3522 }
    ];
    const q = query.toLowerCase();
    return catalog.filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q));
  }

  async getCurrentWeather(lat, lon) {
    try {
      if (!this.apiKey) {
        return this.sampleCurrentWeather();
      }
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      return {
        temperature: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind.speed,
        windDirection: response.data.wind.deg,
        visibility: response.data.visibility,
        condition: response.data.weather[0].main,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon
      };
    } catch (error) {
      if (error.response?.status === 401) {
        return this.sampleCurrentWeather();
      }
      throw new Error(`Weather API error: ${error.response?.data?.message || error.message}`);
    }
  }

  async getForecast(lat, lon, days = 5) {
    try {
      if (!this.apiKey) {
        return this.sampleForecast(days);
      }
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 forecasts per day (3-hour intervals)
        }
      });

      // Group forecasts by date and get daily min/max
      const dailyForecasts = {};
      response.data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toDateString();
        
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date: new Date(forecast.dt * 1000),
            temperatures: [],
            humidity: forecast.main.humidity,
            windSpeed: forecast.wind.speed,
            condition: forecast.weather[0].main,
            description: forecast.weather[0].description,
            icon: forecast.weather[0].icon
          };
        }
        
        dailyForecasts[date].temperatures.push(forecast.main.temp);
      });

      // Convert to required format
      return Object.values(dailyForecasts).map(day => ({
        date: day.date,
        temperature: {
          min: Math.min(...day.temperatures),
          max: Math.max(...day.temperatures)
        },
        humidity: day.humidity,
        windSpeed: day.windSpeed,
        condition: day.condition,
        description: day.description,
        icon: day.icon
      }));
    } catch (error) {
      if (error.response?.status === 401) {
        return this.sampleForecast(days);
      }
      throw new Error(`Forecast API error: ${error.response?.data?.message || error.message}`);
    }
  }

  async searchLocation(query) {
    try {
      if (!this.apiKey) {
        // Use Nominatim when no key available for accurate search
        return await this.nominatimSearch(query);
      }
      const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: this.apiKey
        }
      });

      let results = response.data;

      // Fallback: try zip code endpoint if no results and query looks like a zip
      const zipLike = /^\d{3,6}(-\d{4})?$/.test(query) || /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(query);
      if ((!results || results.length === 0) && zipLike) {
        const zipResp = await axios.get(`http://api.openweathermap.org/geo/1.0/zip`, {
          params: {
            zip: query,
            appid: this.apiKey
          }
        }).catch(() => null);
        if (zipResp && zipResp.data) {
          results = [{
            name: zipResp.data.name,
            country: zipResp.data.country,
            lat: zipResp.data.lat,
            lon: zipResp.data.lon
          }];
        } else if (!this.apiKey) {
          // As a fallback without key, try Nominatim again
          return await this.nominatimSearch(query);
        }
      }

      return (results || []).map(location => ({
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon
      }));
    } catch (error) {
      // Graceful fallback for invalid/missing API key or other geocode failures
      if (!this.apiKey || error.response?.status === 401) {
        return await this.nominatimSearch(query);
      }
      throw new Error(`Location search error: ${error.response?.data?.message || error.message}`);
    }
  }

  async reverseGeocode(lat, lon) {
    try {
      if (!this.apiKey) {
        return await this.nominatimReverse(lat, lon);
      }
      const response = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse`, {
        params: {
          lat,
          lon,
          limit: 1,
          appid: this.apiKey
        }
      });

      if (response.data.length === 0) {
        throw new Error('Location not found');
      }

      const location = response.data[0];
      return {
        address: `${location.name}, ${location.state || ''}, ${location.country}`.replace(/, ,/, ','),
        city: location.name,
        country: location.country,
        lat: location.lat,
        lon: location.lon
      };
    } catch (error) {
      if (!this.apiKey || error.response?.status === 401) {
        return await this.nominatimReverse(lat, lon);
      }
      throw new Error(`Reverse geocoding error: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = new WeatherService();
