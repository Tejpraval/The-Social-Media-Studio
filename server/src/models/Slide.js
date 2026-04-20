import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    index: { type: Number, required: true },
    heading: { type: String, required: true },
    subtext: { type: String, default: '' },
    visualTheme: { type: String, default: 'minimal' },
    layoutType: {
      type: String,
      enum: ['title-heavy', 'split-text-image', 'quote-style', 'infographic-style'],
      default: 'title-heavy'
    },
    imagePrompt: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    background: { type: String, default: '' },
    notes: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const Slide = mongoose.model('Slide', slideSchema);
