import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User.js';
import { BrandProfile } from '../models/BrandProfile.js';
import { signToken } from '../utils/tokens.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = express.Router();

const credentialsSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(120)
});

authRouter.post('/register', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid registration details' });

  const { name = 'Creator', email, password } = parsed.data;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email is already registered' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  await BrandProfile.create({ user: user._id, name: `${name}'s Brand` });

  res.status(201).json({
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email }
  });
});

authRouter.post('/login', async (req, res) => {
  const parsed = credentialsSchema.omit({ name: true }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid login details' });

  const user = await User.findOne({ email: parsed.data.email });
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

  res.json({
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email }
  });
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
});
