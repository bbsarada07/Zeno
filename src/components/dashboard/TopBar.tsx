import React, { useState } from 'react';
import {
  Shield,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Bell,
  CheckCircle2,
  Lock,
  Building2,
  ToggleLeft,
  ToggleRight,
  Menu,
  X,
  LayoutDashboard,
  MapPin,
  GraduationCap,
  FileText,
  BookOpen,
  Mic,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INSTITUTIONAL_TENANTS } from '../../data/mockData';
import { KernelStatus } from './KernelStatus';
import { VoiceAssistant } from '../VoiceAssistant';
import { VoiceAgentModal } from '../VoiceAgentModal';
import type { UserRole, NavigationTab } from '../../types';

export const TopBar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    isDemoMode,
    toggleDemoMode,
    selectedTenant,
    setSelectedTenant,
    activeRole,
    setActiveRole,
    logoutSession,
    activeTab,
    setActiveTab,
    unreadCount,
    setIsNotificationDrawerOpen,
    sendMessage,
  } = useApp();

  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const rolesList: { role: UserRole; label: string; badge: string }[] = [
    { role: 'student', label: 'Student Governance Node', badge: 'CSM-SEC-A' },
    { role: 'faculty', label: 'Faculty Course Advisor', badge: 'DEPT-CSE' },
    { role: 'hod', label: 'HOD Executive Admin', badge: 'DEPT-HEAD' },
  ];

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'communication', label: 'Communication Agent', icon: <MessageSquare className="w-4 h-4 text-orange-400" /> },
    { id: 'study', label: 'Academic Study Enclave', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'gis', label: 'Campus GIS Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'placement', label: 'Placement AI', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'waivers', label: 'Waiver Petitions', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090D14]/90 dark:bg-[#090D14]/90 html-light:bg-white/90 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between relative z-30 select-none text-slate-100 dark:text-slate-100 html-light:text-slate-900 transition-colors duration-300">
      {/* Left: Platform Logo & Multi-Tenant Selector */}
      <div className="flex items-center space-x-3 sm:space-x-6">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-wider uppercase flex items-center space-x-1.5 text-slate-900 dark:text-white">
              <span>ZENO</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
                v2.4
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
              Autonomous Smart Campus Governance
            </div>
          </div>
        </div>

        {/* Live Render Kernel Connection Detector */}
        <div className="hidden lg:block">
          <KernelStatus />
        </div>

        {/* Locked Tenant Selector Dropdown (Requires Demo Mode to edit) */}
        <div className="relative hidden sm:block">
          <button
            disabled={!isDemoMode}
            onClick={() => isDemoMode && setIsTenantDropdownOpen(!isTenantDropdownOpen)}
            title={!isDemoMode ? 'Session Locked: Enable Demo Mode to switch college' : 'Switch Institutional Tenant'}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-2 text-xs sm:text-sm font-semibold ${
              !isDemoMode
                ? 'bg-slate-950/40 opacity-75 border-slate-800 cursor-not-allowed text-slate-400'
                : 'bg-slate-950/80 hover:border-cyan-500/50 text-white cursor-pointer'
            }`}
          >
            {!isDemoMode ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Building2 className="w-4 h-4 text-amber-400" />}
            <span className="truncate max-w-[120px] sm:max-w-[160px] font-bold">{selectedTenant.name}</span>
            {isDemoMode && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {isDemoMode && isTenantDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-[#090D14] dark:bg-[#090D14] html-light:bg-white border border-slate-800 dark:border-slate-800 html-light:border-slate-200 rounded-2xl p-2 shadow-2xl z-50">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider p-2">Select College Tenant</div>
              {INSTITUTIONAL_TENANTS.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTenant(t);
                    setIsTenantDropdownOpen(false);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                    selectedTenant.id === t.id
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'hover:bg-slate-900/60 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div>
                    <div>{t.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{t.code}</div>
                  </div>
                  {selectedTenant.id === t.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle Navigation Tabs (Desktop / Laptop >= 768px) */}
      <nav className="hidden md:flex items-center space-x-1.5 bg-slate-950/60 dark:bg-slate-950/60 html-light:bg-slate-100/90 border border-slate-800/80 dark:border-slate-800/80 html-light:border-slate-300 p-1 rounded-2xl">
        {navItems.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 dark:text-slate-400 html-light:text-slate-600 hover:text-slate-100 dark:hover:text-white html-light:hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Demo Mode Toggle, Role Pill, Theme Toggle, Notification & Logout */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Demo Mode Toggle Switch */}
        <button
          onClick={toggleDemoMode}
          title={isDemoMode ? 'Demo Mode Active: Dropdowns Unlocked' : 'Demo Mode Disabled: Role/Tenant Session Locked'}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
            isDemoMode
              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          {isDemoMode ? <ToggleRight className="w-4 h-4 text-cyan-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
          <span className="hidden sm:inline">DEMO MODE</span>
        </button>

        {/* Locked Role Switcher Pill */}
        <div className="relative">
          <button
            disabled={!isDemoMode}
            onClick={() => isDemoMode && setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            title={!isDemoMode ? 'Session Locked: Enable Demo Mode to switch role' : 'Switch Active Role'}
            className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 text-xs sm:text-sm font-bold ${
              !isDemoMode
                ? 'bg-slate-950/40 opacity-75 border-slate-800 cursor-not-allowed text-slate-400'
                : 'bg-slate-900/80 hover:border-amber-500/50 text-white cursor-pointer'
            }`}
          >
            {!isDemoMode ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
            <span className="uppercase text-amber-400 font-mono font-extrabold">{activeRole}</span>
            {isDemoMode && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {isDemoMode && isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-[#090D14] dark:bg-[#090D14] html-light:bg-white border border-slate-800 dark:border-slate-800 html-light:border-slate-200 rounded-2xl p-2 shadow-2xl z-50">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider p-2">Switch Active Role</div>
              {rolesList.map((r) => (
                <div
                  key={r.role}
                  onClick={() => {
                    setActiveRole(r.role);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                    activeRole === r.role
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'hover:bg-slate-900/60 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div>
                    <div>{r.label}</div>
                    <div className="text-xs text-slate-500 font-mono">{r.badge}</div>
                  </div>
                  {activeRole === r.role && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Voice Assistant Mic Button */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          title="Open Voice Intelligence Dispatcher"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:border-purple-500/60 transition-all flex items-center justify-center relative shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        >
          <Mic className="w-4 h-4 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-400 rounded-full animate-ping" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 html-light:bg-slate-200 border border-slate-800 dark:border-slate-800 html-light:border-slate-300 hover:border-cyan-500/50 transition-all flex items-center justify-center text-slate-200 dark:text-slate-200 html-light:text-slate-800"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 html-light:bg-slate-200 border border-slate-800 dark:border-slate-800 html-light:border-slate-300 hover:border-cyan-500/50 transition-all flex items-center justify-center text-slate-300 dark:text-slate-300 html-light:text-slate-800"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={logoutSession}
          title="Safe Logout Session"
          className="px-2.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>

        {/* Voice Assistant Modal */}
        <VoiceAgentModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onDispatch={(res) => sendMessage(res.spokenText)}
        />
      </div>

      {/* Mobile Animated Slide-Out Hamburger Navigation Menu (< 768px) */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#090D14]/95 border-b border-slate-800 p-4 space-y-2 md:hidden shadow-2xl z-50 font-sans">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Campus Navigation</div>
          {navItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full p-3 rounded-xl text-sm font-bold flex items-center space-x-3 transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-extrabold'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
