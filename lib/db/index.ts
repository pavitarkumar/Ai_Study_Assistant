import {
  MOCK_STUDENT,
  MOCK_TOPIC_MASTERY,
  MOCK_TODAY_PLAN,
  MOCK_ACTIVE_GOAL,
  MOCK_RECENT_ACTIVITIES,
  MOCK_CONVERSATIONS,
  MOCK_INITIAL_MESSAGES,
  MOCK_DOCUMENTS,
  StudentProfile,
  TopicMasteryItem,
  StudyPlanItemData,
  GoalData,
  RecentActivity,
  ConversationSummary,
  ChatMessageData,
  StudyDocumentData
} from './mockData';

export interface AIUsageRecord {
  id: string;
  userId: string;
  requestId?: string;
  model: string;
  provider: string; // 'mock' or 'azure'
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  latencyMs?: number;
  estimatedCost?: number;
  createdAt: string;
}

export interface AIFeedbackRecord {
  id: string;
  userId: string;
  messageId: string;
  rating: 'helpful' | 'unhelpful';
  reason?: string;
  createdAt: string;
}

export interface KnowledgeChunk {
  chunkId: string;
  documentId: string;
  userId: string;
  filename: string;
  pageNumber: number;
  topic: string;
  content: string;
  score?: number;
}

const DEFAULT_CHUNKS: KnowledgeChunk[] = [
  {
    chunkId: 'chk-1',
    documentId: 'doc-1',
    userId: 'user-demo-123',
    filename: 'Operating Systems Notes.pdf',
    pageNumber: 18,
    topic: 'Deadlock Prevention',
    content: 'Deadlock prevention requires invalidating at least one of the four Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. In circular wait prevention, resources are assigned numerical IDs and must be acquired in ascending order.',
    score: 0.95,
  },
  {
    chunkId: 'chk-2',
    documentId: 'doc-1',
    userId: 'user-demo-123',
    filename: 'Operating Systems Notes.pdf',
    pageNumber: 22,
    topic: "Banker's Algorithm",
    content: 'Bankers algorithm is a deadlock avoidance algorithm used in operating systems to test for safety by simulating the allocation for predetermined maximum possible amounts of all resources.',
    score: 0.88,
  },
  {
    chunkId: 'chk-3',
    documentId: 'doc-2',
    userId: 'user-demo-123',
    filename: 'Trees Lecture.pdf',
    pageNumber: 10,
    topic: 'Binary Search Trees',
    content: 'In a Binary Search Tree (BST), for every node, values in the left subtree are strictly smaller than the node value, and values in the right subtree are strictly greater.',
    score: 0.92,
  },
  {
    chunkId: 'chk-4',
    documentId: 'doc-3',
    userId: 'user-demo-123',
    filename: 'DSA Notes.pdf',
    pageNumber: 45,
    topic: 'Graph Traversal',
    content: 'Breadth-First Search (BFS) uses a Queue data structure to explore nodes level by level. Depth-First Search (DFS) uses a Stack or recursion to explore deeply before backtracking.',
    score: 0.91,
  },
];

class LocalDatabaseStore {
  private student: StudentProfile = { ...MOCK_STUDENT };
  private topics: TopicMasteryItem[] = [...MOCK_TOPIC_MASTERY];
  private todayPlan: StudyPlanItemData[] = [...MOCK_TODAY_PLAN];
  private goal: GoalData = { ...MOCK_ACTIVE_GOAL };
  private activities: RecentActivity[] = [...MOCK_RECENT_ACTIVITIES];
  private conversations: ConversationSummary[] = [...MOCK_CONVERSATIONS];
  private messages: Record<string, ChatMessageData[]> = JSON.parse(JSON.stringify(MOCK_INITIAL_MESSAGES));
  private documents: StudyDocumentData[] = [...MOCK_DOCUMENTS];
  private chunks: KnowledgeChunk[] = [...DEFAULT_CHUNKS];
  private aiUsages: AIUsageRecord[] = [];
  private aiFeedbacks: AIFeedbackRecord[] = [];

  constructor() {
    this.loadFromFile();
  }

