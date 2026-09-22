'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { HelpCircle, Award, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { dbStore } from '@/lib/db';

function QuizPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTopic = searchParams.get('topic') || 'Graphs';

  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, count: questionCount }),
      });
      const json = await res.json();
      if (json.success) {
        setQuestions(json.data.questions);
        setQuizStarted(true);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setQuizSubmitted(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: option }));
  };

  const handleCalculateScore = async () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });

    const accuracyPct = Math.round((score / questions.length) * 100);

    // Update topic mastery score on server via API
    try {
      await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          userId: 'user-demo-123',
          topic,
          score,
          accuracyPct,
        }),
      });
      dbStore.updateTopicMastery(topic, accuracyPct >= 80 ? 5 : -3);
    } catch (err) {
      console.error('Failed to submit quiz mastery:', err);
    }

    setQuizSubmitted(true);
  };

  const currentQ = questions[currentIndex];
  const score = Object.keys(selectedAnswers).reduce((acc, idx) => {
    return selectedAnswers[Number(idx)] === questions[Number(idx)]?.correctAnswer ? acc + 1 : acc;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">AI Quiz</h1>
        <p className="text-sm text-[#64748B] mt-1">Adaptive quizzes that adjust difficulty based on your topic mastery.</p>
      </div>

      {!quizStarted ? (
        /* Quiz Setup Modal / Card */
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-base text-[#111827]">Configure Your Quiz</h2>
              <p className="text-xs text-[#64748B]">Select topic, difficulty level, and number of questions.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Topic Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#111827]">Select Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="Graphs">Graphs (BFS/DFS)</option>
                <option value="Trees">Binary Trees & BST</option>
                <option value="Operating Systems">Operating Systems (Deadlock)</option>
                <option value="Arrays">Arrays & Dynamic Memory</option>
                <option value="Dynamic Programming">Dynamic Programming</option>
                <option value="Python">Python Programming</option>
                <option value="Java">Java & OOP Principles</option>
              </select>
            </div>

            {/* Difficulty Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#111827]">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="Easy">Easy (Conceptual)</option>
                <option value="Medium">Medium (Standard)</option>
                <option value="Hard">Hard (Deep Logic)</option>
              </select>
            </div>

            {/* Question Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#111827]">Question Count</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm flex items-center gap-2"
            >
              <span>{loading ? 'Generating Quiz...' : 'Start Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : !quizSubmitted ? (
        /* Active Quiz Screen */
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 sm:p-8 shadow-card space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="text-xs font-semibold text-[#2563EB] block">{topic} Quiz • {difficulty}</span>
              <h2 className="font-semibold text-base text-[#111827]">
                Question {currentIndex + 1} of {questions.length}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#F1F5F9] text-[#64748B] text-xs font-semibold">
              {currentQ.type}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="py-2">
            <p className="text-base font-medium text-[#111827] leading-relaxed">{currentQ.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt: string, idx: number) => {
              const isSelected = selectedAnswers[currentIndex] === opt;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]'
                      : 'bg-white border-[#E2E8F0] text-[#111827] hover:border-[#BFDBFE]'
                  }`}
                >
                  <span>{opt}</span>
                  <div className={`w-4 h-4 rounded-full border ${isSelected ? 'border-[#2563EB] bg-[#2563EB]' : 'border-[#CBD5E1]'}`} />
                </button>
              );
            })}
          </div>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#64748B] disabled:opacity-50 hover:bg-[#F1F5F9]"
            >
              Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleCalculateScore}
                disabled={!selectedAnswers[currentIndex]}
                className="px-6 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-semibold hover:bg-[#15803D] disabled:opacity-50 shadow-sm"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={!selectedAnswers[currentIndex]}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] disabled:opacity-50 shadow-sm"
              >
                Next
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Final Score & Mastery Summary */
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-8 shadow-card text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">Quiz Completed</span>
            <h2 className="text-3xl font-bold text-[#111827] mt-1">
              Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </h2>
            <p className="text-xs text-[#64748B] mt-2">
              Topic mastery score updated in your learning dashboard.
            </p>
          </div>

          {/* Recommendation Box */}
          <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-left text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#2563EB]">
              <Sparkles className="w-4 h-4" />
              <span>AI Recommendation for {topic}</span>
            </div>
            <p className="text-[#111827]">
              {score / questions.length >= 0.8
                ? `Great job! You have demonstrated strong understanding of ${topic}. Ready for higher difficulty!`
                : `Review BFS/DFS graph traversal recursion in your Operating Systems notes and attempt 5 practice questions.`}
            </p>
          </div>

          <div className="flex justify-center gap-4 pt-4 border-t border-[#E2E8F0]">
            <button
              onClick={() => setQuizStarted(false)}
              className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#111827] hover:bg-[#F1F5F9] flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Take Another Quiz</span>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-[#64748B]">Loading quiz module...</div>}>
      <QuizPageContent />
    </Suspense>
  );
}
