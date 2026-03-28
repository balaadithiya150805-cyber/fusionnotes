import React from 'react';
import styles from './SidePanels.module.css';

/* ── DASHBOARD SIDE ── */
const ACTIVITY = [
  { id: 'a1', initials: 'E', name: 'Emma', action: 'uploaded Circuit Theory Notes', time: '2m ago', color: '#8b7fff' },
  { id: 'a2', initials: 'J', name: 'Jason', action: 'generated 24 flashcards from Biology', time: '15m ago', color: '#4ade80' },
  { id: 'a3', initials: 'S', name: 'Sarah', action: 'added WW2 Timeline notes', time: '1h ago', color: '#facc15' },
  { id: 'a4', initials: 'A', name: 'Alex', action: 'invited 2 new collaborators', time: '3h ago', color: '#f87171' },
];

const COLLABORATORS = [
  { id: 'u1', initials: 'E', name: 'Emma W.', online: true },
  { id: 'u2', initials: 'J', name: 'Jason P.', online: true },
  { id: 'u3', initials: 'S', name: 'Sarah C.', online: false },
  { id: 'u4', initials: 'A', name: 'Alex M.', online: true },
];

export const DashboardSide: React.FC = () => (
  <div className={styles.panel}>
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Activity</span>
      </div>
      <div className={styles.activityList}>
        {ACTIVITY.map(a => (
          <div key={a.id} className={styles.activityItem} id={`activity-${a.id}`}>
            <div className={styles.activityDot} style={{ background: a.color }} />
            <div className={styles.activityText}>
              <span className={styles.activityName}>{a.name}</span>
              <span className={styles.activityAction}> {a.action}</span>
            </div>
            <span className={styles.activityTime}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>

    <div className={styles.divider} />

    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Collaborators</span>
        <button className="btn-ghost" style={{ padding: '3px 10px', fontSize: 12 }} id="invite-btn">Invite</button>
      </div>
      <div className={styles.collabList}>
        {COLLABORATORS.map(c => (
          <div key={c.id} className={styles.collabItem} id={`collab-${c.id}`}>
            <div className={styles.collabAvatarWrap}>
              <div className={styles.collabAvatar}>{c.initials}</div>
              {c.online && <div className={styles.onlineDot} />}
            </div>
            <span className={styles.collabName}>{c.name}</span>
            <span className={`${styles.status} ${c.online ? styles.online : styles.offline}`}>
              {c.online ? 'Online' : 'Away'}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── FLASHCARD SIDE ── */
export const FlashcardSide: React.FC = () => (
  <div className={styles.panel}>
    <div className={styles.section}>
      <div className={styles.sectionTitle} style={{ marginBottom: 14 }}>Today's Progress</div>
      <div className={styles.statsGrid}>
        {[
          { label: 'Cards Done', value: '28', color: '#4ade80' },
          { label: 'Streak', value: '7d', color: '#facc15' },
          { label: 'Accuracy', value: '84%', color: '#8b7fff' },
          { label: 'Due Today', value: '12', color: '#f87171' },
        ].map(s => (
          <div key={s.label} className={styles.miniStat}>
            <span className={styles.miniStatValue} style={{ color: s.color }}>{s.value}</span>
            <span className={styles.miniStatLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>

    <div className={styles.divider} />

    <div className={styles.section}>
      <div className={styles.sectionTitle} style={{ marginBottom: 12 }}>Keyboard Shortcuts</div>
      <div className={styles.shortcuts}>
        {[
          { key: 'Space', action: 'Flip card' },
          { key: '→', action: 'Next card' },
          { key: '←', action: 'Previous' },
          { key: '1', action: 'Hard' },
          { key: '2', action: 'Okay' },
          { key: '3', action: 'Easy' },
        ].map(s => (
          <div key={s.key} className={styles.shortcut}>
            <kbd className={styles.kbd}>{s.key}</kbd>
            <span className={styles.action}>{s.action}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── CHAT SIDE ── */
export const ChatSide: React.FC = () => (
  <div className={styles.panel}>
    <div className={styles.section}>
      <div className={styles.sectionTitle} style={{ marginBottom: 12 }}>Study Group — Physics</div>
      <div className={styles.collabList}>
        {COLLABORATORS.map(c => (
          <div key={c.id} className={styles.collabItem}>
            <div className={styles.collabAvatarWrap}>
              <div className={styles.collabAvatar}>{c.initials}</div>
              {c.online && <div className={styles.onlineDot} />}
            </div>
            <span className={styles.collabName}>{c.name}</span>
            <span className={`${styles.status} ${c.online ? styles.online : styles.offline}`}>{c.online ? 'Online' : 'Away'}</span>
          </div>
        ))}
      </div>
    </div>
    <div className={styles.divider} />
    <div className={styles.section}>
      <div className={styles.sectionTitle} style={{ marginBottom: 12 }}>Shared Notes</div>
      {['Circuit Theory Notes', 'Biology Overview', 'WW2 Timeline'].map((n, i) => (
        <div key={i} className={styles.sharedNote}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span>{n}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── NOTES SIDE ── */
export const NotesSide: React.FC = () => (
  <div className={styles.panel}>
    <div className={styles.section}>
      <div className={styles.sectionTitle} style={{ marginBottom: 12 }}>Quick Stats</div>
      <div className={styles.statsGrid}>
        {[
          { label: 'My Notes', value: '89', color: '#8b7fff' },
          { label: 'Shared', value: '53', color: '#4ade80' },
          { label: 'Tags', value: '14', color: '#facc15' },
          { label: 'Merged', value: '28', color: '#38bdf8' },
        ].map(s => (
          <div key={s.label} className={styles.miniStat}>
            <span className={styles.miniStatValue} style={{ color: s.color }}>{s.value}</span>
            <span className={styles.miniStatLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
    <div className={styles.divider} />
    <div className={styles.section}>
      <div className={styles.sectionTitle} style={{ marginBottom: 12 }}>Recent Tags</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['Physics', 'Biology', 'Circuits', 'Math', 'WWII', 'Calculus', 'Thermodynamics'].map(t => (
          <span key={t} className="tag-chip">{t}</span>
        ))}
      </div>
    </div>
  </div>
);
