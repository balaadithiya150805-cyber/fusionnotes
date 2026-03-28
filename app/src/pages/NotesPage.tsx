import React, { useState } from 'react';
import type { Note } from '../types/note';
import NoteCard from '../components/ui/NoteCard';
import UploadDropzone from '../components/ui/UploadDropzone';
import styles from './NotesPage.module.css';

const ALL_NOTES: Note[] = [
  { id: '1',  title: 'Kirchhoff\'s Current Law', excerpt: 'The total current entering a junction equals the total current leaving...', tags: ['Physics', 'Circuits'], date: 'Mar 27', author: 'Emma', authorInitial: 'E', color: '#8b7fff' },
  { id: '2',  title: 'Photosynthesis Overview', excerpt: 'Light-dependent reactions produce ATP and NADPH in the thylakoid...', tags: ['Biology'], date: 'Mar 26', author: 'Jason', authorInitial: 'J', color: '#4ade80' },
  { id: '3',  title: 'World War II Timeline', excerpt: 'Key events 1939–1945. Poland invasion triggered the Allied response...', tags: ['History'], date: 'Mar 25', author: 'Sarah', authorInitial: 'S', color: '#facc15' },
  { id: '4',  title: 'Integration Rules', excerpt: 'Power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. Substitution and by-parts...', tags: ['Math'], date: 'Mar 24', author: 'Alex', authorInitial: 'A', color: '#f87171' },
  { id: '5',  title: 'Ohm\'s Law Deep Dive', excerpt: 'V = IR. Voltage, current, resistance relationships explored in depth...', tags: ['Physics'], date: 'Mar 23', author: 'Emma', authorInitial: 'E', color: '#38bdf8' },
  { id: '6',  title: 'Cell Division — Mitosis', excerpt: 'PMAT phases walkthrough with diagrams and key checkpoints...', tags: ['Biology'], date: 'Mar 22', author: 'Jason', authorInitial: 'J', color: '#fb923c' },
  { id: '7',  title: 'Thermodynamics Laws', excerpt: 'Energy conservation, entropy increase, and absolute zero theory...', tags: ['Physics'], date: 'Mar 21', author: 'Sarah', authorInitial: 'S', color: '#a78bfa' },
  { id: '8',  title: 'French Revolution Notes', excerpt: 'Causes, key figures, and outcomes of the 1789 revolution in France...', tags: ['History'], date: 'Mar 20', author: 'Alex', authorInitial: 'A', color: '#f472b6' },
];

const SORT_OPTIONS = ['Newest', 'Oldest', 'A–Z'];
const FILTER_TAGS = ['All', 'Physics', 'Biology', 'Math', 'History'];

const NotesPage: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [search, setSearch] = useState('');

  const filtered = ALL_NOTES
    .filter(n => filter === 'All' || n.tags.includes(filter))
    .filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'A–Z') return a.title.localeCompare(b.title);
      if (sort === 'Oldest') return a.id.localeCompare(b.id);
      return b.id.localeCompare(a.id);
    });

  return (
    <div className={styles.page}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Filter notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="notes-search"
          />
        </div>
        <select
          className={styles.sortSelect}
          value={sort}
          onChange={e => setSort(e.target.value)}
          id="notes-sort"
        >
          {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
        <button className="btn-accent" id="upload-note-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload
        </button>
      </div>

      {/* Filter pills */}
      <div className={styles.filterRow}>
        {FILTER_TAGS.map(tag => (
          <button
            key={tag}
            className={`pill-btn ${filter === tag ? 'active' : ''}`}
            onClick={() => setFilter(tag)}
            id={`filter-${tag.toLowerCase()}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Notes Grid */}
      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map(note => <NoteCard key={note.id} note={note} />)}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <UploadDropzone />
        </div>
      )}
    </div>
  );
};

export default NotesPage;
