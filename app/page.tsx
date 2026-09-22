'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen, Brain, CheckCircle2, ShieldCheck, Target, Zap, MessageSquare, BarChart3, HelpCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      {/* Header Navigation */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-[#E2E8F0]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm">
            <img src="/logo.jpg" alt="AI Study Assistant Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-lg text-[#111827] tracking-tight">AI Study Assistant</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-[#64748B] hover:text-[#111827]">
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1D4ED8] transition-colors shadow-sm"
          >
            Start Studying
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-semibold text-[#2563EB] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Azure AI Powered Personalized Education Platform
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111827] tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
          Your Personal AI Study Assistant
        </h1>
        <p className="text-lg sm:text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed mb-10">
          Learn smarter, practice better, and stay on track with an AI assistant that adapts to the way you learn.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#2563EB] text-white text-base font-semibold hover:bg-[#1D4ED8] transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Start Studying</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/study/chat"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-[#E2E8F0] text-[#111827] text-base font-semibold hover:bg-[#F1F5F9] transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#2563EB]" />
            <span>Explore AI Chat</span>
          </Link>
        </div>

        {/* Abstract UI Preview of AI Study Chat */}
        <div className="max-w-5xl mx-auto bg-white border border-[#E2E8F0] rounded-[16px] shadow-card p-4 sm:p-6 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#DC2626]/40" />
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]/40" />
              <div className="w-3 h-3 rounded-full bg-[#16A34A]/40" />
              <span className="text-xs font-semibold text-[#64748B] ml-2">AI Study Chat Preview</span>
            </div>
            <span className="text-[11px] font-medium text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">
              Personalized for your learning
            </span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex justify-end">
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#111827] px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-lg">
                Explain deadlock prevention in Operating Systems like I'm a beginner.
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB] mb-1">
                <Brain className="w-4 h-4" />
                <span>AI Study Assistant</span>
              </div>
              <p className="text-[#111827] leading-relaxed">
                Think of a **deadlock** like a traffic gridlock where 4 cars are waiting for each other to move, so nobody moves.
              </p>
              <p className="text-[#64748B]">
                **Deadlock Prevention** means putting up strict traffic rules *beforehand* so a gridlock can never happen in the first place (by breaking circular wait).
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-[#64748B]">
                <span className="font-semibold text-[#111827]">Source:</span>
                <span className="bg-white px-2 py-0.5 border border-[#E2E8F0] rounded">Operating Systems Notes.pdf (Page 18)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-white border-y border-[#E2E8F0] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#111827] tracking-tight mb-4">Designed for Effective Learning</h2>
            <p className="text-[#64748B] text-base">
              A comprehensive toolkit that combines RAG document grounding, adaptive quizzes, and dynamic study plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px]">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-[#111827] mb-2">Central AI Study Chat</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Ask questions naturally. The AI understands your current level, weak topics, and uploaded notes.
              </p>
            </div>

            <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px]">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-[#111827] mb-2">RAG Document Grounding</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Upload PDFs, DOCX, or slides. Get answers grounded strictly in your syllabus with exact citations.
              </p>
            </div>

            <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px]">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-[#111827] mb-2">Adaptive AI Quizzes</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Practice quizzes that automatically scale difficulty based on your accuracy and topic mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B]">
        <p>© 2026 AI Study Assistant. Built for Azure AI-103 Portfolio.</p>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <Link href="/dashboard" className="hover:text-[#111827]">Dashboard</Link>
          <Link href="/study/chat" className="hover:text-[#111827]">Study Chat</Link>
          <Link href="/study/documents" className="hover:text-[#111827]">Documents</Link>
        </div>
      </footer>
    </div>
  );
}
