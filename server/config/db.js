import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';

// Fix for Windows DNS querySrv ECONNREFUSED on MongoDB Atlas SRV URLs
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Fallback if custom DNS cannot be set
}

import User from '../models/User.js';
import Company from '../models/Company.js';
import Category from '../models/Category.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import SavedJob from '../models/SavedJob.js';
import Notification from '../models/Notification.js';
import SupportTicket from '../models/SupportTicket.js';
import SupportMessage from '../models/SupportMessage.js';
import CompanyReview from '../models/CompanyReview.js';

dotenv.config();

const defaultCategories = [
  { name: 'Software Development', slug: 'software-development', description: 'Web, Mobile, Backend, and Frontend roles' },
  { name: 'Design & Creative', slug: 'design-creative', description: 'UI/UX, Visual Design, Motion, and Branding' },
  { name: 'Product Management', slug: 'product-management', description: 'Product Owners, Technical Program Managers' },
  { name: 'Marketing & Sales', slug: 'marketing-sales', description: 'Growth, SEO, Content, Account Executives' },
  { name: 'Customer Support', slug: 'customer-support', description: 'Technical Support, Customer Success' },
  { name: 'Data & Analytics', slug: 'data-analytics', description: 'Data Engineering, Business Intelligence, Data Science' },
];

export const initDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flexihire';
    
    // Mask password in URI for clean console logging
    const maskedURI = mongoURI.replace(/:([^:@]+)@/, ':****@');
    const isCloud = mongoURI.includes('mongodb+srv') || mongoURI.includes('.mongodb.net');
    
    console.log(`🔄 Connecting to ${isCloud ? '🌐 Cloud MongoDB Atlas' : '💻 Local MongoDB'} (${maskedURI})...`);
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    
    const hostName = mongoose.connection.host;
    const dbName = mongoose.connection.name;
    console.log(`✅ Connected to MongoDB Database: "${dbName}" on host: ${hostName}`);

    // Ensure all MongoDB collections ("tables") and indexes exist
    const models = [
      User,
      Company,
      Category,
      Job,
      Application,
      SavedJob,
      Notification,
      SupportTicket,
      SupportMessage,
      CompanyReview,
    ];

    for (const model of models) {
      await model.createCollection();
      await model.init();
    }
    console.log('📦 All 9 MongoDB collections initialized successfully (users, companies, categories, jobs, applications, savedjobs, notifications, supporttickets, supportmessages).');

    // Auto-seed initial categories if empty
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding default categories into MongoDB...');
      await Category.insertMany(defaultCategories);
    }

    // Auto-seed demo accounts if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding demo accounts into MongoDB...');
      const defaultPasswordHash = await bcrypt.hash('password123', 10);

      const seeker = await User.create({
        full_name: 'John Seeker',
        email: 'seeker@flexihire.com',
        password_hash: defaultPasswordHash,
        role: 'job_seeker',
        phone: '+1 555-0192',
        bio: 'Full Stack React & Node Developer with 3+ years experience building web applications.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      });

      const employer = await User.create({
        full_name: 'Sarah Employer',
        email: 'employer@techcorp.com',
        password_hash: defaultPasswordHash,
        role: 'employer',
        phone: '+1 555-0199',
        bio: 'Head of Talent Acquisition at TechCorp Systems.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      });

      await User.create({
        full_name: 'FlexiHire Admin',
        email: 'admin@flexihire.com',
        password_hash: defaultPasswordHash,
        role: 'admin',
        phone: '+1 555-0100',
        bio: 'Platform Administrator.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      });

      const company = await Company.create({
        user_id: employer._id,
        company_name: 'TechCorp Systems',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        website: 'https://techcorp-example.com',
        location: 'San Francisco, CA',
        description: 'Building next-generation cloud infrastructure and developer tools.',
        industry: 'Software & Cloud',
      });

      const devCategory = await Category.findOne({ slug: 'software-development' });

      if (devCategory) {
        await Job.create({
          employer_id: employer._id,
          company_id: company._id,
          category_id: devCategory._id,
          title: 'Senior React / Full Stack Engineer',
          description: 'We are seeking an experienced Full Stack Engineer proficient in React, Node.js, and MongoDB to join our core architecture team.',
          requirements: '5+ years experience with React and Express. Experience with MongoDB & Mongoose. Strong API design skills.',
          job_type: 'Full-Time',
          workplace_type: 'Remote',
          location: 'San Francisco, CA (Remote)',
          salary_min: 120000,
          salary_max: 160000,
          experience_level: 'Senior Level',
          status: 'open',
        });
      }
      console.log('✅ Demo data seeded successfully.');
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};
