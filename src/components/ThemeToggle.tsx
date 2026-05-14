'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const saved = localStorage.getItem('theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (!saved && system);
    setDark(isDark);
    root.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    const root = window.document.documentElement;
    const next = !dark;
    setDark(next);
    root.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-deep-ink/5 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      <Sun
        size={18}
        className={`absolute transition-all duration-300 ${
          dark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        } text-saffron-glow`}
      />
      <Moon
        size={18}
        className={`absolute transition-all duration-300 ${
          dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        } text-saffron-glow`}
      />
    </button>
  );
}
