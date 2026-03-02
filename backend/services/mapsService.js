const axios = require('axios');

class MapsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  async getStaticMapUrl(lat, lon, zoom = 10, size = '600x400') {
    try {
      if (!this.apiKey) {
        return `https://via.placeholder.com/${size}?text=Map+Unavailable`;
      }
      const params = new URLSearchParams({
        center: `${lat},${lon}`,
        zoom: String(zoom),
        size: String(size),
        maptype: 'roadmap',
        markers: `color:red|${lat},${lon}`,
        key: this.apiKey
      });

      return `${this.baseUrl}/staticmap?${params.toString()}`;
    } catch (error) {
      throw new Error(`Maps API error: ${error.message}`);
    }
  }

  async getPlaceDetails(query) {
    try {
      const response = await axios.get(`${this.baseUrl}/place/textsearch/json`, {
        params: {
          query,
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Places API error: ${response.data.status}`);
      }

      return response.data.results.map(place => ({
        name: place.name,
        address: place.formatted_address,
        location: {
          lat: place.geometry.location.lat,
          lon: place.geometry.location.lng
        },
        types: place.types,
        rating: place.rating,
        placeId: place.place_id
      }));
    } catch (error) {
      throw new Error(`Places API error: ${error.response?.data?.message || error.message}`);
    }
  }

  async getNearbyPlaces(lat, lon, type = 'point_of_interest', radius = 5000) {
    try {
      const response = await axios.get(`${this.baseUrl}/place/nearbysearch/json`, {
        params: {
          location: `${lat},${lon}`,
          radius,
          type,
          key: this.apiKey
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Nearby places API error: ${response.data.status}`);
      }

      return response.data.results.map(place => ({
        name: place.name,
        address: place.vicinity,
        location: {
          lat: place.geometry.location.lat,
          lon: place.geometry.location.lng
        },
        types: place.types,
        rating: place.rating,
        placeId: place.place_id
      }));
    } catch (error) {
      throw new Error(`Nearby places API error: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = new MapsService();
