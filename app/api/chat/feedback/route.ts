import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = 'user-demo-123', messageId, rating, reason } = body;

    if (!messageId || !rating) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Message ID and rating are required.' } },
        { status: 400 }
      );
    }

    dbStore.recordFeedback(userId, messageId, rating, reason);

    return NextResponse.json({
      success: true,
      message: 'Feedback recorded successfully.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'FEEDBACK_FAILED', message: err.message } },
      { status: 500 }
    );
  }
}
