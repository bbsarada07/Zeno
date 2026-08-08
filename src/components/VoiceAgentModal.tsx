import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Radio, Sparkles, Volume2, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { processVoiceDispatch } from '../services/voiceDispatcherService';
import type { VoiceDispatchResponse } from '../services/voiceDispatcherService';

interface VoiceAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatch?: (response: VoiceDispatchResponse) => void;
}

export const VoiceAgentModal: React.FC<VoiceAgentModalProps> = ({ isOpen, onClose, onDispatch }) => {
  const { sendMessage } = useApp();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const [transcript, setTranscript] = useState<string>('');
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [activeAgentBadge, setActiveAgentBadge] = useState<string>('Communication Agent');

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Safe Cleanup Function: Terminate mic streams & Web Audio API context
  const cleanupAudioStreams = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_e) {}
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (_e) {}
      });
      mediaStreamRef.current = null;
    }

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close();
      } catch (_e) {}
      audioCtxRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_e) {}
    }

    setIsListening(false);
    setIsProcessing(false);
    setIsSpeaking(false);
  };

  // Escape key listener for immediate modal exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleFullExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle Speech Synthesis (TTS)
  const speakSynthesisText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
    );
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

  // Trigger Immediate Dispatch & Central Orchestrator Routing
  const executeDispatch = async (finalText: string) => {
    const textToProcess = finalText || transcript;
    if (!textToProcess || textToProcess.trim().length < 2) return;

    // 1. Immediately close modal overlay
    cleanupAudioStreams();
    onClose();

    // 2. Route transcript through Central Orchestrator into Main Chat Surface
    try {
      const res = await sendMessage(textToProcess.trim(), 'voice');
      if (res && onDispatch) {
        onDispatch({
          agentName: res.agentBadgeLabel,
          spokenText: res.speechText,
          markdownPayload: res.markdown,
        });
      }
    } catch (_err) {
      console.warn('[VOICE MODAL DISPATCH ERROR]', _err);
    }
  };

  // Start Mic & Audio Context
  const startMicSession = async () => {
    cleanupAudioStreams();
    setTranscript('');
    setIsListening(true);
    setIsProcessing(false);

    try {
      // Microphones Web Audio Analyser
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioCtxRef.current = audioCtx;

          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
            }
            animFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      }
    } catch (e) {
      console.warn('[VOICE MIC WARNING] AudioContext initialization deferred:', e);
    }

    // Web Speech API Integration
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let textStr = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          textStr += event.results[i][0].transcript;
        }
        setTranscript(textStr);

        // Reset 1.5s Auto-Silence Detection Timer
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          setIsListening(false);
          setIsProcessing(true);
          executeDispatch(textStr);
        }, 1500);
      };

      recognition.onerror = (err: any) => {
        console.warn('[SPEECH RECOGNITION ERROR]', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (_e) {}
    } else {
      // Fallback Simulation for environment without SpeechRecognition
      setTimeout(() => {
        setTranscript('Check my current academic attendance');
        setTimeout(() => {
          executeDispatch('Check my current academic attendance');
        }, 1200);
      }, 800);
    }
  };

  // Explicit Exit Handler
  const handleFullExit = () => {
    cleanupAudioStreams();
    onClose();
  };

  // Mount / Unmount lifecycle
  useEffect(() => {
    if (isOpen) {
      startMicSession();
    } else {
      cleanupAudioStreams();
    }
    return () => {
      cleanupAudioStreams();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sampleVoicePrompts = [
    { label: 'Check attendance & grades', prompt: 'Check my current academic attendance and marks' },
    { label: 'Latest placement drives', prompt: 'Are there any new internship placement drives?' },
    { label: 'Main cafeteria opening hours', prompt: 'Is the main campus cafeteria open today?' },
    { label: 'Campus Hackathon registration', prompt: 'When is the annual campus hackathon event?' },
  ];

  return (
    <AnimatePresence>
      <div
        onClick={handleFullExit}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 font-mono select-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()} // Prevent backdrop close when clicking modal content
          className="w-full max-w-lg zeno-glass-card border border-purple-500/40 rounded-3xl shadow-[0_0_80px_rgba(168,85,247,0.3)] overflow-hidden text-slate-100 flex flex-col"
        >
          {/* Top Bar Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 flex-shrink-0">
                <Radio className="w-5 h-5 animate-pulse flex-shrink-0" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-base text-white">Campus Voice Intelligence Dispatcher</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex-shrink-0">
                    5-AGENT ENCLAVE
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-0.5 font-medium">Auto-close on silence • MediaStream track teardown • TTS protocol</p>
              </div>
            </div>

            {/* Explicit Close X Button */}
            <button
              onClick={handleFullExit}
              className="p-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 transition-all flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              title="Close Voice Assistant (Esc)"
            >
              <X className="w-6 h-6 flex-shrink-0" />
            </button>
          </div>

          {/* Main Voice Visualizer & Controls */}
          <div className="p-6 space-y-6">
            {/* Active Voice Agent Badge */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-850 text-xs">
              <span className="text-slate-400 font-bold">Target Voice Enclave:</span>
              <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>[{activeAgentBadge}]</span>
              </span>
            </div>

            {/* DYNAMIC 4-STATE AUDIO WAVEFORM VISUALIZER */}
            <div className="p-6 rounded-3xl bg-[#030712] border border-slate-800 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
              <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 flex items-center space-x-2">
                {isListening && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
                {isProcessing && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                {isSpeaking && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                <span>
                  STATE:{' '}
                  {isListening
                    ? '🔴 LISTENING (MICROPHONE ACTIVE)'
                    : isProcessing
                    ? '🟡 PROCESSING / DISPATCHING AGENT'
                    : isSpeaking
                    ? '🟢 SPEAKING (SYNTHESIS ACTIVE)'
                    : '⚪ READY'}
                </span>
              </div>

              {/* Multi-Bar Animated Waveform */}
              <div className="flex items-center justify-center space-x-2 h-16 w-full">
                {Array.from({ length: 16 }).map((_, idx) => {
                  let barHeight = 'h-3';
                  let barColor = 'bg-slate-800';

                  if (isListening) {
                    barColor = 'bg-rose-500';
                    const dynamicH = Math.max(12, Math.min(64, volumeLevel + (idx % 5) * 8));
                    barHeight = `h-[${dynamicH}px] animate-pulse`;
                  } else if (isProcessing) {
                    barColor = 'bg-amber-400';
                    barHeight = 'h-8 animate-bounce';
                  } else if (isSpeaking) {
                    barColor = 'bg-emerald-400';
                    barHeight = 'h-10 animate-pulse';
                  }

                  return (
                    <div
                      key={idx}
                      className={`w-1.5 rounded-full transition-all duration-150 ${barColor} ${barHeight}`}
                    />
                  );
                })}
              </div>

              {/* Large Center Mic Dispatch Button */}
              <button
                onClick={() => executeDispatch(transcript)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] scale-105'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                }`}
              >
                {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>
              <div className="text-[10px] text-slate-500 font-bold">
                {isListening ? 'Click to Stop & Dispatch Immediately' : 'Click to Speak'}
              </div>
            </div>

            {/* Captured Speech Input Text */}
            {transcript && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Captured Speech Input:</div>
                <div className="text-white font-bold italic">"{transcript}"</div>
              </div>
            )}

            {/* Quick Sample Voice Prompts */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400">Quick Voice Prompts:</div>
              <div className="flex flex-wrap gap-2">
                {sampleVoicePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTranscript(sp.prompt);
                      executeDispatch(sp.prompt);
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
    </AnimatePresence>
  );
};
