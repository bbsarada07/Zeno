import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, GraduationCap, FileCheck, ShieldAlert, FileText, Command, ArrowRight, UserCheck, Shield, User, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export const RaycastCommandPalette: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openGisNavigation,
    setIsHitlDrawerOpen,
    setIsReceiptModalOpen,
    setActiveRole,
    resetDemoState,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Global keydown listener for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands: CommandItem[] = [
    {
      id: 'cmd-reset-demo',
      title: 'Reset Demo State (Re-seed Petitions Queue)',
      category: 'System Governance',
      icon: <RotateCcw className="w-4 h-4 text-cyan-400" />,
      action: () => {
        resetDemoState();
        setIsOpen(false);
      },
      shortcut: '⌘R',
    },
    {
      id: 'cmd-role-student',
      title: 'Switch Role ➔ Student Governance Node',
      category: 'Role Authorization',
      icon: <User className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setActiveRole('student');
        setActiveTab('dashboard');
        setIsOpen(false);
      },
      shortcut: '⌘1',
    },
    {
      id: 'cmd-role-faculty',
      title: 'Switch Role ➔ Faculty Course Advisor Portal',
      category: 'Role Authorization',
      icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setActiveRole('faculty');
        setActiveTab('dashboard');
        setIsOpen(false);
      },
      shortcut: '⌘2',
    },
    {
      id: 'cmd-role-hod',
      title: 'Switch Role ➔ HOD Executive Governance Inbox',
      category: 'Role Authorization',
      icon: <Shield className="w-4 h-4 text-amber-400" />,
      action: () => {
        setActiveRole('hod');
        setActiveTab('dashboard');
        setIsOpen(false);
      },
      shortcut: '⌘3',
    },
    {
      id: 'cmd-gis',
      title: 'Campus GIS Map & Indoor Routing',
      category: 'Navigation',
      icon: <MapPin className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setActiveTab('gis');
        openGisNavigation();
        setIsOpen(false);
      },
      shortcut: '↵',
    },
    {
      id: 'cmd-placement',
      title: 'Placement AI & Skill Digital Twin Workspace',
      category: 'Navigation',
      icon: <GraduationCap className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setActiveTab('placement');
        setIsOpen(false);
      },
      shortcut: '↵',
    },
    {
      id: 'cmd-waiver',
      title: 'Attendance Waiver Petition Hub',
      category: 'Governance',
      icon: <FileCheck className="w-4 h-4 text-amber-400" />,
      action: () => {
        setActiveTab('waivers');
        setIsHitlDrawerOpen(true);
        setIsOpen(false);
      },
      shortcut: '↵',
    },
    {
      id: 'cmd-audit',
      title: 'Download Cryptographic Audit Ledger Certificate',
      category: 'Security Proof',
      icon: <FileText className="w-4 h-4 text-sky-400" />,
      action: () => {
        setIsReceiptModalOpen(true);
        setIsOpen(false);
      },
      shortcut: '↵',
    },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-2xl p-4 font-sans select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="w-full max-w-xl bg-[#090D14]/95 border border-slate-800 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100"
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or reset demo state (e.g. Reset, HOD, Faculty, GIS)..."
            autoFocus
            className="w-full bg-transparent border-none text-sm text-slate-100 placeholder-slate-500 outline-none font-mono"
          />
          <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-900 border border-slate-800 text-slate-400">
            ESC
          </span>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <div
                key={cmd.id}
                onClick={cmd.action}
                className="p-3.5 rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-900/80 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-slate-700">
                    {cmd.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-200 group-hover:text-white">
                      {cmd.title}
                    </div>
                    <div className="text-xs font-mono text-slate-500">{cmd.category}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-slate-500 group-hover:text-cyan-400">
                  <span className="text-xs font-mono">{cmd.shortcut}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No matching commands found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 text-xs font-mono text-slate-500 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Command className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zeno Raycast Command Engine</span>
          </div>
          <div>Press ESC to exit</div>
        </div>
      </motion.div>
    </div>
  );
};
