const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireGuest } = require('../middleware/auth');

// POST /api/auth/register - Register new user
router.post('/register', requireGuest, async (req, res) => {
  try {
    const userData = req.body;
    
    // Basic validation
    if (!userData.username || !userData.password || !userData.email) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, and email are required'
      });
    }
    
    // Password strength validation
    if (userData.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Check if username already exists
    const usernameExists = await User.usernameExists(userData.username);
    if (usernameExists) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }
    
    // Check if email already exists
    const emailExists = await User.emailExists(userData.email);
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    const newUser = await User.createUser(userData);
    
    // Create session for new user
    req.session.user = newUser;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
});

// POST /api/auth/login - User login
router.post('/login', requireGuest, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }
    
    const user = await User.authenticateUser(username, password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
    
    // Create session
    req.session.user = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: user
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in user',
      error: error.message
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', requireAuth, async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({
          success: false,
          message: 'Error logging out'
        });
      }
      
      res.clearCookie('dormly.session');
      res.json({
        success: true,
        message: 'Logout successful'
      });
    });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out user',
      error: error.message
    });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', requireAuth, async (req, res) => {
  try {
    // Get fresh user data from database
    const user = await User.getUserById(req.session.user.user_id);
    
    if (!user) {
      // User was deleted, destroy session
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting current user',
      error: error.message
    });
  }
});

// GET /api/auth/status - Check authentication status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    authenticated: !!(req.session && req.session.user),
    user: req.session && req.session.user ? req.session.user : null
  });
});

// POST /api/auth/refresh - Refresh session
router.post('/refresh', requireAuth, async (req, res) => {
  try {
    // Get fresh user data
    const user = await User.getUserById(req.session.user.user_id);
    
    if (!user) {
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update session with fresh data
    req.session.user = user;
    
    res.json({
      success: true,
      message: 'Session refreshed',
      data: user
    });
  } catch (error) {
    console.error('Error refreshing session:', error);
    res.status(500).json({
      success: false,
      message: 'Error refreshing session',
      error: error.message
    });
  }
});

module.exports = router;