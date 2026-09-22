import { azureConfig } from './config';
import { dbStore } from '../db';

export interface SearchChunkResult {
  chunkId: string;
  documentId: string;
  userId: string;
  filename: string;
  pageNumber: number;
  topic: string;
  content: string;
  score: number;
}

export class SearchProvider {
  async searchKnowledge(userId: string, query: string, topCount: number = 5): Promise<SearchChunkResult[]> {
    if (!userId) {
      throw new Error('Unauthorized: userId is required for vector search isolation.');
    }

    if (azureConfig.isMockMode || !azureConfig.search.endpoint) {
      return this.mockHybridSearch(userId, query, topCount);
    }

    try {
      // Azure AI Search REST API call with mandatory userId OData filter
      const filter = `userId eq '${userId}'`;
      const response = await fetch(`${azureConfig.search.endpoint}/indexes/${azureConfig.search.index}/docs/search?api-version=2023-11-01`, {
        method: 'POST',
        signal: AbortSignal.timeout(1500),
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureConfig.search.key,
        },
        body: JSON.stringify({
          search: query,
          filter: filter, // STRICT MULTI-TENANT FILTER
          top: topCount,
          select: 'chunkId,documentId,userId,filename,pageNumber,topic,content',
        }),
      });

      if (!response.ok) {
        throw new Error(`Azure AI Search error: ${response.statusText}`);
      }

      const data = await response.json();
      return (data.value || []).map((doc: any) => ({
        chunkId: doc.chunkId,
        documentId: doc.documentId,
        userId: doc.userId,
        filename: doc.filename,
        pageNumber: doc.pageNumber,
        topic: doc.topic,
        content: doc.content,
        score: doc['@search.score'] || 0.9,
      }));
    } catch (err) {
      console.warn('Falling back to mock search provider:', err);
      return this.mockHybridSearch(userId, query, topCount);
    }
  }

  private mockHybridSearch(userId: string, query: string, topCount: number): SearchChunkResult[] {
    const qLower = query.toLowerCase();
    
    // Retrieve all active knowledge chunks for this user from dbStore
    const userChunks: SearchChunkResult[] = dbStore.getChunks(userId).map(c => ({
      chunkId: c.chunkId,
      documentId: c.documentId,
      userId: c.userId || userId,
      filename: c.filename,
      pageNumber: c.pageNumber || 1,
      topic: c.topic || 'General Note',
      content: c.content,
      score: c.score || 0.9,
    }));

    if (!qLower.trim()) {
      return userChunks.slice(0, topCount);
    }

    const STOPWORDS = new Set([
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'which', 'who', 'what', 'when', 'where', 'why', 'how',
      'you', 'your', 'i', 'me', 'my', 'we', 'our', 'they', 'them', 'their', 'he', 'she', 'it', 'this', 'that',
      'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'about', 'as', 'into', 'like', 'through', 'after',
      'give', 'ans', 'answer', 'working', 'work', 'tell', 'explain', 'show', 'please', 'api', 'help', 'can'
    ]);

    // Rank chunks based on domain query term frequency, ignoring common conversational stopwords
    const queryTerms = qLower.split(/[^a-z0-9]+/).filter(t => t.length > 2 && !STOPWORDS.has(t));
    if (queryTerms.length === 0) {
      return [];
    }

    const scored = userChunks.map(chunk => {
      let score = 0;
      const contentLower = chunk.content.toLowerCase();
      const topicLower = chunk.topic.toLowerCase();
      queryTerms.forEach(term => {
        if (topicLower.includes(term)) {
          score += 0.6;
        } else if (contentLower.includes(term)) {
          score += 0.3;
        }
      });
      return { ...chunk, score };
    });

    const matching = scored.filter(c => c.score >= 0.5);
    return matching
      .sort((a, b) => b.score - a.score)
      .slice(0, topCount);
  }
}

export const searchProvider = new SearchProvider();
