'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center p-2.5 rounded-xl border transition-all duration-300 cursor-pointer relative group ${
        theme === 'dark'
          ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/30'
          : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
      }`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-4.5 w-4.5 transition-transform duration-500 rotate-0 group-hover:rotate-45" />
      ) : (
        <Moon className="h-4.5 w-4.5 transition-transform duration-500 rotate-0 group-hover:-rotate-12" />
      )}
    </button>
  );
};
