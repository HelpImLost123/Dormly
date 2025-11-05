const express = require('express');
const router = express.Router();
const Dorm = require('../models/Dorm');

// Advanced search endpoint for dorms with comprehensive filtering
router.post('/', async (req, res) => {
  try {
    const filters = {
      // Location-based search
      lat: req.body.lat !== undefined ? parseFloat(req.body.lat) : undefined,
      lng: req.body.lng !== undefined ? parseFloat(req.body.lng) : undefined,
      radiusKm: req.body.radiusKm ? parseFloat(req.body.radiusKm) : 10,
      
      // Price filtering
      priceMin: req.body.priceMin !== undefined ? parseFloat(req.body.priceMin) : undefined,
      priceMax: req.body.priceMax !== undefined ? parseFloat(req.body.priceMax) : undefined,
      
      // Availability filtering
      hasAvailableRooms: req.body.hasAvailableRooms !== false,
      
      // Text search
      searchText: req.body.searchText || req.body.q || undefined,
      
      // Facility filtering (array of facility names)
      facilities: Array.isArray(req.body.facilities) ? req.body.facilities : [],
      
      // Pagination
      limit: req.body.limit ? parseInt(req.body.limit) : 50,
      offset: req.body.offset ? parseInt(req.body.offset) : 0
    };

    // Validate pagination
    if (filters.limit < 1 || filters.limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100'
      });
    }

    const dorms = await Dorm.searchDorms(filters);

    res.json({
      success: true,
      data: dorms,
      count: dorms.length,
      filters: filters,
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        hasMore: dorms.length === filters.limit
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error performing search',
      error: error.message
    });
  }
});

module.exports = router;