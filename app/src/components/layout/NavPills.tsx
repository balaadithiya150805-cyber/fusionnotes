import React from 'react';
import styles from './NavPills.module.css';

const TABS = [
  { id: 'dashboard', label: 'dashboard' },
  { id: 'notes',     label: 'notes' },
  { id: 'flashcard', label: 'flashcard' },
  { id: 'chat',      label: 'chat' },
];

interface NavPillsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavPills: React.FC<NavPillsProps> = ({ activeTab, onTabChange }) => (
  <nav className={styles.nav} role="tablist" aria-label="Main navigation">
    {TABS.map(tab => (
      <button
        key={tab.id}
        id={`nav-${tab.id}`}
        role="tab"
        aria-selected={activeTab === tab.id}
        className={`pill-btn ${activeTab === tab.id ? 'active' : ''} ${styles.pill}`}
        onClick={() => onTabChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </nav>
);

export default NavPills;
