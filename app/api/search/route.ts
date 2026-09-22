import { NextResponse } from 'next/server';
import { searchProvider } from '@/lib/azure/search';
import { dbStore } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = 'user-demo-123', query, includeWeb = false } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_QUERY', message: 'Search query is required.' } },
        { status: 400 }
      );
    }

    // Step 1: Document RAG Hybrid Search
    const docChunks = await searchProvider.searchKnowledge(userId, query, 5);

    // Step 2: Search previous questions
    const conversations = dbStore.getConversations(userId);
    const relatedQuestions: string[] = [];
    conversations.forEach(c => {
      const msgs = dbStore.getMessages(c.id);
      msgs.filter(m => m.sender === 'user').forEach(m => {
        if (m.content.toLowerCase().includes(query.toLowerCase())) {
          relatedQuestions.push(m.content);
        }
      });
    });

    // Synthesize grounded answer summary
    const synthesizedAnswer = docChunks.length > 0
      ? `Based on your uploaded study materials:\n\n` +
        docChunks.map((c, i) => `**${i + 1}. [${c.filename}, Page ${c.pageNumber}]**: ${c.content}`).join('\n\n')
      : `No exact matching chunks found in your documents for "${query}". Try searching related keywords or checking web reference.`;

    const sources = docChunks.map(c => ({
      documentId: c.documentId,
      filename: c.filename,
      pageNumber: c.pageNumber,
      topic: c.topic,
      snippet: c.content,
    }));

    const cleanQuery = query.replace(/[^\w\s]/gi, '').trim();
    const relatedTopics = [
      `${cleanQuery} Overview & Principles`,
      `${cleanQuery} Practice Problems`,
      `${cleanQuery} Implementation & Complexity`,
      `Advanced Concepts in ${cleanQuery}`,
    ];

    const webResults = includeWeb
      ? [
          {
            title: `${cleanQuery} - Comprehensive Learning Guide`,
            url: `https://www.google.com/search?q=${encodeURIComponent(cleanQuery + ' tutorial computer science')}`,
            source: 'Web Documentation',
          },
          {
            title: `${cleanQuery} - Reference & Examples`,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(cleanQuery.replace(/\s+/g, '_'))}`,
            source: 'Encyclopedia',
          },
        ]
      : [];

    return NextResponse.json({
      success: true,
      data: {
        query,
        answer: synthesizedAnswer,
        sources,
        previousRelatedQuestions:
          relatedQuestions.length > 0
            ? relatedQuestions.slice(0, 3)
            : [`Recent queries related to ${cleanQuery}`],
        relatedTopics,
        webResults,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SEARCH_FAILED', message: err.message } },
      { status: 500 }
    );
  }
}
