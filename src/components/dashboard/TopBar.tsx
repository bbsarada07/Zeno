import React, { useState } from 'react';
import {
  MapPin,
  GraduationCap,
  FileCheck,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  Bell,
  User,
  ChevronDown,
  Command,
  Building2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INSTITUTIONAL_TENANTS } from '../../data/mockData';
import { SubAgentHeartbeatPill } from './SubAgentHeartbeatPill';
import type { NavigationTab, InstitutionalTenant } from '../../types';

export const TopBar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    selectedTenant,
    setSelectedTenant,
    student,
    activeRole,
    activeTab,
    setActiveTab,
    logoutSession,
    unreadCount,
    setIsNotificationDrawerOpen,
  } = useApp();

  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);

  const navItems: Array<{ id: NavigationTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'gis', label: 'Campus GIS', icon: <MapPin className="w-4 h-4" /> },
    { id: 'placement', label: 'Placement AI', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'waivers', label: 'Waiver Petitions', icon: <FileCheck className="w-4 h-4" /> },
  ];

  const handleSelectTenant = (tenant: InstitutionalTenant) => {
    setSelectedTenant(tenant);
    setIsTenantDropdownOpen(false);
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#070A0F]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30 select-none relative">
      {/* Brand & Interactive Multi-Tenant Dropdown */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-9 h-9 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-extrabold font-mono text-lg shadow-[0_0_15px_rgba(0,240,255,0.25)]"
            style={{ borderColor: 'var(--accent-color, #00F0FF)' }}
          >
            Z
          </div>

          <div className="relative">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-sm text-white">ZENO</span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                v2.4 Core
              </span>
            </div>

            {/* Interactive Tenant Dropdown Trigger */}
            <button
              onClick={() => setIsTenantDropdownOpen((prev) => !prev)}
              className="text-[11px] text-slate-300 hover:text-white flex items-center space-x-1.5 font-medium transition-all group pt-0.5"
            >
              <Building2 className="w-3 h-3 text-cyan-400" />
              <span className="truncate max-w-[200px]">{selectedTenant.name}</span>
              <span className="font-mono text-cyan-400 font-bold">({selectedTenant.code})</span>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white transition-transform duration-200" />
            </button>

            {/* Dropdown Menu */}
            {isTenantDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#090D14] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-800/80">
                  Switch Institutional Tenant
                </div>
                {INSTITUTIONAL_TENANTS.map((t) => {
                  const isSelected = t.id === selectedTenant.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTenant(t)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-transparent hover:border-slate-800 hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>{t.name}</span>
                        {isSelected && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">{t.code}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Floating Sub-Agent Status Pill */}
        <SubAgentHeartbeatPill />
      </div>

      {/* Center Navigation Tabs */}
      <nav className="hidden md:flex items-center space-x-1 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-slate-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
              style={{
                borderColor: isActive ? 'var(--accent-color, #00F0FF)' : undefined,
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Raycast Cmd+K Trigger Badge */}
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
            window.dispatchEvent(event);
          }}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-all"
        >
          <Command className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cmd + K</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-slate-800"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          )}
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-slate-800"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* User Profile Pill & Explicit Logout */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-semibold text-xs border border-cyan-500/30">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold leading-tight text-white">{student.name}</div>
              <div className="text-[10px] text-slate-400 font-mono leading-none capitalize">
                {activeRole} • {student.rollNumber}
              </div>
            </div>
          </div>

          <button
            onClick={logoutSession}
            className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
            title="Logout Session (Reset Vault)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
