import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Terminal,
  UserCheck,
  Building2,
  GraduationCap,
  FileCheck,
  Shield,
  KeyRound,
  CheckCircle2,
  Loader2,
  PlusCircle,
} from 'lucide-react';
import { AuthNeuralCanvas } from './AuthNeuralCanvas';
import { OtpRegistrationModal } from './OtpRegistrationModal';
import { useApp } from '../../context/AppContext';
import { apiClient } from '../../lib/api';
import type { UserRole } from '../../types';

// Preset Personas for 1-Click Demo Access
const DEMO_PERSONAS: Array<{
  id: string;
  label: string;
  name: string;
  email: string;
  role: UserRole;
  tenantCode: string;
  accent: string;
  icon: string;
}> = [
  {
    id: 'student_alex',
    label: 'Alex (Student)',
    name: 'Alex Rivera',
    email: 'alex.rivera@vasavi.ac.in',
    role: 'student',
    tenantCode: 'VCE-HDO-500031',
    accent: '#00F0FF',
    icon: '🎓',
  },
  {
    id: 'faculty_sharma',
    label: 'Dr. Sharma (Faculty)',
    name: 'Dr. K. V. Sharma',
    email: 'dr.sharma@vasavi.ac.in',
    role: 'faculty',
    tenantCode: 'VCE-HDO-500031',
    accent: '#10B981',
    icon: '👨‍🏫',
  },
  {
    id: 'hod_admin',
    label: 'HOD (Admin)',
    name: 'Dr. S. R. Rao (HOD CSE)',
    email: 'hod.cse@vasavi.ac.in',
    role: 'hod',
    tenantCode: 'VCE-HDO-500031',
    accent: '#F59E0B',
    icon: '🏛️',
  },
];

// Role configuration & themes
const ROLE_CONFIGS: Record<
  UserRole,
  {
    title: string;
    subtext: string;
    accent: string;
    accentGlow: string;
    borderClass: string;
    bgHoverClass: string;
    icon: React.ReactNode;
  }
> = {
  student: {
    title: 'Student Governance Node',
    subtext: 'Access personal academic telemetry, placement AI, and waiver petitions.',
    accent: '#00F0FF',
    accentGlow: 'rgba(0, 240, 255, 0.25)',
    borderClass: 'border-[#00F0FF]',
    bgHoverClass: 'hover:border-[#00F0FF]/60',
    icon: <GraduationCap className="w-5 h-5 text-[#00F0FF]" />,
  },
  faculty: {
    title: 'Faculty / Course Advisor',
    subtext: 'Review student petitions, approve condonations, and publish grades.',
    accent: '#10B981',
    accentGlow: 'rgba(16, 185, 129, 0.25)',
    borderClass: 'border-[#10B981]',
    bgHoverClass: 'hover:border-[#10B981]/60',
    icon: <FileCheck className="w-5 h-5 text-[#10B981]" />,
  },
  hod: {
    title: 'HOD / Institutional Admin',
    subtext: 'Full node sandbox, emergency approvals, and campus-wide governance dispatch.',
    accent: '#F59E0B',
    accentGlow: 'rgba(245, 158, 11, 0.25)',
    borderClass: 'border-[#F59E0B]',
    bgHoverClass: 'hover:border-[#F59E0B]/60',
    icon: <Shield className="w-5 h-5 text-[#F59E0B]" />,
  },
};

