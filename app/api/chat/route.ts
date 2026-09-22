import { NextResponse } from 'next/server';
import { studyAgent } from '@/lib/ai/agent';
import { dbStore } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = 'user-demo-123', message, conversationId, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Message content is required.' } },
        { status: 400 }
      );
    }

    let activeConvId = conversationId;
    if (!activeConvId) {
      const title = message.slice(0, 30) + '...';
      const newConv = dbStore.createConversation(userId, title);
      activeConvId = newConv.id;
    }

    const agentResult = await studyAgent.run(userId, message, activeConvId, history);

    return NextResponse.json({
      success: true,
      data: {
        conversationId: activeConvId,
        answer: agentResult.answer,
        citations: agentResult.citations,
        usedTools: agentResult.usedTools,
      },
    });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: err.message || 'An error occurred during processing.' } },
      { status: 500 }
    );
  }
}
