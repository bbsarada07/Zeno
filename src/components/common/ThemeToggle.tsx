import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="p-2 rounded-xl transition-all cursor-pointer border border-zinc-700 dark:border-white/10 bg-zinc-800 dark:bg-zinc-900 text-amber-400 dark:text-sky-300 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
    </button>
  );
};
