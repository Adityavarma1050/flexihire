import { initDB } from '../config/db.js';
import mongoose from 'mongoose';

console.log('🚀 Initializing FlexiHire MongoDB Database Collections & Seed Data...');

initDB().then(() => {
  console.log('🎉 MongoDB Setup Completed Successfully!');
  mongoose.connection.close();
  process.exit(0);
}).catch((err) => {
  console.error('❌ Failed to initialize MongoDB:', err);
  process.exit(1);
});
