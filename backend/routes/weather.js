const express = require('express');
const router = express.Router();
const WeatherRecord = require('../models/WeatherRecord');
const weatherService = require('../services/weatherService');
const Joi = require('joi');

// Validation schemas
const locationSchema = Joi.object({
  query: Joi.string(),
  lat: Joi.number().min(-90).max(90),
  lon: Joi.number().min(-180).max(180)
})
.or('query', 'lat')
.with('lat', 'lon')
.with('lon', 'lat');

const weatherRecordSchema = Joi.object({
  location: Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
    address: Joi.string().required(),
    city: Joi.string(),
    country: Joi.string()
  }).required(),
  dateRange: Joi.object({
    start: Joi.date().required(),
    end: Joi.date().min(Joi.ref('start')).required()
  }).required()
});

// GET /api/weather/search - Search for locations
router.get('/search', async (req, res, next) => {
  try {
    const { error, value } = locationSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let locations;
    if (value.lat && value.lon) {
      // Reverse geocoding
      const location = await weatherService.reverseGeocode(value.lat, value.lon);
      locations = [location];
    } else {
      // Text search
      locations = await weatherService.searchLocation(value.query);
    }

    res.json({ locations });
  } catch (error) {
    next(error);
  }
});

// GET /api/weather/current - Get current weather for a location
router.get('/current', async (req, res, next) => {
  try {
    const schema = Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lon: Joi.number().min(-180).max(180).required()
    });

    const { error, value } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const weather = await weatherService.getCurrentWeather(value.lat, value.lon);
    res.json({ weather });
  } catch (error) {
    next(error);
  }
});

// GET /api/weather/forecast - Get 5-day forecast for a location
router.get('/forecast', async (req, res, next) => {
  try {
    const schema = Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lon: Joi.number().min(-180).max(180).required(),
      days: Joi.number().min(1).max(5).default(5)
    });

    const { error, value } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const forecast = await weatherService.getForecast(value.lat, value.lon, value.days);
    res.json({ forecast });
  } catch (error) {
    next(error);
  }
});

// GET /api/weather/records - Get all weather records
router.get('/records', async (req, res, next) => {
  try {
    const records = await WeatherRecord.find()
      .sort({ createdAt: -1 })
      .limit(50); // Limit to prevent large responses

    res.json({ records });
  } catch (error) {
    next(error);
  }
});

// GET /api/weather/records/:id - Get a specific weather record
router.get('/records/:id', async (req, res, next) => {
  try {
    const record = await WeatherRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Weather record not found' });
    }

    res.json({ record });
  } catch (error) {
    next(error);
  }
});

// POST /api/weather/records - Create a new weather record
router.post('/records', async (req, res, next) => {
  try {
    const { error, value } = weatherRecordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Fetch weather data
    const [lon, lat] = value.location.coordinates;
    const currentWeather = await weatherService.getCurrentWeather(lat, lon);
    const forecast = await weatherService.getForecast(lat, lon);

    const weatherRecord = new WeatherRecord({
      ...value,
      weatherData: {
        current: currentWeather,
        forecast
      }
    });

    await weatherRecord.save();
    res.status(201).json({ record: weatherRecord });
  } catch (error) {
    next(error);
  }
});

// PUT /api/weather/records/:id - Update a weather record
router.put('/records/:id', async (req, res, next) => {
  try {
    const updateSchema = Joi.object({
      location: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required(),
        address: Joi.string().required(),
        city: Joi.string(),
        country: Joi.string()
      }),
      dateRange: Joi.object({
        start: Joi.date().required(),
        end: Joi.date().min(Joi.ref('start')).required()
      })
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const record = await WeatherRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Weather record not found' });
    }

    // If location changed, refetch weather data
    if (value.location && 
        (value.location.coordinates[0] !== record.location.coordinates[0] ||
         value.location.coordinates[1] !== record.location.coordinates[1])) {
      
      const [lon, lat] = value.location.coordinates;
      const currentWeather = await weatherService.getCurrentWeather(lat, lon);
      const forecast = await weatherService.getForecast(lat, lon);

      record.weatherData = {
        current: currentWeather,
        forecast
      };
    }

    // Update fields
    if (value.location) record.location = value.location;
    if (value.dateRange) record.dateRange = value.dateRange;

    await record.save();
    res.json({ record });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/weather/records/:id - Delete a weather record
router.delete('/records/:id', async (req, res, next) => {
  try {
    const record = await WeatherRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Weather record not found' });
    }

    res.json({ message: 'Weather record deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
