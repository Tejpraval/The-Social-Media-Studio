export const demoBrand = {
  name: 'CreatorOS Demo',
  colors: ['#f8fafc', '#f97316', '#14b8a6', '#0b1120'],
  fonts: { heading: 'Inter', body: 'Inter' },
  toneOfVoice: 'clear, confident, curiosity-led'
};

export const demoProject = {
  _id: 'demo-project',
  title: 'Why kids forget math',
  format: 'carousel',
  style: 'viral',
  caption: 'Kids do not forget math because they are lazy. Their memory follows a curve. Design review around the curve and learning starts to stick.',
  hashtags: ['#CreatorOS', '#LearningScience', '#MathTips', '#StudySmarter'],
  ctas: ['Save this framework', 'Try spaced review', 'Share with a parent'],
  narrative: {
    hook: 'Kids are not bad at math. Their memory is just doing its job.',
    targetAudience: 'parents, teachers, and learning creators',
    tone: 'simple, visual, practical'
  },
  intelligence: {
    hookStrength: 88,
    readability: 91,
    engagementPrediction: 86,
    suggestions: ['Strong hook. Keep slide 2 under 20 words.', 'CTA is clear. Add one action verb for more urgency.']
  }
};

export const demoSlides = [
  {
    index: 0,
    heading: 'Kids are not bad at math.',
    subtext: 'Their brain is following a forgetting curve.',
    visualTheme: 'viral',
    layoutType: 'title-heavy',
    imagePrompt: 'bold memory curve visual for math learning',
    background: 'linear-gradient(135deg, #0b1120 0%, #111827 52%, #f9731622 100%)'
  },
  {
    index: 1,
    heading: 'Memory fades fastest right after learning.',
    subtext: 'That first review window matters more than another long worksheet.',
    visualTheme: 'educational',
    layoutType: 'infographic-style',
    imagePrompt: 'clean forgetting curve chart with warm accent',
    textColor: '#111827',
    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 54%, #14b8a622 100%)'
  },
  {
    index: 2,
    heading: 'The fix is spacing, not pressure.',
    subtext: 'Short reviews today, tomorrow, and next week beat one big revision session.',
    visualTheme: 'minimal',
    layoutType: 'split-text-image',
    imagePrompt: 'minimal spaced repetition timeline',
    textColor: '#111827',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 58%, #f9731620 100%)'
  },
  {
    index: 3,
    heading: 'Make review part of the design.',
    subtext: 'Teach less at once. Revisit more deliberately.',
    visualTheme: 'bold',
    layoutType: 'quote-style',
    imagePrompt: 'bold quote style education graphic',
    background: 'linear-gradient(135deg, #111827 0%, #0f766e 58%, #f97316 100%)'
  }
];
