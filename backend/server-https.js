const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Import configurations
const sessionConfig = require('./config/session');

// Import routes
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const mediaRoutes = require('./routes/media');
const searchRoutes = require('./routes/search');
const dormRoutes = require('./routes/dorms');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// Import database configuration to test connection
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 3001;

// HTTPS Certificate configuration
const getSSLOptions = () => {
  try {
    // Production certificates (if available)
    if (fs.existsSync('./ssl/cert.pem') && fs.existsSync('./ssl/key.pem')) {
      return {
        key: fs.readFileSync('./ssl/key.pem'),
        cert: fs.readFileSync('./ssl/cert.pem')
      };
    }
    
    // Development self-signed certificates
    if (fs.existsSync('./ssl/localhost-key.pem') && fs.existsSync('./ssl/localhost.pem')) {
      return {
        key: fs.readFileSync('./ssl/localhost-key.pem'),
        cert: fs.readFileSync('./ssl/localhost.pem')
      };
    }
    
    console.log('⚠️  No SSL certificates found. Generating self-signed certificates...');
    
    // Generate self-signed certificates for development
    const { execSync } = require('child_process');
    
    // Create ssl directory if it doesn't exist
    if (!fs.existsSync('./ssl')) {
      fs.mkdirSync('./ssl');
    }
    
    // Generate self-signed certificate
    execSync(`openssl req -x509 -newkey rsa:4096 -keyout ./ssl/localhost-key.pem -out ./ssl/localhost.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"`);
    
    return {
      key: fs.readFileSync('./ssl/localhost-key.pem'),
      cert: fs.readFileSync('./ssl/localhost.pem')
    };
  } catch (error) {
    console.error('❌ Error setting up SSL certificates:', error.message);
    console.log('💡 Falling back to HTTP mode. Install OpenSSL or provide certificates in ./ssl/ directory');
    return null;
  }
};

// CORS configuration for frontend-backend separation with HTTPS support
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'https://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3000', // Fallback for development
    'https://127.0.0.1:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware (must be after body parser)
app.use(session(sessionConfig));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/dorms', dormRoutes);
app.use('/api/users', userRoutes);

// Serve uploaded files statically (still needed for media)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Backend API is healthy',
      timestamp: result.rows[0].now,
      server: 'Dormly Backend API (HTTPS)',
      version: '1.0.0',
      ssl: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Dormly Backend API',
    version: '1.0.0',
    ssl: true,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      dorms: '/api/dorms',
      rooms: '/api/rooms',
      bookings: '/api/bookings',
      media: '/api/media',
      search: '/api/search'
    },
    documentation: 'API-only backend for Dormly application with HTTPS support'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler for API routes only
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: ['/api/health', '/api/auth', '/api/users', '/api/dorms', '/api/rooms', '/api/bookings', '/api/media', '/api/search']
  });
});

// Start HTTPS server
const sslOptions = getSSLOptions();

if (sslOptions) {
  // Start HTTPS server
  https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
    console.log(`🚀 Dormly Backend API (HTTPS) is running on port ${HTTPS_PORT}`);
    console.log(`🔗 API health check: https://localhost:${HTTPS_PORT}/api/health`);
    console.log(`🌐 Accepting requests from: ${process.env.FRONTEND_URL || 'https://localhost:3000'}`);
    console.log(`💾 Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`🔒 SSL certificates loaded successfully`);
  });
} else {
  // Fallback to HTTP server
  app.listen(PORT, () => {
    console.log(`🚀 Dormly Backend API (HTTP Fallback) is running on port ${PORT}`);
    console.log(`🔗 API health check: http://localhost:${PORT}/api/health`);
    console.log(`⚠️  Running in HTTP mode - SSL certificates not available`);
    console.log(`🌐 Accepting requests from: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`💾 Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down backend server gracefully...');
  pool.end(() => {
    console.log('📦 Database connection pool closed');
    process.exit(0);
  });
});