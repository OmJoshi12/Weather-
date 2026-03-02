const WeatherRecord = require('../models/WeatherRecord');

const sampleWeatherRecords = [
  {
    location: {
      type: 'Point',
      coordinates: [-0.1278, 51.5074], // London
      address: 'London, United Kingdom',
      city: 'London',
      country: 'United Kingdom'
    },
    weatherData: {
      current: {
        temperature: 18.5,
        feelsLike: 17.2,
        humidity: 65,
        pressure: 1013,
        windSpeed: 4.2,
        windDirection: 230,
        visibility: 10000,
        uvIndex: 5,
        condition: 'Clouds',
        description: 'partly cloudy',
        icon: '02d'
      },
      forecast: [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          temperature: { min: 14, max: 20 },
          humidity: 70,
          windSpeed: 3.8,
          condition: 'Clouds',
          description: 'scattered clouds',
          icon: '03d'
        },
        {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          temperature: { min: 12, max: 18 },
          humidity: 80,
          windSpeed: 5.1,
          condition: 'Rain',
          description: 'light rain',
          icon: '10d'
        },
        {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          temperature: { min: 15, max: 22 },
          humidity: 60,
          windSpeed: 2.9,
          condition: 'Clear',
          description: 'clear sky',
          icon: '01d'
        },
        {
          date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          temperature: { min: 16, max: 21 },
          humidity: 68,
          windSpeed: 4.5,
          condition: 'Clouds',
          description: 'overcast clouds',
          icon: '04d'
        },
        {
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          temperature: { min: 13, max: 19 },
          humidity: 75,
          windSpeed: 6.2,
          condition: 'Rain',
          description: 'moderate rain',
          icon: '10d'
        }
      ]
    },
    dateRange: {
      start: new Date(),
      end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  },
  {
    location: {
      type: 'Point',
      coordinates: [-74.0060, 40.7128], // New York
      address: 'New York, NY, USA',
      city: 'New York',
      country: 'United States'
    },
    weatherData: {
      current: {
        temperature: 22.3,
        feelsLike: 24.1,
        humidity: 58,
        pressure: 1015,
        windSpeed: 3.5,
        windDirection: 180,
        visibility: 16093,
        uvIndex: 7,
        condition: 'Clear',
        description: 'clear sky',
        icon: '01d'
      },
      forecast: [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          temperature: { min: 18, max: 25 },
          humidity: 55,
          windSpeed: 4.1,
          condition: 'Clear',
          description: 'clear sky',
          icon: '01d'
        },
        {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          temperature: { min: 20, max: 27 },
          humidity: 62,
          windSpeed: 3.2,
          condition: 'Clouds',
          description: 'few clouds',
          icon: '02d'
        },
        {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          temperature: { min: 19, max: 26 },
          humidity: 68,
          windSpeed: 5.5,
          condition: 'Clouds',
          description: 'broken clouds',
          icon: '04d'
        },
        {
          date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          temperature: { min: 17, max: 23 },
          humidity: 72,
          windSpeed: 6.8,
          condition: 'Rain',
          description: 'shower rain',
          icon: '09d'
        },
        {
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          temperature: { min: 16, max: 22 },
          humidity: 65,
          windSpeed: 4.3,
          condition: 'Clouds',
          description: 'scattered clouds',
          icon: '03d'
        }
      ]
    },
    dateRange: {
      start: new Date(),
      end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  },
  {
    location: {
      type: 'Point',
      coordinates: [139.6917, 35.6895], // Tokyo
      address: 'Tokyo, Japan',
      city: 'Tokyo',
      country: 'Japan'
    },
    weatherData: {
      current: {
        temperature: 26.8,
        feelsLike: 28.9,
        humidity: 72,
        pressure: 1010,
        windSpeed: 2.8,
        windDirection: 90,
        visibility: 8000,
        uvIndex: 8,
        condition: 'Clouds',
        description: 'few clouds',
        icon: '02d'
      },
      forecast: [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          temperature: { min: 22, max: 28 },
          humidity: 75,
          windSpeed: 3.1,
          condition: 'Clouds',
          description: 'scattered clouds',
          icon: '03d'
        },
        {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          temperature: { min: 24, max: 30 },
          humidity: 68,
          windSpeed: 2.5,
          condition: 'Clear',
          description: 'clear sky',
          icon: '01d'
        },
        {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          temperature: { min: 23, max: 29 },
          humidity: 70,
          windSpeed: 4.2,
          condition: 'Clouds',
          description: 'broken clouds',
          icon: '04d'
        },
        {
          date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          temperature: { min: 21, max: 27 },
          humidity: 78,
          windSpeed: 5.8,
          condition: 'Rain',
          description: 'light rain',
          icon: '10d'
        },
        {
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          temperature: { min: 20, max: 26 },
          humidity: 80,
          windSpeed: 6.1,
          condition: 'Clouds',
          description: 'overcast clouds',
          icon: '04d'
        }
      ]
    },
    dateRange: {
      start: new Date(),
      end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  },
  {
    location: {
      type: 'Point',
      coordinates: [2.3522, 48.8566], // Paris
      address: 'Paris, France',
      city: 'Paris',
      country: 'France'
    },
    weatherData: {
      current: {
        temperature: 20.4,
        feelsLike: 19.8,
        humidity: 61,
        pressure: 1018,
        windSpeed: 3.9,
        windDirection: 270,
        visibility: 12000,
        uvIndex: 6,
        condition: 'Clear',
        description: 'clear sky',
        icon: '01d'
      },
      forecast: [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          temperature: { min: 16, max: 22 },
          humidity: 58,
          windSpeed: 3.2,
          condition: 'Clear',
          description: 'clear sky',
          icon: '01d'
        },
        {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          temperature: { min: 17, max: 24 },
          humidity: 62,
          windSpeed: 4.5,
          condition: 'Clouds',
          description: 'few clouds',
          icon: '02d'
        },
        {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          temperature: { min: 15, max: 21 },
          humidity: 70,
          windSpeed: 5.2,
          condition: 'Rain',
          description: 'moderate rain',
          icon: '10d'
        },
        {
          date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          temperature: { min: 14, max: 20 },
          humidity: 75,
          windSpeed: 6.3,
          condition: 'Clouds',
          description: 'overcast clouds',
          icon: '04d'
        },
        {
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          temperature: { min: 16, max: 23 },
          humidity: 65,
          windSpeed: 4.1,
          condition: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }
      ]
    },
    dateRange: {
      start: new Date(),
      end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  },
  {
    location: {
      type: 'Point',
      coordinates: [-118.2437, 34.0522], // Los Angeles
      address: 'Los Angeles, CA, USA',
      city: 'Los Angeles',
      country: 'United States'
    },
    weatherData: {
      current: {
        temperature: 28.7,
        feelsLike: 29.3,
        humidity: 45,
        pressure: 1012,
        windSpeed: 2.1,
        windDirection: 225,
        visibility: 15000,
        uvIndex: 9,
        condition: 'Clear',
        description: 'clear sky',
        icon: '01d'
      },
      forecast: [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          temperature: { min: 22, max: 30 },
          humidity: 42,
          windSpeed: 2.5,
          condition: 'Clear',
          description: 'clear sky',
          icon: '01d'
        },
        {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          temperature: { min: 21, max: 31 },
          humidity: 38,
          windSpeed: 3.1,
          condition: 'Clear',
          description: 'clear sky',
          icon: '01d'
        },
        {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          temperature: { min: 20, max: 29 },
          humidity: 45,
          windSpeed: 4.2,
          condition: 'Clouds',
          description: 'few clouds',
          icon: '02d'
        },
        {
          date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          temperature: { min: 19, max: 27 },
          humidity: 52,
          windSpeed: 5.8,
          condition: 'Clouds',
          description: 'scattered clouds',
          icon: '03d'
        },
        {
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          temperature: { min: 18, max: 26 },
          humidity: 48,
          windSpeed: 4.5,
          condition: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }
      ]
    },
    dateRange: {
      start: new Date(),
      end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  }
];

async function seedSampleData() {
  try {
    // Clear existing records
    await WeatherRecord.deleteMany({});
    console.log('Cleared existing weather records');

    // Insert sample records
    const insertedRecords = await WeatherRecord.insertMany(sampleWeatherRecords);
    console.log(`Inserted ${insertedRecords.length} sample weather records`);
    
    return insertedRecords;
  } catch (error) {
    console.error('Error seeding sample data:', error);
    throw error;
  }
}

module.exports = { seedSampleData, sampleWeatherRecords };
