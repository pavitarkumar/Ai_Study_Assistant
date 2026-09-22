'use client';

import React from 'react';
import { Flame, Clock, Calendar, CheckCircle2, Award, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { dbStore } from '@/lib/db';

export default function StudyTrackerPage() {
  const userId = 'user-demo-123';
  const profile = dbStore.getStudentProfile(userId);

  const weeklyData = [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 60 },
    { day: 'Wed', minutes: 75 },
    { day: 'Thu', minutes: 30 },
    { day: 'Fri', minutes: 90 },
    { day: 'Sat', minutes: 120 },
    { day: 'Sun', minutes: 45 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Study Tracker</h1>
        <p className="text-sm text-[#64748B] mt-1">Track your daily study consistency, streak, and weekly hours.</p>
      </div>

      {/* Streak Hero Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center shrink-0">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#111827]">{profile.currentStreak} Day Streak</span>
              <span className="text-xs font-semibold text-[#F59E0B] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">Active</span>
            </div>
            <p className="text-xs text-[#64748B] mt-1">Keep your learning momentum going! Longest streak: {profile.longestStreak} days.</p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-[#E2E8F0] pt-4 sm:pt-0 sm:pl-6 text-xs text-[#64748B]">
          <div>
            <span className="block font-bold text-[#111827] text-lg">465 min</span>
            <span>This Week</span>
          </div>
          <div>
            <span className="block font-bold text-[#111827] text-lg">1,420 min</span>
            <span>This Month</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card space-y-4">
        <h2 className="font-semibold text-base text-[#111827]">Weekly Study Time (Minutes)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
              <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
              <Bar dataKey="minutes" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
