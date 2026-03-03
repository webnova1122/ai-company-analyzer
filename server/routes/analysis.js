import express from 'express';
import { analyzeCompany, generateBusinessPlan } from '../services/analyzer.js';
import { generatePDF } from '../services/pdfGenerator.js';
import { v4 as uuidv4 } from 'uuid';
import BusinessPlan from '../models/BusinessPlan.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Analyze company data and return insights
router.post('/analyze', requireAuth, async (req, res) => {
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
    const message = error?.message || String(error);
    res.status(500).json({
      error: 'Failed to analyze company data',
      details: message
    });
  }
});

// Generate full business plan (linked to user)
router.post('/business-plan', requireAuth, async (req, res) => {
  try {
    const companyData = req.body;
    
    if (!companyData.companyName || !companyData.industry) {
      return res.status(400).json({ 
        error: 'Missing required fields: companyName and industry are required' 
      });
    }

    const businessPlan = await generateBusinessPlan(companyData);
    const planId = uuidv4();
    
    const savedPlan = BusinessPlan.create({
      planId,
      userId: req.user.uid,
      companyData,
      ...businessPlan
    });

    res.json({ 
      planId: savedPlan.planId,
      ...businessPlan 
    });
  } catch (error) {
    console.error('Business plan error:', error);
    res.status(500).json({ error: 'Failed to generate business plan', details: error.message });
  }
});

// Get all plans for the authenticated user
router.get('/my-plans', requireAuth, (req, res) => {
  try {
    const plans = BusinessPlan.findByUserId(req.user.uid);
    res.json(plans);
  } catch (error) {
    console.error('Error fetching user plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans', details: error.message });
  }
});

// Download business plan as PDF (only if owned by user)
router.get('/business-plan/:id/pdf', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const plan = BusinessPlan.findById(id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Business plan not found' });
    }

    if (plan.userId && plan.userId !== req.user.uid) {
      return res.status(403).json({ error: 'You do not have access to this plan' });
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

// Get stored business plan by ID (only if owned by user)
router.get('/business-plan/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const plan = BusinessPlan.findById(id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Business plan not found' });
    }

    if (plan.userId && plan.userId !== req.user.uid) {
      return res.status(403).json({ error: 'You do not have access to this plan' });
    }
    
    res.json(plan);
  } catch (error) {
    console.error('Error fetching business plan:', error);
    res.status(500).json({ error: 'Failed to fetch business plan', details: error.message });
  }
});

export default router;
