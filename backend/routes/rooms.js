const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { requireAuth } = require('../middleware/auth');

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

// PUT /api/rooms/:id - Update room status and/or current occupancy (requires authentication and ownership)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const roomId = parseInt(req.params.id);
    const userId = req.session.user.user_id;
    const { status, cur_occupancy } = req.body;
    
    if (isNaN(roomId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid room ID'
      });
    }

    // Check if at least one field is provided
    if (status === undefined && cur_occupancy === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (status or cur_occupancy) is required'
      });
    }

    // Check if user owns the room
    const isOwner = await Room.isRoomOwnedByUser(roomId, userId);
    
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only update rooms in dorms you own'
      });
    }

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (cur_occupancy !== undefined) updateData.cur_occupancy = cur_occupancy;

    const room = await Room.updateRoom(roomId, updateData);
    
    res.json({
      success: true,
      data: room,
      message: 'Room updated successfully'
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating room',
      error: error.message
    });
  }
});

module.exports = router;