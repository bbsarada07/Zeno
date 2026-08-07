import React from 'react';
import { ShieldCheck, MapPin, GraduationCap, FileCheck, LayoutDashboard, LogOut, Moon, Sun, Bell, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { NavigationTab } from '../../types';

export const TopBar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    selectedTenant,
    student,
    activeRole,
    activeTab,
    setActiveTab,
    logoutSession,
    unreadCount,
    setIsNotificationDrawerOpen,
  } = useApp();

  const navItems: Array<{ id: NavigationTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'gis', label: 'Campus GIS', icon: <MapPin className="w-4 h-4" /> },
    { id: 'placement', label: 'Placement AI', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'waivers', label: 'Waiver Petitions', icon: <FileCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="h-16 border-b border-border bg-card/60 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30 select-none">
      {/* Brand & Multi-Tenant Badge */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold font-mono text-base shadow-sm">
            Z
          </div>
          <div>
            <div className="font-bold tracking-tight text-sm flex items-center space-x-2">
              <span>ZENO</span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                v2.4 Executive
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center space-x-1 font-medium">
              <span>{selectedTenant.name}</span>
              <span className="font-mono text-primary">({selectedTenant.code})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="hidden md:flex items-center space-x-1 p-1 bg-muted/30 rounded-xl border border-border">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Notifications, Theme Switcher, User Profile Pill */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all border border-transparent hover:border-border"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          )}
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all border border-transparent hover:border-border"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* User Profile Pill & Explicit Logout */}
        <div className="flex items-center space-x-2 pl-2 border-l border-border">
          <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-muted/40 border border-border rounded-xl">
            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-xs border border-primary/30">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold leading-tight">{student.name}</div>
              <div className="text-[10px] text-muted-foreground font-mono leading-none capitalize">
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
