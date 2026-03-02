const mongoose = require('mongoose');

const weatherRecordSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: String,
    country: String
  },
  weatherData: {
    current: {
      temperature: Number,
      feelsLike: Number,
      humidity: Number,
      pressure: Number,
      windSpeed: Number,
      windDirection: Number,
      visibility: Number,
      uvIndex: Number,
      condition: String,
      description: String,
      icon: String
    },
    forecast: [{
      date: Date,
      temperature: {
        min: Number,
        max: Number
      },
      humidity: Number,
      windSpeed: Number,
      condition: String,
      description: String,
      icon: String
    }]
  },
  dateRange: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for location-based queries
weatherRecordSchema.index({ 'location.coordinates': '2dsphere' });

// Index for date range queries
weatherRecordSchema.index({ 'dateRange.start': 1, 'dateRange.end': 1 });

// Update the updatedAt field on save
weatherRecordSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('WeatherRecord', weatherRecordSchema);
