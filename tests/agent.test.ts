import { describe, it, expect } from 'vitest';
import { studyAgent } from '../lib/ai/agent';

describe('Central AI Study Agent', () => {
  it('should answer student query using study context', async () => {
    const res = await studyAgent.run('user-demo-123', 'Explain polymorphism in Java.');
    expect(res).toBeDefined();
    expect(res.answer).toContain('Polymorphism');
  });

  it('should select study plan tools when asked what to study today', async () => {
    const res = await studyAgent.run('user-demo-123', 'What should I study today?');
    expect(res.usedTools).toContain('getStudentProgress');
    expect(res.usedTools).toContain('getWeakTopics');
  });
});
