import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = "" }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <button
      onClick={toggleTheme}
      className={`text-subtext hover:text-textMain transition-all bg-surface/40 p-2.5 rounded-xl border border-borderCustom hover:bg-surface/60 group ${className}`}
      title={isDark ? "Activate Soft Luxury" : "Activate Luxe Dark"}
    >
      {isDark ? (
        <Sun size={18} strokeWidth={2.5} className="group-hover:rotate-45 transition-transform" />
      ) : (
        <Moon size={18} strokeWidth={2.5} className="group-hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
};

export default ThemeToggle;