  private saveToFile(): void {
    if (typeof window !== 'undefined' || typeof process === 'undefined' || !process.versions?.node) return;
    try {
      const nodeRequire = eval('require');
      const fs = nodeRequire('fs');
      const path = nodeRequire('path');
      const dataDir = path.resolve(process.cwd(), 'database');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const data = {
        student: this.student,
        topics: this.topics,
        todayPlan: this.todayPlan,
        goal: this.goal,
        activities: this.activities,
        conversations: this.conversations,
        messages: this.messages,
        documents: this.documents,
        chunks: this.chunks,
      };
      fs.writeFileSync(path.join(dataDir, 'data.json'), JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // Non-fatal
    }
  }

  private loadFromFile(): void {
    if (typeof window !== 'undefined' || typeof process === 'undefined' || !process.versions?.node) return;
    try {
      const nodeRequire = eval('require');
      const fs = nodeRequire('fs');
      const path = nodeRequire('path');
      const dataFile = path.resolve(process.cwd(), 'database', 'data.json');
      if (fs.existsSync(dataFile)) {
        const raw = fs.readFileSync(dataFile, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.student) this.student = parsed.student;
        if (parsed.topics) this.topics = parsed.topics;
        if (parsed.todayPlan) this.todayPlan = parsed.todayPlan;
        if (parsed.goal) this.goal = parsed.goal;
        if (parsed.activities) this.activities = parsed.activities;
        if (parsed.conversations) this.conversations = parsed.conversations;
        if (parsed.messages) this.messages = parsed.messages;
        if (parsed.documents) this.documents = parsed.documents;
        if (parsed.chunks && Array.isArray(parsed.chunks) && parsed.chunks.length > 0) {
          this.chunks = parsed.chunks;
        }
      }
    } catch {
      // Non-fatal
    }
  }

  getStudentProfile(userId: string): StudentProfile {
    return this.student;
  }

  getTopicMastery(userId: string): TopicMasteryItem[] {
    return this.topics;
  }

  getWeakTopics(userId: string): TopicMasteryItem[] {
    return this.topics.filter(t => t.masteryPct < 65).sort((a, b) => a.masteryPct - b.masteryPct);
  }

  getStrongTopics(userId: string): TopicMasteryItem[] {
    return this.topics.filter(t => t.masteryPct >= 75).sort((a, b) => b.masteryPct - a.masteryPct);
  }

  getStudyPlan(userId: string): StudyPlanItemData[] {
    return this.todayPlan;
  }

  getActiveGoal(userId: string): GoalData {
    return this.goal;
  }

  getRecentActivities(userId: string): RecentActivity[] {
    return this.activities;
  }

  getConversations(userId: string): ConversationSummary[] {
    return this.conversations;
  }

  getMessages(conversationId: string): ChatMessageData[] {
    return this.messages[conversationId] || [];
  }

  getDocuments(userId: string): StudyDocumentData[] {
    return this.documents.filter(d => d.status !== 'Failed');
  }

  getChunks(userId: string): KnowledgeChunk[] {
    return this.chunks.filter(c => !c.userId || c.userId === userId);
  }

  addChunks(newChunks: KnowledgeChunk[]): void {
    this.chunks.unshift(...newChunks);
    this.saveToFile();
  }

  addMessage(conversationId: string, sender: 'user' | 'assistant', content: string, citations?: { title: string; page?: number; section?: string }[]): ChatMessageData {
    const newMessage: ChatMessageData = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      conversationId,
      sender,
      content,
      citations,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(newMessage);
    this.saveToFile();
    return newMessage;
  }

  createConversation(userId: string, title: string, topic?: string): ConversationSummary {
    const newConv: ConversationSummary = {
      id: `conv-${Date.now()}`,
      title,
      topic: topic || 'General Study',
      lastUpdated: 'Just now',
      timeframe: 'Today',
    };
    this.conversations.unshift(newConv);
    this.messages[newConv.id] = [];
    this.saveToFile();
    return newConv;
  }

  addDocument(userId: string, filename: string, fileSizeMb: number, topics: string[], chunkCount?: number): StudyDocumentData {
    const newDoc: StudyDocumentData = {
      id: `doc-${Date.now()}`,
      filename,
      fileSizeMb,
      mimeType: filename.endsWith('.pdf') ? 'application/pdf' : 'text/plain',
      topics,
      status: 'Indexed',
      uploadedAt: new Date().toISOString().split('T')[0],
      chunkCount: chunkCount || Math.floor(Math.random() * 10) + 2,
    };
    this.documents.unshift(newDoc);
    this.saveToFile();
    return newDoc;
  }

  deleteDocument(documentId: string): void {
    this.documents = this.documents.filter(d => d.id !== documentId);
    this.chunks = this.chunks.filter(c => c.documentId !== documentId);
    this.saveToFile();
  }

  updateTopicMastery(topicName: string, deltaPct: number): void {
    const topic = this.topics.find(t => t.name.toLowerCase() === topicName.toLowerCase());
    if (topic) {
      topic.masteryPct = Math.min(100, Math.max(0, topic.masteryPct + deltaPct));
      this.saveToFile();
    }
  }

  recordSession(userId: string, topic: string, durationMin: number): void {
    this.student.todayStudyTimeMin += durationMin;
    this.activities.unshift({
      id: `act-${Date.now()}`,
      timeframe: 'Today',
      title: `Studied ${topic} for ${durationMin} minutes`,
      type: 'study',
      timestamp: 'Just now',
    });
    this.saveToFile();
  }

  recordUsage(userId: string, model: string, provider: string, latencyMs?: number): void {
    this.aiUsages.push({
      id: `usage-${Date.now()}`,
      userId,
      model,
      provider,
      latencyMs,
      createdAt: new Date().toISOString(),
    });
  }

  recordFeedback(userId: string, messageId: string, rating: 'helpful' | 'unhelpful', reason?: string): void {
    this.aiFeedbacks.push({
      id: `fb-${Date.now()}`,
      userId,
      messageId,
      rating,
      reason,
      createdAt: new Date().toISOString(),
    });
    this.saveToFile();
  }

  getAIUsages(): AIUsageRecord[] {
    return this.aiUsages;
  }

  getAIFeedbacks(): AIFeedbackRecord[] {
    return this.aiFeedbacks;
  }
}

export const dbStore = new LocalDatabaseStore();
