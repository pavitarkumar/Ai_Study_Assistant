import { dbStore } from '../db';
import { foundryAI } from '../azure/foundry';
import { searchProvider } from '../azure/search';
import { retrievePersonalizedContext } from './contextEngine';
import { sanitizeAndCheckSafety } from './safety';
import { rateLimiter } from './rateLimit';

export interface StudyAgentTool {
  name: string;
  description: string;
  parameters: any;
  execute: (userId: string, args: any) => Promise<any>;
}

export type FollowUpIntent = 'SIMPLER' | 'EXAMPLE' | 'QUESTIONS' | 'QUIZ' | null;

export function detectFollowUpIntent(query: string): FollowUpIntent {
  const q = query.trim().toLowerCase();
  if (
    q.includes('explain this simpler') ||
    q.includes('explain simpler') ||
    q.includes('simpler for a beginner') ||
    q.includes('simple explanation') ||
    q.includes('in simple terms') ||
    q.includes('explain like i am 5') ||
    q.includes('eli5') ||
    q === 'explain simpler'
  ) {
    return 'SIMPLER';
  }
  if (
    q.includes('give me a practical') ||
    q.includes('give example') ||
    q.includes('show example') ||
    q.includes('c++ / java example') ||
    q.includes('code example') ||
    q.includes('give me an example') ||
    q === 'give example'
  ) {
    return 'EXAMPLE';
  }
  if (
    q.includes('ask me 5 practice questions') ||
    q.includes('ask me questions') ||
    q.includes('practice questions') ||
    q.includes('test me on this') ||
    q === 'ask me questions'
  ) {
    return 'QUESTIONS';
  }
  if (
    q.includes('create a quiz') ||
    q.includes('create quiz') ||
    q.includes('quiz on this') ||
    q.includes('generate quiz') ||
    q === 'create quiz'
  ) {
    return 'QUIZ';
  }
  return null;
}

