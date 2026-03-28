import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import NavPills from './NavPills';
import AISearchBar from './AISearchBar';
import ThemeToggle from '../ui/ThemeToggle';
import styles from './TopBar.module.css';

interface TopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (query: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ activeTab, onTabChange, onSearch }) => {
  const { logo } = useTheme();

  return (
    <header className={styles.topbar}>
      <div className={styles.logoZone}>
        <img
          src={logo}
          alt="Fusionnotes"
          className={styles.logo}
          draggable={false}
        />
      </div>

      <div className={styles.centerZone}>
        <AISearchBar onSearch={onSearch} />
        <NavPills activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      <div className={styles.actionsZone}>
        <ThemeToggle />
        <button className="icon-btn" title="Notifications" id="notif-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
        <button className={styles.avatar} title="Account" id="avatar-btn">
          <span>A</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
