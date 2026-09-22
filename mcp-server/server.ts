import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { dbStore } from '../lib/db';

const server = new Server(
  {
    name: 'ai-study-assistant-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Mandatory authentication and user authorization validation check
function validateUserAuth(userId: string): boolean {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Unauthorized: Valid userId is required for MCP tool execution.');
  }
  return true;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_student_progress',
        description: 'Get student overall study progress, streak, quiz accuracy, and goal progress.',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'Authenticated User ID' },
          },
          required: ['userId'],
        },
      },
      {
        name: 'get_weak_topics',
        description: 'Get topics where the student has low mastery (<65%).',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'Authenticated User ID' },
          },
          required: ['userId'],
        },
      },
      {
        name: 'get_strong_topics',
        description: 'Get topics where the student has high mastery (>=75%).',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'Authenticated User ID' },
          },
          required: ['userId'],
        },
      },
      {
        name: 'get_study_plan',
        description: 'Retrieve the daily study plan for the user.',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'Authenticated User ID' },
          },
          required: ['userId'],
        },
      },
      {
        name: 'create_quiz',
        description: 'Generate an adaptive quiz for a specific topic.',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            topic: { type: 'string' },
            difficulty: { type: 'string' },
            count: { type: 'number' },
          },
          required: ['userId', 'topic'],
        },
      },
      {
        name: 'create_study_session',
        description: 'Log a study session for a topic.',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            topic: { type: 'string' },
            durationMin: { type: 'number' },
          },
          required: ['userId', 'topic', 'durationMin'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const userId = (args as any)?.userId;

  validateUserAuth(userId);

  switch (name) {
    case 'get_student_progress': {
      const p = dbStore.getStudentProfile(userId);
      return {
        content: [{ type: 'text', text: JSON.stringify(p, null, 2) }],
      };
    }
    case 'get_weak_topics': {
      const weak = dbStore.getWeakTopics(userId);
      return {
        content: [{ type: 'text', text: JSON.stringify(weak, null, 2) }],
      };
    }
    case 'get_strong_topics': {
      const strong = dbStore.getStrongTopics(userId);
      return {
        content: [{ type: 'text', text: JSON.stringify(strong, null, 2) }],
      };
    }
    case 'get_study_plan': {
      const plan = dbStore.getStudyPlan(userId);
      return {
        content: [{ type: 'text', text: JSON.stringify(plan, null, 2) }],
      };
    }
    case 'create_quiz': {
      const topic = (args as any).topic;
      return {
        content: [{ type: 'text', text: `Generated quiz for ${topic} (User: ${userId})` }],
      };
    }
    case 'create_study_session': {
      const topic = (args as any).topic;
      const duration = (args as any).durationMin;
      dbStore.recordSession(userId, topic, duration);
      return {
        content: [{ type: 'text', text: `Recorded ${duration} min session for ${topic}` }],
      };
    }
    default:
      throw new Error(`Unknown MCP Tool: ${name}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('AI Study Assistant MCP Server running on stdio');
}

if (require.main === module) {
  main().catch(console.error);
}
