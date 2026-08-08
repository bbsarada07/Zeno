import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, Radio, Play, ShieldAlert, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dispatchVoiceQuery } from '../services/aiRoutingService';
import type { VoiceAgentResponse } from '../services/aiRoutingService';

interface VoiceAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen: externalIsOpen, onClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isModalOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState<VoiceAgentResponse | null>(null);
  const [selectedAgentBadge, setSelectedAgentBadge] = useState<string>('Communication Agent');

  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setIsProcessing(false);
          setIsSpeaking(false);
        };

        recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          setTranscript(currentText);
        };

        recognition.onerror = (event: any) => {
          console.warn('[VOICE STT WARNING]', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Handle Speech Synthesis (TTS)
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsProcessing(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const { sendMessage } = useApp();

  // Process User Speech or Preset Sample Text
  const handleProcessVoiceInput = async (inputText: string) => {
    if (!inputText || inputText.trim().length < 2) return;

    setIsListening(false);
    setIsProcessing(true);
    setIsSpeaking(false);

    // Stop recognition if active
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_e) {}
    }

    try {
      const res = await sendMessage(inputText.trim(), 'voice');
      if (res) {
        setLastResponse({
          agentName: res.agentBadgeLabel,
          speechText: res.speechText,
        });
        setSelectedAgentBadge(res.agentBadgeLabel);
      }
    } catch (_err) {
      console.warn('[VOICE PROCESSING ERROR]', _err);
    } finally {
      setIsProcessing(false);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  // Toggle Microphone Listening
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_e) {}
      }
      setIsListening(false);
      if (transcript) handleProcessVoiceInput(transcript);
    } else {
      setTranscript('');
      setIsSpeaking(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (_e) {
          // Speech Recognition fallback simulation for unsupported/blocked browsers
          setIsListening(true);
          setTimeout(() => {
            setTranscript('Where is my algorithms lecture today?');
            setTimeout(() => {
              setIsListening(false);
              handleProcessVoiceInput('Where is my algorithms lecture today?');
            }, 1200);
          }, 800);
        }
      } else {
        // Fallback simulation
        setIsListening(true);
        setTimeout(() => {
          setTranscript('Check new placement drives and ATS score');
          setTimeout(() => {
            setIsListening(false);
            handleProcessVoiceInput('Check new placement drives and ATS score');
          }, 1200);
        }, 800);
      }
    }
  };

  const closeModal = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsListening(false);
    setIsProcessing(false);
    if (onClose) onClose();
    else setInternalIsOpen(false);
  };

  const samplePrompts = [
    { label: 'Algorithms lecture schedule', agent: 'Academic Agent', prompt: 'Where is my Algorithms lecture today?' },
    { label: 'Check new placement drives', agent: 'Placement Agent', prompt: 'Are there any new internship drives?' },
    { label: 'Hostel AC repair ticket', agent: 'Service Agent', prompt: 'Log a maintenance ticket for hostel AC unit' },
    { label: 'Annual Hackathon details', agent: 'Events Agent', prompt: 'When is the campus hackathon event?' },
    { label: 'Campus emergency alert', agent: 'Communication Agent', prompt: 'Are there any urgent campus alerts?' },
  ];

  return (
    <>
      {/* Floating Glowing Quick-Mic Action Trigger Button */}
      {externalIsOpen === undefined && (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600 via-purple-600 to-emerald-500 p-0.5 shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:scale-105 transition-all flex items-center justify-center group"
          title="Open ZENO Voice Dispatcher Enclave"
        >
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-cyan-400 group-hover:text-emerald-400 transition-colors">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
        </button>
      )}

      {/* Modal / Drawer Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl zeno-glass-card border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden font-mono text-slate-100 flex flex-col"
            >
              {/* Header Bar */}
              <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-sm text-white">ZENO Voice Intelligence Dispatcher</h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        5-AGENT ENCLAVE
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Real-time Web Speech STT • TTS Synthesis • Multi-Bar Waveform</p>
                  </div>
                </div>

                <button onClick={closeModal} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Body */}
              <div className="p-6 space-y-6">
                {/* Active Agent Badge Indicator */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850 text-xs">
                  <span className="text-slate-400 font-bold">Active Voice Agent:</span>
                  <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>[{selectedAgentBadge}]</span>
                  </span>
                </div>

                {/* ANIMATED AUDIO WAVEFORM VISUALIZER WIDGET */}
                <div className="p-6 rounded-3xl bg-[#030712] border border-slate-800 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 flex items-center space-x-2">
                    {isListening && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
                    {isProcessing && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                    {isSpeaking && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                    <span>
                      STATUS:{' '}
                      {isListening
                        ? '🔴 LISTENING (MICROPHONE ACTIVE)'
                        : isProcessing
                        ? '🟡 PROCESSING / ROUTING ENCLAVE'
                        : isSpeaking
                        ? '🟢 SPEAKING (SYNTHESIS ACTIVE)'
                        : 'IDLE / READY'}
                    </span>
                  </div>

                  {/* Multi-Bar Animated Waveform */}
                  <div className="flex items-center justify-center space-x-2 h-16 w-full">
                    {Array.from({ length: 16 }).map((_, idx) => {
                      let barHeight = 'h-3';
                      let barColor = 'bg-slate-800';

                      if (isListening) {
                        barColor = 'bg-rose-500';
                        const hList = ['h-6', 'h-10', 'h-14', 'h-8', 'h-12', 'h-16', 'h-5'];
                        barHeight = `${hList[idx % hList.length]} animate-pulse`;
                      } else if (isProcessing) {
                        barColor = 'bg-amber-400';
                        const hList = ['h-4', 'h-8', 'h-12', 'h-6', 'h-10', 'h-5'];
                        barHeight = `${hList[idx % hList.length]} animate-bounce`;
                      } else if (isSpeaking) {
                        barColor = 'bg-emerald-400';
                        const hList = ['h-8', 'h-14', 'h-16', 'h-10', 'h-12', 'h-6'];
                        barHeight = `${hList[idx % hList.length]} animate-pulse`;
                      }

                      return (
                        <div
                          key={idx}
                          className={`w-1.5 rounded-full transition-all duration-200 ${barColor} ${barHeight}`}
                        />
                      );
                    })}
                  </div>

                  {/* Large Center Mic Button */}
                  <button
                    onClick={toggleListening}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] scale-110'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                    }`}
                  >
                    {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                  </button>
                  <div className="text-[10px] text-slate-500 font-bold">
                    {isListening ? 'Click to Stop & Dispatch' : 'Click to Speak'}
                  </div>
                </div>

                {/* Real-time Captured Transcript Display */}
                {transcript && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Captured Speech Input:</div>
                    <div className="text-white font-bold italic">"{transcript}"</div>
                  </div>
                )}

                {/* Spoken Response & UI Payload Preview */}
                {lastResponse && (
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between text-purple-300 font-bold">
                      <span className="flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>Speech Synthesis Response:</span>
                      </span>
                      <button
                        onClick={() => speakText(lastResponse.speechText)}
                        className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border border-purple-500/40"
                      >
                        Replay Audio 🔊
                      </button>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-bold">{lastResponse.speechText}</p>

                    {lastResponse.uiPayload && (
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 space-y-0.5">
                        <div className="font-bold text-slate-300">Synchronized UI Data Payload:</div>
                        <div>{JSON.stringify(lastResponse.uiPayload)}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Preset Voice Command Chips */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400">Try Preset Voice Commands:</div>
                  <div className="flex flex-wrap gap-2">
                    {samplePrompts.map((sp, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setTranscript(sp.prompt);
                          handleProcessVoiceInput(sp.prompt);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-purple-500/20 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 hover:text-purple-300 transition-all font-mono"
                      >
                        {sp.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
