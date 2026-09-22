import { NextResponse } from 'next/server';
import { speechProvider } from '@/lib/azure/speech';
import { studyAgent } from '@/lib/ai/agent';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = 'user-demo-123', action = 'stt', spokenText } = body;

    if (action === 'stt') {
      const sttResult = await speechProvider.speechToText();
      const textToQuery = spokenText || sttResult.text;

      // Run agent response on recognized text
      const agentResult = await studyAgent.run(userId, textToQuery);
      const ttsResult = await speechProvider.textToSpeech(agentResult.answer);

      return NextResponse.json({
        success: true,
        data: {
          recognizedText: textToQuery,
          agentResponse: agentResult.answer,
          ttsAudioUrl: ttsResult.audioUrl,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: { code: 'UNKNOWN_ACTION', message: 'Unknown speech action' } },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SPEECH_FAILED', message: err.message } },
      { status: 500 }
    );
  }
}
