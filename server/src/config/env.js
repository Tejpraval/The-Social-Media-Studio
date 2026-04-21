import dotenv from 'dotenv';

dotenv.config();

const clientUrls = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5174')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

export const env = {
  port: process.env.PORT || 8081,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/creatoros',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-this-secret',
  clientUrl: clientUrls[0],
  clientUrls,
  googleAiApiKey: process.env.GOOGLE_AI_API_KEY || '',
  googleTextModel: process.env.GOOGLE_TEXT_MODEL || 'gemini-2.5-flash-lite',
  googleImageModel: process.env.GOOGLE_IMAGE_MODEL || 'gemini-2.5-flash-image',
  imageApiKey: process.env.IMAGE_API_KEY || ''
};
