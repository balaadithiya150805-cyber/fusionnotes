import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Note } from '../types/note';
import StatCard from '../components/ui/StatCard';
import NoteCard from '../components/ui/NoteCard';
import UploadDropzone from '../components/ui/UploadDropzone';
import styles from './DashboardPage.module.css';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
  onTagClick?: (tag: string) => void;
  notes: Note[];
  onUpload: (files: File[], subject: string) => void;
  isUploading: boolean;
  onSelectNote: (id: string) => void;
  user: { id: string; email: string; username?: string } | null;
  onLogout: () => void;
  isMobile?: boolean;
  onSearch?: (query: string) => void;
  activeTab?: string;
}

const DashboardPage: React.FC<DashboardProps> = ({ onNavigate, onTagClick, notes, onUpload, isUploading, onSelectNote, user, isMobile }) => {
  const { t } = useTranslation();
  const recentNotes = notes.slice(0, 4);

  const handleUpload = (files: File[]) => {
    // Default to 'General' or first tag from existing notes if any
    onUpload(files, notes[0]?.tags[0] || 'General');
  };

  return (
    <div className={styles.page}>
      
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={`${styles.greeting} text-display`}>
            {t('dashboard.greeting', { name: user?.username || 'Student' })} 👋
          </h1>
          <p className={styles.sub}>
            {notes.length > 0 ? t('dashboard.newNotesHint') : t('dashboard.noNotesHint')}
          </p>
        </div>
        {!isMobile && (
          <div className={styles.headerActions}>
            <button className="btn-ghost" onClick={() => {
              const text = prompt(t('dashboard.enterNotePrompt') || "Enter text for your note:");
              if (text) {
                const blob = new Blob([text], { type: 'text/plain' });
                const file = new File([blob], "manual_note.txt", { type: 'text/plain' });
                onUpload([file], 'General');
              }
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              {t('dashboard.quickNote')}
            </button>
            <button className="btn-accent" id="new-note-btn" onClick={() => onNavigate?.('notes')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {t('dashboard.newNote')}
            </button>
          </div>
        )}
      </div>

    {/* Stats */}
    <div className={styles.statsRow}>
      <StatCard label={t('dashboard.totalNotes')} value={notes.length.toString()} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} delta={`+${notes.filter((n: any) => n.date === 'Today' || n.date === 'Just Now').length} ${t('dashboard.today')}`} />
      <StatCard label={t('dashboard.flashcards')} value="0" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>} color="#22c55e20" delta="0 this week" />
      <StatCard label={t('dashboard.collaborators')} value="2" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} color="#f59e0b20" />
    </div>

    {/* Upload */}
    <div style={{ position: 'relative' }}>
        {isUploading && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(0,0,0,0.5)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>{t('dashboard.scanningGemini')}</span>
          </div>
        )}
        <UploadDropzone onUpload={handleUpload} />
    </div>

    {/* Notes Grid */}
    <div className={styles.sectionHeader}>
      <h2 className={`${styles.sectionTitle} text-heading`}>{t('dashboard.recentNotes')}</h2>
      <button className="btn-ghost" id="view-all-notes-btn" onClick={() => onNavigate?.('notes')}>{t('dashboard.viewAll')}</button>
    </div>
    <div className={styles.grid}>
      {recentNotes.map((note: any) => (
        <NoteCard 
          key={note.id} 
          note={note} 
          onClick={() => onSelectNote(note.id)} 
          onTagClick={onTagClick} 
        />
      ))}
    </div>
  </div>
  );
};

export default DashboardPage;
