import express from 'express';
import { analyzeCompany, generateBusinessPlan, generateStrategicPlan } from '../services/analyzer.js';
import { generatePDF } from '../services/pdfGenerator.js';
import { v4 as uuidv4 } from 'uuid';
import { transactionsStore } from './payment.js';

const router = express.Router();

// Store generated plans in memory (in production, use a database)
const plansStore = new Map();

// Analyze company data and return insights
router.post('/analyze', async (req, res) => {
  try {
    const companyData = req.body;
    
    if (!companyData.companyName || !companyData.industry) {
      return res.status(400).json({ 
        error: 'Missing required fields: companyName and industry are required' 
      });
    }

    const analysis = await analyzeCompany(companyData);
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze company data', details: error.message });
  }
});

// Generate full business plan
router.post('/business-plan', async (req, res) => {
  try {
    const companyData = req.body;
    
    if (!companyData.companyName || !companyData.industry) {
      return res.status(400).json({ 
        error: 'Missing required fields: companyName and industry are required' 
      });
    }

    const businessPlan = await generateBusinessPlan(companyData);
    const planId = uuidv4();
    
    // Store the plan for later PDF generation
    plansStore.set(planId, {
      ...businessPlan,
      companyData,
      createdAt: new Date().toISOString()
    });

    res.json({ 
      planId,
      ...businessPlan 
    });
  } catch (error) {
    console.error('Business plan error:', error);
    res.status(500).json({ error: 'Failed to generate business plan', details: error.message });
  }
});

// Download business plan as PDF
router.get('/business-plan/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    const plan = plansStore.get(id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Business plan not found' });
    }

    const pdfBuffer = await generatePDF(plan);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${plan.companyData.companyName}-business-plan.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
});

// Get stored business plan by ID
router.get('/business-plan/:id', (req, res) => {
  const { id } = req.params;
  const plan = plansStore.get(id);
  
  if (!plan) {
    return res.status(404).json({ error: 'Business plan not found' });
  }
  
  res.json(plan);
});

// Analyze company with payment verification
router.post('/paid', async (req, res) => {
  try {
    const { transactionId, companyData } = req.body;

    // Verify transaction
    const transaction = transactionsStore.get(transactionId);
    if (!transaction || transaction.status !== 'completed') {
      return res.status(403).json({ error: 'Invalid or incomplete transaction' });
    }

    // Generate analysis based on plan
    const analysis = await analyzeCompany(companyData);
    
    // Store analysis with transaction
    transaction.analysisId = analysis.analysisId || uuidv4();
    plansStore.set(transaction.analysisId, { analysis, companyData });

    res.json(analysis);
  } catch (error) {
    console.error('Paid analysis error:', error);
    res.status(500).json({ error: 'Failed to generate analysis', details: error.message });
  }
});

// Generate strategic plan (premium/enterprise only)
router.post('/strategic-plan', async (req, res) => {
  try {
    const { transactionId, companyData } = req.body;

    // Verify transaction and plan level
    const transaction = transactionsStore.get(transactionId);
    if (!transaction || transaction.status !== 'completed') {
      return res.status(403).json({ error: 'Invalid transaction' });
    }

    if (transaction.plan === 'basic') {
      return res.status(403).json({ 
        error: 'Strategic plan not included in Basic plan. Upgrade to Premium or Enterprise.' 
      });
    }

    const strategicPlan = await generateStrategicPlan(companyData, transaction.plan);
    const planId = uuidv4();
    
    plansStore.set(planId, {
      ...strategicPlan,
      companyData,
      transactionId,
      createdAt: new Date().toISOString()
    });

    res.json({ 
      planId,
      ...strategicPlan 
    });
  } catch (error) {
    console.error('Strategic plan error:', error);
    res.status(500).json({ error: 'Failed to generate strategic plan', details: error.message });
  }
});

export default router;
