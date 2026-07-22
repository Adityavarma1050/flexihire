import mongoose from 'mongoose';

const companyReviewSchema = new mongoose.Schema(
  {
    seeker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    review_text: {
      type: String,
      required: [true, 'Please write a review message'],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent a user from leaving more than one review per company
companyReviewSchema.index({ seeker_id: 1, company_id: 1 }, { unique: true });

companyReviewSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const CompanyReview = mongoose.model('CompanyReview', companyReviewSchema);
export default CompanyReview;
