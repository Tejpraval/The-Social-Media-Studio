import mongoose from 'mongoose';

const narrativeSchema = new mongoose.Schema(
  {
    hook: String,
    storyline: String,
    slideBreakdown: [String],
    tone: String,
    targetAudience: String
  },
  { _id: false }
);

const intelligenceSchema = new mongoose.Schema(
  {
    hookStrength: { type: Number, default: 72 },
    readability: { type: Number, default: 78 },
    engagementPrediction: { type: Number, default: 74 },
    suggestions: { type: [String], default: [] }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    format: { type: String, enum: ['post', 'carousel', 'story'], default: 'carousel' },
    roughIdea: { type: String, required: true },
    style: { type: String, default: 'educational' },
    themeMode: { type: String, enum: ['light', 'dark', 'brand'], default: 'brand' },
    narrative: narrativeSchema,
    intelligence: intelligenceSchema,
    caption: { type: String, default: '' },
    hashtags: { type: [String], default: [] },
    ctas: { type: [String], default: [] },
    shareId: { type: String, index: true }
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
