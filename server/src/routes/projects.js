import express from 'express';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { BrandProfile } from '../models/BrandProfile.js';
import { Project } from '../models/Project.js';
import { Slide } from '../models/Slide.js';
import {
  generateCaptionAndHashtags,
  generateImage,
  generateNarrative,
  generateSlides,
  rewriteCopy,
  scoreCreative
} from '../services/creativeEngine.js';
import { generateNarrativeWithGemini, generateSlidesWithGemini } from '../services/geminiService.js';

export const projectRouter = express.Router();
projectRouter.use(requireAuth);

const createSchema = z.object({
  roughIdea: z.string().min(8).max(1200),
  format: z.enum(['post', 'carousel', 'story']).default('carousel'),
  style: z.enum(['minimal', 'bold', 'educational', 'playful', 'viral']).default('educational')
});

const slideUpdateSchema = z.object({
  slides: z.array(z.object({
    _id: z.string().optional(),
    index: z.number(),
    heading: z.string().min(1).max(140),
    subtext: z.string().max(300).default(''),
    visualTheme: z.string().default('educational'),
    layoutType: z.enum(['title-heavy', 'split-text-image', 'quote-style', 'infographic-style']),
    imagePrompt: z.string().default(''),
    imageUrl: z.string().default(''),
    background: z.string().default(''),
    textColor: z.string().default(''),
    notes: z.string().default(''),
    meta: z.record(z.any()).optional()
  }))
});

projectRouter.get('/', async (req, res) => {
  const projects = await Project.find({ user: req.user._id }).sort({ updatedAt: -1 }).limit(30);
  res.json({ projects });
});

projectRouter.post('/generate', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid generation request' });

  const brand = await BrandProfile.findOne({ user: req.user._id });
  let narrative = generateNarrative(parsed.data.roughIdea, brand);
  let baseSlides = generateSlides({ ...parsed.data, narrative, brand });

  try {
    narrative = await generateNarrativeWithGemini(parsed.data.roughIdea, brand) || narrative;
    baseSlides = await generateSlidesWithGemini({ ...parsed.data, narrative, brand }) || baseSlides;
  } catch (error) {
    console.warn('Gemini generation failed, using local fallback:', error.message);
  }

  const generatedSlides = baseSlides.map((slide, index) => ({
    ...slide,
    index,
    imageUrl: generateImage(slide, brand, parsed.data.style)
  }));
  const intelligence = scoreCreative({ narrative, slides: generatedSlides });
  const projectExtras = generateCaptionAndHashtags({
    narrative,
    project: { roughIdea: parsed.data.roughIdea }
  });

  const project = await Project.create({
    user: req.user._id,
    title: narrative.hook.slice(0, 80),
    roughIdea: parsed.data.roughIdea,
    format: parsed.data.format,
    style: parsed.data.style,
    narrative,
    intelligence,
    shareId: nanoid(12),
    ...projectExtras
  });

  const slides = await Slide.insertMany(generatedSlides.map((slide) => ({ ...slide, project: project._id })));
  res.status(201).json({ project, slides });
});

projectRouter.get('/:id', async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const slides = await Slide.find({ project: project._id }).sort({ index: 1 });
  res.json({ project, slides });
});

projectRouter.put('/:id/slides', async (req, res) => {
  const parsed = slideUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid slides payload' });

  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
  if (!project) return res.status(404).json({ message: 'Project not found' });

  await Slide.deleteMany({ project: project._id });
  const slides = await Slide.insertMany(parsed.data.slides.map((slide, index) => ({
    ...slide,
    _id: undefined,
    project: project._id,
    index
  })));
  const intelligence = scoreCreative({ narrative: project.narrative, slides });
  project.intelligence = intelligence;
  await project.save();
  res.json({ project, slides });
});

projectRouter.post('/:id/regenerate-slide/:slideId', async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const brand = await BrandProfile.findOne({ user: req.user._id });
  const slide = await Slide.findOne({ _id: req.params.slideId, project: project._id });
  if (!slide) return res.status(404).json({ message: 'Slide not found' });

  slide.visualTheme = req.body.style || project.style;
  slide.layoutType = req.body.layoutType || slide.layoutType;
  slide.imageUrl = generateImage(slide, brand, slide.visualTheme);
  slide.subtext = `Fresh angle: ${slide.subtext}`.slice(0, 220);
  await slide.save();

  res.json({ slide });
});

projectRouter.post('/:id/rewrite-slide/:slideId', async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const slide = await Slide.findOne({ _id: req.params.slideId, project: project._id });
  if (!slide) return res.status(404).json({ message: 'Slide not found' });

  Object.assign(slide, rewriteCopy(slide.toObject(), req.body.mode));
  await slide.save();
  res.json({ slide });
});
