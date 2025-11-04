const pool = require('../config/database');

class Room {
  // Get room by ID with complete information (for viewing specific room details)
  static async getRoomById(roomId) {
    try {
      if (!roomId || isNaN(roomId)) {
        throw new Error('Invalid room ID');
      }

      const query = `
        SELECT 
          r.*,
          rt.room_type_name,
          rt.room_type_desc,
          rt.rent_per_month,
          rt.rent_per_day,
          d.dorm_id,
          d.dorm_name,
          d.lat,
          d.long,
          d.address,
          d.soi,
          d.moo,
          d.road,
          d.prov,
          d.dist,
          d.subdist,
          d.postal_code,
          d.tel,
          d.line_id,
          d.medias,
          COALESCE(array_agg(DISTINCT f.faci_name) FILTER (WHERE f.faci_name IS NOT NULL), '{}') as facilities
        FROM "Rooms" r
        JOIN "RoomTypes" rt ON r.room_type_id = rt.room_type_id
        JOIN "Dorms" d ON rt.dorm_id = d.dorm_id
        LEFT JOIN "FacilityList" fl ON d.dorm_id = fl.dorm_id
        LEFT JOIN "Facilities" f ON fl.faci_id = f.faci_id
        WHERE r.room_id = $1
        GROUP BY r.room_id, rt.room_type_id, d.dorm_id
      `;
      const result = await pool.query(query, [roomId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching room by ID:', error);
      throw error;
    }
  }

  // Get rooms by dorm ID (for displaying rooms of a specific dorm)
  static async getRoomsByDormId(dormId) {
    try {
      if (!dormId || isNaN(dormId)) {
        throw new Error('Invalid dorm ID');
      }

      const query = `
        SELECT 
          r.*,
          rt.room_type_name,
          rt.room_type_desc,
          rt.rent_per_month,
          rt.rent_per_day
        FROM "Rooms" r
        JOIN "RoomTypes" rt ON r.room_type_id = rt.room_type_id
        WHERE rt.dorm_id = $1
        ORDER BY r.status DESC, r.room_name
      `;
      const result = await pool.query(query, [dormId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching rooms by dorm ID:', error);
      throw error;
    }
  }

  // Get available rooms by dorm ID (for booking)
  static async getAvailableRoomsByDormId(dormId) {
    try {
      if (!dormId || isNaN(dormId)) {
        throw new Error('Invalid dorm ID');
      }

      const query = `
        SELECT 
          r.*,
          rt.room_type_name,
          rt.room_type_desc,
          rt.rent_per_month,
          rt.rent_per_day
        FROM "Rooms" r
        JOIN "RoomTypes" rt ON r.room_type_id = rt.room_type_id
        WHERE rt.dorm_id = $1 AND r.status = 'available'
        ORDER BY r.room_name
      `;
      const result = await pool.query(query, [dormId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      throw error;
    }
  }

  // Check if room is available for booking
  static async isRoomAvailable(roomId) {
    try {
      if (!roomId || isNaN(roomId)) {
        throw new Error('Invalid room ID');
      }

      const query = `
        SELECT status 
        FROM "Rooms" 
        WHERE room_id = $1
      `;
      const result = await pool.query(query, [roomId]);
      
      if (!result.rows[0]) {
        throw new Error('Room not found');
      }
      
      return result.rows[0].status === 'available';
    } catch (error) {
      console.error('Error checking room availability:', error);
      throw error;
    }
  }
}

module.exports = Room;