import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/storageKeys';

export type Theme = 'washi' | 'frappe';

const THEMES: Theme[] = ['washi', 'frappe'];
const THEME_SWITCHING_CLASS = 'theme-switching';

let transitionResetFrame = 0;

function suppressThemeTransitions(root: HTMLElement): void {
  if (typeof window === 'undefined') return;

  root.classList.add(THEME_SWITCHING_CLASS);

  if (transitionResetFrame) {
    window.cancelAnimationFrame(transitionResetFrame);
  }

  transitionResetFrame = window.requestAnimationFrame(() => {
    transitionResetFrame = window.requestAnimationFrame(() => {
      root.classList.remove(THEME_SWITCHING_CLASS);
      transitionResetFrame = 0;
    });
  });
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEYS.theme);
  if (THEMES.includes(stored as Theme)) return stored as Theme;
  if (stored === 'light') return 'washi';
  if (stored === 'dark') return 'frappe';
  return 'washi';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    suppressThemeTransitions(root);
    root.classList.remove(...THEMES.map(t => `theme-${t}`));
    root.classList.add(`theme-${theme}`);
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const idx = THEMES.indexOf(prev);
      return THEMES[(idx + 1) % THEMES.length];
    });
  }, []);

  return { theme, toggleTheme };
}
