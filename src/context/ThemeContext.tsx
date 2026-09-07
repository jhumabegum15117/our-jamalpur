import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'oj_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch (e) {
      console.warn('Unable to access localStorage for theme:', e);
    }
    return 'system';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const computeIsDark = () => {
      if (theme === 'dark') return true;
      if (theme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const darkActive = computeIsDark();
    setIsDark(darkActive);

    if (darkActive) {
      root.classList.add('dark');
      body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      // Update meta theme color for mobile browser navbars
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#020617');
      }
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#047857');
      }
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Failed to save theme to localStorage:', e);
    }
  }, [theme]);

  // Listen to system preference changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const darkActive = e.matches;
      setIsDark(darkActive);
      const root = document.documentElement;
      const body = document.body;
      if (darkActive) {
        root.classList.add('dark');
        body.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        body.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      return isDark ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
