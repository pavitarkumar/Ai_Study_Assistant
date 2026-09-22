'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border border-[#E2E8F0] rounded-[14px] p-8 text-center space-y-4 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#111827]">Application Error</h2>
          <p className="text-xs text-[#64748B]">
            A critical error occurred in the application shell.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-2.5 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
