const pool = require('../config/database');

class Dorm {
  // Validate dorm registration data
  static validateDormData(dormData) {
    const errors = [];
    
    if (!dormData.dorm_name || dormData.dorm_name.trim().length < 3) {
      errors.push('Dorm name must be at least 3 characters long');
    }
    
    if (!dormData.lat || isNaN(dormData.lat) || dormData.lat < -90 || dormData.lat > 90) {
      errors.push('Valid latitude is required (-90 to 90)');
    }
    
    if (!dormData.long || isNaN(dormData.long) || dormData.long < -180 || dormData.long > 180) {
      errors.push('Valid longitude is required (-180 to 180)');
    }
    
    if (!dormData.address || dormData.address.trim().length === 0) {
      errors.push('Address is required');
    }
    
    if (dormData.tel && !/^\d{9,10}$/.test(dormData.tel.replace(/[-\s]/g, ''))) {
      errors.push('Valid phone number is required (9-10 digits)');
    }
    
    return errors;
  }

  // Get dorm by ID with complete information (for viewing dorm details)
  // Returns: All dorm fields including medias JSONB, room_types, facilities, owner info
  static async getDormById(dormId) {
    try {
      if (!dormId || isNaN(dormId)) {
        throw new Error('Invalid dorm ID');
      }

      const query = `
        SELECT 
          d.*, 
          u.f_name || ' ' || u.l_name as owner_name,
          u.email as owner_email,
          (
            SELECT JSON_AGG(room_type_data)
            FROM (
              SELECT DISTINCT ON (rt.room_type_id)
                JSON_BUILD_OBJECT(
                  'room_type_id', rt.room_type_id,
                  'room_type_name', rt.room_type_name,
                  'room_type_desc', rt.room_type_desc,
                  'rent_per_month', rt.rent_per_month,
                  'rent_per_day', rt.rent_per_day,
                  'total_rooms', (
                    SELECT COUNT(*) 
                    FROM "Rooms" r 
                    WHERE r.room_type_id = rt.room_type_id
                  ),
                  'available_rooms', (
                    SELECT COUNT(*) 
                    FROM "Rooms" r 
                    WHERE r.room_type_id = rt.room_type_id AND r.status = 'ห้องว่าง'
                  )
                ) as room_type_data
              FROM "RoomTypes" rt
              WHERE rt.dorm_id = d.dorm_id
              ORDER BY rt.room_type_id
            ) room_types_subquery
          ) as room_types,
          COALESCE(array_agg(DISTINCT f.faci_name) FILTER (WHERE f.faci_name IS NOT NULL), '{}') as facilities
        FROM "Dorms" d
        LEFT JOIN "DormOwners" dorm_owner ON d.owner_id = dorm_owner.dorm_own_id
        LEFT JOIN "Users" u ON dorm_owner.user_id = u.user_id
        LEFT JOIN "FacilityList" fl ON d.dorm_id = fl.dorm_id
        LEFT JOIN "Facilities" f ON fl.faci_id = f.faci_id
        WHERE d.dorm_id = $1
        GROUP BY d.dorm_id, u.user_id
      `;
      const result = await pool.query(query, [dormId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching dorm by ID:', error);
      throw error;
    }
  }

  // Search dorms with filters (main search functionality)
  static async searchDorms(filters = {}) {
    try {
      const {
        lat,
        lng,
        radiusKm = 10,
        priceMin,
        priceMax,
        hasAvailableRooms = true,
        searchText,
        facilities = [], // Array of facility names
        limit = 50,
        offset = 0
      } = filters;

      // Validate search parameters
      if (lat !== undefined && (isNaN(lat) || lat < -90 || lat > 90)) {
        throw new Error('Invalid latitude');
      }
      if (lng !== undefined && (isNaN(lng) || lng < -180 || lng > 180)) {
        throw new Error('Invalid longitude');
      }

      // Build query with CTE for better performance and readability
      const params = [];
      const conditions = [];
      
      // Use Common Table Expression (CTE) for distance calculation
      let query = `
        WITH dorm_stats AS (
          SELECT 
            d.dorm_id,
            COUNT(DISTINCT r.room_id) as total_rooms,
            COUNT(DISTINCT CASE WHEN r.status = 'ห้องว่าง' THEN r.room_id END) as available_rooms,
            MIN(rt.rent_per_month) as min_price,
            MAX(rt.rent_per_month) as max_price
          FROM "Dorms" d
          LEFT JOIN "RoomTypes" rt ON d.dorm_id = rt.dorm_id
          LEFT JOIN "Rooms" r ON rt.room_type_id = r.room_type_id
          GROUP BY d.dorm_id
        )
      `;

      // Add distance calculation in CTE if location search
      if (lat !== undefined && lng !== undefined) {
        params.push(lat, lng);
        query += `,
        dorm_distance AS (
          SELECT 
            dorm_id,
            (
              6371 * acos(
                cos(radians($${params.length - 1})) * 
                cos(radians(lat)) * 
                cos(radians(long) - radians($${params.length})) + 
                sin(radians($${params.length - 1})) * 
                sin(radians(lat))
              )
            ) as distance_km
          FROM "Dorms"
          WHERE lat IS NOT NULL AND long IS NOT NULL
        )`;
      }

      // Main SELECT
      query += `
        SELECT 
          d.*,
          ds.total_rooms,
          ds.available_rooms,
          ds.min_price,
          ds.max_price,
          COALESCE(array_agg(DISTINCT f.faci_name) FILTER (WHERE f.faci_name IS NOT NULL), '{}') as facilities
          ${lat !== undefined && lng !== undefined ? ', dd.distance_km' : ''}
        FROM "Dorms" d
        INNER JOIN dorm_stats ds ON d.dorm_id = ds.dorm_id
        ${lat !== undefined && lng !== undefined ? 'LEFT JOIN dorm_distance dd ON d.dorm_id = dd.dorm_id' : ''}
        LEFT JOIN "FacilityList" fl ON d.dorm_id = fl.dorm_id
        LEFT JOIN "Facilities" f ON fl.faci_id = f.faci_id
        WHERE 1=1
      `;

      // Text search filter (search in name, description, address)
      if (searchText && searchText.trim().length > 0) {
        params.push(`%${searchText.trim().toLowerCase()}%`);
        conditions.push(`(
          LOWER(d.dorm_name) LIKE $${params.length} OR
          LOWER(d.description) LIKE $${params.length} OR
          LOWER(d.address) LIKE $${params.length}
        )`);
      }

      // Distance filter
      if (lat !== undefined && lng !== undefined) {
        params.push(radiusKm);
        conditions.push(`dd.distance_km <= $${params.length}`);
      }

      // Price range filter
      if (priceMin !== undefined && priceMin > 0) {
        params.push(priceMin);
        conditions.push(`ds.min_price >= $${params.length}`);
      }
      if (priceMax !== undefined) {
        params.push(priceMax);
        conditions.push(`ds.min_price <= $${params.length}`);
      }

      // Available rooms filter
      if (hasAvailableRooms) {
        conditions.push(`ds.available_rooms > 0`);
      }

      // Add all WHERE conditions
      if (conditions.length > 0) {
        query += ' AND ' + conditions.join(' AND ');
      }

      // GROUP BY (needed because of facility aggregation)
      query += `
        GROUP BY d.dorm_id, ds.total_rooms, ds.available_rooms, ds.min_price, ds.max_price
        ${lat !== undefined && lng !== undefined ? ', dd.distance_km' : ''}
      `;

      // Facility filter (HAVING clause after GROUP BY)
      if (facilities && facilities.length > 0) {
        const facilityConditions = facilities.map(facility => {
          params.push(facility);
          return `$${params.length} = ANY(array_agg(DISTINCT f.faci_name))`;
        });
        query += ` HAVING ${facilityConditions.join(' AND ')}`;
      }

      // Order by
      if (lat !== undefined && lng !== undefined) {
        query += ` ORDER BY dd.distance_km ASC, d.avg_score DESC`;
      } else {
        query += ` ORDER BY d.avg_score DESC, d.dorm_name ASC`;
      }

      // Pagination
      params.push(limit, offset);
      query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error searching dorms:', error);
      throw error;
    }
  }

  // Create a new dorm (registration)
  static async createDorm(dormData, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Validate input data
      const validationErrors = this.validateDormData(dormData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }

      // Check if user is already a dorm owner, if not create owner record
      let ownerResult = await client.query(
        'SELECT dorm_own_id FROM "DormOwners" WHERE user_id = $1',
        [userId]
      );

      let ownerId;
      if (ownerResult.rows.length === 0) {
        const newOwner = await client.query(
          'INSERT INTO "DormOwners" (user_id) VALUES ($1) RETURNING dorm_own_id',
          [userId]
        );
        ownerId = newOwner.rows[0].dorm_own_id;
      } else {
        ownerId = ownerResult.rows[0].dorm_own_id;
      }

      const { 
        dorm_name, water_cost_per_unit, power_cost_per_unit, 
        lat, long, address, soi, moo, road, prov, dist, subdist, 
        postal_code, tel, line_id 
      } = dormData;
      
      const query = `
        INSERT INTO "Dorms" (
          owner_id, dorm_name, water_cost_per_unit, power_cost_per_unit,
          lat, long, address, soi, moo, road, prov, dist, subdist,
          postal_code, tel, line_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `;
      
      const result = await client.query(query, [
        ownerId, 
        dorm_name.trim(), 
        water_cost_per_unit || null, 
        power_cost_per_unit || null,
        parseFloat(lat), 
        parseFloat(long), 
        address.trim(), 
        soi || null, 
        moo || null, 
        road || null, 
        prov || null, 
        dist || null, 
        subdist || null,
        postal_code || null, 
        tel || null, 
        line_id || null
      ]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating dorm:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Dorm;