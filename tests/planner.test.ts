import { describe, it, expect } from 'vitest';
import { dbStore } from '../lib/db';

describe('Study Planner & Dynamic Plan Adjustment', () => {
  it('should return active goal and today study plan items', () => {
    const goal = dbStore.getActiveGoal('user-demo-123');
    const plan = dbStore.getStudyPlan('user-demo-123');
    expect(goal).toBeDefined();
    expect(goal.title).toContain('Data Structures');
    expect(plan.length).toBeGreaterThan(0);
  });
});