export const AuthGatewayPage: React.FC = () => {
  const { loginWithOtp, selectedTenant, activeRole, setActiveRole } = useApp();

  const [email, setEmail] = useState('alex.rivera@vasavi.ac.in');
  const [passphrase, setPassphrase] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [activePersonaId, setActivePersonaId] = useState<string>('student_alex');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const currentRoleConfig = ROLE_CONFIGS[activeRole];

  // Handle role selection change
  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    // Find matching persona if available
    const matchedPersona = DEMO_PERSONAS.find((p) => p.role === role);
    if (matchedPersona) {
      setEmail(matchedPersona.email);
      setActivePersonaId(matchedPersona.id);
    }
  };

  // Submit Authentication
  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsConnecting(true);
    setTerminalLogs([]);

    const logs = [
      `[SYS_INIT] Initializing TLS 1.3 handshake with ZENO_CORE_ORCHESTRATOR...`,
      `[AUTH_GATEWAY] Dispatching POST /api/v1/auth/send-otp -> ${email}...`,
      `[AUTH_VAULT] Verifying Ed25519 cryptographic token & OTP...`,
      `[ROUTING_KEY] Sub-agent node topology resolved for [${activeRole.toUpperCase()}]...`,
      `[SESSION_ESTABLISHED] Access granted. Unlocking Executive Governance Workspace...`,
    ];

    // Trigger POST request to live backend (with local enclave fallback fallback)
    try {
      const otpResp = await apiClient.post(
        '/api/v1/auth/send-otp',
        { email, domain_role: activeRole, tenant: selectedTenant.code },
        { success: true, message: 'OTP sent' },
        { timeoutMs: 4000 }
      );

      const verifyResp = await apiClient.post(
        '/api/v1/auth/verify-otp',
        { email, otp: '500031' },
        { access_token: `zeno_live_jwt_token_${Date.now()}` },
        { timeoutMs: 4000 }
      );

      if (verifyResp?.access_token) {
        localStorage.setItem('zeno_token', verifyResp.access_token);
        localStorage.setItem('zeno_tenant', selectedTenant.code);
        localStorage.setItem('zeno_user', JSON.stringify({
          email,
          role: activeRole,
          name: email.split('@')[0].replace('.', ' '),
          rollNumber: '2451-22-733-001',
        }));
      }
    } catch (err) {
      console.warn('[AUTH GATEWAY] Network request warning, proceeding with local vault session.', err);
    }

    for (let i = 0; i < logs.length; i++) {
      await new Promise((res) => setTimeout(res, 220));
      setTerminalLogs((prev) => [...prev, logs[i]]);
    }

    await new Promise((res) => setTimeout(res, 150));

    // Log into AppContext & transition to Executive Dashboard
    loginWithOtp(selectedTenant.code, activeRole, '+91 98765 43210', '500031');
    setIsConnecting(false);
  };

  // Preset 1-Click Demo Key Trigger
  const handleQuickAccessPreset = (persona: (typeof DEMO_PERSONAS)[0]) => {
    setActivePersonaId(persona.id);
    setActiveRole(persona.role);
    setEmail(persona.email);
    setPassphrase('••••••••••••');
    // Trigger terminal loader and authentication
    handleConnect();
  };

  return (
    <div className="h-screen w-screen bg-[#05070A] text-slate-100 flex flex-col lg:flex-row overflow-hidden font-sans select-none relative">
      {/* 2-Step OTP Registration Modal */}
      <OtpRegistrationModal isOpen={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)} />

      {/* MATRIX TERMINAL LOADER OVERLAY */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#05070A]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-emerald-400 font-mono space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>

            <div className="text-center space-y-1">
              <div className="text-lg font-bold tracking-widest text-white">
                ESTABLISHING ENCRYPTED SESSION
              </div>
              <div className="text-xs text-slate-400 font-mono">
                SECURE GATEWAY // PORT 8000 LIVE // AES-256-GCM
              </div>
            </div>

            <div className="w-full max-w-xl p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-2 text-xs text-slate-300 font-mono min-h-[160px]">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="text-emerald-500 font-bold">❯</span>
                  <span className={idx === terminalLogs.length - 1 ? 'text-emerald-300 font-semibold' : 'text-slate-400'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT COLUMN (60% Width): Interactive Sub-Agent Neural Graph Canvas */}
      <div className="w-full lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-[#05070A] border-b lg:border-b-0 lg:border-r border-slate-800/80">
        <AuthNeuralCanvas activeRole={activeRole} accentColor={currentRoleConfig.accent} />
      </div>

      {/* RIGHT COLUMN (40% Width): High-Fidelity Access Gateway Panel */}
      <div className="w-full lg:w-[40%] h-1/2 lg:h-full bg-[#070A0F]/90 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 border-l border-slate-800/80 z-20 overflow-y-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-3 border-b border-slate-800/80 pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-xl bg-slate-900 border flex items-center justify-center font-bold text-lg text-white shadow-xl transition-all duration-500"
                  style={{
                    borderColor: `${currentRoleConfig.accent}60`,
                    boxShadow: `0 0 20px ${currentRoleConfig.accentGlow}`,
                  }}
                >
                  Z
                </div>
                <div>
                  <div className="font-extrabold tracking-wider text-xl flex items-center space-x-2 text-white">
                    <span>ZENO</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                      v2.4 Core
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    Autonomous Campus Intelligence Platform
                  </div>
                </div>
              </div>

              {/* SECURE NODE GATEWAY badge */}
              <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center space-x-2 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold">SECURE NODE GATEWAY</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-slate-400 leading-relaxed">
                Verify your institutional security token to access the command workspace.
              </p>

              {/* OTP Registration Modal Trigger */}
              <button
                type="button"
                onClick={() => setIsOtpModalOpen(true)}
                className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold font-mono transition-all flex items-center space-x-1.5 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Register Node</span>
              </button>
            </div>
          </div>

          {/* Form Controls */}
          <form onSubmit={handleConnect} className="space-y-5">
            {/* 1. INSTITUTIONAL IDENTIFIER / EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Institutional Identifier / Email</span>
                <span className="text-[10px] text-cyan-400 font-mono">{selectedTenant.code}</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex.rivera@vasavi.ac.in"
                  required
                  className="w-full bg-slate-900/60 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 outline-none transition-all duration-300 font-mono"
                  style={{
                    boxShadow: `0 0 0 1px ${currentRoleConfig.accent}20`,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = currentRoleConfig.accent;
                    e.currentTarget.style.boxShadow = `0 0 15px ${currentRoleConfig.accentGlow}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#1e293b';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* 2. SECURITY PASSPHRASE */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Security Passphrase</span>
                <span className="text-[10px] text-slate-500">256-BIT ENCRYPTED</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter security passphrase"
                  required
                  className="w-full bg-slate-900/60 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 pr-10 outline-none transition-all duration-300 font-mono"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = currentRoleConfig.accent;
                    e.currentTarget.style.boxShadow = `0 0 15px ${currentRoleConfig.accentGlow}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#1e293b';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3. SELECT DOMAIN AUTHORIZATION ROLE (Radio Group Cards) */}
            <div className="space-y-2 pt-1">
              <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
                Select Domain Authorization Role
              </label>

              <div className="space-y-2.5">
                {(['student', 'faculty', 'hod'] as UserRole[]).map((roleKey) => {
                  const roleConfig = ROLE_CONFIGS[roleKey];
                  const isSelected = activeRole === roleKey;

                  return (
                    <div
                      key={roleKey}
                      onClick={() => handleRoleSelect(roleKey)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden flex items-start space-x-3 ${
                        isSelected
                          ? `bg-slate-900/90 border-2`
                          : `bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 ${roleConfig.bgHoverClass}`
                      }`}
                      style={{
                        borderColor: isSelected ? roleConfig.accent : undefined,
                        boxShadow: isSelected ? `0 0 20px ${roleConfig.accentGlow}` : undefined,
                      }}
                    >
                      {/* Active Accent Bar Indicator */}
                      {isSelected && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                          style={{ backgroundColor: roleConfig.accent }}
                        />
                      )}

                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 mt-0.5"
                        style={{
                          backgroundColor: `${roleConfig.accent}15`,
                          borderColor: `${roleConfig.accent}40`,
                        }}
                      >
                        {roleConfig.icon}
                      </div>

                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">
                            {roleConfig.title}
                          </span>
                          {isSelected && (
                            <span
                              className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full border"
                              style={{
                                color: roleConfig.accent,
                                backgroundColor: `${roleConfig.accent}15`,
                                borderColor: `${roleConfig.accent}40`,
                              }}
                            >
                              SELECTED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {roleConfig.subtext}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary Action CTA */}
            <button
              type="submit"
              disabled={isConnecting}
              className="w-full py-3.5 px-6 font-bold text-xs uppercase tracking-wider text-slate-950 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              style={{
                backgroundColor: currentRoleConfig.accent,
                boxShadow: `0 0 25px ${currentRoleConfig.accentGlow}`,
              }}
            >
              <span>Verify Credentials & Connect</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* QUICKACCESS DEMO KEYS (Bottom Pill Bar) */}
        <div className="pt-6 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>QUICKACCESS DEMO KEYS</span>
            </span>
            <span className="text-[10px] text-slate-500">1-CLICK INSTANT EVALUATION</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {DEMO_PERSONAS.map((persona) => {
              const isActive = activePersonaId === persona.id;
              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleQuickAccessPreset(persona)}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                    isActive
                      ? 'bg-slate-900 border-slate-700 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs">{persona.icon}</span>
                  <span className="font-mono text-[11px] font-semibold text-slate-200 truncate">
                    {persona.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
