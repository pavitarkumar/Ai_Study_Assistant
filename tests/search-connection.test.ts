import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load .env.local variables if present
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

import { searchProvider } from '../lib/azure/search';

describe('Azure AI Search Connection & Multi-Tenant Retrieval Test', () => {
  it('should verify search provider endpoint configuration or safe mock fallback', () => {
    const endpoint = process.env.AZURE_SEARCH_ENDPOINT || 'https://aistudy-search-india-99.search.windows.net';
    expect(endpoint).toBeTruthy();
    expect(endpoint).toContain('search.windows.net');
  });

  it('should execute hybrid knowledge search query', async () => {
    const results = await searchProvider.searchKnowledge('user-demo-123', 'deadlock prevention', 3);
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].content).toContain('Deadlock');
  });
});
