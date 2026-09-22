'use client';

import React from 'react';
import { TrendingUp, Sparkles, AlertCircle, CheckCircle2, Award } from 'lucide-react';
import { dbStore } from '@/lib/db';

export default function ProgressPage() {
  const userId = 'user-demo-123';
  const topicMastery = dbStore.getTopicMastery(userId);
  const weakTopics = dbStore.getWeakTopics(userId);
  const strongTopics = dbStore.getStrongTopics(userId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Your Progress</h1>
        <p className="text-sm text-[#64748B] mt-1">Detailed analysis of your topic mastery, quiz accuracy, and weak concepts.</p>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
          <Sparkles className="w-4 h-4" />
          <span>AI Insights</span>
        </div>
        <p className="text-sm text-[#111827] leading-relaxed">
          "Your performance in <strong className="font-semibold">Graphs</strong> improved over your last 5 quizzes. Dynamic Programming remains your primary growth opportunity."
        </p>
      </div>

      {/* Topic Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strong Topics */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#16A34A]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Strong Topics (&ge; 75%)</span>
          </div>
          <div className="space-y-3">
            {strongTopics.map((t) => (
              <div key={t.id} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-[#111827] block">{t.name}</span>
                  <span className="text-[11px] text-[#64748B]">{t.category}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs font-bold">
                  {t.masteryPct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#F59E0B]">
            <AlertCircle className="w-4 h-4" />
            <span>Needs Practice (&lt; 65%)</span>
          </div>
          <div className="space-y-3">
            {weakTopics.map((t) => (
              <div key={t.id} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-[#111827] block">{t.name}</span>
                  <span className="text-[11px] text-[#64748B]">{t.category}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#F59E0B] text-xs font-bold">
                  {t.masteryPct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
