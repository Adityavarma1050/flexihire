import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema(
  {
    seeker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'saved_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

savedJobSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const SavedJob = mongoose.model('SavedJob', savedJobSchema);
export default SavedJob;
