import express from 'express';
import { getCompanyReviews, createCompanyReview } from '../controllers/companyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id/reviews', getCompanyReviews);
router.post('/:id/reviews', protect, createCompanyReview);

export default router;
