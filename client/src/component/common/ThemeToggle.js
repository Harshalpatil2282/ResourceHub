import React, { useEffect, useState } from 'react';

function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // ✅ Add this below useState
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (!storedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme} style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '8px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      backgroundColor: 'var(--card-background)',
      border: '1px solid var(--border-color)',
      color: 'var(--text-color)'
    }}>
      {theme === 'light' ? '🌙 Dark Mode' : '🌞 Light Mode'}
    </button>
  );
}

export default ThemeToggle;
