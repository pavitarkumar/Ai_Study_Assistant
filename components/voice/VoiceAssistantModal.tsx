'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Loader2 } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VoiceState = 'Ready' | 'Listening...' | 'Processing...' | 'Speaking...';

export function VoiceAssistantModal({ isOpen, onClose }: VoiceAssistantModalProps) {
  const [state, setState] = useState<VoiceState>('Ready');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  if (!isOpen) return null;

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/#+\s*/g, '')
        .replace(/[\*_`]/g, '')
        .replace(/\$[^$]+\$/g, 'formula')
        .slice(0, 350);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setState('Speaking...');
      utterance.onend = () => setState('Ready');
      utterance.onerror = () => setState('Ready');
      window.speechSynthesis.speak(utterance);
    } else {
      setState('Ready');
    }
  };

  const processQuery = async (queryText: string) => {
    setState('Processing...');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-demo-123', message: queryText }),
      });
      const json = await res.json();
      const reply = json.data?.answer || 'I am ready to help you with your study questions.';
      setResponse(reply);
      speakText(reply);
    } catch (err) {
      setResponse('Could not connect to the study agent. Please try again.');
      setState('Ready');
    }
  };

  const handleStartListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback for browsers without speech recognition support
      const sample = 'What should I study today based on my weak topics?';
      setTranscript(sample);
      processQuery(sample);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setState('Listening...');
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
        processQuery(spoken);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event);
        if (!transcript) {
          const sample = 'What should I study today based on my weak topics?';
          setTranscript(sample);
          processQuery(sample);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      const sample = 'What should I study today based on my weak topics?';
      setTranscript(sample);
      processQuery(sample);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }
    setState('Ready');
  };

  const handleCloseModal = () => {
    handleStop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-[14px] shadow-lg p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-[#111827]">Voice Study Assistant</h3>
          </div>
          <button onClick={handleCloseModal} className="p-1 rounded-md text-[#64748B] hover:bg-[#F1F5F9]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* State Visualizer */}
        <div className="py-8 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <button
              onClick={state === 'Ready' ? handleStartListening : handleStop}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md ${
                state === 'Listening...'
                  ? 'bg-[#EFF6FF] border-2 border-[#2563EB] text-[#2563EB] animate-pulse ring-4 ring-[#BFDBFE]'
                  : state === 'Processing...'
                  ? 'bg-[#F1F5F9] border-2 border-[#64748B] text-[#64748B]'
                  : state === 'Speaking...'
                  ? 'bg-[#16A34A]/10 border-2 border-[#16A34A] text-[#16A34A] ring-4 ring-[#BBF7D0]'
                  : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
              }`}
            >
              {state === 'Processing...' ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : state === 'Speaking...' ? (
                <Volume2 className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#2563EB] mb-1">
              {state}
            </span>
            <p className="text-xs text-[#64748B]">
              {state === 'Ready' && 'Click the microphone to speak your question'}
              {state === 'Listening...' && 'Listening... Speak clearly into your microphone'}
              {state === 'Processing...' && 'Searching study context & generating answer...'}
              {state === 'Speaking...' && 'Speaking answer via text-to-speech'}
            </p>
          </div>
        </div>

        {/* Transcript & AI Response Box */}
        {(transcript || response) && (
          <div className="space-y-3 pt-3 border-t border-[#E2E8F0] text-xs max-h-48 overflow-y-auto">
            {transcript && (
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                <span className="font-semibold text-[#64748B] block mb-0.5">You said:</span>
                <p className="text-[#111827]">{transcript}</p>
              </div>
            )}
            {response && (
              <div className="p-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
                <span className="font-semibold text-[#2563EB] block mb-0.5">AI Response:</span>
                <p className="text-[#111827] whitespace-pre-line">{response.slice(0, 400)}...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
