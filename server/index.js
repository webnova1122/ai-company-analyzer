import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import analysisRoutes from './routes/analysis.js';
import paymentRoutes from './routes/payment.js';
import emailRoutes from './routes/email.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (one level up from server directory)
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', analysisRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/email', emailRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Company Analyzer API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 AI Company Analyzer API ready`);
});
