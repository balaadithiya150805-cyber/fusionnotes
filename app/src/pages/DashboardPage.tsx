import React from 'react';
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
}

const DashboardPage: React.FC<DashboardProps> = ({ onNavigate, onTagClick, notes, onUpload, isUploading, onSelectNote }) => {
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
        <h1 className={`${styles.greeting} text-display`}>Welcome back, Aditya 👋</h1>
        <p className={styles.sub}>You have 1 new scanned note to review.</p>
      </div>
      <button className="btn-accent" id="new-note-btn" onClick={() => onNavigate?.('notes')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Note
      </button>
    </div>

    {/* Stats */}
    <div className={styles.statsRow}>
      <StatCard label="Total Notes" value={notes.length.toString()} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} delta={`+${notes.filter(n => n.date === 'Today' || n.date === 'Just Now').length} today`} />
      <StatCard label="Flashcards" value="0" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>} color="#22c55e20" delta="0 this week" />
      <StatCard label="Collaborators" value="2" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} color="#f59e0b20" />
    </div>

    {/* Upload */}
    <div style={{ position: 'relative' }}>
        {isUploading && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(0,0,0,0.5)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>Scanning with Gemini Core...</span>
          </div>
        )}
        <UploadDropzone onUpload={handleUpload} />
    </div>

    {/* Notes Grid */}
    <div className={styles.sectionHeader}>
      <h2 className={`${styles.sectionTitle} text-heading`}>Recent Notes</h2>
      <button className="btn-ghost" id="view-all-notes-btn" onClick={() => onNavigate?.('notes')}>View all</button>
    </div>
    <div className={styles.grid}>
      {recentNotes.map(note => (
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
