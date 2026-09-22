export type IntentCategory =
  | 'GENERAL_STUDY'
  | 'DOCUMENT_QA'
  | 'PREVIOUS_QUESTION'
  | 'QUIZ'
  | 'PLANNER'
  | 'PROGRESS'
  | 'REVISION'
  | 'SEARCH'
  | 'CODING'
  | 'GOAL'
  | 'STUDY_SESSION';

export interface ClassifyIntentResult {
  intent: IntentCategory;
  confidence: number;
  extractedKeywords: string[];
}

export function classifyUserIntent(query: string): ClassifyIntentResult {
  const qLower = query.toLowerCase().trim();
  const keywords: string[] = [];

  if (qLower.includes('quiz') || qLower.includes('ask me 5 questions') || qLower.includes('test me')) {
    return { intent: 'QUIZ', confidence: 0.95, extractedKeywords: ['quiz', 'questions'] };
  }

  if (qLower.includes('study plan') || qLower.includes('what should i study today') || qLower.includes('schedule')) {
    return { intent: 'PLANNER', confidence: 0.92, extractedKeywords: ['plan', 'schedule'] };
  }

  if (qLower.includes('progress') || qLower.includes('mastery') || qLower.includes('weak topic') || qLower.includes('accuracy')) {
    return { intent: 'PROGRESS', confidence: 0.90, extractedKeywords: ['progress', 'mastery'] };
  }

  if (qLower.includes('revise') || qLower.includes('revision') || qLower.includes('recap')) {
    return { intent: 'REVISION', confidence: 0.88, extractedKeywords: ['revision', 'recap'] };
  }

  if (qLower.includes('code') || qLower.includes('c++') || qLower.includes('java') || qLower.includes('python') || qLower.includes('example')) {
    return { intent: 'CODING', confidence: 0.89, extractedKeywords: ['code', 'example'] };
  }

  if (qLower.includes('notes') || qLower.includes('pdf') || qLower.includes('document') || qLower.includes('lecture')) {
    return { intent: 'DOCUMENT_QA', confidence: 0.91, extractedKeywords: ['document', 'pdf'] };
  }

  if (qLower.includes('goal') || qLower.includes('target')) {
    return { intent: 'GOAL', confidence: 0.85, extractedKeywords: ['goal'] };
  }

  return { intent: 'GENERAL_STUDY', confidence: 0.80, extractedKeywords: [] };
}
