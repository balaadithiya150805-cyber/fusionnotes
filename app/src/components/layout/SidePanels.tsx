import React, { useEffect, useState } from 'react';
import styles from './SidePanels.module.css';

/* ── DASHBOARD SIDE ── */
const ACTIVITY = [
  { id: 'a1', initials: 'E', name: 'Emma', action: 'uploaded Circuit Theory Notes', time: '2m ago', color: '#8b7fff' },
  { id: 'a2', initials: 'J', name: 'Jason', action: 'generated 24 flashcards from Biology', time: '15m ago', color: '#4ade80' },
  { id: 'a3', initials: 'S', name: 'Sarah', action: 'added WW2 Timeline notes', time: '1h ago', color: '#facc15' },
  { id: 'a4', initials: 'A', name: 'Alex', action: 'invited 2 new collaborators', time: '3h ago', color: '#f87171' },
];

interface Collaborator {
  user_id: string;
  initial: string;
  last_subject: string;
  last_active: string;
}

const AVATAR_COLORS = ['#8b7fff', '#4ade80', '#facc15', '#f87171', '#38bdf8', '#f97316', '#ec4899'];

function useCollaborators() {
  const [collabs, setCollabs] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchCollabs = async () => {
      try {
        const res = await fetch('/api/collaborators');
        if (res.ok && !cancelled) {
          const data = await res.json();
          // Always prepend some mock "active" members for the prototype
          const mockCollabs: Collaborator[] = [
            { user_id: 'Emma Wilson', initial: 'E', last_subject: 'Biology', last_active: '2m ago' },
            { user_id: 'Jason Park', initial: 'J', last_subject: 'Physics', last_active: '15m ago' },
          ];
          setCollabs([...mockCollabs, ...data]);
        }
      } catch {
        // ...
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCollabs();
    const id = setInterval(fetchCollabs, 30_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return { collabs, loading };
}

export const DashboardSide: React.FC = () => {
  const { collabs, loading } = useCollaborators();

  return (
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
          <span className={styles.sectionTitle}>
            Collaborators
            {!loading && collabs.length > 0 && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6, fontWeight: 400 }}>
                ({collabs.length} active)
              </span>
            )}
          </span>
          <button className="btn-ghost" style={{ padding: '3px 10px', fontSize: 12 }} id="invite-btn">Invite</button>
        </div>
        <div className={styles.collabList}>
          {loading && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 0' }}>Loading…</div>
          )}
          {!loading && collabs.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 0' }}>No collaborators yet. Upload notes to connect!</div>
          )}
          {collabs.map((c, i) => (
            <div key={c.user_id} className={styles.collabItem} id={`collab-${i}`}>
              <div className={styles.collabAvatarWrap}>
                <div className={styles.collabAvatar} style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                  {c.initial}
                </div>
                <div className={styles.onlineDot} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className={styles.collabName} style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.user_id.length > 25 ? c.user_id.substring(0, 8) + '…' : c.user_id}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {c.last_subject}
                </span>
              </div>
              <span className={`${styles.status} ${styles.online}`}>Online</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
export const ChatSide: React.FC = () => {
  const { collabs, loading } = useCollaborators();

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <div className={styles.sectionTitle} style={{ marginBottom: 12 }}>Study Group — Physics</div>
        <div className={styles.collabList}>
          {loading && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Loading…</div>}
          {!loading && collabs.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No members yet.</div>
          )}
          {collabs.map((c, i) => (
            <div key={c.user_id} className={styles.collabItem}>
              <div className={styles.collabAvatarWrap}>
                <div className={styles.collabAvatar} style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                  {c.initial}
                </div>
                <div className={styles.onlineDot} />
              </div>
              <span className={styles.collabName}>{c.user_id.substring(0, 8)}…</span>
              <span className={`${styles.status} ${styles.online}`}>Online</span>
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
};

/* ── NOTES SIDE ── */
export const NotesSide: React.FC = () => {
  const { collabs } = useCollaborators();

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <div className={styles.sectionTitle} style={{ marginBottom: 12 }}>Quick Stats</div>
        <div className={styles.statsGrid}>
          {[
            { label: 'Collaborators', value: String(collabs.length || '—'), color: '#8b7fff' },
            { label: 'Subjects', value: '4', color: '#4ade80' },
            { label: 'Shared', value: 'All', color: '#facc15' },
            { label: 'AI Synth', value: '✓', color: '#38bdf8' },
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
};
