'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Calendar, Clock, ArrowRight, Plus } from 'lucide-react';
import { dbStore } from '@/lib/db';

export default function GoalsPage() {
  const userId = 'user-demo-123';
  const goal = dbStore.getActiveGoal(userId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Study Goals</h1>
          <p className="text-sm text-[#64748B] mt-1">Set and track long-term academic and learning milestones.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] flex items-center gap-1.5 self-start">
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goal Cards */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[10px] font-semibold border border-[#BFDBFE]">
              Active
            </span>
            <h2 className="text-lg font-bold text-[#111827]">{goal.title}</h2>
            <p className="text-xs text-[#64748B]">{goal.description}</p>
          </div>
          <Link
            href="/study/planner"
            className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] flex items-center gap-1.5 shrink-0"
          >
            <span>View Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-[#111827]">Progress</span>
            <span className="font-bold text-[#2563EB]">{goal.progressPct}% complete</span>
          </div>
          <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${goal.progressPct}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E2E8F0] text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2563EB]" />
            <span>{goal.daysRemaining} days remaining</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2563EB]" />
            <span>{goal.dailyHours} hours/day</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#2563EB]" />
            <span>Target: Oct 4, 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
