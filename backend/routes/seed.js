const express = require('express');
const router = express.Router();
const { seedSampleData } = require('../services/sampleData');

// POST /api/seed/sample - Seed sample weather data
router.post('/sample', async (req, res, next) => {
  try {
    const records = await seedSampleData();
    res.status(201).json({
      message: 'Sample data seeded successfully',
      count: records.length,
      records: records
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
