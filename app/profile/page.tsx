'use client';

import React from 'react';
import { User, Mail, Award, BookOpen } from 'lucide-react';
import { dbStore } from '@/lib/db';

export default function ProfilePage() {
  const userId = 'user-demo-123';
  const profile = dbStore.getStudentProfile(userId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Student Profile</h1>
        <p className="text-sm text-[#64748B] mt-1">Your account information and learning level details.</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#EFF6FF] border-2 border-[#BFDBFE] text-[#2563EB] font-bold text-xl flex items-center justify-center">
            DS
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#111827]">{profile.name}</h2>
            <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{profile.email}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0] text-xs">
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
            <span className="text-[#64748B] block mb-1">Learning Level</span>
            <span className="font-bold text-[#111827] text-sm">{profile.learningLevel}</span>
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
            <span className="text-[#64748B] block mb-1">Target Goal</span>
            <span className="font-bold text-[#111827] text-sm">{profile.targetGoal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
