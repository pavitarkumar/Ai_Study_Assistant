import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-demo-123';

    const profile = dbStore.getStudentProfile(userId);
    const topics = dbStore.getTopicMastery(userId);
    const weakTopics = dbStore.getWeakTopics(userId);
    const strongTopics = dbStore.getStrongTopics(userId);
    const todayPlan = dbStore.getStudyPlan(userId);
    const activeGoal = dbStore.getActiveGoal(userId);
    const recentActivities = dbStore.getRecentActivities(userId);
    const documents = dbStore.getDocuments(userId);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        topics,
        weakTopics,
        strongTopics,
        todayPlan,
        activeGoal,
        recentActivities,
        documentsCount: documents.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'STUDENT_FETCH_FAILED', message: err.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = 'user-demo-123', action, topic, durationMin, deltaPct } = body;

    if (action === 'session' && topic && durationMin) {
      dbStore.recordSession(userId, topic, Number(durationMin));
      return NextResponse.json({ success: true, message: `Recorded ${durationMin} min session for ${topic}` });
    }

    if (action === 'mastery' && topic && deltaPct !== undefined) {
      dbStore.updateTopicMastery(topic, Number(deltaPct));
      return NextResponse.json({ success: true, message: `Updated topic mastery for ${topic}` });
    }

    return NextResponse.json(
      { success: false, error: { code: 'UNKNOWN_ACTION', message: 'Action not supported' } },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'STUDENT_UPDATE_FAILED', message: err.message } },
      { status: 500 }
    );
  }
}
