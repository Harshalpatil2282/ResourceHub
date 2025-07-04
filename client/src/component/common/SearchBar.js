import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

function SearchBar({ onResults }) {
  const [name, setName] = useState('');
  const { theme } = useTheme();

  // Call onResults automatically when name changes
  useEffect(() => {
    onResults({ name });
  }, [name, onResults]);

  const clearField = () => setName('');

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        background: theme === 'light'
          ? 'rgba(255,255,255,0.7)'
          : 'rgba(34,40,49,0.55)',
        boxShadow: theme === 'light'
          ? '0 2px 12px rgba(44,62,80,0.08)'
          : '0 2px 12px rgba(0,0,0,0.18)',
        borderRadius: '16px',
        padding: '12px 18px',
        margin: '10px 0',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'background 0.3s'
      }}
    >
      <input
        type="text"
        placeholder="🔍 Search files by name..."
        value={name}
        onChange={e => setName(e.target.value)}
        style={{
          flex: 1,
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          outline: 'none',
          fontSize: '1rem',
          background: theme === 'light' ? '#fff' : '#232526',
          color: theme === 'light' ? '#222' : '#f5f5f5',
          transition: 'background 0.2s, color 0.2s'
        }}
      />
      {name && (
        <button
          type="button"
          onClick={clearField}
          title="Clear"
          style={{
            background: 'transparent',
            border: 'none',
            color: theme === 'light' ? '#888' : '#ccc',
            fontSize: '1.2rem',
            cursor: 'pointer',
            marginLeft: '2px'
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
