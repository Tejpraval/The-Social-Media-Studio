import mongoose from 'mongoose';

const brandProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, default: 'CreatorOS Brand' },
    colors: {
      type: [String],
      default: ['#111827', '#f97316', '#14b8a6', '#f8fafc']
    },
    fonts: {
      heading: { type: String, default: 'Inter' },
      body: { type: String, default: 'Inter' }
    },
    toneOfVoice: { type: String, default: 'clear, practical, optimistic' },
    logoUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

export const BrandProfile = mongoose.model('BrandProfile', brandProfileSchema);
