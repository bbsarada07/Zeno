import React, { useState } from 'react';
import { Send, MapPin, GraduationCap, FileCheck, Mic, Paperclip, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChatCanvas: React.FC = () => {
  const {
    messages,
    sendMessage,
    openGisNavigation,
    setActiveTab,
    setIsHitlDrawerOpen,
    triggerScenario1_GIS,
    triggerScenario2_Placement,
    triggerScenario3_Waiver,
  } = useApp();

  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground relative">
      {/* Executive Header Quick Action Chips */}
      <div className="p-3 sm:p-4 border-b border-border bg-card/40 backdrop-blur-md">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Executive Governance Command Shortcuts</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={triggerScenario1_GIS}
            className="px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-primary/10 hover:border-primary/40 border border-border text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Where is my OS Lab class?</span>
          </button>

          <button
            onClick={triggerScenario2_Placement}
            className="px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-primary/10 hover:border-primary/40 border border-border text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 shrink-0"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Am I eligible for Google Placement Drive?</span>
          </button>

          <button
            onClick={triggerScenario3_Waiver}
            className="px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-primary/10 hover:border-primary/40 border border-border text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 shrink-0"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Draft Medical Attendance Waiver Request</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          return (
            <div key={msg.id} className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 ${
                  isAgent
                    ? 'bg-card border border-border text-foreground'
                    : 'bg-primary text-primary-foreground font-medium'
                }`}
              >
                <div className="flex items-center justify-between text-xs opacity-75 pb-1 border-b border-border/40">
                  <span className="font-semibold">{isAgent ? 'Zeno Governance Intelligence' : 'Alex Rivera'}</span>
                  <span className="font-mono text-[10px]">{msg.timestamp}</span>
                </div>

                {/* Formatted Message Output */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Interactive Action Triggers embedded in Agent Responses */}
                {isAgent && msg.quickActionType === 'gis' && (
                  <div className="pt-2">
                    <button
                      onClick={openGisNavigation}
                      className="w-full py-2.5 px-4 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Open Interactive Indoor Floor Plan Map</span>
                    </button>
                  </div>
                )}

                {isAgent && msg.quickActionType === 'placement' && (
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('placement')}
                      className="w-full py-2.5 px-4 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Open Placement AI & Digital Twin Workspace</span>
                    </button>
                  </div>
                )}

                {isAgent && msg.quickActionType === 'waiver' && (
                  <div className="pt-2">
                    <button
                      onClick={() => setIsHitlDrawerOpen(true)}
                      className="w-full py-2.5 px-4 bg-amber-500 text-black text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Open HITL Approval Drawer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Command Input Area */}
      <div className="p-4 border-t border-border bg-card/60 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Zeno (e.g. OS Lab location, placement eligibility, attendance waiver)..."
            className="w-full pl-4 pr-24 py-3.5 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
          />

          <div className="absolute right-2 flex items-center space-x-1">
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-all"
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-all"
              title="Attach Document"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
