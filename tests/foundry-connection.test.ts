import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load .env.local variables for Node Vitest environment
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

import { foundryAI } from '../lib/azure/foundry';
import { azureConfig } from '../lib/azure/config';

describe('Microsoft AI Services / Foundry Connection Test', () => {
  it('should verify endpoint and deployment configuration values', () => {
    expect(azureConfig.foundry.endpoint).toBeTruthy();
    expect(azureConfig.foundry.deployment).toBeTruthy();
  });

  it('should execute an AI completion request', async () => {
    const result = await foundryAI.generateCompletion('Explain deadlock prevention in 2 sentences.');
    expect(result).toBeDefined();
    expect(result.text).toBeTruthy();
    expect(typeof result.text).toBe('string');
  });

  it('should accurately answer factual questions like "who is modi"', async () => {
    const result = await foundryAI.generateCompletion('who is modi');
    expect(result.text).toContain('Modi');
  }, 10000);

  it('should answer greetings politely without textbook formatting', async () => {
    const result = await foundryAI.generateCompletion('hi');
    expect(result.text).toContain('Hello');
  }, 10000);

  it('should accurately calculate math expressions like "5+5"', async () => {
    const result = await foundryAI.generateCompletion('5+5');
    expect(result.text).toContain('10');
  }, 10000);

  it('should accurately answer university location questions like "where is chitkara university"', async () => {
    const result = await foundryAI.generateCompletion('where is chitkara university');
    expect(result.text).toContain('Punjab');
    expect(result.text).toContain('Rajpura');
  }, 10000);
});
