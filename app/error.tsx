'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled App Router Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center border border-[#FEE2E2]">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-md">
        <h2 className="text-xl font-bold text-[#111827]">Something went wrong</h2>
        <p className="text-xs text-[#64748B] leading-relaxed">
          An unexpected error occurred while loading this page. Our system has caught the issue.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-[#1D4ED8] transition-colors flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>

        <Link
          href="/dashboard"
          className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#111827] text-xs font-semibold rounded-lg hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
