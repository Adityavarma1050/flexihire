import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    employer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: String,
      default: '',
    },
    job_type: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Internship', 'Freelance', 'Temporary', 'Weekend'],
      default: 'Full-Time',
    },
    workplace_type: {
      type: String,
      enum: ['Remote', 'On-Site', 'Hybrid'],
      default: 'Remote',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    salary_min: {
      type: Number,
      default: 0,
    },
    salary_max: {
      type: Number,
      default: 0,
    },
    experience_level: {
      type: String,
      default: 'Entry',
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
