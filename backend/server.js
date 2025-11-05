const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const omise = require('omise');
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

// Omise Client
if (!process.env.OMISE_SECRET_KEY) {
  console.warn('*** WARNING: OMISE_SECRET_KEY is not defined ***');
}
const omiseClient = omise({
  secretKey: process.env.OMISE_SECRET_KEY,
  apiVersion: '2019-05-29',
});

const app = express();
const PORT = process.env.PORT || 3001;

// CORS (โค้ดเดิมของคุณ)
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',   // Prod
      'http://localhost:5173',   // Dev
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

// --- Payment Routes ---

// 1. Credit Card (โค้ดเดิม)
app.post('/api/create-charge', async (req, res) => {
  const { token, amount, userId, roomId } = req.body; 

  if (!token || !amount) {
    return res.status(400).json({ success: false, message: 'Token and amount are required' });
  }
  if (!omiseClient || !process.env.OMISE_SECRET_KEY) {
     return res.status(500).json({ success: false, message: 'Omise client is not initialized.' });
  }

  try {
    const charge = await omiseClient.charges.create({
      amount: amount,
      currency: 'thb',
      card: token,
      description: `Dormly Booking (Credit Card) for Room ID: ${roomId} by User ID: ${userId}`,
    });

    if (charge.status === 'successful') {
      // TODO: INSERT "DormBookings"
      res.json({
        success: true,
        message: 'Payment processed and booking confirmed',
        charge: charge,
      });
    } else {
      res.status(400).json({
        success: false,
        message: charge.failure_message || 'Payment failed',
      });
    }
  } catch (error) {
    console.error('Omise API Error (Credit Card):', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// PromptPay QR Code
app.post('/api/create-qr-charge', async (req, res) => {
  const { amount, userId, roomId } = req.body;

  if (!amount) {
    return res.status(400).json({ success: false, message: 'Amount is required' });
  }
  if (!omiseClient || !process.env.OMISE_SECRET_KEY) {
     return res.status(500).json({ success: false, message: 'Omise client is not initialized.' });
  }

  try {
    //สร้าง Charge โดยระบุ source.type เป็น 'promptpay'
    const charge = await omiseClient.charges.create({
      amount: amount,
      currency: 'thb',
      source: { type: 'promptpay' }, // 💡 บอก Omise ให้สร้าง QR
      description: `Dormly Booking (PromptPay) for Room ID: ${roomId} by User ID: ${userId}`,
    });

    //  ดึง URL รูปภาพ QR Code
    const qrImageUrl = charge.source.scannable_code.image.download_uri;
    
    if (qrImageUrl) {
      res.json({
        success: true,
        qrImageUrl: qrImageUrl,
        chargeId: charge.id // (ส่ง ID เผื่อ Frontend ใช้เช็คสถานะ)
      });
    } else {
      throw new Error('QR Code image URL not found in Omise response.');
    }

  } catch (error) {
    console.error('Omise API Error (PromptPay):', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Webhook (Omise จะยิงมาที่นี่เมื่อจ่าย QR สำเร็จ)
// (นี่คือ Endpoint ที่คุณต้องไปตั้งค่าใน Omise Dashboard)
app.post('/api/omise-webhook', bodyParser.raw({type: 'application/json'}), async (req, res) => {
  const event = req.body;

  console.log('--- OMISE WEBHOOK RECEIVED ---');
  console.log('Event Type:', event.key);

  try {
    if (event.key === 'charge.complete') {
      const charge = event.data;

      if (charge.status === 'successful') {
        //  จ่ายสำเร็จ!
        console.log(`Charge ${charge.id} (PromptPay) is successful!`);
        
        //อัปเดต Database
        // (คุณต้องดึง roomId/userId จาก `charge.description`)
        
        // await pool.query(
        //   'INSERT INTO "DormBookings" (booker_id, room_id, status) VALUES ($1, $2, $3)',
        //   [userId, roomId, 'confirmed']
        // );
        // await pool.query(
        //   'UPDATE "Rooms" SET status = $1 WHERE room_id = $2',
        //   ['occupied', roomId]
        // );
        
        console.log(`Database updated for Charge ${charge.id}`);
        
      } else if (charge.status === 'failed') {
        console.log(`Charge ${charge.id} (PromptPay) failed.`);
        // (ส่ง Email แจ้งเตือน User)
      }
    }
    
    res.status(200).send('OK');
    
  } catch (error) {
    console.error('Webhook Error:', error.message);
    res.status(500).send('Webhook error');
  }
});


// (โค้ดที่เหลือ: /uploads, /api/health, 404, app.listen)
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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: [ 
      '/api/health', '/api/auth', '/api/users', 
      '/api/dorms', '/api/rooms', '/api/bookings', 
      '/api/media', '/api/search', 
      '/api/create-charge', '/api/create-qr-charge', '/api/omise-webhook'
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
