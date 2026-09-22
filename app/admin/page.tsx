'use client';

import React, { useState, useEffect } from 'react';
import { Users, FileText, HelpCircle, Clock, Cpu, AlertTriangle } from 'lucide-react';
import { dbStore } from '@/lib/db';

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    documents: 3,
    sessions: 4,
    conversations: 2,
    totalMinutes: 45,
  });

  useEffect(() => {
    try {
      const docs = dbStore.getDocuments('user-demo-123');
      const activities = dbStore.getRecentActivities('user-demo-123');
      const convs = dbStore.getConversations('user-demo-123');
      const profile = dbStore.getStudentProfile('user-demo-123');

      setCounts({
        documents: docs.length,
        sessions: activities.length,
        conversations: convs.length,
        totalMinutes: profile.todayStudyTimeMin,
      });
    } catch {
      // ignore
    }
  }, []);

  const metrics = [
    { label: 'Active Students', value: '1', sub: 'Demo Student Connected', icon: Users },
    { label: 'Documents Indexed', value: `${counts.documents}`, sub: 'Ready for RAG Hybrid Search', icon: FileText },
    { label: 'Active Study Conversations', value: `${counts.conversations}`, sub: 'Multi-turn chat threads', icon: Cpu },
    { label: 'Study Sessions Logged', value: `${counts.sessions}`, sub: 'Active progress sessions', icon: Clock },
    { label: 'Today Study Time', value: `${counts.totalMinutes} min`, sub: 'Real-time tracked study minutes', icon: HelpCircle },
    { label: 'System Errors', value: '0', sub: 'All services healthy & online', icon: AlertTriangle },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Admin & Platform Overview</h1>
        <p className="text-sm text-[#64748B] mt-1">Platform analytics and live usage metrics overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-card flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-[#64748B] block mb-1">{m.label}</span>
                <span className="text-2xl font-bold text-[#111827]">{m.value}</span>
                <span className="text-[11px] text-[#64748B] block mt-1">{m.sub}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
