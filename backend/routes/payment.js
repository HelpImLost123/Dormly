const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const paymentService = require('../services/paymentService');

// POST /api/payment/create-charge - Create a payment charge and update booking
router.post('/create-charge', requireAuth, async (req, res) => {
  try {
    const { token, amount, bookingId, description } = req.body;
    const userId = req.session.user.user_id;

    // Validate required fields
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Payment token is required'
      });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment amount is required'
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }

    // Process payment
    const result = await paymentService.processPayment({
      token,
      amount,
      bookingId,
      userId,
      description
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Payment route error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment processing failed',
      error: error.message
    });
  }
});

// GET /api/payment/verify/:chargeId - Verify a charge status
router.get('/verify/:chargeId', requireAuth, async (req, res) => {
  try {
    const { chargeId } = req.params;

    if (!chargeId) {
      return res.status(400).json({
        success: false,
        message: 'Charge ID is required'
      });
    }

    const charge = await paymentService.verifyCharge(chargeId);

    res.json({
      success: true,
      charge: {
        id: charge.id,
        amount: charge.amount,
        currency: charge.currency,
        status: charge.status,
        created: charge.created,
        paid: charge.paid
      }
    });
  } catch (error) {
    console.error('Charge verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Charge verification failed',
      error: error.message
    });
  }
});

module.exports = router;
