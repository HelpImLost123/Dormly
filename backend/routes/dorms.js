const express = require('express');
const router = express.Router();
const Dorm = require('../models/Dorm'); // 💡 Import โมเดล
const { requireAuth } = require('../middleware/auth');

// POST /api/dorms/search - Search dorms
router.post('/search', async (req, res) => {
  try {
    const filters = {
      lat: req.body.lat ? parseFloat(req.body.lat) : undefined,
      lng: req.body.lng ? parseFloat(req.body.lng) : undefined,
      radiusKm: req.body.radius ? parseFloat(req.body.radius) : 10,
      priceMin: req.body.priceMin ? parseFloat(req.body.priceMin) : 0,
      priceMax: req.body.priceMax ? parseFloat(req.body.priceMax) : 999999,
      hasAvailableRooms: req.body.hasAvailableRooms !== false
    };
    const dorms = await Dorm.searchDorms(filters);
    res.json({ success: true, data: dorms, count: dorms.length, filters: filters });
  } catch (error) {
    console.error('Error searching dorms:', error);
    res.status(500).json({ success: false, message: 'Error searching dorms', error: error.message });
  }
});

// GET /api/dorms/:id - Get specific dorm
router.get('/:id', async (req, res) => {
  try {
    const dormId = parseInt(req.params.id);
    if (isNaN(dormId)) {
      return res.status(400).json({ success: false, message: 'Invalid dorm ID' });
    }
    
    // 💡 เรียกใช้ฟังก์ชันจาก Model
    const dorm = await Dorm.getDormById(dormId); 
    
    if (!dorm) {
      return res.status(404).json({ success: false, message: 'Dorm not found' });
    }
    res.json({ success: true, data: dorm });
  } catch (error) {
    console.error('Error fetching dorm:', error);
    res.status(500).json({ success: false, message: 'Error fetching dorm', error: error.message });
  }
});

// POST /api/dorms - Create new dorm
router.post('/', requireAuth, async (req, res) => {
  try {
    const dormData = req.body;
    const userId = req.session.user.user_id;
    const newDorm = await Dorm.createDorm(dormData, userId);
    res.status(201).json({ success: true, message: 'Dorm registered successfully', data: newDorm });
  } catch (error) {
    console.error('Error creating dorm:', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating dorm', error: error.message });
  }
});

// 💡💡💡 ต้อง export "router" 💡💡💡
module.exports = router;