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

describe('Azure Speech Service Connection & Provider Test', () => {
  it('should verify Speech region configuration', async () => {
    const { azureConfig } = await import('../lib/azure/config');
    expect(azureConfig.speech.region).toBeTruthy();
  });

  it('should execute speech-to-text processing', async () => {
    const { speechProvider } = await import('../lib/azure/speech');
    const result = await speechProvider.speechToText();
    expect(result).toBeDefined();
    expect(result.text).toBeTruthy();
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should execute text-to-speech processing', async () => {
    const { speechProvider } = await import('../lib/azure/speech');
    const speechResult = await speechProvider.textToSpeech('Welcome to AI Study Assistant');
    expect(speechResult).toBeDefined();
    expect(speechResult.durationMs).toBeGreaterThan(0);
  });
});
