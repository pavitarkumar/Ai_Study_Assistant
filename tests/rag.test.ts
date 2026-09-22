import { describe, it, expect } from 'vitest';
import { searchProvider } from '../lib/azure/search';

describe('RAG Multi-Tenant Document Isolation', () => {
  it('should retrieve documents for authorized user-demo-123', async () => {
    const results = await searchProvider.searchKnowledge('user-demo-123', 'deadlock', 3);
    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].userId).toBe('user-demo-123');
  });

  it('should return empty results for unauthorized non-existent user', async () => {
    const results = await searchProvider.searchKnowledge('user-unknown-999', 'deadlock', 3);
    expect(results.length).toBe(0);
  });

  it('should throw error when userId is missing', async () => {
    await expect(searchProvider.searchKnowledge('', 'deadlock', 3)).rejects.toThrow();
  });
});
