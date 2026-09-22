'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, RefreshCw, Sparkles, Plus, Play, ArrowRight } from 'lucide-react';
import { dbStore } from '@/lib/db';

export default function StudyPlannerPage() {
  const userId = 'user-demo-123';
  const goal = dbStore.getActiveGoal(userId);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [planUpdatedBanner, setPlanUpdatedBanner] = useState(false);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, goal: goal.title, deadlineDays: 30, dailyHours: 2 }),
      });
      const json = await res.json();
      if (json.success) {
        setItems(json.data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleDynamicAdaptation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, goal: goal.title, deadlineDays: 30, dailyHours: 2, action: 'adapt' }),
      });
      const json = await res.json();
      if (json.success && json.data.items) {
        setItems(json.data.items);
        setPlanUpdatedBanner(true);
      }
    } catch (err) {
      console.error('Failed to adapt study plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Study Planner</h1>
          <p className="text-sm text-[#64748B] mt-1">AI-generated schedule tailored to your goal and available daily hours.</p>
        </div>

        <button
          onClick={handleDynamicAdaptation}
          className="px-4 py-2 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-semibold hover:bg-[#DBEAFE] transition-colors flex items-center gap-2 self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Adapt Plan to Progress</span>
        </button>
      </div>

      {/* Dynamic Adaptation Notification Banner */}
      {planUpdatedBanner && (
        <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[14px] flex items-center justify-between text-xs text-[#111827]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span><strong>Plan updated based on your progress:</strong> Extra revision added for Graph BFS/DFS based on recent quiz performance.</span>
          </div>
          <button onClick={() => setPlanUpdatedBanner(false)} className="text-[#64748B] font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Goal Summary Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider block">Active Goal</span>
          <h2 className="text-lg font-bold text-[#111827]">{goal.title}</h2>
          <p className="text-xs text-[#64748B]">{goal.description}</p>
        </div>

        <div className="flex items-center gap-6 text-xs text-[#64748B] border-t sm:border-t-0 sm:border-l border-[#E2E8F0] pt-4 sm:pt-0 sm:pl-6 shrink-0">
          <div>
            <span className="block font-semibold text-[#111827] text-sm">{goal.daysRemaining} days</span>
            <span>Remaining</span>
          </div>
          <div>
            <span className="block font-semibold text-[#111827] text-sm">{goal.dailyHours} hrs</span>
            <span>Daily Commitment</span>
          </div>
          <div>
            <span className="block font-semibold text-[#2563EB] text-sm">{goal.progressPct}%</span>
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card space-y-4">
        <h2 className="font-semibold text-base text-[#111827]">Schedule Timeline</h2>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#64748B]">Generating dynamic plan...</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleComplete(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  item.completed
                    ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-75'
                    : 'bg-white border-[#E2E8F0] hover:border-[#BFDBFE]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-lg bg-[#F1F5F9] text-[#111827] text-xs font-bold shrink-0">
                    Day {item.dayNumber}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-[#2563EB] block">{item.topic}</span>
                    <span className={`text-sm font-medium ${item.completed ? 'line-through text-[#64748B]' : 'text-[#111827]'}`}>
                      {item.task}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-md hidden sm:inline">
                    {item.durationMin} min
                  </span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    item.completed ? 'bg-[#16A34A] border-[#16A34A] text-white' : 'border-[#CBD5E1]'
                  }`}>
                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
