import mongoose from 'mongoose';

const supportMessageSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SupportTicket',
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

supportMessageSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const SupportMessage = mongoose.model('SupportMessage', supportMessageSchema);
export default SupportMessage;
