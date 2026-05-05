import { useState, useEffect, useCallback } from 'react';

export type Theme = 'washi' | 'suna' | 'matcha' | 'sora' | 'sumi';

const STORAGE_KEY = 'veganut-theme';
const THEMES: Theme[] = ['washi', 'suna', 'matcha', 'sora', 'sumi'];

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (THEMES.includes(stored as Theme)) return stored as Theme;
  if (stored === 'light') return 'washi';
  if (stored === 'dark') return 'suna';
  return 'washi';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...THEMES.map(t => `theme-${t}`));
    root.classList.add(`theme-${theme}`);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const idx = THEMES.indexOf(prev);
      return THEMES[(idx + 1) % THEMES.length];
    });
  }, []);

  return { theme, toggleTheme };
}
