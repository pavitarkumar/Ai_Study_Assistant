import { describe, it, expect } from 'vitest';
import { dbStore } from '../lib/db';

describe('Study Session & Activity Logging', () => {
  it('should record study session minutes and update total today study time', () => {
    const initialTime = dbStore.getStudentProfile('user-demo-123').todayStudyTimeMin;
    dbStore.recordSession('user-demo-123', 'Binary Trees', 30);
    const updatedTime = dbStore.getStudentProfile('user-demo-123').todayStudyTimeMin;
    expect(updatedTime).toBe(initialTime + 30);
  });
});
