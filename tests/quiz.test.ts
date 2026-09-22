import { describe, it, expect } from 'vitest';
import { dbStore } from '../lib/db';

describe('Adaptive Quiz & Topic Mastery Engine', () => {
  it('should update topic mastery percentage on quiz completion', () => {
    const initialMastery = dbStore.getTopicMastery('user-demo-123').find(t => t.name === 'Graphs')?.masteryPct || 45;
    dbStore.updateTopicMastery('Graphs', 5);
    const newMastery = dbStore.getTopicMastery('user-demo-123').find(t => t.name === 'Graphs')?.masteryPct;
    expect(newMastery).toBe(initialMastery + 5);
  });
});
