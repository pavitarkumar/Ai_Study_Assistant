'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Globe, FileText, HelpCircle, Sparkles, Layers } from 'lucide-react';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || 'Deadlock Prevention';

  const [query, setQuery] = useState(initialQuery);
  const [includeWeb, setIncludeWeb] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async (qText?: string) => {
    const activeQuery = qText || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-demo-123', query: activeQuery, includeWeb }),
      });
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Search your study knowledge</h1>
        <p className="text-sm text-[#64748B] mt-1">Search across your documents, notes, chats, and quiz history.</p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-4 shadow-card space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="What do you want to learn? (e.g. Deadlock Prevention, Graph BFS...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm shrink-0"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Options */}
        <div className="flex items-center justify-between text-xs text-[#64748B] pt-1 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeWeb}
                onChange={(e) => setIncludeWeb(e.target.checked)}
                className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
              />
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
                Include Web Search
              </span>
            </label>
          </div>
          <span>Scope: My Documents, Previous Chats, Notes, Topics</span>
        </div>
      </div>

      {/* Results View */}
      {results && (
        <div className="space-y-6">
          {/* Synthesized Answer */}
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
              <Sparkles className="w-4 h-4" />
              <span>Synthesized Answer</span>
            </div>
            <p className="text-sm text-[#111827] leading-relaxed whitespace-pre-line">
              {results.answer}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sources (2 cols) */}
            <div className="md:col-span-2 bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-card space-y-4">
              <h3 className="font-semibold text-sm text-[#111827] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                <span>Document Sources</span>
              </h3>
              <div className="space-y-3">
                {results.sources.map((src: any, idx: number) => (
                  <div key={idx} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111827]">{src.filename}</span>
                      <span className="px-2 py-0.5 bg-white border border-[#E2E8F0] rounded text-[11px] text-[#64748B]">
                        Page {src.pageNumber}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#2563EB] block">{src.topic}</span>
                    <p className="text-[#64748B] leading-relaxed">{src.snippet}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Questions & Topics (1 col) */}
            <div className="space-y-6">
              {/* Previous Related Questions */}
              <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-card space-y-3">
                <h3 className="font-semibold text-xs text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Previous Related Questions</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {results.previousRelatedQuestions.map((q: string, i: number) => (
                    <div key={i} className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#111827]">
                      "{q}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Topics */}
              <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-card space-y-3">
                <h3 className="font-semibold text-xs text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Related Topics</span>
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {results.relatedTopics.map((t: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] font-medium rounded-lg">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdvancedSearchPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-[#64748B]">Loading search engine...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
