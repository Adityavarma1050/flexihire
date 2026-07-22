import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import savedJobRoutes from './routes/savedJobRoutes.js';
import employerRoutes from './routes/employerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import companyRoutes from './routes/companyRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    app: 'FlexiHire REST API',
    time: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved', savedJobRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/companies', companyRoutes);

// Global Error Handler
app.use(errorHandler);

// Initialize DB and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 FlexiHire Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
});
