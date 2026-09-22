'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  MessageSquare,
  Plus,
  Search,
  Send,
  Paperclip,
  Mic,
  BookOpen,
  Sparkles,
  HelpCircle,
  FileText,
  ChevronRight,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check
} from 'lucide-react';
import { dbStore } from '@/lib/db';
import { ConversationSummary, ChatMessageData } from '@/lib/db/mockData';

export default function AIStudyChatPage() {
  const userId = 'user-demo-123';
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchConv, setSearchConv] = useState('');
  const [mobileContextOpen, setMobileContextOpen] = useState(false);
  const [knowledgeSource, setKnowledgeSource] = useState<'My Study Material' | 'AI Knowledge' | 'Both'>('Both');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, string>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convs = dbStore.getConversations(userId);
    setConversations(convs);
    if (convs.length > 0) {
      setActiveConvId(convs[0].id);
      setMessages(dbStore.getMessages(convs[0].id));
    } else {
      setActiveConvId('');
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    if (activeConvId) {
      setMessages(dbStore.getMessages(activeConvId));
    } else {
      setMessages([]);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
  };

  const handleNewChat = () => {
    const newConv = dbStore.createConversation(userId, 'New Study Session');
    setConversations(dbStore.getConversations(userId));
    setActiveConvId(newConv.id);
    setMessages([]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || loading) return;

    setInputQuery('');
    setLoading(true);

    let targetConvId = activeConvId;
    if (!targetConvId) {
      const convTitle = query.length > 25 ? query.slice(0, 25) + '...' : query;
      const newConv = dbStore.createConversation(userId, convTitle);
      targetConvId = newConv.id;
      setActiveConvId(targetConvId);
      setConversations(dbStore.getConversations(userId));
    }

    const userMsg = dbStore.addMessage(targetConvId, 'user', query);
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: query,
          conversationId: targetConvId,
          knowledgeSource,
          history: messages.slice(-8).map(m => ({ role: m.sender, content: m.content })),
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.answer) {
        const assistantMsg = dbStore.addMessage(
          targetConvId,
          'assistant',
          json.data.answer,
          json.data.citations
        );
        setMessages(prev => [...prev, assistantMsg]);
        setConversations(dbStore.getConversations(userId));
      } else {
        const errorMsg = dbStore.addMessage(
          targetConvId,
          'assistant',
          `Sorry, an error occurred: ${json.error?.message || 'Failed to process request.'}`
        );
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (err: any) {
      console.error('Failed to send message:', err);
      const networkErrMsg = dbStore.addMessage(
        targetConvId,
        'assistant',
        'Network error: Could not connect to server. Please try again.'
      );
      setMessages(prev => [...prev, networkErrMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (msgId: string, rating: 'helpful' | 'unhelpful', reason?: string) => {
    setFeedbackGiven(prev => ({ ...prev, [msgId]: rating }));
    try {
      await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, messageId: msgId, rating, reason }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchConv.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)] bg-white border border-[#E2E8F0] rounded-[14px] shadow-card flex overflow-hidden">
      {/* 1. LEFT SIDEBAR */}
      <div className="w-64 border-r border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between hidden md:flex">
        <div className="p-3 space-y-3">
          <button
            onClick={handleNewChat}
            className="w-full py-2.5 px-3 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchConv}
              onChange={(e) => setSearchConv(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-4 text-xs">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-[11px] text-[#64748B]">
              No previous chats yet. Type a question below to start studying!
            </div>
          ) : (
            ['Today', 'Yesterday', 'Previous 7 Days'].map((group) => {
              const groupConvs = filteredConversations.filter(c => c.timeframe === group);
              if (groupConvs.length === 0) return null;

              return (
                <div key={group} className="space-y-1">
                  <span className="px-2 font-semibold text-[10px] text-[#64748B] uppercase tracking-wider block">
                    {group}
                  </span>
                  {groupConvs.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between group ${
                        activeConvId === conv.id
                          ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                          : 'text-[#64748B] hover:bg-white hover:text-[#111827]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{conv.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. CENTER AREA */}
      <div className="flex-1 flex flex-col justify-between bg-white min-w-0">
        {/* Chat Top Header */}
        <div className="h-14 px-6 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-sm text-[#111827]">AI Study Chat</h2>
            
            {/* Knowledge Source Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-[#F8FAFC] p-1 border border-[#E2E8F0] rounded-lg text-[11px]">
              <span className="text-[#64748B] px-1 font-medium">Source:</span>
              {(['Both', 'My Study Material', 'AI Knowledge'] as const).map((src) => (
                <button
                  key={src}
                  onClick={() => setKnowledgeSource(src)}
                  className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                    knowledgeSource === src ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#64748B] hover:text-[#111827]'
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setMobileContextOpen(!mobileContextOpen)}
            className="lg:hidden text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-lg"
          >
            Study Context
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-8">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base text-[#111827]">Start your first study conversation</h3>
              <p className="text-xs text-[#64748B] max-w-sm leading-relaxed">
                Ask about any topic, request quizzes, or get explanations tailored to your current mastery level.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-sm ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`space-y-2 max-w-2xl ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.sender === 'user' ? (
                    <div className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#111827] px-4 py-3 rounded-2xl rounded-tr-sm">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 text-[#111827] space-y-3 prose prose-slate max-w-none text-xs sm:text-sm relative group">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {msg.content}
                      </ReactMarkdown>

                      {/* Source Citations */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold text-[#64748B]">Sources:</span>
                          {msg.citations.map((cite, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md bg-white border border-[#E2E8F0] text-[#2563EB] font-medium inline-flex items-center gap-1 text-[11px]"
                            >
                              <FileText className="w-3 h-3" />
                              {cite.title} {cite.page ? `(Page ${cite.page})` : ''}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Response Footer: Feedback & Copy */}
                      <div className="pt-2 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs text-[#64748B]">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px]">Was this helpful?</span>
                          <button
                            onClick={() => handleFeedback(msg.id, 'helpful')}
                            className={`p-1 rounded hover:bg-white ${feedbackGiven[msg.id] === 'helpful' ? 'text-[#16A34A]' : ''}`}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, 'unhelpful', 'Needs clarification')}
                            className={`p-1 rounded hover:bg-white ${feedbackGiven[msg.id] === 'unhelpful' ? 'text-[#DC2626]' : ''}`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleCopyText(msg.content, msg.id)}
                          className="flex items-center gap-1 text-[11px] hover:text-[#111827]"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {msg.sender === 'assistant' && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => handleSendMessage('Explain this simpler for a beginner.')}
                        className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-white text-[11px] font-medium text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                      >
                        Explain Simpler
                      </button>
                      <button
                        onClick={() => handleSendMessage('Give me a practical C++ / Java example.')}
                        className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-white text-[11px] font-medium text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                      >
                        Give Example
                      </button>
                      <button
                        onClick={() => handleSendMessage('Ask me 5 practice questions about this.')}
                        className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-white text-[11px] font-medium text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                      >
                        Ask Me Questions
                      </button>
                      <button
                        onClick={() => handleSendMessage('Create a quiz on this topic.')}
                        className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-white text-[11px] font-medium text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                      >
                        Create Quiz
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-[#64748B]">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span>Searching study context & generating answer...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all"
          >
            <button type="button" className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#E2E8F0]" title="Attach document">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Ask anything about your studies..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#111827] placeholder:text-[#94A3B8] focus:outline-none"
            />
            <button type="button" className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#E2E8F0]" title="Voice input">
              <Mic className="w-4 h-4 text-[#2563EB]" />
            </button>
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="px-3.5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. RIGHT SIDEBAR */}
      <div className={`w-72 border-l border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col justify-between ${mobileContextOpen ? 'block fixed right-0 top-16 bottom-0 z-40 bg-white' : 'hidden lg:flex'}`}>
        <div className="space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <h3 className="font-semibold text-xs text-[#111827] uppercase tracking-wider">Study Context</h3>
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          </div>

          <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl space-y-2 shadow-card">
            <span className="text-[#64748B] font-medium block">Current Topic</span>
            <span className="text-sm font-bold text-[#111827] block">Operating Systems & Graphs</span>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#64748B]">Mastery</span>
                <span className="font-semibold text-[#2563EB]">61%</span>
              </div>
              <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '61%' }} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-[#64748B] uppercase text-[10px] tracking-wider block">Recent Questions</span>
            <div className="space-y-1.5">
              {['Explain BST vs Graph', 'Deadlock Coffman Conditions', 'BFS Implementation'].map((q, i) => (
                <div key={i} className="p-2 bg-white border border-[#E2E8F0] rounded-lg text-[#111827] flex items-center justify-between">
                  <span className="truncate">{q}</span>
                  <ChevronRight className="w-3 h-3 text-[#64748B]" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-[#64748B] uppercase text-[10px] tracking-wider block">Related Documents</span>
            <div className="space-y-1.5">
              <div className="p-2 bg-white border border-[#E2E8F0] rounded-lg flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="truncate font-medium text-[#111827]">Operating Systems Notes.pdf</span>
              </div>
              <div className="p-2 bg-white border border-[#E2E8F0] rounded-lg flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="truncate font-medium text-[#111827]">DSA Notes.pdf</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-[#2563EB]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Practice</span>
            </div>
            <p className="text-[11px] text-[#111827]">Practice 5 Medium Graph Traversal Questions to improve from 45% mastery.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
