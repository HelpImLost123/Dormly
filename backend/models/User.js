const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  // Validate user registration data
  static validateRegistrationData(userData) {
    const errors = [];
    
    if (!userData.username || userData.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (!userData.f_name || userData.f_name.trim().length === 0) {
      errors.push('First name is required');
    }
    
    if (!userData.l_name || userData.l_name.trim().length === 0) {
      errors.push('Last name is required');
    }
    
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Valid email is required');
    }
    
    return errors;
  }

  // Email validation helper
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get user by ID (for session validation)
  static async getUserById(userId) {
    try {
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }

      const query = `
        SELECT 
          user_id, username, f_name, l_name, email, 
          sex, national_id, profile_path, registered_at
        FROM "Users"
        WHERE user_id = $1
      `;
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  // Create new user (registration)
  static async createUser(userData) {
    try {
      // Validate input data
      const validationErrors = this.validateRegistrationData(userData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { 
        username, password, f_name, l_name, email, 
        sex, national_id 
      } = userData;
      
      // Hash the password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);
      
      const query = `
        INSERT INTO "Users" (
          username, password, f_name, l_name, email,
          sex, national_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING user_id, username, f_name, l_name, email, 
                  sex, national_id, registered_at
      `;
      
      const result = await pool.query(query, [
        username.trim(), 
        password_hash, 
        f_name.trim(), 
        l_name.trim(), 
        email.trim().toLowerCase(),
        sex || null,
        national_id || null
      ]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Authenticate user (for login)
  static async authenticateUser(username, password) {
    try {
      if (!username || !password) {
        return null;
      }

      // Get the user with password hash
      const query = `
        SELECT 
          user_id, username, password, f_name, l_name, email,
          sex, national_id, profile_path, registered_at
        FROM "Users"
        WHERE username = $1
      `;
      const result = await pool.query(query, [username.trim()]);
      const user = result.rows[0];
      
      if (!user) {
        return null; // User not found
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return null; // Invalid password
      }
      
      // Return user without password hash
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  // Check if username exists
  static async usernameExists(username) {
    try {
      if (!username) return false;
      
      const query = 'SELECT user_id FROM "Users" WHERE username = $1';
      const result = await pool.query(query, [username.trim()]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking username:', error);
      throw error;
    }
  }

  // Check if email exists
  static async emailExists(email) {
    try {
      if (!email) return false;
      
      const query = 'SELECT user_id FROM "Users" WHERE email = $1';
      const result = await pool.query(query, [email.trim().toLowerCase()]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      throw error;
    }
  }

  // Update bank token for dorm owner
  static async updateDormOwnerBankToken(userId, bankToken) {
    try {
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }

      if (!bankToken || typeof bankToken !== 'string') {
        throw new Error('Valid bank token is required');
      }

      // Check if user is a dorm owner
      const checkQuery = 'SELECT dorm_own_id FROM "DormOwners" WHERE user_id = $1';
      const checkResult = await pool.query(checkQuery, [userId]);

      if (checkResult.rows.length === 0) {
        throw new Error('User is not registered as a dorm owner');
      }

      // Update the bank token
      const updateQuery = `
        UPDATE "DormOwners" 
        SET bank_token = $1 
        WHERE user_id = $2 
        RETURNING dorm_own_id, user_id, bank_token, registered_at
      `;
      const result = await pool.query(updateQuery, [bankToken.trim(), userId]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating bank token:', error);
      throw error;
    }
  }

  // Get dorm owner info by user ID
  static async getDormOwnerByUserId(userId) {
    try {
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }

      const query = `
        SELECT dorm_own_id, user_id, bank_token, registered_at 
        FROM "DormOwners" 
        WHERE user_id = $1
      `;
      const result = await pool.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching dorm owner info:', error);
      throw error;
    }
  }
}

module.exports = User;