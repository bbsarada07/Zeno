import React, { useState, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Calendar,
  Mail,
  ShieldAlert,
  Copy,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgentTopologyVisualizer } from './AgentTopologyVisualizer';
import type { AgentDomain } from '../../types';

export const ChatCanvas: React.FC = () => {
  const { messages, sendMessage, setIsHitlDrawerOpen } = useApp();
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [spatialBadge, setSpatialBadge] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeDomain: AgentDomain =
    messages[messages.length - 1]?.intentResult?.domain || 'ACADEMIC_GIS';

  useEffect(() => {
    const handleGisEvent = (e: any) => {
      if (e.detail) {
        setSpatialBadge('[AGENT: ACADEMIC_GIS]');
        setTimeout(() => setSpatialBadge(null), 8000);
      }
    };
    window.addEventListener('zeno:spatial_gis_trigger', handleGisEvent);
    return () => window.removeEventListener('zeno:spatial_gis_trigger', handleGisEvent);
  }, []);

  const dispatchPrompt = (promptText: string) => {
    if (isProcessing || !promptText.trim()) return;

    setIsProcessing(true);
    sendMessage(promptText.trim());
    setInputText('');

    setTimeout(() => {
      setIsProcessing(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchPrompt(inputText);
  };

  const handleChipClick = (promptText: string) => {
    dispatchPrompt(promptText);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickActionChips = [
    { label: 'Where is my next lab?', icon: '📍', prompt: 'Where is my next lab?' },
    { label: 'Quiz me on Trees & BST', icon: '📝', prompt: 'Quiz me on Trees & BST' },
    { label: '10-day exam study plan', icon: '📅', prompt: '10-day exam study plan' },
    { label: 'Can I bunk Java Lab today?', icon: '⚠️', prompt: 'Can I bunk Java Lab today?' },
    { label: "Show today's section schedule", icon: '📅', prompt: "Show today's section schedule" },
    { label: 'Check academic standing & attendance', icon: '📊', prompt: 'Check academic standing & attendance' },
  ];

  return (
    <div className="h-full flex flex-col zeno-glass-card p-4 sm:p-5 space-y-3 font-sans select-none overflow-hidden">
      {/* Live Agent Topology Node Visualizer */}
      <AgentTopologyVisualizer activeDomain={activeDomain} />

      {/* Chat Messages Conversation Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const intent = msg.intentResult;
          const displayBadge = spatialBadge && !isUser ? spatialBadge : intent ? `[AGENT: ${intent.agentName}]` : null;

          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}>
              {/* Agent Domain Badge */}
              {!isUser && displayBadge && (
                <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{displayBadge}</span>
                </div>
              )}

              <div
                className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-cyan-500 text-slate-950 font-medium shadow-[0_0_15px_rgba(0,240,255,0.3)] rounded-tr-none'
                    : 'bg-slate-950/80 dark:bg-slate-950/80 html-light:bg-white border border-slate-800 dark:border-slate-800 html-light:border-slate-200 text-slate-100 dark:text-slate-100 html-light:text-slate-900 rounded-tl-none space-y-3'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* DYNAMIC COMPONENT 1: Structured Event Card */}
                {!isUser && intent?.eventCard && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 text-xs font-mono space-y-2 text-slate-100">
                    <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800 pb-2">
                      <span className="flex items-center space-x-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{intent.eventCard.eventName}</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                        SCHEDULED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div>
                        <span className="text-slate-500">Organizer:</span> {intent.eventCard.organizer}
                      </div>
                      <div>
                        <span className="text-slate-500">Venue:</span> {intent.eventCard.venue}
                      </div>
                      <div>
                        <span className="text-slate-500">Date & Time:</span> {intent.eventCard.dateTime}
                      </div>
                      <div>
                        <span className="text-slate-500">Deadline:</span> {intent.eventCard.deadline}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">{intent.eventCard.description}</p>

                    <button
                      onClick={() => alert(`Registered for ${intent.eventCard?.eventName}`)}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5"
                    >
                      <span>Register for Event</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* DYNAMIC COMPONENT 2: Structured Email Draft Card */}
                {!isUser && intent?.emailDraft && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900/90 border border-purple-500/40 text-xs font-mono space-y-3 text-slate-100">
                    <div className="flex items-center justify-between text-purple-400 font-bold border-b border-slate-800 pb-2">
                      <span className="flex items-center space-x-1.5">
                        <Mail className="w-4 h-4" />
                        <span>Formal Institutional Draft</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Recipient: {intent.emailDraft.recipientName}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-400">Subject:</div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800 text-purple-300 font-bold">
                        {intent.emailDraft.subject}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-400">Body Payload:</div>
                      <div className="p-3 rounded bg-slate-950 border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                        {intent.emailDraft.body}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        onClick={() => handleCopyText(`body-${msg.id}`, intent.emailDraft?.body || '')}
                        className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 font-bold rounded-lg border border-slate-800 transition-all flex items-center justify-center space-x-1.5"
                      >
                        {copiedId === `body-${msg.id}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === `body-${msg.id}` ? 'Copied Body' : 'Copy Draft'}</span>
                      </button>

                      <button
                        onClick={() => setIsHitlDrawerOpen(true)}
                        className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Send to HITL Drawer</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* DYNAMIC COMPONENT 3: Structured Grievance Action Steps */}
                {!isUser && intent?.grievanceSteps && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900/90 border border-rose-500/40 text-xs font-mono space-y-3 text-slate-100">
                    <div className="flex items-center justify-between text-rose-400 font-bold border-b border-slate-800 pb-2">
                      <span className="flex items-center space-x-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Administrative Action Workflow</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      {intent.grievanceSteps.map((step) => (
                        <div key={step.stepNumber} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                          <div className="flex items-center space-x-2 font-bold text-white">
                            <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px]">
                              {step.stepNumber}
                            </span>
                            <span>{step.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{step.description}</p>
                          <div className="text-[10px] text-rose-300 font-mono pt-1 border-t border-slate-900">
                            Contact: {step.officeContact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[10px] font-mono text-slate-500 px-1">{msg.timestamp}</span>
            </div>
          );
        })}
      </div>

      {/* Interactive Quick Action Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {quickActionChips.map((chip, idx) => (
          <button
            key={idx}
            disabled={isProcessing}
            onClick={() => handleChipClick(chip.prompt)}
            className="px-2.5 py-1 rounded-xl bg-slate-950/80 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-all shrink-0 flex items-center space-x-1.5 disabled:opacity-40"
          >
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Input Prompt Form */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 pt-2 border-t border-slate-800/80">
        <input
          type="text"
          disabled={isProcessing}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Zeno about Attendance, Next Lab, Bunking Risk, Placement Drives, or Grievances..."
          className="flex-1 bg-slate-950 dark:bg-slate-950 html-light:bg-slate-100 border border-slate-800 dark:border-slate-800 html-light:border-slate-300 rounded-xl p-3 text-xs text-slate-100 dark:text-slate-100 html-light:text-slate-900 outline-none focus:border-cyan-500 font-mono disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isProcessing || !inputText.trim()}
          className="px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center space-x-1.5 disabled:opacity-40"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">{isProcessing ? 'Routing...' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};