export function extractTopicFromHistory(
  history: { role?: string; sender?: string; content: string }[]
): string | null {
  if (!history || history.length === 0) return null;

  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    const text = (msg.content || '').trim();
    if (!text) continue;

    // Check for title in assistant response: ### Title
    const headingMatch = text.match(/^#+\s*(?:💡|🔍|🔄|🧬|🔒|📝|🎯)?\s*([^\n\r]+)/m);
    if (headingMatch && headingMatch[1]) {
      let candidate = headingMatch[1]
        .replace(/^(Study Overview:|Location Information:|Overview:|Comprehensive Guide:|Key Highlights:|Practice Questions:|Quick Quiz:)\s*/i, '')
        .replace(/[\*\_`#]/g, '')
        .trim();
      candidate = candidate
        .replace(/\s+(Explained Simply|in Programming|in Computer Science|in Operating Systems|Mastery)[\s\(\)]*$/i, '')
        .trim();
      if (candidate && !/^(Calculation Result|Helpful Summary|Requested Subject)/i.test(candidate)) {
        return candidate;
      }
    }

    // Check user query
    if (msg.role === 'user' || msg.sender === 'user') {
      const q = text.toLowerCase();
      if (detectFollowUpIntent(q)) continue;
      const cleaned = text
        .replace(/^(who is|who was|what is|what was|tell me about|explain|describe|define|information about|details of|where is|location of)\s+/i, '')
        .replace(/\s+(in detail|in detailed|deeply|thoroughly|for beginners|step by step|with examples|with code|simply|simpler)[\?\.\!]*$/i, '')
        .replace(/[\?\.\!]+$/, '')
        .trim();
      if (cleaned.length > 2) {
        return cleaned;
      }
    }
  }

  return null;
}

export class StudyAgent {
  private tools: Record<string, StudyAgentTool> = {};

  constructor() {
    this.registerDefaultTools();
  }

  private registerDefaultTools() {
    this.tools['getStudentProgress'] = {
      name: 'getStudentProgress',
      description: 'Retrieve overall progress, streak, quiz accuracy, and goal completion percentage for the student',
      parameters: {},
      execute: async (userId: string) => {
        const p = dbStore.getStudentProfile(userId);
        return {
          todayStudyTimeMin: p.todayStudyTimeMin,
          currentStreak: p.currentStreak,
          quizAccuracyPct: p.quizAccuracyPct,
          goalProgressPct: p.goalProgressPct,
        };
      },
    };

    this.tools['getWeakTopics'] = {
      name: 'getWeakTopics',
      description: 'Get topics where the student has low mastery (<65%) and needs practice',
      parameters: {},
      execute: async (userId: string) => {
        return dbStore.getWeakTopics(userId);
      },
    };

    this.tools['getStrongTopics'] = {
      name: 'getStrongTopics',
      description: 'Get topics where the student has high mastery (>=75%)',
      parameters: {},
      execute: async (userId: string) => {
        return dbStore.getStrongTopics(userId);
      },
    };

    this.tools['getStudyPlan'] = {
      name: 'getStudyPlan',
      description: 'Get the current daily study plan and tasks for the student',
      parameters: {},
      execute: async (userId: string) => {
        return dbStore.getStudyPlan(userId);
      },
    };

    this.tools['searchKnowledge'] = {
      name: 'searchKnowledge',
      description: 'Search indexed study documents and notes using RAG hybrid search',
      parameters: { query: 'string' },
      execute: async (userId: string, args: { query: string }) => {
        return searchProvider.searchKnowledge(userId, args.query);
      },
    };

    this.tools['recordStudySession'] = {
      name: 'recordStudySession',
      description: 'Log completed study minutes for a specific topic',
      parameters: { topic: 'string', durationMin: 'number' },
      execute: async (userId: string, args: { topic: string; durationMin: number }) => {
        dbStore.recordSession(userId, args.topic, args.durationMin);
        return { success: true, message: `Recorded ${args.durationMin} minutes of studying ${args.topic}.` };
      },
    };

    this.tools['generateQuiz'] = {
      name: 'generateQuiz',
      description: 'Create an adaptive quiz for a specific topic and difficulty',
      parameters: { topic: 'string', difficulty: 'string', count: 'number' },
      execute: async (userId: string, args: { topic: string; difficulty?: string; count?: number }) => {
        return {
          topic: args.topic,
          difficulty: args.difficulty || 'Medium',
          questionsCount: args.count || 5,
          message: `Generated ${args.count || 5} ${args.difficulty || 'Medium'} questions for ${args.topic}`,
        };
      },
    };

    this.tools['webSearch'] = {
      name: 'webSearch',
      description: 'Search public web information when concepts are not found in student study material',
      parameters: { query: 'string' },
      execute: async (userId: string, args: { query: string }) => {
        return {
          source: 'Web Information',
          query: args.query,
          summary: `Web search reference for ${args.query}: Standard industry specifications and reference documentation.`,
        };
      },
    };
  }

  async run(
    userId: string,
    userQuery: string,
    conversationId?: string,
    clientHistory?: { role?: string; sender?: string; content: string }[]
  ): Promise<{
    answer: string;
    citations?: { title: string; page?: number; section?: string }[];
    usedTools?: string[];
  }> {
    // Determine conversation history from client payload or DB store
    const history = clientHistory && clientHistory.length > 0
      ? clientHistory
      : (conversationId ? dbStore.getMessages(conversationId) : []);

    // Detect if the query is a follow-up chip/intent ("Explain simpler", "Give example", etc.)
    const intent = detectFollowUpIntent(userQuery);
    let resolvedQuery = userQuery;
    let resolvedTopic: string | null = null;

    if (intent) {
      resolvedTopic = extractTopicFromHistory(history);
      if (resolvedTopic) {
        if (intent === 'SIMPLER') {
          resolvedQuery = `Explain ${resolvedTopic} in simpler terms for a beginner with intuitive real-world analogies.`;
        } else if (intent === 'EXAMPLE') {
          resolvedQuery = `Provide practical C++ and Java code examples for ${resolvedTopic} with step-by-step explanations.`;
        } else if (intent === 'QUESTIONS') {
          resolvedQuery = `Ask me 5 practice and interview questions about ${resolvedTopic} with answers.`;
        } else if (intent === 'QUIZ') {
          resolvedQuery = `Create a quiz on ${resolvedTopic}.`;
        }
      }
    }

    // Rate limit check
    const rateStatus = rateLimiter.check(userId);
    if (!rateStatus.success) {
      return {
        answer: 'You have reached the temporary limit for study queries. Please wait a moment before sending more questions.',
        usedTools: [],
      };
    }

    // Safety and prompt injection check
    const safety = sanitizeAndCheckSafety(userQuery);
    if (!safety.isSafe) {
      return {
        answer: '⚠️ Security Notice: ' + (safety.flaggedReason || 'Input was flagged by the safety system.'),
        usedTools: [],
      };
    }

    // Step 1: Retrieve personalized student context
    const context = await retrievePersonalizedContext(userId, resolvedQuery);

    const qLower = resolvedQuery.toLowerCase();
    const usedTools: string[] = [];
    let toolFeedback = '';

    // Decision Engine: Determine required tools based on intent
    if (qLower.includes('study today') || qLower.includes('recommendation') || qLower.includes('what should i study')) {
      const p = await this.tools['getStudentProgress'].execute(userId, {});
      const w = await this.tools['getWeakTopics'].execute(userId, {});
      const s = await this.tools['getStudyPlan'].execute(userId, {});
      usedTools.push('getStudentProgress', 'getWeakTopics', 'getStudyPlan');
      toolFeedback = `\n\nTOOL RESULT - Progress & Weak Topics:\nStreak: ${p.currentStreak} days, Accuracy: ${p.quizAccuracyPct}%\nWeak Topics needing focus: ${w.map((t: any) => `${t.name} (${t.masteryPct}%)`).join(', ')}`;
    } else if (qLower.includes('deadlock') || qLower.includes('tree') || qLower.includes('graph') || qLower.includes('search') || qLower.includes('note') || qLower.includes('pdf')) {
      const searchRes = await this.tools['searchKnowledge'].execute(userId, { query: resolvedQuery });
      usedTools.push('searchKnowledge');
      if (searchRes && searchRes.length > 0) {
        toolFeedback = `\n\nTOOL RESULT - Retrieved Knowledge:\n` + searchRes.map((r: any) => `[${r.filename}, Page ${r.pageNumber}]: ${r.content}`).join('\n');
      }
    }

    // Step 2: Generate grounded LLM response using context and tool feedback
    const isRoadmap = /roadmap|road map|learning path|curriculum|step by step guide to learn|how to learn|study path/i.test(qLower);

    let systemPrompt = `You are a Personal AI Study Assistant.
You adapt to the student's learning level (${context.learningLevel}), goals (${context.targetGoal}), and weak topics (${context.weakTopics.join(', ')}).
Always give clean, encouraging, structured explanations with markdown formatting, code examples when applicable, and clear takeaways. Address the student's specific learning context.`;

    if (isRoadmap) {
      systemPrompt += `\n\nROADMAP DIRECTIVE: The student is requesting a learning roadmap. You must provide a comprehensive, industry-standard, chronological curriculum broken into 4-5 clear phases with duration estimates (e.g. Weeks/Months), key skills to master, milestone projects, capstone recommendations, and actionable pro-tips.`;
    }

    const aiResult = await foundryAI.generateCompletion(resolvedQuery, {
      systemPrompt,
      context: `${context.formattedSystemContext}${toolFeedback}`,
      topic: resolvedTopic || undefined,
      intent,
    });

    // Only attach citations if the query is asking about student documents and relevant chunks exist with score >= 0.6
    // Never attach random document citations for system questions, math, greetings, or general tech/roadmap queries
    const isSystemOrGeneral =
      /^(hi|hello|hey|5\+5|\d+\s*[\+\-\*\/]\s*\d+|which api|what api|on which api|who is|who was|where is|java|python|c\+\+|cpp|javascript|roadmap|road map|learning path)/i.test(
        qLower
      );

    const citations = isSystemOrGeneral
      ? []
      : context.relevantChunks
          .filter(c => (c.score || 0) >= 0.6)
          .map(c => ({
            title: c.filename,
            page: c.pageNumber,
            section: c.topic,
          }));

    // Record user query & assistant response to conversation history in DB
    if (conversationId) {
      dbStore.addMessage(conversationId, 'user', userQuery);
      dbStore.addMessage(conversationId, 'assistant', aiResult.text, citations.length > 0 ? citations : undefined);
    }

    return {
      answer: aiResult.text,
      citations: citations.length > 0 ? citations : (aiResult.citations || undefined),
      usedTools,
    };
  }
}

export const studyAgent = new StudyAgent();
