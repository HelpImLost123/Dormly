const pool = require('../config/database');
const fs = require('fs-extra');
const path = require('path');

class Media {
  // Add media files for a dorm
  static async addDormMedia(dormId, files) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      if (!dormId || isNaN(dormId)) {
        throw new Error('Invalid dorm ID');
      }

      // Get current medias array
      const getCurrentMediaQuery = 'SELECT medias FROM "Dorms" WHERE dorm_id = $1';
      const currentResult = await client.query(getCurrentMediaQuery, [dormId]);
      
      if (currentResult.rows.length === 0) {
        throw new Error('Dorm not found');
      }

      const currentMedias = currentResult.rows[0].medias || [];
      
      // Create new media objects
      const newMedias = files.map(file => ({
        file_name: file.filename,
        file_path: `/uploads/dorms/${file.filename}`,
        file_type: file.mimetype.startsWith('image/') ? 'image' : 'video',
        file_size: file.size,
        mime_type: file.mimetype,
        uploaded_at: new Date().toISOString()
      }));
      
      // Combine with existing medias
      const updatedMedias = [...currentMedias, ...newMedias];
      
      // Update dorm's medias JSONB field
      const updateQuery = `
        UPDATE "Dorms" 
        SET medias = $1, updated_at = NOW()
        WHERE dorm_id = $2
        RETURNING dorm_id, dorm_name, medias
      `;
      
      const result = await client.query(updateQuery, [JSON.stringify(updatedMedias), dormId]);
      
      await client.query('COMMIT');
      return {
        dorm: result.rows[0],
        newMedias: newMedias,
        totalMedia: updatedMedias.length
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error adding dorm media:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Get all media for a dorm
  static async getDormMedia(dormId) {
    try {
      if (!dormId || isNaN(dormId)) {
        throw new Error('Invalid dorm ID');
      }

      const query = `
        SELECT dorm_id, dorm_name, medias 
        FROM "Dorms" 
        WHERE dorm_id = $1
      `;
      const result = await pool.query(query, [dormId]);
      
      if (result.rows.length === 0) {
        throw new Error('Dorm not found');
      }

      const mediasData = result.rows[0].medias || [];
      
      // Extract just the filenames for the frontend
      const filenames = mediasData.map(media => media.file_name);

      return {
        dorm_id: result.rows[0].dorm_id,
        dorm_name: result.rows[0].dorm_name,
        medias: filenames,  // Array of filenames
        media_details: mediasData,  // Full media objects with metadata
        count: filenames.length
      };
    } catch (error) {
      console.error('Error fetching dorm media:', error);
      throw error;
    }
  }
  
  // Delete media file from dorm
  static async deleteDormMedia(dormId, fileName) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      if (!dormId || isNaN(dormId)) {
        throw new Error('Invalid dorm ID');
      }

      if (!fileName) {
        throw new Error('File name is required');
      }

      // Get current medias
      const getCurrentMediaQuery = 'SELECT medias FROM "Dorms" WHERE dorm_id = $1';
      const currentResult = await client.query(getCurrentMediaQuery, [dormId]);
      
      if (currentResult.rows.length === 0) {
        throw new Error('Dorm not found');
      }

      const currentMedias = currentResult.rows[0].medias || [];
      
      // Find and remove the media
      const mediaToDelete = currentMedias.find(m => m.file_name === fileName);
      
      if (!mediaToDelete) {
        throw new Error('Media file not found');
      }

      const updatedMedias = currentMedias.filter(m => m.file_name !== fileName);
      
      // Update database
      const updateQuery = `
        UPDATE "Dorms" 
        SET medias = $1, updated_at = NOW()
        WHERE dorm_id = $2
        RETURNING dorm_id, dorm_name, medias
      `;
      
      await client.query(updateQuery, [JSON.stringify(updatedMedias), dormId]);
      
      // Delete physical file
      const filePath = path.join(__dirname, '..', 'uploads', 'dorms', fileName);
      if (fs.existsSync(filePath)) {
        await fs.remove(filePath);
      }
      
      await client.query('COMMIT');
      return {
        message: 'Media deleted successfully',
        deletedMedia: mediaToDelete,
        remainingCount: updatedMedias.length
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting media:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Media;