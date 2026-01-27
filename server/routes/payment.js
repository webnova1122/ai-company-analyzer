import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { sendDiscountEmail, sendReceiptEmail } from '../services/email.js';

const router = express.Router();

// Store transactions in memory (in production, use a database)
const transactionsStore = new Map();

// Process payment
router.post('/process', async (req, res) => {
  try {
    const { plan, amount, discountCode, paymentMethod, cardDetails, companyData } = req.body;

    // Validate required fields
    if (!plan || !amount || !paymentMethod || !companyData) {
      return res.status(400).json({ error: 'Missing required payment information' });
    }

    // In production, integrate with actual payment processor (Stripe, PayPal, etc.)
    // For now, simulate payment processing
    const transactionId = uuidv4();
    
    // Simulate payment validation
    if (paymentMethod === 'card' && cardDetails) {
      // Basic card validation
      const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
      if (cardNumber.length < 16) {
        return res.status(400).json({ error: 'Invalid card number' });
      }
    }

    // Store transaction
    const transaction = {
      transactionId,
      plan,
      amount,
      discountCode,
      paymentMethod,
      companyData: {
        companyName: companyData.companyName,
        email: companyData.email,
        fullName: companyData.fullName
      },
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    transactionsStore.set(transactionId, transaction);

    // Send receipt email
    try {
      await sendReceiptEmail(companyData.email, transaction);
    } catch (emailError) {
      console.error('Failed to send receipt email:', emailError);
      // Don't fail the payment if email fails
    }

    res.json({
      success: true,
      transactionId,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      error: 'Payment processing failed', 
      details: error.message 
    });
  }
});

// Verify transaction
router.get('/verify/:transactionId', (req, res) => {
  const { transactionId } = req.params;
  const transaction = transactionsStore.get(transactionId);

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.json({
    valid: transaction.status === 'completed',
    plan: transaction.plan,
    amount: transaction.amount,
    createdAt: transaction.createdAt
  });
});

// Get transaction details
router.get('/:transactionId', (req, res) => {
  const { transactionId } = req.params;
  const transaction = transactionsStore.get(transactionId);

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.json(transaction);
});

export default router;
export { transactionsStore };
