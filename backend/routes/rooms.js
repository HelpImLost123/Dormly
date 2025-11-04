const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// GET /api/rooms/dorm/:dormId - Get all rooms for a specific dorm
router.get('/dorm/:dormId', async (req, res) => {
  try {
    const dormId = parseInt(req.params.dormId);
    
    if (isNaN(dormId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dorm ID'
      });
    }
    
    const rooms = await Room.getRoomsByDormId(dormId);
    
    res.json({
      success: true,
      data: rooms,
      count: rooms.length
    });
  } catch (error) {
    console.error('Error fetching rooms for dorm:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching rooms for dorm',
      error: error.message
    });
  }
});

// GET /api/rooms/dorm/:dormId/available - Get available rooms for a specific dorm
router.get('/dorm/:dormId/available', async (req, res) => {
  try {
    const dormId = parseInt(req.params.dormId);
    
    if (isNaN(dormId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dorm ID'
      });
    }
    
    const rooms = await Room.getAvailableRoomsByDormId(dormId);
    
    res.json({
      success: true,
      data: rooms,
      count: rooms.length
    });
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching available rooms',
      error: error.message
    });
  }
});

// GET /api/rooms/:id - Get specific room by ID
router.get('/:id', async (req, res) => {
  try {
    const roomId = parseInt(req.params.id);
    
    if (isNaN(roomId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid room ID'
      });
    }
    
    const room = await Room.getRoomById(roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching room',
      error: error.message
    });
  }
});

module.exports = router;