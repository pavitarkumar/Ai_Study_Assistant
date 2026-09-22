import { describe, it, expect } from 'vitest';
import { dbStore } from '../lib/db';
import { studyAgent } from '../lib/ai/agent';

describe('AI Study Chat & Conversation Memory', () => {
  it('should store and retrieve multi-turn messages within a conversation', () => {
    const conv = dbStore.createConversation('user-demo-123', 'Test Memory Session');
    dbStore.addMessage(conv.id, 'user', 'Explain polymorphism in Java.');
    dbStore.addMessage(conv.id, 'assistant', 'Polymorphism allows objects of different classes...');
    dbStore.addMessage(conv.id, 'user', 'Give me a C++ example.');

    const history = dbStore.getMessages(conv.id);
    expect(history.length).toBe(3);
    expect(history[0].content).toContain('polymorphism');
    expect(history[2].content).toContain('C++');
  });

  it('should answer "explain recursion in detailed" with base case, recursive step, and call stack', async () => {
    const conv = dbStore.createConversation('user-demo-123', 'Recursion Deep Dive');
    const res = await studyAgent.run('user-demo-123', 'explain recursion in detailed', conv.id);

    expect(res.answer).toContain('Recursion');
    expect(res.answer).toContain('Base Case');
    expect(res.answer).toContain('Call Stack');
    expect(res.answer).toContain('factorial');
  });

  it('should correctly handle multi-turn follow-up "Explain this simpler for a beginner." for Recursion', async () => {
    const conv = dbStore.createConversation('user-demo-123', 'Recursion Followup Session');
    // First turn: recursion
    await studyAgent.run('user-demo-123', 'explain recursion in detailed', conv.id);

    // Follow-up: simpler chip clicked
    const followUpRes = await studyAgent.run('user-demo-123', 'Explain this simpler for a beginner.', conv.id);

    // Must explain Recursion simply with analogy, NOT random musical accompaniment!
    expect(followUpRes.answer).toContain('Recursion');
    expect(followUpRes.answer).toContain('Base Case');
    expect(followUpRes.answer.toLowerCase()).not.toContain('accompaniment');
    expect(followUpRes.answer.toLowerCase()).not.toContain('musical composition');
  });

  it('should resolve "who is ambhani" typo to Mukesh Ambani and not unrelated Wikipedia articles', async () => {
    const conv = dbStore.createConversation('user-demo-123', 'Ambani Search');
    const res = await studyAgent.run('user-demo-123', 'who is ambhani', conv.id);

    expect(res.answer).toContain('Mukesh Ambani');
    expect(res.answer).toContain('Reliance');
    expect(res.answer).not.toContain('Chitra Lakshmanan');
  });

  it('should provide practical C++ / Java code example when follow-up chip is clicked', async () => {
    const conv = dbStore.createConversation('user-demo-123', 'Code Example Followup');
    await studyAgent.run('user-demo-123', 'explain recursion in detailed', conv.id);

    const codeRes = await studyAgent.run('user-demo-123', 'Give me a practical C++ / Java example.', conv.id);

    expect(codeRes.answer).toContain('factorial');
    expect(codeRes.answer).toContain('```cpp');
    expect(codeRes.answer).toContain('```python');
  });

  it('should accurately explain architecture when asked "on which api you are working to give ans" without fake citations', async () => {
    const conv = dbStore.createConversation('user-demo-123', 'API Inquiry');
    const res = await studyAgent.run('user-demo-123', 'on which api you are working to give ans', conv.id);

    expect(res.answer).toContain('Microsoft Azure AI Services');
    expect(res.answer).toContain('Azure AI Foundry');
    expect(res.answer).toContain('Azure AI Search');
    expect(res.answer).toContain('Azure Document Intelligence');
    expect(res.answer).toContain('Azure AI Speech Services');
    // Must NOT have fake document citations attached
    expect(res.citations || []).toHaveLength(0);
  });

  it('should answer "java" as the programming language and not the Indonesian island', async () => {
    const conv = dbStore.createConversation('user-demo-123', 'Java Query');
    const res = await studyAgent.run('user-demo-123', 'java', conv.id);

    expect(res.answer).toContain('Java Programming Language');
    expect(res.answer).toContain('JVM');
    expect(res.answer).toContain('Write Once, Run Anywhere');
    expect(res.answer.toLowerCase()).not.toContain('greater sunda islands');
    expect(res.answer.toLowerCase()).not.toContain('indonesian population');
  });

  it('should provide a structured, multi-phase roadmap when requested for full stack web development', async () => {
    const conv = dbStore.createConversation('user-demo-123', 'Full Stack Roadmap');
    const res = await studyAgent.run('user-demo-123', 'give me a roadmap for full stack web development', conv.id);

    expect(res.answer).toContain('Full Stack Web Development Roadmap');
    expect(res.answer).toContain('Phase 1');
    expect(res.answer).toContain('Phase 2');
    expect(res.answer).toContain('React');
    expect(res.answer).toContain('Node.js');
    expect(res.answer).toContain('Capstone Portfolio Projects');
  });

  it('should provide a structured roadmap for custom requested skills like Rust or DevOps', async () => {
    const conv = dbStore.createConversation('user-demo-123', 'DevOps Roadmap');
    const res = await studyAgent.run('user-demo-123', 'roadmap for devops', conv.id);

    expect(res.answer).toContain('DevOps');
    expect(res.answer).toContain('Docker');
    expect(res.answer).toContain('Kubernetes');
    expect(res.answer).toContain('CI/CD');
  });
});
