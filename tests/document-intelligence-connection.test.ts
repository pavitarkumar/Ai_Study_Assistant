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

import { documentIntelligence } from '../lib/azure/documentIntelligence';

describe('Azure Document Intelligence Connection & Pipeline Validation', () => {
  it('should verify document intelligence pipeline availability', () => {
    expect(documentIntelligence).toBeDefined();
    expect(typeof documentIntelligence.processDocument).toBe('function');
  });

  it('should process a document through the document intelligence pipeline', async () => {
    const result = await documentIntelligence.processDocument('user-demo-123', 'Operating Systems Notes.pdf');
    expect(result).toBeDefined();
    expect(result.status).toBe('Indexed');
    expect(result.topics.length).toBeGreaterThan(0);
    expect(result.chunks.length).toBeGreaterThan(0);
  });
});
