import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, GraduationCap, FileCheck, ArrowRight, Building2, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { MultiTenantAuthModal } from './MultiTenantAuthModal';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setIsAuthModalOpen, selectedTenant } = useApp();

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Background Noise & Subtle Radial Glow */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="h-20 border-b border-border bg-card/40 backdrop-blur-xl px-6 sm:px-12 flex items-center justify-between z-20 relative">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold font-mono text-xl shadow-lg">
            Z
          </div>
          <div>
            <div className="font-bold tracking-tight text-lg flex items-center space-x-2">
              <span>ZENO</span>
              <span className="text-xs uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Autonomous Campus Platform
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Enterprise Multi-Tenant Smart Governance</p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg shadow-primary/10"
        >
          <Lock className="w-4 h-4" />
          <span>Enter Auth Gateway</span>
        </button>
      </header>

      {/* Hero Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 relative">
        {/* Left Side: Brand Highlights & Features */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Autonomous University Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Autonomous Smart Campus <span className="text-primary">Governance & GIS</span> Intelligence
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
            Zeno powers institutional governance with real-time Spatial Campus GIS indoor floor plan navigation, hierarchical Placement AI & Digital Twin career simulations, and human-in-the-loop attendance waiver automation.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <MapPin className="w-6 h-6 text-blue-400" />
              <div className="font-bold text-sm">Spatial GIS Navigation</div>
              <p className="text-xs text-muted-foreground">Turn-by-turn indoor route maps to classrooms & laboratories.</p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <GraduationCap className="w-6 h-6 text-emerald-400" />
              <div className="font-bold text-sm">Placement AI Workspace</div>
              <p className="text-xs text-muted-foreground">Digital Twin career simulations & automated ATS readiness scoring.</p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <FileCheck className="w-6 h-6 text-amber-400" />
              <div className="font-bold text-sm">Waiver Petition HITL</div>
              <p className="text-xs text-muted-foreground">Medical attendance condensation with cryptographic audit receipts.</p>
            </div>
          </div>

          {/* Institutional Trust Badges */}
          <div className="pt-6 border-t border-border flex items-center space-x-6 text-xs text-muted-foreground font-mono">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Vasavi College (VCE)</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>CBIT Hyderabad</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>IIT Hyderabad</span>
            </span>
          </div>
        </div>

        {/* Right Side: Split Pre-Login Card */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-card border border-border shadow-2xl space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest font-mono">
              Multi-Tenant Auth Gateway
            </div>
            <h3 className="text-2xl font-bold">Access Campus Vault</h3>
            <p className="text-xs text-muted-foreground">
              Select your institution and authenticate via mobile OTP to enter your secure session vault.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{selectedTenant.logo}</div>
              <div>
                <div className="font-bold text-sm">{selectedTenant.name}</div>
                <div className="text-xs text-muted-foreground font-mono">{selectedTenant.code}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-3.5 px-6 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary/10"
          >
            <span>Proceed to 2-Stage Auth</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Multi-Tenant 2-Tier Login Modal */}
      <MultiTenantAuthModal />
    </div>
  );
};
