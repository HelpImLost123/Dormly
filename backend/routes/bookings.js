const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { requireAuth } = require('../middleware/auth');

// GET /api/bookings/my - Get current user's bookings (requires authentication)
router.get('/my', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const bookings = await Booking.getBookingsByUserId(userId);
    
    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user bookings',
      error: error.message
    });
  }
});

// GET /api/bookings/:id - Get specific booking by ID (requires authentication)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    
    if (isNaN(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }
    
    const booking = await Booking.getBookingById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if booking belongs to current user
    if (booking.booker_id !== req.session.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own bookings'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching booking',
      error: error.message
    });
  }
});

// POST /api/bookings - Create a new booking (requires authentication)
router.post('/', requireAuth, async (req, res) => {
  try {
    const bookingData = req.body;
    const userId = req.session.user.user_id;
    
    // Validation is handled in the model
    const booking = await Booking.createBooking(bookingData, userId);
    
    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating booking',
      error: error.message
    });
  }
});

// DELETE /api/bookings/:id - Cancel a booking (requires authentication)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const userId = req.session.user.user_id;
    
    if (isNaN(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }
    
    const booking = await Booking.cancelBooking(bookingId, userId);
    
    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error cancelling booking',
      error: error.message
    });
  }
});

module.exports = router;