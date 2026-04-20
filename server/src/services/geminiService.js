import { env } from '../config/env.js';

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Gemini response did not include JSON');
  return JSON.parse(raw.slice(start, end + 1));
}

async function callGemini(prompt, model = env.googleTextModel) {
  if (!env.googleAiApiKey) return null;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.googleAiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.75,
          responseMimeType: 'application/json'
        }
      })
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Gemini request failed: ${response.status} ${detail}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n');
  if (!text) throw new Error('Gemini response was empty');
  return extractJson(text);
}

export async function generateNarrativeWithGemini(idea, brand) {
  const prompt = `
You are CreatorOS, an expert social media narrative designer.
Transform the rough idea into JSON only.

Rough idea:
${idea}

Brand:
${JSON.stringify({
  colors: brand?.colors || [],
  fonts: brand?.fonts || {},
  toneOfVoice: brand?.toneOfVoice || ''
})}

Return exactly this JSON shape:
{
  "hook": "pattern interrupt for slide 1",
  "storyline": "one concise sentence describing the arc",
  "slideBreakdown": ["slide 1 hook", "slide 2 insight", "slide 3 proof", "slide 4 application", "slide 5 CTA"],
  "tone": "tone description",
  "targetAudience": "audience description"
}

Rules:
- Slide 1 must be a hook with a pattern interrupt.
- Middle slides must build insight visually.
- Final slide must end with a clear takeaway or CTA.
- Do not return markdown.
`;

  return callGemini(prompt);
}

export async function generateSlidesWithGemini({ narrative, format, style, brand }) {
  const count = format === 'post' ? 1 : format === 'story' ? 4 : 5;
  const prompt = `
Create ${count} editable social creative slides as JSON only.

Narrative:
${JSON.stringify(narrative)}

Format: ${format}
Style: ${style}
Brand:
${JSON.stringify({
  colors: brand?.colors || [],
  fonts: brand?.fonts || {},
  toneOfVoice: brand?.toneOfVoice || ''
})}

Return exactly:
{
  "slides": [
    {
      "heading": "short heading",
      "subtext": "supporting copy, max 28 words",
      "visualTheme": "${style}",
      "layoutType": "title-heavy | split-text-image | quote-style | infographic-style",
      "imagePrompt": "specific visual prompt for a consistent generated background/illustration",
      "notes": "optional editorial note"
    }
  ]
}

Rules:
- Use exactly ${count} slides.
- Keep each slide editable and not too text-heavy.
- Make the first slide hook-heavy and the last slide CTA/takeaway-heavy.
- Use only the allowed layoutType values.
- Do not return markdown.
`;

  const result = await callGemini(prompt);
  return Array.isArray(result?.slides) ? result.slides : null;
}
