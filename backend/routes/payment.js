const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();


const pool = require('../config/database');
const omise = require('omise');

if (!process.env.OMISE_SECRET_KEY) {
  console.warn('*** WARNING: OMISE_SECRET_KEY is not defined ***');
}
const omiseClient = omise({
  secretKey: process.env.OMISE_SECRET_KEY,
  apiVersion: '2019-05-29',
});


router.post('/create-charge', async (req, res) => {
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

router.post('/create-qr-charge', async (req, res) => {
  const { amount, userId, roomId } = req.body;

  if (!amount) {
    return res.status(400).json({ success: false, message: 'Amount is required' });
  }
  if (!omiseClient || !process.env.OMISE_SECRET_KEY) {
     return res.status(500).json({ success: false, message: 'Omise client is not initialized.' });
  }

  try {
    const charge = await omiseClient.charges.create({
      amount: amount,
      currency: 'thb',
      source: { type: 'promptpay' },
      description: `Dormly Booking (PromptPay) for Room ID: ${roomId} by User ID: ${userId}`,
    });

    const qrImageUrl = charge.source.scannable_code.image.download_uri;
    
    if (qrImageUrl) {
      res.json({
        success: true,
        qrImageUrl: qrImageUrl,
        chargeId: charge.id
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

router.post('/omise-webhook', bodyParser.raw({type: 'application/json'}), async (req, res) => {
  const event = req.body;

  console.log('--- OMISE WEBHOOK RECEIVED ---');
  console.log('Event Type:', event.key);

  try {
    if (event.key === 'charge.complete') {
      const charge = event.data;

      if (charge.status === 'successful') {
        console.log(`Charge ${charge.id} (PromptPay) is successful!`);
        
        
        console.log(`Database updated for Charge ${charge.id}`);
        
      } else if (charge.status === 'failed') {
        console.log(`Charge ${charge.id} (PromptPay) failed.`);
      }
    }
    
    res.status(200).send('OK');
    
  } catch (error) {
    console.error('Webhook Error:', error.message);
    res.status(500).send('Webhook error');
  }
});


module.exports = router;
