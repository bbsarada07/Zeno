import React, { useState } from 'react';
import {
  Shield,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Bell,
  CheckCircle2,
  Sparkles,
  Command,
  UserCheck,
  GraduationCap,
  Building2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INSTITUTIONAL_TENANTS } from '../../data/mockData';
import { KernelStatus } from './KernelStatus';
import type { UserRole, NavigationTab } from '../../types';

export const TopBar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    selectedTenant,
    setSelectedTenant,
    activeRole,
    setActiveRole,
    logoutSession,
    activeTab,
    setActiveTab,
    unreadCount,
    setIsNotificationDrawerOpen,
    student,
  } = useApp();

  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const rolesList: { role: UserRole; label: string; badge: string }[] = [
    { role: 'student', label: 'Student Governance Node', badge: 'CSM-SEC-A' },
    { role: 'faculty', label: 'Faculty Course Advisor', badge: 'DEPT-CSE' },
    { role: 'hod', label: 'HOD Executive Admin', badge: 'DEPT-HEAD' },
  ];

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090D14]/80 dark:bg-[#090D14]/80 html-light:bg-white/90 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between relative z-30 select-none text-slate-100 dark:text-slate-100 html-light:text-slate-900 transition-colors duration-300">
      {/* Left: Platform Logo & Multi-Tenant Selector */}
      <div className="flex items-center space-x-4 sm:space-x-6">
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
            <div className="text-xs font-mono text-slate-400 hidden sm:block">
              Autonomous Smart Campus Governance
            </div>
          </div>
        </div>

        {/* Live Render Kernel Connection Detector */}
        <div className="hidden md:block">
          <KernelStatus />
        </div>

        {/* Tenant Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
            className="px-3 py-1.5 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 html-light:bg-slate-100 border border-slate-800 dark:border-slate-800 html-light:border-slate-300 hover:border-cyan-500/50 transition-all flex items-center space-x-2 text-xs sm:text-sm font-semibold"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span className="truncate max-w-[120px] sm:max-w-[180px] font-bold text-slate-900 dark:text-white">{selectedTenant.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isTenantDropdownOpen && (
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

      {/* Middle Navigation Tabs */}
      <nav className="hidden md:flex items-center space-x-1.5 bg-slate-950/60 dark:bg-slate-950/60 html-light:bg-slate-100/90 border border-slate-800/80 dark:border-slate-800/80 html-light:border-slate-300 p-1 rounded-2xl">
        {(
          [
            { id: 'dashboard', label: 'Executive Dashboard' },
            { id: 'gis', label: 'Campus GIS Map' },
            { id: 'placement', label: 'Placement AI' },
            { id: 'waivers', label: 'Waiver Petitions' },
          ] as { id: NavigationTab; label: string }[]
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 dark:text-slate-400 html-light:text-slate-600 hover:text-slate-100 dark:hover:text-white html-light:hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Role Pill, Theme Toggle, Notification & Logout */}
      <div className="flex items-center space-x-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 html-light:bg-slate-200 border border-slate-800 dark:border-slate-800 html-light:border-slate-300 hover:border-amber-500/50 transition-all flex items-center space-x-2 text-xs sm:text-sm font-bold"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="uppercase text-amber-400 font-mono font-extrabold">{activeRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
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

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="w-10 h-10 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 html-light:bg-slate-200 border border-slate-800 dark:border-slate-800 html-light:border-slate-300 hover:border-cyan-500/50 transition-all flex items-center justify-center text-slate-200 dark:text-slate-200 html-light:text-slate-800"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="relative w-10 h-10 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 html-light:bg-slate-200 border border-slate-800 dark:border-slate-800 html-light:border-slate-300 hover:border-cyan-500/50 transition-all flex items-center justify-center text-slate-300 dark:text-slate-300 html-light:text-slate-800"
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
          className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
