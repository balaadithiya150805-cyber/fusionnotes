import React from 'react';
import type { Note } from '../types/note';
import StatCard from '../components/ui/StatCard';
import NoteCard from '../components/ui/NoteCard';
import UploadDropzone from '../components/ui/UploadDropzone';
import styles from './DashboardPage.module.css';

const MOCK_NOTES: Note[] = [
  { id: '1', title: 'Kirchhoff\'s Current Law', excerpt: 'The total current entering a junction equals the total current leaving. KCL is fundamental to circuit analysis...', tags: ['Physics', 'Circuits'], date: 'Mar 27', author: 'Emma', authorInitial: 'E', color: '#8b7fff' },
  { id: '2', title: 'Photosynthesis Overview', excerpt: 'Light-dependent reactions occur in the thylakoid membrane. ATP and NADPH are produced during the light phase...', tags: ['Biology', 'Energy'], date: 'Mar 26', author: 'Jason', authorInitial: 'J', color: '#4ade80' },
  { id: '3', title: 'World War II Timeline', excerpt: 'Key events from 1939–1945. The invasion of Poland on Sept 1, 1939 marked the official start of the war...', tags: ['History'], date: 'Mar 25', author: 'Sarah', authorInitial: 'S', color: '#facc15' },
  { id: '4', title: 'Calculus — Integration Rules', excerpt: 'Power rule, substitution, and by-parts techniques. ∫xⁿ dx = xⁿ⁺¹/(n+1) + C is the power rule...', tags: ['Math', 'Calculus'], date: 'Mar 24', author: 'Alex', authorInitial: 'A', color: '#f87171' },
  { id: '5', title: 'Ohm\'s Law Deep Dive', excerpt: 'V = IR. Voltage equals current times resistance. Derived from the combination of Coulomb\'s and Joule\'s laws...', tags: ['Physics', 'Circuits'], date: 'Mar 23', author: 'Emma', authorInitial: 'E', color: '#38bdf8' },
  { id: '6', title: 'Cell Division — Mitosis', excerpt: 'PMAT phases: Prophase, Metaphase, Anaphase, Telophase. Chromosome condensation happens first...', tags: ['Biology'], date: 'Mar 22', author: 'Jason', authorInitial: 'J', color: '#fb923c' },
];

const DashboardPage: React.FC = () => (
  <div className={styles.page}>
    {/* Header */}
    <div className={styles.header}>
      <div>
        <h1 className={`${styles.greeting} text-display`}>Good evening, Alex 👋</h1>
        <p className={styles.sub}>You have 3 notes to review and 12 flashcards due today.</p>
      </div>
      <button className="btn-accent" id="new-note-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Note
      </button>
    </div>

    {/* Stats */}
    <div className={styles.statsRow}>
      <StatCard label="Total Notes" value="142" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} delta="+8 this week" />
      <StatCard label="Flashcards" value="348" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>} color="#22c55e20" delta="+24 this week" />
      <StatCard label="Collaborators" value="7" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} color="#f59e0b20" />
    </div>

    {/* Upload */}
    <UploadDropzone />

    {/* Notes Grid */}
    <div className={styles.sectionHeader}>
      <h2 className={`${styles.sectionTitle} text-heading`}>Recent Notes</h2>
      <button className="btn-ghost" id="view-all-notes-btn">View all</button>
    </div>
    <div className={styles.grid}>
      {MOCK_NOTES.map(note => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  </div>
);

export default DashboardPage;
