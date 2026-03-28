import React from 'react';
import type { Note } from '../types/note';
import StatCard from '../components/ui/StatCard';
import NoteCard from '../components/ui/NoteCard';
import UploadDropzone from '../components/ui/UploadDropzone';
import styles from './DashboardPage.module.css';

const MOCK_NOTES: Note[] = [
  { id: '1', title: 'Information Lifecycle Management', excerpt: 'It represents the journey of the data from creation to disposal, highlighting stages the data passes through in its lifetime...', tags: ['Computer Science'], date: 'Today', author: 'Aditya', authorInitial: 'A', color: '#a78bfa' }
];

interface DashboardProps {
  onNavigate?: (tab: string) => void;
  onTagClick?: (tag: string) => void;
}

const DashboardPage: React.FC<DashboardProps> = ({ onNavigate, onTagClick }) => (
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
      <StatCard label="Total Notes" value="1" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} delta="+1 this week" />
      <StatCard label="Flashcards" value="0" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>} color="#22c55e20" delta="0 this week" />
      <StatCard label="Collaborators" value="0" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} color="#f59e0b20" />
    </div>

    {/* Upload */}
    <UploadDropzone />

    {/* Notes Grid */}
    <div className={styles.sectionHeader}>
      <h2 className={`${styles.sectionTitle} text-heading`}>Recent Notes</h2>
      <button className="btn-ghost" id="view-all-notes-btn" onClick={() => onNavigate?.('notes')}>View all</button>
    </div>
    <div className={styles.grid}>
      {MOCK_NOTES.map(note => (
        <NoteCard 
          key={note.id} 
          note={note} 
          onClick={() => onNavigate?.('notes')} 
          onTagClick={onTagClick} 
        />
      ))}
    </div>
  </div>
);

export default DashboardPage;
