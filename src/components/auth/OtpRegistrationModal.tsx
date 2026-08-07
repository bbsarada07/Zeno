import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INSTITUTIONAL_TENANTS } from '../../data/mockData';
import type { UserRole, InstitutionalTenant } from '../../types';

interface OtpRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OtpRegistrationModal: React.FC<OtpRegistrationModalProps> = ({ isOpen, onClose }) => {
  const { loginWithOtp } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTenant, setSelectedTenantState] = useState<InstitutionalTenant>(INSTITUTIONAL_TENANTS[0]);
  const [selectedRole, setSelectedRoleState] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('+91 98765 43210');
  
  // 6-digit OTP inputs
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 30-second countdown timer
  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && countdown > 0) {
      setIsResendDisabled(true);
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep(2);
    setCountdown(30);
    // Auto-fill mock OTP 500031
    setOtp(['5', '0', '0', '0', '3', '1']);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next cell
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setCountdown(30);
    setIsResendDisabled(true);
    setOtp(['5', '0', '0', '0', '3', '1']);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    loginWithOtp(selectedTenant.code, selectedRole, mobile, enteredOtp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 font-sans select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#090D14] border border-slate-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100 relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900/80 to-[#090D14] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-wide text-white flex items-center gap-2">
                <span>Cryptographic OTP Registration</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  STEP {step} OF 2
                </span>
              </h3>
              <p className="text-xs text-slate-400">Register new institutional governance node</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Slider Container */}
        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1-credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendToken}
                className="space-y-5"
              >
                {/* Institutional Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
                    Institutional Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. new.node@vce.ac.in"
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.25)] font-mono transition-all"
                  />
                </div>

                {/* Tenant College Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span>Select Institutional Tenant</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{selectedTenant.code}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {INSTITUTIONAL_TENANTS.map((tenant) => {
                      const isSel = selectedTenant.id === tenant.id;
                      return (
                        <div
                          key={tenant.id}
                          onClick={() => setSelectedTenantState(tenant)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isSel
                              ? 'bg-slate-900 border-cyan-500 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold truncate">{tenant.name}</div>
                          <div className="text-[10px] font-mono text-slate-500">{tenant.code}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
                    Select Domain Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['student', 'faculty', 'hod'] as UserRole[]).map((r) => {
                      const isSel = selectedRole === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setSelectedRoleState(r)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                            isSel
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 font-bold text-xs uppercase tracking-wider bg-cyan-400 text-slate-950 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:scale-[1.01]"
                >
                  <span>Send Verification Token</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step2-otp-challenge"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <div className="text-sm font-semibold text-slate-200">
                    Verification token dispatched to:
                  </div>
                  <div className="text-xs font-mono text-cyan-400 font-bold">{email}</div>
                  <div className="text-[11px] text-slate-500">
                    Enter the 6-digit cryptographic OTP challenge below.
                  </div>
                </div>

                {/* 6-Digit Cells */}
                <div className="flex items-center justify-center gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-13 text-center text-xl font-mono font-extrabold bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 outline-none focus:border-emerald-400 focus:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                    />
                  ))}
                </div>

                {/* Countdown Timer & Resend Button */}
                <div className="flex items-center justify-between text-xs font-mono px-2">
                  <div className="text-slate-400 flex items-center space-x-1">
                    <span>Resend token in:</span>
                    <span className="text-amber-400 font-bold">{countdown}s</span>
                  </div>

                  <button
                    type="button"
                    disabled={isResendDisabled}
                    onClick={handleResendOtp}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Code</span>
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 font-semibold text-xs text-slate-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3.5 px-6 font-bold text-xs uppercase tracking-wider bg-emerald-500 text-slate-950 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-[1.01]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>VERIFY & ESTABLISH SESSION</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
