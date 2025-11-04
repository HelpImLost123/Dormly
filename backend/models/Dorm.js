const pool = require('../config/database');

const Dorm = {
  

  searchDorms: async (filters) => {
    const {
      lat,
      lng,
      radiusKm = 10,
      priceMin = 0,
      priceMax = 9999999,
      hasAvailableRooms = false
    } = filters;

    let params = [];
    let paramIndex = 1;

    let baseQuery = `
      SELECT
        d.dorm_id,
        d.dorm_name,
        d.address,
        d.prov,
        d.dist,
        d.subdist,
        d.avg_score,
        d.likes,
        d.medias,
        d.lat,
        d.long,
        MIN(rt.rent_per_month) as min_price,
        COUNT(DISTINCT r.room_id) as available_rooms_count
        
        ${
       
          (lat && lng) ? `, ( 6371 * acos(
              cos(radians($${paramIndex++})) * cos(radians(d.lat)) *
              cos(radians(d.long) - radians($${paramIndex++})) +
              sin(radians($${paramIndex++})) * sin(radians(d.lat))
          )) AS distance_km` : ''
        }
        
      FROM "Dorms" d
      LEFT JOIN "RoomTypes" rt ON d.dorm_id = rt.dorm_id
      LEFT JOIN "Rooms" r ON rt.room_type_id = r.room_type_id AND r.status = 'available'
    `;
    
    if (lat && lng) {
      params.push(lat, lng, lat);
    }


    const whereClauses = [];
    if (priceMin > 0) {
      whereClauses.push(`rt.rent_per_month >= $${paramIndex++}`);
      params.push(priceMin);
    }
    if (priceMax < 9999999) {
      whereClauses.push(`rt.rent_per_month <= $${paramIndex++}`);
      params.push(priceMax);
    }

    if (whereClauses.length > 0) {
      baseQuery += ' WHERE ' + whereClauses.join(' AND ');
    }


    baseQuery += ' GROUP BY d.dorm_id';

  
    let finalQuery = `SELECT * FROM (${baseQuery}) AS dorms_with_details`;

    const finalWhereClauses = [];

    if (hasAvailableRooms) {
      finalWhereClauses.push('available_rooms_count > 0');
    }

    if (lat && lng) {
      finalWhereClauses.push(`distance_km <= $${paramIndex++}`);
      params.push(radiusKm);
    }

    if (finalWhereClauses.length > 0) {
      finalQuery += ' WHERE ' + finalWhereClauses.join(' AND ');
    }

 
    if (lat && lng) {
      finalQuery += ' ORDER BY distance_km ASC';
    } else {
      finalQuery += ' ORDER BY avg_score DESC, likes DESC';
    }

    finalQuery += ' LIMIT 20';

    // console.log("Final SQL Query:", finalQuery);
    // console.log("Params:", params);

    const result = await pool.query(finalQuery, params);
    return result.rows;
  },


  getDormById: async (dormId) => {
    const dormResult = await pool.query('SELECT * FROM "Dorms" WHERE dorm_id = $1', [dormId]);
    if (dormResult.rows.length === 0) {
      return null;
    }
    const dorm = dormResult.rows[0];

  
    const roomTypeResult = await pool.query(
      'SELECT rent_per_month FROM "RoomTypes" WHERE dorm_id = $1 ORDER BY rent_per_month ASC',
      [dormId]
    );
    dorm.room_types = roomTypeResult.rows; 


    const faciResult = await pool.query(
      `SELECT T2.faci_name 
       FROM "FacilityList" T1
       JOIN "Facilities" T2 ON T1.faci_id = T2.faci_id
       WHERE T1.dorm_id = $1`,
      [dormId]
    );
    dorm.facilities = faciResult.rows;


    const reviewResult = await pool.query(
      'SELECT user_id, content, score, created_at FROM "Reviews" WHERE dorm_id = $1 ORDER BY created_at DESC LIMIT 5',
      [dormId]
    );
    dorm.reviews = reviewResult.rows;
    
   
    return dorm;
  },

  createDorm: async (dormData, userId) => {
    console.log('Creating dorm:', dormData, 'by user:', userId);
    return { dorm_id: 999, ...dormData }; // (ตัวอย่าง)
  },
};

module.exports = Dorm;

