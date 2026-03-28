import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import NavPills from './NavPills';
import AISearchBar from './AISearchBar';
import ThemeToggle from '../ui/ThemeToggle';
import { Bell, User, Settings, LogOut, X, AlertCircle } from 'lucide-react';
import styles from './TopBar.module.css';

interface TopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (query: string) => void;
}

type PanelType = 'notifications' | 'profile' | null;

const TopBar: React.FC<TopBarProps> = ({ activeTab, onTabChange, onSearch }) => {
  const { logo } = useTheme();
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  
  // Real-time notification logic
  const [showToast, setShowToast] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  // Swipe-to-dismiss gesture logic
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const diff = e.clientX - dragStart.current;
    if (diff > 0) setDragOffset(diff); // Only swipe right
  };

  const handlePointerUp = () => {
    if (dragOffset > 100) {
      setShowToast(false);
    }
    setDragOffset(0);
    dragStart.current = null;
  };

  // Trigger an important notification popup after a short delay to simulate live event
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
      setHasUnread(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Floating Panel Overlay */}
      {activePanel && (
        <div className={styles.panelOverlay} onClick={() => setActivePanel(null)}>
          <div className={styles.floatingPanel} onClick={e => e.stopPropagation()}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>
                {activePanel === 'profile' ? 'Account Settings' : 'Notifications'}
              </h3>
              <button className={styles.closeBtn} onClick={() => setActivePanel(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.panelContent}>
              {activePanel === 'profile' ? (
                <>
                  <div className={styles.panelItem}>
                    <User size={18} className={styles.panelItemIcon} />
                    <span>Alex Student</span>
                  </div>
                  <div className={styles.panelItem}>
                    <Settings size={18} className={styles.panelItemIcon} />
                    <span>Preferences</span>
                  </div>
                  <div className={styles.panelItem} style={{ color: 'var(--accent)' }}>
                    <LogOut size={18} className={styles.panelItemIcon} />
                    <span>Sign out</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.panelItem} style={{ background: hasUnread ? 'var(--bg-glass-hover)' : 'transparent' }}>
                    <AlertCircle size={18} className={styles.panelItemIcon} style={{ color: hasUnread ? '#ef4444' : 'var(--text-muted)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>CRITICAL UPDATE</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Emma completely rewrote Kirchhoff's Law.</div>
                    </div>
                  </div>
                  <div className={styles.panelItem}>
                    <Bell size={18} className={styles.panelItemIcon} />
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Jason attached a file</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Biology — Cell Division</div>
                    </div>
                  </div>
                  <div className={styles.panelItem}>
                    <Bell size={18} className={styles.panelItemIcon} />
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Sarah commented</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WWII Timeline</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main TopBar */}
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
        <div className={styles.notifBtnWrap}>
          <button className="icon-btn" title="Notifications" onClick={() => { setActivePanel('notifications'); setHasUnread(false); }}>
            <Bell size={18} />
          </button>
          {hasUnread && <span className={styles.notifBadge} />}
        </div>
        <button className={styles.avatar} title="Account" onClick={() => setActivePanel('profile')}>
          <span>A</span>
        </button>
      </div>
    </header>

    {/* Live Toast Popup */}
    {showToast && (
      <div 
        className={styles.toastCard}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ 
          transform: dragOffset > 0 ? `translateX(${dragOffset}px)` : undefined,
          opacity: dragOffset > 0 ? Math.max(0, 1 - dragOffset / 200) : 1,
          transition: dragStart.current === null ? 'all var(--duration-fast) var(--ease-out)' : 'none',
          cursor: 'grab' 
        }}
      >
        <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
        <div className={styles.toastContent}>
          <div className={styles.toastTitle}>Important Sync Change</div>
          <div className={styles.toastBody}>Emma just completely updated your "Kirchhoff's Law" active note! Review changes.</div>
        </div>
        <button className={styles.toastDismiss} onClick={() => setShowToast(false)}>
          <X size={16} />
        </button>
      </div>
    )}
    </>
  );
};

export default TopBar;
