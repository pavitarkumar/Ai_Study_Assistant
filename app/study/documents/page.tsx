'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, Trash2, MessageSquare, Eye, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { StudyDocumentData } from '@/lib/db/mockData';

export default function MyDocumentsPage() {
  const router = useRouter();
  const userId = 'user-demo-123';
  const [documents, setDocuments] = useState<StudyDocumentData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileSizeMb, setFileSizeMb] = useState<number>(2.5);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    try {
      const res = await fetch(`/api/documents?userId=${userId}`);
      const json = await res.json();
      if (json.success) {
        setDocuments(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileChange = (file: File) => {
    if (!file) return;
    setSelectedFile(file.name);
    const size = Number((file.size / (1024 * 1024)).toFixed(2)) || 0.1;
    setFileSizeMb(Math.max(0.1, size));

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileContent(text || '');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          filename: selectedFile,
          fileSizeMb,
          fileContent: fileContent || undefined,
          topics: ['Computer Science', 'Study Notes'],
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSelectedFile('');
        setFileContent('');
        fetchDocs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchDocs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">My Documents</h1>
          <p className="text-sm text-[#64748B] mt-1">Upload and manage your study materials for AI grounding & search.</p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`bg-white border-2 border-dashed rounded-[14px] p-8 text-center space-y-4 transition-all cursor-pointer ${
          dragOver ? 'border-[#2563EB] bg-[#EFF6FF]/40' : 'border-[#E2E8F0] hover:border-[#2563EB]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.txt,.md,.json,.csv,.doc,.docx"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileChange(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-base text-[#111827]">
            {selectedFile ? `Selected: ${selectedFile} (${fileSizeMb} MB)` : 'Click to Browse or Drag & Drop Study Material'}
          </h3>
          <p className="text-xs text-[#64748B] mt-1">Supports PDF, TXT, MD, DOCX, CSV up to 25 MB</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            placeholder="Or type/edit document name..."
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#2563EB]"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Indexing...</span>
              </>
            ) : (
              <span>Upload Document</span>
            )}
          </button>
        </div>
      </div>

      {/* Document Grid */}
      <div className="space-y-4">
        <h2 className="font-semibold text-base text-[#111827]">Indexed Study Material ({documents.length})</h2>

        {documents.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-[#64748B] mx-auto" />
            <h3 className="font-semibold text-sm text-[#111827]">No documents yet</h3>
            <p className="text-xs text-[#64748B]">Upload your study material and start asking questions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-card flex flex-col justify-between space-y-4 hover:border-[#BFDBFE] transition-all">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-xs text-[#111827] truncate">{doc.filename}</h3>
                        <span className="text-[11px] text-[#64748B]">{doc.fileSizeMb} MB</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {doc.status}
                    </span>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {doc.topics.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-[#64748B]">
                    <span>{doc.chunkCount || 2} indexed chunks • Added {doc.uploadedAt}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] text-xs">
                  <button
                    onClick={() => router.push(`/study/search?q=${encodeURIComponent(doc.filename)}`)}
                    className="text-[#2563EB] font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Search Chunks</span>
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-[#EF4444] hover:text-[#DC2626] p-1 rounded hover:bg-[#FEE2E2] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
