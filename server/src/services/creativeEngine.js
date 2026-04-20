const styleMap = {
  minimal: ['clean negative space', 'precise typography', 'quiet contrast'],
  bold: ['high contrast blocks', 'large editorial type', 'punchy geometric accents'],
  educational: ['diagram-first structure', 'clear hierarchy', 'friendly explanatory graphics'],
  playful: ['bright shapes', 'warm illustrations', 'curious visual metaphors'],
  viral: ['bold hook framing', 'high contrast editorial tension', 'scroll-stopping visual hierarchy']
};

const layoutSequence = ['title-heavy', 'split-text-image', 'infographic-style', 'quote-style'];

function titleFromIdea(idea) {
  const first = idea.replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean).slice(0, 7).join(' ');
  return first || 'Untitled Creative';
}

function inferAudience(idea) {
  const lower = idea.toLowerCase();
  if (lower.includes('kids') || lower.includes('student') || lower.includes('math')) return 'parents, teachers, and learning creators';
  if (lower.includes('startup') || lower.includes('business')) return 'founders and operators';
  if (lower.includes('fitness') || lower.includes('health')) return 'health-conscious beginners';
  return 'curious social media learners';
}

function inferTone(idea, brand) {
  if (brand?.toneOfVoice) return brand.toneOfVoice;
  if (idea.toLowerCase().includes('kids')) return 'simple, encouraging, educational';
  return 'clear, engaging, practical';
}

export function generateNarrative(idea, brand) {
  const cleanIdea = idea.trim();
  const hook = cleanIdea.toLowerCase().includes('forget')
    ? 'Your brain is not bad at learning. It is just following a curve.'
    : `Most people miss the real story behind: ${titleFromIdea(cleanIdea)}`;

  const storyline = `Start with a pattern interrupt, explain the hidden mechanism behind the idea, make the insight visual, then land on one action the audience can use today.`;
  const targetAudience = inferAudience(cleanIdea);
  const tone = inferTone(cleanIdea, brand);

  const slideBreakdown = [
    hook,
    'Name the problem in human language so the audience feels seen.',
    'Reveal the underlying model or insight with a simple visual metaphor.',
    'Show the cost of ignoring it and the payoff of solving it.',
    'Give a practical next step with a crisp CTA.'
  ];

  return { hook, storyline, slideBreakdown, tone, targetAudience };
}

export function generateSlides({ narrative, format = 'carousel', style = 'educational', brand }) {
  const count = format === 'post' ? 1 : format === 'story' ? 4 : 5;
  const color = brand?.colors?.[1] || '#f97316';
  const supporting = brand?.colors?.[2] || '#14b8a6';
  const styleSignals = styleMap[style] || styleMap.educational;

  return Array.from({ length: count }, (_, index) => {
    const source = narrative.slideBreakdown[index] || narrative.slideBreakdown.at(-1);
    const isFirst = index === 0;
    const isLast = index === count - 1;
    return {
      index,
      heading: isFirst ? narrative.hook : isLast ? 'Use the curve instead of fighting it' : source,
      subtext: isFirst
        ? 'A pattern interrupt that reframes the idea instantly.'
        : isLast
          ? 'Review sooner, space practice, and make memory part of the design.'
          : 'Keep one idea per slide. Make the viewer feel progress with every swipe.',
      visualTheme: style,
      layoutType: layoutSequence[index % layoutSequence.length],
      background: `linear-gradient(135deg, ${brand?.colors?.[3] || '#f8fafc'} 0%, #ffffff 58%, ${color}22 100%)`,
      imagePrompt: `${styleSignals.join(', ')} for "${source}" using ${color} and ${supporting}`,
      notes: isLast ? 'CTA slide' : ''
    };
  });
}

export function generateImage(slide, brand, style = 'educational') {
  const colors = brand?.colors?.length ? brand.colors : ['#111827', '#f97316', '#14b8a6', '#f8fafc'];
  const seed = encodeURIComponent(`${slide.heading}-${style}`);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
      <rect width="1200" height="1200" fill="${colors[3] || '#f8fafc'}"/>
      <circle cx="930" cy="260" r="220" fill="${colors[1] || '#f97316'}" opacity=".18"/>
      <rect x="118" y="170" width="330" height="330" rx="44" fill="${colors[2] || '#14b8a6'}" opacity=".2"/>
      <path d="M150 770 C 310 560, 510 940, 700 720 S 970 640, 1060 790" fill="none" stroke="${colors[1] || '#f97316'}" stroke-width="34" stroke-linecap="round"/>
      <g fill="${colors[0] || '#111827'}" opacity=".82">
        <circle cx="240" cy="750" r="28"/>
        <circle cx="520" cy="820" r="28"/>
        <circle cx="815" cy="675" r="28"/>
      </g>
      <text x="120" y="1040" font-family="Inter, Arial" font-size="44" font-weight="800" fill="${colors[0] || '#111827'}">CreatorOS visual</text>
    </svg>`;
  return `data:image/svg+xml;seed=${seed};utf8,${encodeURIComponent(svg)}`;
}

export function scoreCreative({ narrative, slides }) {
  const hookWords = (narrative.hook || '').split(/\s+/).filter(Boolean).length;
  const avgSlideWords = slides.reduce((sum, slide) => {
    return sum + `${slide.heading} ${slide.subtext}`.split(/\s+/).filter(Boolean).length;
  }, 0) / Math.max(slides.length, 1);
  const hookStrength = Math.max(48, Math.min(96, 84 - Math.abs(12 - hookWords) * 3));
  const readability = Math.max(42, Math.min(94, 96 - Math.max(0, avgSlideWords - 22) * 2));
  const engagementPrediction = Math.round((hookStrength * 0.42) + (readability * 0.28) + 24);
  const suggestions = [];

  if (hookStrength < 72) suggestions.push('Hook is weak. Add a curiosity gap or sharper contradiction.');
  if (readability < 76) suggestions.push('Too much text on one or more slides. Keep each slide to one idea.');
  if (!slides.at(-1)?.heading.toLowerCase().includes('use')) suggestions.push('Final slide can be more action-oriented.');
  if (!suggestions.length) suggestions.push('Strong flow. Test a bolder visual contrast on slide 1.');

  return {
    hookStrength: Math.round(hookStrength),
    readability: Math.round(readability),
    engagementPrediction: Math.round(Math.min(97, engagementPrediction)),
    suggestions
  };
}

export function generateCaptionAndHashtags({ narrative, project }) {
  const caption = `${narrative.hook}\n\n${narrative.storyline}\n\nSave this for the next time you turn an idea into content.`;
  const base = ['#CreatorOS', '#ContentDesign', '#SocialMediaDesign', '#Storytelling'];
  const niche = project.roughIdea.toLowerCase().includes('math')
    ? ['#LearningScience', '#MathTips', '#StudySmarter']
    : ['#CreatorTools', '#ContentStrategy', '#BrandDesign'];
  const ctas = ['Save this carousel', 'Share it with a creator friend', 'Try this framework on your next post'];
  return { caption, hashtags: [...base, ...niche], ctas };
}

export function rewriteCopy(slide, mode) {
  const suffix = {
    simpler: 'In plain terms.',
    engaging: 'Here is the part most people miss.',
    formal: 'The key implication is measurable and practical.'
  }[mode] || 'Here is the clearer version.';

  return {
    ...slide,
    heading: mode === 'engaging' ? slide.heading.replace(/\.$/, '') + '?' : slide.heading,
    subtext: `${suffix} ${slide.subtext}`.slice(0, 180)
  };
}
