import { describe, it, expect } from 'vitest';
import { toolPermissionManager } from '../lib/ai/toolPermissions';

describe('Tool Permission Manager', () => {
  it('should validate tool access for authenticated users', () => {
    const isValid = toolPermissionManager.validateToolAccess('getStudentProgress', 'user-demo-123', 'Student');
    expect(isValid).toBe(true);
  });

  it('should throw exception when executing tools without authenticated userId', () => {
    expect(() => toolPermissionManager.validateToolAccess('recordStudySession', '', 'Student')).toThrow();
  });
});
