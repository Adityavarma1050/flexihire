import mongoose from 'mongoose';
import CompanyReview from '../models/CompanyReview.js';
import Company from '../models/Company.js';

// Helper to recalculate and cache company rating metrics
const updateCompanyRatingMetrics = async (companyId) => {
  const reviews = await CompanyReview.find({ company_id: companyId });
  const reviewsCount = reviews.length;
  let averageRating = 0;
  
  if (reviewsCount > 0) {
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    averageRating = parseFloat((total / reviewsCount).toFixed(1));
  }

  await Company.findByIdAndUpdate(companyId, {
    average_rating: averageRating,
    reviews_count: reviewsCount,
  });
};

// @desc    Get all reviews for a company
// @route   GET /api/companies/:id/reviews
// @access  Public
export const getCompanyReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID.' });
    }

    const rawReviews = await CompanyReview.find({ company_id: id })
      .populate('seeker_id', 'full_name avatar')
      .sort({ created_at: -1 });

    const reviews = rawReviews.map((r) => {
      const obj = r.toObject();
      const seeker = obj.seeker_id && typeof obj.seeker_id === 'object' ? obj.seeker_id : {};
      return {
        ...obj,
        id: obj._id.toString(),
        seeker_id: seeker._id ? seeker._id.toString() : obj.seeker_id,
        seeker_name: seeker.full_name || 'Job Seeker',
        seeker_avatar: seeker.avatar || '',
      };
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review for a company
// @route   POST /api/companies/:id/reviews
// @access  Private (Job Seeker)
export const createCompanyReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, review_text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid company ID.' });
    }

    // Verify user is a job seeker
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ success: false, message: 'Only Job Seekers can leave reviews for companies.' });
    }

    if (!rating || !review_text) {
      return res.status(400).json({ success: false, message: 'Please provide both a rating and review comments.' });
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5.' });
    }

    // Check if company exists
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    // Check if duplicate review exists
    const existingReview = await CompanyReview.findOne({ company_id: id, seeker_id: req.user.id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this company.' });
    }

    // Create review
    const review = await CompanyReview.create({
      company_id: id,
      seeker_id: req.user.id,
      rating: ratingNum,
      review_text: review_text.trim(),
    });

    // Update Company metrics cache
    await updateCompanyRatingMetrics(id);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review: {
        ...review.toObject(),
        id: review._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};
