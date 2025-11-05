const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const sessionConfig = require('./config/session');
const pool = require('./config/database');

// Routes
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const mediaRoutes = require('./routes/media');
const searchRoutes = require('./routes/search');
const dormRoutes = require('./routes/dorms');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');


const app = express();
const PORT = process.env.PORT || 3001;

// CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.FRONTEND_URL,
      null
    ];
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionConfig));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/dorms', dormRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes); 


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Backend API is healthy',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.get('/api', (req, res) => {
  res.json({ name: 'Dormly Backend API' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
  });
});

// 💡 7. (อัปเดต) 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: [ 
      '/api/health', '/api/auth', '/api/users', 
      '/api/dorms', '/api/rooms', '/api/bookings', 
      '/api/media', '/api/search', 
      '/api/payment' // 💡 (เปลี่ยน)
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Dormly Backend API is running on port ${PORT}`);
  console.log(`🔗 API health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Accepting requests from: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`💾 Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down backend server gracefully...');
  pool.end(() => {
    console.log('📦 Database connection pool closed');
    process.exit(0);
  });
});