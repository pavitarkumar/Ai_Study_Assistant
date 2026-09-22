'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, Flame, Award, Target, Play, Sparkles, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { dbStore } from '@/lib/db';

export default function DashboardPage() {
  const router = useRouter();
  const userId = 'user-demo-123';
  const profile = dbStore.getStudentProfile(userId);
  const topicMastery = dbStore.getTopicMastery(userId);
  const todayPlan = dbStore.getStudyPlan(userId);
  const recentActivities = dbStore.getRecentActivities(userId);

  const [activePlan, setActivePlan] = useState(todayPlan);

  const handleToggleTask = (itemId: string) => {
    setActivePlan(prev =>
      prev.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Good morning, Student 👋</h1>
        <p className="text-sm text-[#64748B] mt-1">Here's your study progress for today.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Study Time */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#64748B] block mb-1">Today's Study Time</span>
            <span className="text-2xl font-bold text-[#111827] tracking-tight">{profile.todayStudyTimeMin} min</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#64748B] block mb-1">Current Streak</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#111827] tracking-tight">{profile.currentStreak} days</span>
              <span className="text-xs font-medium text-[#F59E0B]">🔥</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Quiz Accuracy */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#64748B] block mb-1">Quiz Accuracy</span>
            <span className="text-2xl font-bold text-[#111827] tracking-tight">{profile.quizAccuracyPct}%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Goal Progress */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#64748B] block mb-1">Goal Progress</span>
            <span className="text-2xl font-bold text-[#111827] tracking-tight">{profile.goalProgressPct}%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: AI Recommendation + Study Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): AI Recommendation & Today's Study Plan */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Recommendation Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-base text-[#111827]">AI Recommendation</h2>
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed mb-4">
              You've been performing well in <strong className="text-[#111827]">Arrays</strong> and <strong className="text-[#111827]">Linked Lists</strong>. Your recent <strong className="text-[#111827]">Graphs</strong> quiz results show that <strong className="text-[#111827]">BFS and DFS</strong> need more practice.
            </p>
            <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-[#64748B] block">Recommended for today:</span>
                <span className="text-sm font-semibold text-[#111827]">Practice Graph Traversal</span>
              </div>
              <button
                onClick={() => router.push('/study/quiz?topic=Graphs')}
                className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Today's Study Plan */}
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-base text-[#111827]">Today's Study Plan</h2>
                <p className="text-xs text-[#64748B] mt-0.5">3 tasks scheduled for today</p>
              </div>
              <button
                onClick={() => router.push('/study/chat')}
                className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold hover:bg-[#DBEAFE] transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Session</span>
              </button>
            </div>

            <div className="space-y-3">
              {activePlan.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleTask(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    item.completed
                      ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-75'
                      : 'bg-white border-[#E2E8F0] hover:border-[#BFDBFE]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      item.completed ? 'bg-[#16A34A] border-[#16A34A] text-white' : 'border-[#CBD5E1] bg-white'
                    }`}>
                      {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#2563EB] block">{item.topic}</span>
                      <span className={`text-sm font-medium ${item.completed ? 'line-through text-[#64748B]' : 'text-[#111827]'}`}>
                        {item.task}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-md">
                    {item.durationMin} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Topic Mastery & Recent Activity */}
        <div className="space-y-6">
          {/* Topic Mastery */}
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card">
            <h2 className="font-semibold text-base text-[#111827] mb-4">Topic Mastery</h2>
            <div className="space-y-4">
              {topicMastery.map((topic) => (
                <div key={topic.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#111827]">{topic.name}</span>
                    <span className="font-semibold text-[#64748B]">{topic.masteryPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        topic.masteryPct >= 75
                          ? 'bg-[#16A34A]'
                          : topic.masteryPct >= 50
                          ? 'bg-[#2563EB]'
                          : 'bg-[#F59E0B]'
                      }`}
                      style={{ width: `${topic.masteryPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card">
            <h2 className="font-semibold text-base text-[#111827] mb-4">Recent Activity</h2>
            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
              {recentActivities.map((act) => (
                <div key={act.id} className="relative pl-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] absolute left-0.5 top-1 border-2 border-white ring-2 ring-[#EFF6FF]" />
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-0.5">
                    {act.timeframe}
                  </span>
                  <p className="text-xs font-medium text-[#111827] leading-tight">{act.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
