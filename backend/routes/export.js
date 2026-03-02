const express = require('express');
const router = express.Router();
const WeatherRecord = require('../models/WeatherRecord');

// GET /api/export/json - Export all weather records as JSON
router.get('/json', async (req, res, next) => {
  try {
    const records = await WeatherRecord.find().sort({ createdAt: -1 });
    
    const exportData = {
      exportDate: new Date().toISOString(),
      totalRecords: records.length,
      records: records.map(record => ({
        id: record._id,
        location: {
          address: record.location.address,
          city: record.location.city,
          country: record.location.country,
          coordinates: record.location.coordinates
        },
        weatherData: record.weatherData,
        dateRange: record.dateRange,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      }))
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=weather-records.json');
    res.json(exportData);
  } catch (error) {
    next(error);
  }
});

// GET /api/export/csv - Export all weather records as CSV
router.get('/csv', async (req, res, next) => {
  try {
    const records = await WeatherRecord.find().sort({ createdAt: -1 });
    
    // CSV headers
    const headers = [
      'ID',
      'Address',
      'City',
      'Country',
      'Latitude',
      'Longitude',
      'Current Temperature (°C)',
      'Current Condition',
      'Current Humidity (%)',
      'Current Wind Speed (m/s)',
      'Date Range Start',
      'Date Range End',
      'Created At'
    ];

    // Convert records to CSV rows
    const csvRows = records.map(record => [
      record._id,
      `"${record.location.address}"`,
      `"${record.location.city || ''}"`,
      `"${record.location.country || ''}"`,
      record.location.coordinates[1], // latitude
      record.location.coordinates[0], // longitude
      record.weatherData.current.temperature,
      `"${record.weatherData.current.condition}"`,
      record.weatherData.current.humidity,
      record.weatherData.current.windSpeed,
      record.dateRange.start.toISOString(),
      record.dateRange.end.toISOString(),
      record.createdAt.toISOString()
    ]);

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=weather-records.csv');
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
});

// GET /api/export/markdown - Export all weather records as Markdown
router.get('/markdown', async (req, res, next) => {
  try {
    const records = await WeatherRecord.find().sort({ createdAt: -1 });
    
    let markdown = `# Weather Records Export\n\n`;
    markdown += `**Export Date:** ${new Date().toISOString()}\n`;
    markdown += `**Total Records:** ${records.length}\n\n`;

    records.forEach((record, index) => {
      markdown += `## ${index + 1}. ${record.location.address}\n\n`;
      markdown += `- **City:** ${record.location.city || 'N/A'}\n`;
      markdown += `- **Country:** ${record.location.country || 'N/A'}\n`;
      markdown += `- **Coordinates:** ${record.location.coordinates[1]}, ${record.location.coordinates[0]}\n`;
      markdown += `- **Date Range:** ${record.dateRange.start.toDateString()} - ${record.dateRange.end.toDateString()}\n\n`;
      
      markdown += `### Current Weather\n\n`;
      markdown += `- **Temperature:** ${record.weatherData.current.temperature}°C\n`;
      markdown += `- **Feels Like:** ${record.weatherData.current.feelsLike}°C\n`;
      markdown += `- **Condition:** ${record.weatherData.current.condition}\n`;
      markdown += `- **Description:** ${record.weatherData.current.description}\n`;
      markdown += `- **Humidity:** ${record.weatherData.current.humidity}%\n`;
      markdown += `- **Wind Speed:** ${record.weatherData.current.windSpeed} m/s\n\n`;
      
      markdown += `### 5-Day Forecast\n\n`;
      markdown += `| Date | Min Temp | Max Temp | Condition | Humidity | Wind Speed |\n`;
      markdown += `|------|----------|----------|-----------|----------|------------|\n`;
      
      record.weatherData.forecast.forEach(day => {
        markdown += `| ${day.date.toDateString()} | ${day.temperature.min}°C | ${day.temperature.max}°C | ${day.condition} | ${day.humidity}% | ${day.windSpeed} m/s |\n`;
      });
      
      markdown += `\n---\n\n`;
    });

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', 'attachment; filename=weather-records.md');
    res.send(markdown);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
