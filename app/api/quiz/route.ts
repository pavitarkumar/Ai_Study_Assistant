import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { generateAdaptiveQuiz } from '@/lib/ai/quizGenerator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      action = 'generate',
      userId = 'user-demo-123',
      topic = 'Graphs',
      difficulty = 'Medium',
      count = 5,
      score,
      accuracyPct,
    } = body;

    // Handle quiz submission and mastery recording
    if (action === 'submit') {
      const delta = (accuracyPct || 0) >= 80 ? 5 : -3;
      dbStore.updateTopicMastery(topic, delta);
      dbStore.recordSession(userId, topic, 15);
      return NextResponse.json({
        success: true,
        data: {
          topic,
          delta,
          message: `Topic mastery for ${topic} updated by ${delta > 0 ? '+' + delta : delta}%.`,
        },
      });
    }

    // Generate adaptive questions based on requested topic and difficulty
    const questions = await generateAdaptiveQuiz(topic, difficulty as any, Number(count) || 5);

    return NextResponse.json({
      success: true,
      data: {
        topic,
        difficulty,
        totalQuestions: questions.length,
        questions,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'QUIZ_GEN_FAILED', message: err.message } },
      { status: 500 }
    );
  }
}
