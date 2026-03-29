import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import NavPills from './NavPills';
import AISearchBar from './AISearchBar';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageSelector from '../ui/LanguageSelector';
import { Bell, User, Settings, LogOut, X, AlertCircle } from 'lucide-react';
import styles from './TopBar.module.css';

interface TopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (query: string) => void;
  user: { id: string; email: string; username?: string } | null;
  onLogout: () => void;
  isMobile?: boolean;
  onMenuClick?: () => void;
}

type PanelType = 'notifications' | 'profile' | null;

const TopBar: React.FC<TopBarProps> = ({ activeTab, onTabChange, onSearch, user, onLogout, isMobile, onMenuClick }) => {
  const { logo } = useTheme();
  const { t } = useTranslation();
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  
  // Real-time notification logic
  const [showToast, setShowToast] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  // Swipe-to-dismiss gesture logic
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    setIsDragging(true);
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
    setIsDragging(false);
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
                {activePanel === 'profile' ? t('topbar.accountSettings') : t('topbar.notifications')}
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
                    <span>{user?.username || 'Student'}</span>
                  </div>
                  <div className={styles.panelItem}>
                    <Settings size={18} className={styles.panelItemIcon} />
                    <span>{t('topbar.preferences')}</span>
                  </div>
                  <div className={styles.panelItem} style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={onLogout}>
                    <LogOut size={18} className={styles.panelItemIcon} />
                    <span>{t('topbar.signOut')}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.panelItem} style={{ background: hasUnread ? 'var(--bg-glass-hover)' : 'transparent' }}>
                    <AlertCircle size={18} className={styles.panelItemIcon} style={{ color: hasUnread ? '#ef4444' : 'var(--text-muted)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{t('topbar.criticalUpdate')}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Emma completely rewrote Kirchhoff's Law.</div>
                    </div>
                  </div>
                  <div className={styles.panelItem}>
                    <Bell size={18} className={styles.panelItemIcon} />
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Jason attached a file</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Biology ΓÇö Cell Division</div>
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
      <header className={`${styles.topbar} ${isMobile ? styles.topbarMobile : ''}`}>
        <div className={styles.headerTop}>
          <div className={styles.logoZone}>
            <img
              src={logo}
              alt="Fusionnotes"
              className={styles.logo}
              draggable={false}
            />
          </div>

          <div className={styles.actionsZone}>
            {isMobile ? (
              <button className={styles.menuBtn} onClick={onMenuClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            ) : (
              <>
                <LanguageSelector />
                <ThemeToggle />
                <div className={styles.notifBtnWrap}>
                  <button className="icon-btn" title={t('topbar.notifications')} onClick={() => { setActivePanel('notifications'); setHasUnread(false); }}>
                    <Bell size={18} />
                  </button>
                  {hasUnread && <span className={styles.notifBadge} />}
                </div>
                <button className={styles.avatar} title={t('topbar.accountSettings')} onClick={() => setActivePanel('profile')}>
                  <span>{(user?.username || 'S')[0].toUpperCase()}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {isMobile ? (
          <div className={styles.mobileNavStack}>
            <div className={styles.searchWrapper}>
              <AISearchBar onSearch={onSearch} />
            </div>
            <div className={styles.navWrapper}>
              <NavPills activeTab={activeTab} onTabChange={onTabChange} />
            </div>
          </div>
        ) : (
          <div className={styles.centerZone}>
            <AISearchBar onSearch={onSearch} />
            <NavPills activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        )}
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
          transition: !isDragging ? 'all var(--duration-fast) var(--ease-out)' : 'none',
          cursor: 'grab' 
        }}
      >
        <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
        <div className={styles.toastContent}>
          <div className={styles.toastTitle}>{t('topbar.importantSync')}</div>
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
