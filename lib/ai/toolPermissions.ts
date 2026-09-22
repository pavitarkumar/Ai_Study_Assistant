export type ToolAccessType = 'READ' | 'WRITE' | 'EXTERNAL';

export interface ToolPermissionRule {
  name: string;
  type: ToolAccessType;
  allowedRoles: string[];
}

export class ToolPermissionManager {
  private rules: Record<string, ToolPermissionRule> = {
    getStudentProgress: { name: 'getStudentProgress', type: 'READ', allowedRoles: ['Student', 'Admin'] },
    getWeakTopics: { name: 'getWeakTopics', type: 'READ', allowedRoles: ['Student', 'Admin'] },
    getStrongTopics: { name: 'getStrongTopics', type: 'READ', allowedRoles: ['Student', 'Admin'] },
    getStudyPlan: { name: 'getStudyPlan', type: 'READ', allowedRoles: ['Student', 'Admin'] },
    searchKnowledge: { name: 'searchKnowledge', type: 'READ', allowedRoles: ['Student', 'Admin'] },
    recordStudySession: { name: 'recordStudySession', type: 'WRITE', allowedRoles: ['Student', 'Admin'] },
    updateStudyGoal: { name: 'updateStudyGoal', type: 'WRITE', allowedRoles: ['Student', 'Admin'] },
    createStudyPlan: { name: 'createStudyPlan', type: 'WRITE', allowedRoles: ['Student', 'Admin'] },
    generateQuiz: { name: 'generateQuiz', type: 'WRITE', allowedRoles: ['Student', 'Admin'] },
    webSearch: { name: 'webSearch', type: 'EXTERNAL', allowedRoles: ['Student', 'Admin'] },
  };

  validateToolAccess(toolName: string, authenticatedUserId: string, userRole: string = 'Student'): boolean {
    if (!authenticatedUserId || typeof authenticatedUserId !== 'string') {
      throw new Error(`Unauthorized: Cannot execute tool ${toolName} without valid user authentication.`);
    }

    const rule = this.rules[toolName];
    if (!rule) {
      // Default to allowed for standard registered tools
      return true;
    }

    if (!rule.allowedRoles.includes(userRole)) {
      throw new Error(`Forbidden: Role '${userRole}' is not permitted to execute tool '${toolName}'.`);
    }

    return true;
  }
}

export const toolPermissionManager = new ToolPermissionManager();
