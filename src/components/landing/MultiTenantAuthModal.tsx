import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Search, Building2, UserCheck, Smartphone, KeyRound, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INSTITUTIONAL_TENANTS } from '../../data/mockData';
import type { UserRole } from '../../types';

export const MultiTenantAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, selectedTenant, setSelectedTenant, activeRole, setActiveRole, loginWithOtp } = useApp();

  const [stage, setStage] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(['5', '0', '0', '0', '3', '1']);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const filteredTenants = INSTITUTIONAL_TENANTS.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTenant = (tenant: typeof INSTITUTIONAL_TENANTS[0]) => {
    setSelectedTenant(tenant);
    setStage(2);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number registered with your college.');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join('');
    if (otp.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP code sent to your mobile number.');
      return;
    }

    loginWithOtp(selectedTenant.code, activeRole, `+91 ${mobileNumber}`, otp);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-foreground"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border bg-muted/20 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl">
                {selectedTenant.logo}
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span>ZENO Auth Gateway</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
                    {selectedTenant.code}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  {stage === 1 ? 'Stage 1: Select Institutional Tenant' : `Stage 2: ${selectedTenant.name}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-lg border border-border">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Vault Encrypted</span>
            </div>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center space-x-2 mt-4">
            <div className={`h-1 flex-1 rounded-full transition-all ${stage >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-1 flex-1 rounded-full transition-all ${stage >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {stage === 1 ? (
              <motion.div
                key="stage1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search college by name, code (e.g. VCE, CBIT), or location..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredTenants.map((tenant) => {
                    const isSelected = selectedTenant.id === tenant.id;
                    return (
                      <button
                        key={tenant.id}
                        onClick={() => handleSelectTenant(tenant)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-primary/10 border-primary text-foreground'
                            : 'bg-background/50 border-border hover:border-primary/40 hover:bg-muted/40'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{tenant.logo}</div>
                          <div>
                            <div className="font-semibold text-sm flex items-center space-x-2">
                              <span>{tenant.name}</span>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center space-x-2 mt-0.5">
                              <span className="font-mono">{tenant.code}</span>
                              <span>•</span>
                              <span>{tenant.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="stage2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Role Tabs */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Select Governance Role
                  </label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-muted/40 rounded-xl border border-border">
                    {(['student', 'faculty', 'hod'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => setActiveRole(r)}
                        className={`py-2 px-3 text-xs font-medium rounded-lg capitalize transition-all ${
                          activeRole === r
                            ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {r === 'student' ? 'Student' : r === 'faculty' ? 'Faculty' : 'HOD / Admin'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile & OTP Inputs */}
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                        Registered Mobile Number
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-xs font-mono text-muted-foreground">
                          <Smartphone className="w-4 h-4" />
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="9876543210"
                          className="w-full pl-16 pr-4 py-2.5 text-sm font-mono bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Enter the mobile number registered with {selectedTenant.code} administration.
                      </p>
                    </div>

                    {errorMsg && <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>}

                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStage(1)}
                        className="px-4 py-2.5 text-xs font-medium border border-border rounded-xl hover:bg-muted transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                      >
                        <span>Send 6-Digit OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Enter 6-Digit Verification OTP
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-xs text-primary hover:underline"
                        >
                          Change Number (+91 {mobileNumber})
                        </button>
                      </div>

                      <div className="grid grid-cols-6 gap-2">
                        {otpValues.map((val, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            type="text"
                            maxLength={1}
                            value={val}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            className="w-full py-3 text-center font-mono font-bold text-lg bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        ))}
                      </div>
                    </div>

                    {errorMsg && <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>}

                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="px-4 py-2.5 text-xs font-medium border border-border rounded-xl hover:bg-muted transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Enter Vault Session</span>
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
