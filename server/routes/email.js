import express from 'express';
import { sendDiscountEmail } from '../services/email.js';

const router = express.Router();

// Send discount code email
router.post('/discount', async (req, res) => {
  try {
    const { email, discountCode } = req.body;

    if (!email || !discountCode) {
      return res.status(400).json({ error: 'Email and discount code are required' });
    }

    await sendDiscountEmail(email, discountCode);

    res.json({
      success: true,
      message: 'Discount code sent successfully'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message 
    });
  }
});

export default router;
