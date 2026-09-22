export const azureConfig = {
  isMockMode: (process.env.AI_PROVIDER || 'mock').toLowerCase() === 'mock',
  foundry: {
    endpoint: (process.env.AZURE_FOUNDRY_ENDPOINT || 'https://aistudy101.services.ai.azure.com/').replace(/\/+$/, ''),
    project: process.env.AZURE_FOUNDRY_PROJECT || 'Aiassistant',
    deployment: process.env.AZURE_MODEL_DEPLOYMENT || 'Aiassistant',
    apiKey: process.env.AZURE_FOUNDRY_KEY || '',
  },
  search: {
    endpoint: process.env.AZURE_SEARCH_ENDPOINT || '',
    key: process.env.AZURE_SEARCH_KEY || '',
    index: process.env.AZURE_SEARCH_INDEX || 'study-documents-index',
  },
  storage: {
    account: process.env.AZURE_STORAGE_ACCOUNT || '',
    container: process.env.AZURE_STORAGE_CONTAINER || 'study-materials',
  },
  speech: {
    key: process.env.AZURE_SPEECH_KEY || '',
    region: process.env.AZURE_SPEECH_REGION || 'eastus',
  },
  documentIntelligence: {
    endpoint: process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT || '',
    key: process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY || '',
  },
  vision: {
    endpoint: process.env.AZURE_VISION_ENDPOINT || '',
    key: process.env.AZURE_VISION_KEY || '',
  },
};
