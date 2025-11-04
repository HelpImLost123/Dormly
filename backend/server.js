const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config(); // 💡 ต้องมีไฟล์ .env ที่ root

// 💡 1. Import OMISE
const omise = require('omise');

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

// Import database configuration
const pool = require('./config/database');

// --- 💡 2. OMISE CONFIGURATION ---
// (อ่าน OMISE_SECRET_KEY จาก .env ที่เราสร้างไว้)
if (!process.env.OMISE_SECRET_KEY) {
  console.warn('*** WARNING: OMISE_SECRET_KEY is not defined in .env file ***');
  console.warn('*** Payment API (/api/create-charge) will FAIL ***');
}
const omiseClient = omise({
  secretKey: process.env.OMISE_SECRET_KEY,
  apiVersion: '2019-05-29',
});
// ---------------------------------

const app = express();
const PORT = process.env.PORT || 3001; // (รันที่ 3001 ตามไฟล์ docker)

// CORS configuration (โค้ดเดิมของคุณ)
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',   // Frontend (Production)
      'http://localhost:5173',   // Frontend (Development)
      process.env.FRONTEND_URL,
      null
    ];
    
    // ใน Dev Mode, เราอนุญาตทั้งหมด (ตามโค้ด Docker compose)
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
    }
    // ใน Prod Mode, เราเช็ค
    else if (!origin || allowedOrigins.includes(origin)) {
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
app.use(session(sessionConfig)); // (ต้องอยู่ก่อน app.use routes)

// API Routes (โค้ดเดิมของคุณ)
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/dorms', dormRoutes);
app.use('/api/users', userRoutes);

// --- 💡 3. OMISE PAYMENT ROUTE (เพิ่มเข้ามาใหม่) ---
app.post('/api/create-charge', async (req, res) => {
  // (Frontend ต้องส่ง 4 อย่างนี้มา)
  const { token, amount, userId, roomId } = req.body; 

  if (!token || !amount) {
    return res.status(400).json({ success: false, message: 'Token and amount are required' });
  }

  if (!omiseClient || !process.env.OMISE_SECRET_KEY) {
     return res.status(500).json({ success: false, message: 'Omise client is not initialized. Check OMISE_SECRET_KEY.' });
  }

  try {
    // 1. สร้าง Charge (ตัดเงิน)
    const charge = await omiseClient.charges.create({
      amount: amount,     // ยอดเงิน (สตางค์)
      currency: 'thb',
      card: token,        // Token จาก Frontend
      description: `Dormly Booking for Room ID: ${roomId} by User ID: ${userId}`,
    });

    // 2. ตรวจสอบสถานะการตัดเงิน
    if (charge.status === 'successful') {
      
      // 💡 TODO: เมื่อตัดเงินสำเร็จ ให้ INSERT การจองลง Database
      // (คุณต้องส่ง userId, roomId, checkIn, checkOut มาจาก Frontend)
      /*
      await pool.query(
        'INSERT INTO "DormBookings" (booker_id, room_id, status) VALUES ($1, $2, $3)',
        [userId, roomId, 'confirmed']
      );
      await pool.query(
        'UPDATE "Rooms" SET status = $1 WHERE room_id = $2',
        ['occupied', roomId]
      );
      */

      // 3. ส่ง "สำเร็จ" กลับไป
      res.json({
        success: true,
        message: 'Payment processed and booking confirmed',
        charge: charge,
      });
    } else {
      // ถ้าสถานะไม่ใช่ "successful" (เช่น 3D Secure ล้มเหลว)
      res.status(400).json({
        success: false,
        message: charge.failure_message || 'Payment failed',
      });
    }
  } catch (error) {
    // ถ้า API ของ Omise มีปัญหา (เช่น คีย์ผิด, Token ผิด)
    console.error('Omise API Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// ---------------------------------

// Serve uploaded files (โค้ดเดิมของคุณ)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint (โค้ดเดิมของคุณ)
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Backend API is healthy',
      timestamp: result.rows[0].now,
      // ...
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API info endpoint (โค้ดเดิมของคุณ)
app.get('/api', (req, res) => {
  res.json({
    name: 'Dormly Backend API',
    // ...
  });
});

// Error handling middleware (โค้ดเดิมของคุณ)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    // ...
  });
});

// 404 handler (ต้องอยู่ล่างสุด)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: [ // 💡 อัปเดต List นี้ด้วย
      '/api/health',
      '/api/auth',
      '/api/users',
      '/api/dorms',
      '/api/rooms',
      '/api/bookings',
      '/api/media',
      '/api/search',
      '/api/create-charge' // 💡 เพิ่มเข้ามาแล้ว!
    ]
  });
});

// Start server (โค้ดเดิมของคุณ)
app.listen(PORT, () => {
  console.log(`🚀 Dormly Backend API is running on port ${PORT}`);
  console.log(`🔗 API health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Accepting requests from: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`💾 Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
});

// Graceful shutdown (โค้ดเดิมของคุณ)
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down backend server gracefully...');
  pool.end(() => {
    console.log('📦 Database connection pool closed');
    process.exit(0);
  });
});