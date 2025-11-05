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

  // Update room status and/or current occupancy
  static async updateRoom(roomId, updateData) {
    try {
      if (!roomId || isNaN(roomId)) {
        throw new Error('Invalid room ID');
      }

      const { status, cur_occupancy } = updateData;

      // Validate status if provided
      if (status && !['ห้องว่าง', 'ห้องไม่ว่าง'].includes(status)) {
        throw new Error('Invalid status. Must be: ห้องว่าง, ห้องไม่ว่าง');
      }

      // Validate cur_occupancy if provided
      if (cur_occupancy !== undefined && (isNaN(cur_occupancy) || cur_occupancy < 0)) {
        throw new Error('Current occupancy must be a non-negative number');
      }

      // Check if room exists
      const checkQuery = 'SELECT room_id FROM "Rooms" WHERE room_id = $1';
      const checkResult = await pool.query(checkQuery, [roomId]);
      
      if (checkResult.rows.length === 0) {
        throw new Error('Room not found');
      }

      // Build dynamic update query
      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (status) {
        updates.push(`status = $${paramIndex++}`);
        values.push(status);
      }

      if (cur_occupancy !== undefined) {
        updates.push(`cur_occupancy = $${paramIndex++}`);
        values.push(cur_occupancy);
      }

      if (updates.length === 0) {
        throw new Error('No update data provided');
      }

      values.push(roomId);

      const query = `
        UPDATE "Rooms" 
        SET ${updates.join(', ')}
        WHERE room_id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }

  // Check if user owns the dorm that contains this room
  static async isRoomOwnedByUser(roomId, userId) {
    try {
      if (!roomId || isNaN(roomId) || !userId || isNaN(userId)) {
        throw new Error('Invalid room ID or user ID');
      }

      const query = `
        SELECT d.owner_id, do.user_id
        FROM "Rooms" r
        JOIN "RoomTypes" rt ON r.room_type_id = rt.room_type_id
        JOIN "Dorms" d ON rt.dorm_id = d.dorm_id
        JOIN "DormOwners" do ON d.owner_id = do.dorm_own_id
        WHERE r.room_id = $1 AND do.user_id = $2
      `;
      
      const result = await pool.query(query, [roomId, userId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking room ownership:', error);
      throw error;
    }
  }

  // Check if user owns the dorm
  static async isDormOwnedByUser(dormId, userId) {
    try {
      if (!dormId || isNaN(dormId) || !userId || isNaN(userId)) {
        throw new Error('Invalid dorm ID or user ID');
      }

      const query = `
        SELECT d.dorm_id
        FROM "Dorms" d
        JOIN "DormOwners" do ON d.owner_id = do.dorm_own_id
        WHERE d.dorm_id = $1 AND do.user_id = $2
      `;
      
      const result = await pool.query(query, [dormId, userId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking dorm ownership:', error);
      throw error;
    }
  }

  // Create a new room type
  static async createRoomType(roomTypeData, userId) {
    try {
      const { dorm_id, room_type_name, room_type_desc, rent_per_month, rent_per_day } = roomTypeData;

      // Validate required fields
      if (!dorm_id || isNaN(dorm_id)) {
        throw new Error('Valid dorm ID is required');
      }

      if (!room_type_name || room_type_name.trim().length === 0) {
        throw new Error('Room type name is required');
      }

      // Check if user owns the dorm
      const isOwner = await this.isDormOwnedByUser(dorm_id, userId);
      if (!isOwner) {
        throw new Error('Unauthorized: You can only create room types for dorms you own');
      }

      // Validate pricing
      if (rent_per_month !== undefined && (isNaN(rent_per_month) || rent_per_month < 0)) {
        throw new Error('Rent per month must be a non-negative number');
      }

      if (rent_per_day !== undefined && (isNaN(rent_per_day) || rent_per_day < 0)) {
        throw new Error('Rent per day must be a non-negative number');
      }

      const query = `
        INSERT INTO "RoomTypes" (dorm_id, room_type_name, room_type_desc, rent_per_month, rent_per_day)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const result = await pool.query(query, [
        dorm_id,
        room_type_name.trim(),
        room_type_desc?.trim() || null,
        rent_per_month || null,
        rent_per_day || null
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Error creating room type:', error);
      throw error;
    }
  }

  // Create multiple rooms for a room type
  static async createRooms(roomsData, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { room_type_id, room_count, room_name_prefix, starting_number, status, cur_occupancy } = roomsData;

      // Validate required fields
      if (!room_type_id || isNaN(room_type_id)) {
        throw new Error('Valid room type ID is required');
      }

      if (!room_count || isNaN(room_count) || room_count <= 0) {
        throw new Error('Room count must be a positive number');
      }

      // Check if room type exists and user owns it
      const roomTypeCheck = await client.query(
        `SELECT rt.room_type_id, d.dorm_id
         FROM "RoomTypes" rt
         JOIN "Dorms" d ON rt.dorm_id = d.dorm_id
         JOIN "DormOwners" do ON d.owner_id = do.dorm_own_id
         WHERE rt.room_type_id = $1 AND do.user_id = $2`,
        [room_type_id, userId]
      );

      if (roomTypeCheck.rows.length === 0) {
        throw new Error('Room type not found or you do not own this dorm');
      }

      // Set defaults
      const prefix = room_name_prefix || 'ห้อง';
      const startNum = starting_number || 1;
      const roomStatus = status || 'ห้องว่าง';
      const occupancy = cur_occupancy || 0;

      // Validate status
      if (!['ห้องว่าง', 'ห้องไม่ว่าง'].includes(roomStatus)) {
        throw new Error('Invalid status. Must be: ห้องว่าง or ห้องไม่ว่าง');
      }

      const createdRooms = [];

      // Create rooms
      for (let i = 0; i < room_count; i++) {
        const roomNumber = startNum + i;
        const roomName = `${prefix}${roomNumber}`;

        const query = `
          INSERT INTO "Rooms" (room_name, room_type_id, cur_occupancy, status)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;

        const result = await client.query(query, [
          roomName,
          room_type_id,
          occupancy,
          roomStatus
        ]);

        createdRooms.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return createdRooms;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating rooms:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Create room type with rooms (combined operation)
  static async createRoomTypeWithRooms(data, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { 
        dorm_id, 
        room_type_name, 
        room_type_desc, 
        rent_per_month, 
        rent_per_day,
        room_count,
        room_name_prefix,
        starting_number,
        status,
        cur_occupancy
      } = data;

      // Validate dorm ownership
      const isOwner = await this.isDormOwnedByUser(dorm_id, userId);
      if (!isOwner) {
        throw new Error('Unauthorized: You can only create room types for dorms you own');
      }

      // Create room type
      const roomTypeQuery = `
        INSERT INTO "RoomTypes" (dorm_id, room_type_name, room_type_desc, rent_per_month, rent_per_day)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const roomTypeResult = await client.query(roomTypeQuery, [
        dorm_id,
        room_type_name.trim(),
        room_type_desc?.trim() || null,
        rent_per_month || null,
        rent_per_day || null
      ]);

      const roomType = roomTypeResult.rows[0];

      // Create rooms if room_count is provided
      let rooms = [];
      if (room_count && room_count > 0) {
        if (room_count > 100) {
          throw new Error('Cannot create more than 100 rooms at once');
        }

        const prefix = room_name_prefix || 'ห้อง';
        const startNum = starting_number || 1;
        const roomStatus = status || 'ห้องว่าง';
        const occupancy = cur_occupancy || 0;

        for (let i = 0; i < room_count; i++) {
          const roomNumber = startNum + i;
          const roomName = `${prefix}${roomNumber}`;

          const roomQuery = `
            INSERT INTO "Rooms" (room_name, room_type_id, cur_occupancy, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *
          `;

          const roomResult = await client.query(roomQuery, [
            roomName,
            roomType.room_type_id,
            occupancy,
            roomStatus
          ]);

          rooms.push(roomResult.rows[0]);
        }
      }

      await client.query('COMMIT');

      return {
        roomType,
        rooms,
        roomCount: rooms.length
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating room type with rooms:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Room;