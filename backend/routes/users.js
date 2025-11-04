const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireOwnership } = require('../middleware/auth');

// GET /api/users/:id - Get specific user (authentication required)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const user = await User.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// GET /api/users/:id/bookings - Get user with their bookings (requires ownership)
router.get('/:id/bookings', requireOwnership('id'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const userWithBookings = await User.getUserWithBookings(userId);
    
    if (!userWithBookings) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: userWithBookings
    });
  } catch (error) {
    console.error('Error fetching user with bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user with bookings',
      error: error.message
    });
  }
});

// GET /api/users/username/:username - Get user by username
router.get('/username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.getUserByUsername(username);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user by username:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user by username',
      error: error.message
    });
  }
});

module.exports = router;