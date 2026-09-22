import { dbStore } from '../db';
import { searchProvider, SearchChunkResult } from '../azure/search';

export interface PersonalizedContext {
  userId: string;
  studentName: string;
  learningLevel: string;
  targetGoal: string;
  weakTopics: string[];
  strongTopics: string[];
  recentQuizAccuracy: number;
  currentStreak: number;
  studyPlanToday: { topic: string; task: string; durationMin: number }[];
  relevantChunks: SearchChunkResult[];
  formattedSystemContext: string;
}

export async function retrievePersonalizedContext(userId: string, query: string): Promise<PersonalizedContext> {
  const profile = dbStore.getStudentProfile(userId);
  const weakTopics = dbStore.getWeakTopics(userId);
  const strongTopics = dbStore.getStrongTopics(userId);
  const todayPlan = dbStore.getStudyPlan(userId);
  
  // Retrieve RAG document chunks for the user
  const relevantChunks = await searchProvider.searchKnowledge(userId, query, 3);

  const weakTopicNames = weakTopics.map(t => `${t.name} (${t.masteryPct}%)`);
  const strongTopicNames = strongTopics.map(t => `${t.name} (${t.masteryPct}%)`);

  const planSummary = todayPlan.map(p => `- ${p.topic}: ${p.task} (${p.durationMin} min)`).join('\n');

  const docContext = relevantChunks.length > 0
    ? relevantChunks.map(c => `[Source: ${c.filename}, Page ${c.pageNumber}] ${c.content}`).join('\n\n')
    : 'No directly matching document context found.';

  const formattedSystemContext = `
=== STUDENT PERSONALIZED CONTEXT ===
Student Name: ${profile.name}
Learning Level: ${profile.learningLevel}
Goal: ${profile.targetGoal}
Current Streak: ${profile.currentStreak} days
Quiz Accuracy: ${profile.quizAccuracyPct}%

WEAK TOPICS (NEEDS PRACTICE): ${weakTopicNames.join(', ')}
STRONG TOPICS: ${strongTopicNames.join(', ')}

TODAY'S STUDY PLAN:
${planSummary}

RELEVANT STUDY MATERIAL CHUNKS:
${docContext}
===================================
`.trim();

  return {
    userId,
    studentName: profile.name,
    learningLevel: profile.learningLevel,
    targetGoal: profile.targetGoal,
    weakTopics: weakTopics.map(t => t.name),
    strongTopics: strongTopics.map(t => t.name),
    recentQuizAccuracy: profile.quizAccuracyPct,
    currentStreak: profile.currentStreak,
    studyPlanToday: todayPlan.map(p => ({ topic: p.topic, task: p.task, durationMin: p.durationMin })),
    relevantChunks,
    formattedSystemContext,
  };
}
