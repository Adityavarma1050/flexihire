import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    company_name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: '',
    },
    average_rating: {
      type: Number,
      default: 0,
    },
    reviews_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

companySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Company = mongoose.model('Company', companySchema);
export default Company;
