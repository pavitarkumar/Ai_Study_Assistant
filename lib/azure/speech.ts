import { azureConfig } from './config';

export interface SpeechToTextResult {
  text: string;
  confidence: number;
}

export class SpeechProvider {
  async speechToText(audioBlob?: Blob): Promise<SpeechToTextResult> {
    if (azureConfig.isMockMode || !azureConfig.speech.key) {
      return {
        text: 'What should I study today based on my weak topics?',
        confidence: 0.96,
      };
    }

    try {
      // Azure Speech REST / SDK endpoint call simulation
      return {
        text: 'What should I study today based on my weak topics?',
        confidence: 0.96,
      };
    } catch (err) {
      return {
        text: 'Give me a quick revision of deadlock prevention.',
        confidence: 0.90,
      };
    }
  }

  async textToSpeech(text: string): Promise<{ audioUrl?: string; durationMs: number }> {
    // Return mock audio playback signal or URL
    return {
      durationMs: Math.min(10000, text.length * 60),
    };
  }
}

export const speechProvider = new SpeechProvider();
