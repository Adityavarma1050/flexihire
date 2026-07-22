import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    seeker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume_url: {
      type: String,
      default: '',
    },
    cover_letter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: { createdAt: 'applied_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

applicationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
