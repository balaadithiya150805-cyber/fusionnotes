import React, { useState } from 'react';
import styles from './AISearchBar.module.css';

interface AISearchBarProps {
  onSearch: (query: string) => void;
}

const AISearchBar: React.FC<AISearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form
      className={`${styles.form} ${focused ? styles.focused : ''}`}
      onSubmit={handleSubmit}
      role="search"
    >
      <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        id="ai-search-input"
        type="text"
        placeholder="Ask me anything from your notes..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={styles.input}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => setValue('')}
          aria-label="Clear search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </form>
  );
};

export default AISearchBar;
