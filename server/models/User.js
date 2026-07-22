import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: ['job_seeker', 'employer', 'admin'],
      default: 'job_seeker',
    },
    phone: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to present _id as id string for frontend compatibility
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const User = mongoose.model('User', userSchema);
export default User;
