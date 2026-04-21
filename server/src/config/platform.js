export const platform = {
  name: 'CreatorOS',
  apiVersion: 'v1',
  product: 'AI creative operating system',
  clients: ['web', 'mobile-ready'],
  ai: {
    provider: 'google-gemini',
    textGeneration: true,
    imageGenerationReady: true,
    fallbackEngine: true
  },
  capabilities: {
    auth: true,
    brandProfiles: true,
    projectPersistence: true,
    slideEditing: true,
    exportPng: true,
    exportZip: true,
    creativeIntelligence: true
  },
  formats: ['post', 'carousel', 'story'],
  styles: ['minimal', 'bold', 'educational', 'viral']
};
