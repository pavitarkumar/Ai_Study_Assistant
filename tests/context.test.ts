import { describe, it, expect } from 'vitest';
import { retrievePersonalizedContext } from '../lib/ai/contextEngine';

describe('Personalized Context Engine', () => {
  it('should retrieve student profile, weak topics, and RAG chunks for user', async () => {
    const context = await retrievePersonalizedContext('user-demo-123', 'deadlock prevention');
    expect(context.userId).toBe('user-demo-123');
    expect(context.weakTopics).toBeDefined();
    expect(context.weakTopics).toContain('Graphs');
    expect(context.formattedSystemContext).toContain('STUDENT PERSONALIZED CONTEXT');
  });
});
