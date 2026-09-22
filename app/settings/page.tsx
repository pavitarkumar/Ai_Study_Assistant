'use client';

import React from 'react';
import { Settings, Shield, Bell, Moon, Sun, Cpu } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Settings</h1>
        <p className="text-sm text-[#64748B] mt-1">Manage system preferences, AI provider settings, and notifications.</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card space-y-6">
        <h2 className="font-semibold text-base text-[#111827] flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#2563EB]" />
          <span>AI & Search Configuration</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
            <div>
              <span className="font-semibold text-[#111827] block">AI Provider Mode</span>
              <span className="text-[#64748B]">Currently running in local mock mode without Azure API keys</span>
            </div>
            <span className="px-3 py-1 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] font-bold rounded-lg">
              AI_PROVIDER=mock
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
            <div>
              <span className="font-semibold text-[#111827] block">Appearance Theme</span>
              <span className="text-[#64748B]">Light theme (Enforced SaaS system design)</span>
            </div>
            <span className="px-3 py-1 bg-white border border-[#E2E8F0] text-[#111827] font-semibold rounded-lg flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Light Mode</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
