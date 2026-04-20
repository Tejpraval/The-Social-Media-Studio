import express from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { BrandProfile } from '../models/BrandProfile.js';

export const brandRouter = express.Router();
brandRouter.use(requireAuth);

const brandSchema = z.object({
  name: z.string().min(2).max(80),
  colors: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).min(3).max(6),
  fonts: z.object({
    heading: z.string().min(2).max(40),
    body: z.string().min(2).max(40)
  }),
  toneOfVoice: z.string().min(4).max(180),
  logoUrl: z.string().url().or(z.literal('')).optional()
});

brandRouter.get('/', async (req, res) => {
  const brand = await BrandProfile.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { user: req.user._id } },
    { upsert: true, new: true }
  );
  res.json({ brand });
});

brandRouter.put('/', async (req, res) => {
  const parsed = brandSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid brand profile' });

  const brand = await BrandProfile.findOneAndUpdate(
    { user: req.user._id },
    { ...parsed.data, user: req.user._id },
    { upsert: true, new: true }
  );
  res.json({ brand });
});
