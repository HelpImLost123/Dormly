const omise = require('omise');
const pool = require('../config/database');

// Initialize Omise client
let omiseClient = null;

const initializeOmise = () => {
  if (!process.env.OMISE_SECRET_KEY) {
    console.warn('*** WARNING: OMISE_SECRET_KEY is not defined in .env file ***');
    console.warn('*** Payment API will FAIL ***');
    return null;
  }

  if (!omiseClient) {
    omiseClient = omise({
      secretKey: process.env.OMISE_SECRET_KEY,
      apiVersion: '2019-05-29',
    });
    console.log('✓ Omise client initialized successfully');
  }

  return omiseClient;
};

// Process payment and update booking status
const processPayment = async (paymentData) => {
  const { token, amount, bookingId, userId, description } = paymentData;

  // Validate required fields
  if (!token || !amount) {
    throw new Error('Token and amount are required');
  }

  if (!bookingId || isNaN(bookingId)) {
    throw new Error('Valid booking ID is required');
  }

  if (!omiseClient) {
    throw new Error('Omise client is not initialized');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verify booking exists and is in correct status
    const bookingCheck = await client.query(
      `SELECT 
        b.booking_id, 
        b.booker_id, 
        b.status, 
        b.room_id,
        r.room_name,
        d.dorm_name
      FROM "DormBookings" b
      JOIN "Rooms" r ON b.room_id = r.room_id
      JOIN "RoomTypes" rt ON r.room_type_id = rt.room_type_id
      JOIN "Dorms" d ON rt.dorm_id = d.dorm_id
      WHERE b.booking_id = $1`,
      [bookingId]
    );

    if (bookingCheck.rows.length === 0) {
      throw new Error('Booking not found');
    }

    const booking = bookingCheck.rows[0];

    // Verify user owns this booking
    if (userId && booking.booker_id !== userId) {
      throw new Error('Unauthorized: This booking does not belong to you');
    }

    // Check if booking is in correct status for payment
    if (booking.status !== 'รอการชำระเงินมัดจำ') {
      throw new Error(`Cannot process payment. Current booking status: ${booking.status}`);
    }

    // 2. Create charge with Omise
    const charge = await omiseClient.charges.create({
      amount: amount,
      currency: 'thb',
      card: token,
      description: description || `Dormly - ${booking.dorm_name}, ${booking.room_name} (Booking #${bookingId})`,
      metadata: {
        booking_id: bookingId,
        user_id: userId,
        room_id: booking.room_id
      }
    });

    // 3. Check if payment was successful
    if (charge.status === 'successful') {
      // Update booking status to "paid deposit"
      const updateResult = await client.query(
        `UPDATE "DormBookings" 
         SET status = $1 
         WHERE booking_id = $2 
         RETURNING *`,
        ['ชำระเงินมัดจำแล้ว', bookingId]
      );

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Payment processed and booking confirmed',
        booking: updateResult.rows[0],
        charge: {
          id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          status: charge.status,
          created: charge.created
        }
      };
    } else {
      // Payment failed
      await client.query('ROLLBACK');
      
      return {
        success: false,
        message: charge.failure_message || 'Payment failed',
        failureCode: charge.failure_code
      };
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Payment processing error:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Create a charge (for backward compatibility)
const createCharge = async (chargeData) => {
  if (!omiseClient) {
    throw new Error('Omise client is not initialized');
  }

  try {
    const charge = await omiseClient.charges.create(chargeData);
    return charge;
  } catch (error) {
    console.error('Omise charge creation error:', error);
    throw error;
  }
};

// Verify charge status
const verifyCharge = async (chargeId) => {
  if (!omiseClient) {
    throw new Error('Omise client is not initialized');
  }

  try {
    const charge = await omiseClient.charges.retrieve(chargeId);
    return charge;
  } catch (error) {
    console.error('Omise charge verification error:', error);
    throw error;
  }
};

module.exports = {
  initializeOmise,
  processPayment,
  createCharge,
  verifyCharge
};
