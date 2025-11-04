const pool = require('../config/database');

class Booking {
  // Validate booking data
  static validateBookingData(bookingData) {
    const errors = [];
    
    if (!bookingData.room_id || isNaN(bookingData.room_id)) {
      errors.push('Valid room ID is required');
    }
    
    if (!bookingData.begin_at) {
      errors.push('Start date is required');
    }
    
    if (!bookingData.end_at) {
      errors.push('End date is required');
    }
    
    // Validate dates
    const beginDate = new Date(bookingData.begin_at);
    const endDate = new Date(bookingData.end_at);
    const now = new Date();
    
    if (isNaN(beginDate.getTime())) {
      errors.push('Invalid start date');
    }
    
    if (isNaN(endDate.getTime())) {
      errors.push('Invalid end date');
    }
    
    if (beginDate < now) {
      errors.push('Start date cannot be in the past');
    }
    
    if (endDate <= beginDate) {
      errors.push('End date must be after start date');
    }
    
    return errors;
  }

  // Get booking by ID (for viewing booking details)
  static async getBookingById(bookingId) {
    try {
      if (!bookingId || isNaN(bookingId)) {
        throw new Error('Invalid booking ID');
      }

      const query = `
        SELECT 
          b.*,
          u.f_name || ' ' || u.l_name as booker_name,
          u.email as booker_email,
          r.room_name,
          rt.room_type_name,
          rt.room_type_desc,
          rt.rent_per_month,
          rt.rent_per_day,
          d.dorm_id,
          d.dorm_name,
          d.address,
          d.tel,
          d.line_id
        FROM "DormBookings" b
        JOIN "Users" u ON b.booker_id = u.user_id
        JOIN "Rooms" r ON b.room_id = r.room_id
        JOIN "RoomTypes" rt ON r.room_type_id = rt.room_type_id
        JOIN "Dorms" d ON rt.dorm_id = d.dorm_id
        WHERE b.booking_id = $1
      `;
      const result = await pool.query(query, [bookingId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      throw error;
    }
  }

  // Get bookings by user ID (for viewing user's bookings)
  static async getBookingsByUserId(userId) {
    try {
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }

      const query = `
        SELECT 
          b.*,
          r.room_name,
          rt.room_type_name,
          rt.rent_per_month,
          rt.rent_per_day,
          d.dorm_id,
          d.dorm_name,
          d.address,
          d.tel
        FROM "DormBookings" b
        JOIN "Rooms" r ON b.room_id = r.room_id
        JOIN "RoomTypes" rt ON r.room_type_id = rt.room_type_id
        JOIN "Dorms" d ON rt.dorm_id = d.dorm_id
        WHERE b.booker_id = $1
        ORDER BY b.created_at DESC
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching bookings by user ID:', error);
      throw error;
    }
  }

  // Check if room has conflicting bookings
  static async hasConflictingBooking(roomId, beginAt, endAt, excludeBookingId = null) {
    try {
      let query = `
        SELECT booking_id 
        FROM "DormBookings"
        WHERE room_id = $1
        AND status NOT IN ('cancelled', 'rejected')
        AND (
          (begin_at <= $2 AND end_at > $2) OR
          (begin_at < $3 AND end_at >= $3) OR
          (begin_at >= $2 AND end_at <= $3)
        )
      `;
      
      const params = [roomId, beginAt, endAt];
      
      if (excludeBookingId) {
        query += ` AND booking_id != $4`;
        params.push(excludeBookingId);
      }
      
      const result = await pool.query(query, params);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking conflicting bookings:', error);
      throw error;
    }
  }

  // Create a new booking
  static async createBooking(bookingData, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Validate input data
      const validationErrors = this.validateBookingData(bookingData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }

      const { room_id, begin_at, end_at } = bookingData;

      // Check if room exists and is available
      const roomCheck = await client.query(
        'SELECT status FROM "Rooms" WHERE room_id = $1',
        [room_id]
      );

      if (roomCheck.rows.length === 0) {
        throw new Error('Room not found');
      }

      if (roomCheck.rows[0].status !== 'available') {
        throw new Error('Room is not available');
      }

      // Check for conflicting bookings
      const hasConflict = await this.hasConflictingBooking(room_id, begin_at, end_at);
      if (hasConflict) {
        throw new Error('Room is already booked for the selected dates');
      }

      // Create booking
      const query = `
        INSERT INTO "DormBookings" (booker_id, room_id, begin_at, end_at, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const result = await client.query(query, [
        userId, 
        room_id, 
        begin_at, 
        end_at, 
        'pending'
      ]);

      // Update room status to occupied
      await client.query(
        'UPDATE "Rooms" SET status = $1 WHERE room_id = $2',
        ['occupied', room_id]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating booking:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Cancel a booking
  static async cancelBooking(bookingId, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      if (!bookingId || isNaN(bookingId)) {
        throw new Error('Invalid booking ID');
      }

      // Check if booking exists and belongs to user
      const bookingCheck = await client.query(
        'SELECT room_id, booker_id, status FROM "DormBookings" WHERE booking_id = $1',
        [bookingId]
      );

      if (bookingCheck.rows.length === 0) {
        throw new Error('Booking not found');
      }

      if (bookingCheck.rows[0].booker_id !== userId) {
        throw new Error('Unauthorized: You can only cancel your own bookings');
      }

      if (bookingCheck.rows[0].status === 'cancelled') {
        throw new Error('Booking is already cancelled');
      }

      const roomId = bookingCheck.rows[0].room_id;

      // Update booking status
      const result = await client.query(
        'UPDATE "DormBookings" SET status = $1 WHERE booking_id = $2 RETURNING *',
        ['cancelled', bookingId]
      );

      // Update room status back to available
      await client.query(
        'UPDATE "Rooms" SET status = $1 WHERE room_id = $2',
        ['available', roomId]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error cancelling booking:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Booking;