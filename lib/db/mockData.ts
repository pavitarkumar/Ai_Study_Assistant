export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  learningLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  targetGoal: string;
  todayStudyTimeMin: number;
  currentStreak: number;
  longestStreak: number;
  quizAccuracyPct: number;
  goalProgressPct: number;
}

export interface TopicMasteryItem {
  id: string;
  name: string;
  category: string;
  masteryPct: number;
}

export interface StudyPlanItemData {
  id: string;
  dayNumber: number;
  topic: string;
  task: string;
  durationMin: number;
  completed: boolean;
}

export interface GoalData {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  dailyHours: number;
  progressPct: number;
  status: 'Active' | 'Paused' | 'Completed';
  daysRemaining: number;
}

export interface RecentActivity {
  id: string;
  timeframe: string;
  title: string;
  type: 'quiz' | 'study' | 'chat' | 'document';
  timestamp: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  topic: string;
  lastUpdated: string;
  timeframe: 'Today' | 'Yesterday' | 'Previous 7 Days';
}

export interface ChatMessageData {
  id: string;
  conversationId: string;
  sender: 'user' | 'assistant';
  content: string;
  citations?: { title: string; page?: number; section?: string }[];
  timestamp: string;
}

export interface StudyDocumentData {
  id: string;
  filename: string;
  fileSizeMb: number;
  mimeType: string;
  topics: string[];
  status: 'Uploading' | 'Processing' | 'Indexed' | 'Failed';
  uploadedAt: string;
  chunkCount: number;
}

export const MOCK_STUDENT: StudentProfile = {
  id: 'user-demo-123',
  name: 'Demo Student',
  email: 'student@example.com',
  role: 'Student',
  learningLevel: 'Intermediate',
  targetGoal: 'Master Data Structures & Operating Systems',
  todayStudyTimeMin: 45,
  currentStreak: 12,
  longestStreak: 15,
  quizAccuracyPct: 82,
  goalProgressPct: 74,
};

export const MOCK_TOPIC_MASTERY: TopicMasteryItem[] = [
  { id: 'top-1', name: 'Arrays', category: 'Data Structures', masteryPct: 88 },
  { id: 'top-2', name: 'Linked List', category: 'Data Structures', masteryPct: 76 },
  { id: 'top-3', name: 'Stack', category: 'Data Structures', masteryPct: 82 },
  { id: 'top-4', name: 'Queue', category: 'Data Structures', masteryPct: 79 },
  { id: 'top-5', name: 'Trees', category: 'Data Structures', masteryPct: 61 },
  { id: 'top-6', name: 'Graphs', category: 'Data Structures', masteryPct: 45 },
  { id: 'top-7', name: 'Dynamic Programming', category: 'Algorithms', masteryPct: 35 },
];

export const MOCK_TODAY_PLAN: StudyPlanItemData[] = [
  { id: 'item-1', dayNumber: 14, topic: 'Operating Systems', task: 'Revise Deadlock Prevention', durationMin: 30, completed: false },
  { id: 'item-2', dayNumber: 14, topic: 'Graphs', task: 'Practice 5 Medium Questions (BFS/DFS)', durationMin: 25, completed: false },
  { id: 'item-3', dayNumber: 14, topic: 'Revision', task: 'Review Previous Mistakes in Dynamic Programming', durationMin: 20, completed: false },
];

export const MOCK_ACTIVE_GOAL: GoalData = {
  id: 'goal-1',
  title: 'Master Data Structures & Algorithms',
  description: 'Complete 30-day comprehensive DSA mastery track focusing on Graphs and DP',
  targetDate: '2026-10-04',
  dailyHours: 2.0,
  progressPct: 74,
  status: 'Active',
  daysRemaining: 18,
};

export const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [];

export const MOCK_CONVERSATIONS: ConversationSummary[] = [];

export const MOCK_INITIAL_MESSAGES: Record<string, ChatMessageData[]> = {};

export const MOCK_DOCUMENTS: StudyDocumentData[] = [];

