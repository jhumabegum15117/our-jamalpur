import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, ChevronDown, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface Props {
  variant?: 'compact' | 'pill' | 'dropdown' | 'inline';
  className?: string;
}

export const ThemeToggle: React.FC<Props> = ({ variant = 'compact', className = '' }) => {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'compact') {
    return (
      <button
        id="global-theme-toggle-btn"
        onClick={toggleTheme}
        type="button"
        className={`relative flex items-center justify-center p-1.5 sm:p-2 rounded-xl transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 shadow-xs'
            : 'bg-emerald-950/60 hover:bg-emerald-950 text-amber-300 border border-emerald-700/60 shadow-xs'
        } ${className}`}
        title={isDark ? 'লাইট মোডে পরিবর্তন করুন (Day Mode)' : 'ডার্ক / নাইট মোডে পরিবর্তন করুন (Night Mode)'}
        aria-label="Toggle Night/Day Theme"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300 animate-spin-slow transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-amber-200 transition-transform hover:-rotate-12" />
        )}
        <span className="sr-only">{isDark ? 'লাইট মোড' : 'ডার্ক মোড'}</span>
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        id="theme-toggle-pill-btn"
        onClick={toggleTheme}
        type="button"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 shadow-xs'
            : 'bg-emerald-100 hover:bg-emerald-200/80 text-emerald-900 border border-emerald-300/80'
        } ${className}`}
        title={isDark ? 'লাইট মোডে পরিবর্তন করুন' : 'ডার্ক মোডে পরিবর্তন করুন'}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>লাইট মোড</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-emerald-800" />
            <span>নাইট মোড</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'inline') {
    const options: Array<{ mode: ThemeMode; label: string; icon: any }> = [
      { mode: 'light', label: 'লাইট', icon: Sun },
      { mode: 'dark', label: 'ডার্ক (নাইট)', icon: Moon },
      { mode: 'system', label: 'অটো (সিস্টেম)', icon: Laptop },
    ];

    return (
      <div className={`inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 gap-1 ${className}`}>
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.mode;
          return (
            <button
              key={opt.mode}
              onClick={() => setTheme(opt.mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        id="theme-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
      >
        {theme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-amber-400" />
        ) : theme === 'light' ? (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        ) : (
          <Laptop className="w-3.5 h-3.5 text-emerald-500" />
        )}
        <span className="capitalize hidden xs:inline">
          {theme === 'dark' ? 'ডার্ক' : theme === 'light' ? 'লাইট' : 'অটো'}
        </span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-850 shadow-2xl border border-slate-200 dark:border-slate-750 py-1.5 z-50 animate-fade-in">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            থিম নির্বাচন করুন
          </div>
          <button
            onClick={() => {
              setTheme('light');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 text-xs flex items-center justify-between text-left transition cursor-pointer ${
              theme === 'light'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>লাইট মোড (Day)</span>
            </div>
            {theme === 'light' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              setTheme('dark');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 text-xs flex items-center justify-between text-left transition cursor-pointer ${
              theme === 'dark'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-amber-400" />
              <span>ডার্ক মোড (Night)</span>
            </div>
            {theme === 'dark' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              setTheme('system');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 text-xs flex items-center justify-between text-left transition cursor-pointer ${
              theme === 'system'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-indigo-500" />
              <span>ডিভাইস সিস্টেম অটো</span>
            </div>
            {theme === 'system' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
          </button>
        </div>
      )}
    </div>
  );
};
