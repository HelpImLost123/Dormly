const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./database');

// Session configuration
const sessionConfig = {
  store: new pgSession({
    pool: pool,
    tableName: 'user_sessions', // Optional: customize table name
    createTableIfMissing: true,  // Automatically create session table
  }),
  secret: process.env.SESSION_SECRET || 'dormly-super-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,  // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // CSRF protection
  },
  name: 'dormly.session', // Custom session cookie name
  rolling: true // Reset expiration on activity
};

module.exports = sessionConfig;