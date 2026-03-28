import React, { useState, useEffect, useCallback } from 'react';
import type { Note } from '../types/note';
import NoteCard from '../components/ui/NoteCard';
import UploadDropzone from '../components/ui/UploadDropzone';
import styles from './NotesPage.module.css';

const SUBJECTS = ['Physics', 'Biology', 'Math', 'History'];
const FILTER_TAGS = ['All Subjects', ...SUBJECTS];

interface NotesPageProps {
  noteFilter: string;
  setNoteFilter: (tag: string) => void;
  token?: string | null;
}

const NotesPage: React.FC<NotesPageProps> = ({ noteFilter, setNoteFilter, token }) => {
  const [search, setSearch] = useState('');
  const [uploadSubject, setUploadSubject] = useState('Biology');
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [masterNote, setMasterNote] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const rawRes = await fetch(`http://localhost:3000/api/notes`, { headers });
      if (rawRes.ok) {
        const rawData = await rawRes.json();
        const mappedNotes: Note[] = rawData.map((dbNote: { id: string, group_id: string, extracted_text: string, created_at: string, user_id: string }) => ({
          id: dbNote.id,
          title: dbNote.group_id.charAt(0).toUpperCase() + dbNote.group_id.slice(1) + ' Notes',
          excerpt: dbNote.extracted_text.substring(0, 150) + '...',
          fullText: dbNote.extracted_text,
          tags: [dbNote.group_id.charAt(0).toUpperCase() + dbNote.group_id.slice(1)],
          date: new Date(dbNote.created_at).toLocaleDateString(),
          author: dbNote.user_id,
          authorInitial: dbNote.user_id.charAt(0).toUpperCase(),
          color: '#4ade80'
        }));
        setNotes(mappedNotes);
      }
      
      const queryFilter = noteFilter === 'All Subjects' ? 'All' : noteFilter;
      
      if (queryFilter !== 'All') {
         const masterRes = await fetch(`http://localhost:3000/api/synthesized/${queryFilter.toLowerCase()}`, { headers });
         if (masterRes.ok) {
           const masterData = await masterRes.json();
           setMasterNote(masterData.master_text);
         } else {
           setMasterNote(null);
         }
      } else {
         setMasterNote(null);
      }
    } catch (e) {
      console.warn("Backend unavailable, loading visually rich mock data for UI testing.", e);
      setNotes([
        { id: '1', title: 'Biology Notes', excerpt: 'Mitosis is a part of the cell cycle where replicated chromosomes are separated into two new nuclei...', tags: ['Biology'], date: 'Today', author: 'Demo', authorInitial: 'D', fullText: 'Mitosis is a strict sequence of events.' },
        { id: '2', title: 'Circuit Theory', excerpt: 'Kirchhoffs voltage law states that the sum of voltages around any closed loop is zero...', tags: ['Physics'], date: 'Yesterday', author: 'Demo', authorInitial: 'D', fullText: 'KVL detailed analysis attached here.' },
        { id: '3', title: 'Calculus III', excerpt: 'Using double integrals to compute the volume under a three dimensional topography...', tags: ['Math'], date: 'Mon', author: 'Demo', authorInitial: 'D', fullText: 'Triple integrals scale up exactly like double integrals.' },
        { id: '4', title: 'World War II', excerpt: 'The European theater saw heavily armored tank divisions sweeping across the low countries...', tags: ['History'], date: 'Mar 15', author: 'Demo', authorInitial: 'D', fullText: 'Operation Barbarossa details.' }
      ]);
    }
  }, [noteFilter, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    
    try {
      const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('group_id', uploadSubject.toLowerCase());

        await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          headers,
          body: formData,
        });
      }
      await fetchData(); 
    } catch (e) {
      console.error("Batch upload failed", e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSynthesize = async () => {
    if (noteFilter === 'All Subjects') {
      alert("Please select a specific Subject Filter (e.g., Biology) before Synthesizing!");
      return;
    }
    
    setIsSynthesizing(true);
    const formData = new FormData();
    formData.append('group_id', noteFilter.toLowerCase());
    
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      await fetch('http://localhost:3000/api/synthesize', {
        method: 'POST',
        headers,
        body: formData,
      });
      await fetchData(); 
    } catch (e) {
      console.error("Synthesize failed", e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const filtered = notes
    .filter(n => noteFilter === 'All Subjects' || n.tags.includes(noteFilter))
    .filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.id.localeCompare(a.id));

  if (selectedNote) {
    return (
      <div className={styles.page} style={{ overflowY: 'auto', paddingBottom: '2rem' }}>
        <button 
          onClick={() => setSelectedNote(null)} 
          style={{ background: 'transparent', border: 'none', color: '#a78bfa', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Notes
        </button>
        <div style={{ background: '#1e1e2e', padding: '2rem', borderRadius: '12px', border: '1px solid #3b3b54' }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#fff' }}>{selectedNote.title}</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
            {selectedNote.tags.map((t: string) => (
              <span key={t} style={{ background: '#3b3b54', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', color: '#e2e8f0' }}>{t}</span>
            ))}
            <span style={{ color: '#94a3b8', fontSize: '12px', alignSelf: 'center', marginLeft: 'auto' }}>Extracted via OCR on {selectedNote.date}</span>
          </div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#e2e8f0', fontSize: '15px' }}>
            {selectedNote.fullText}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} style={{ overflowY: 'auto', paddingBottom: '2rem' }}>
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
          style={{marginLeft: 'auto'}}
          value={uploadSubject}
          onChange={e => setUploadSubject(e.target.value)}
          title="Select Subject for Upload"
        >
          {SUBJECTS.map(o => <option key={o} value={o}>{o} Uploads</option>)}
        </select>

        <button className="btn-accent" onClick={() => document.getElementById('upload-dropzone')?.click()} disabled={isUploading}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>

        <button className="btn-accent" onClick={handleSynthesize} disabled={isSynthesizing || noteFilter === 'All Subjects'} style={{ opacity: noteFilter === 'All Subjects' ? 0.5 : 1, background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' }}>
           {isSynthesizing ? 'Synthesizing...' : '✧ Synthesize Guide'}
        </button>
      </div>

      <div className={styles.filterChips || styles.filterRow}>
        {FILTER_TAGS.map(f => (
          <button
            key={f}
            className={`pill-btn ${noteFilter === f || (f === 'All Subjects' && noteFilter === 'All') ? 'btn-accent active' : ''}`}
            onClick={() => setNoteFilter(f)}
            id={`filter-${f.toLowerCase().replace(' ', '-')}`}
          >
            {f}
          </button>
        ))}
      </div>

      {masterNote && noteFilter !== 'All Subjects' && (
        <div style={{ background: '#1e1e2e', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #3b3b54' }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Master {noteFilter} Study Guide
          </h2>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#e2e8f0', fontSize: '15px' }}>
            {masterNote}
          </div>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map(note => (
            <div key={note.id} onClick={() => setSelectedNote(note)}>
              <NoteCard 
                note={note} 
                onTagClick={setNoteFilter}
              />
            </div>
          ))}
          <div style={{opacity: isUploading ? 0.5 : 1}}> 
            <UploadDropzone onUpload={handleUpload} />
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <UploadDropzone onUpload={handleUpload} />
          {isUploading && <p style={{marginTop: '1rem', color: '#8b5cf6'}}>Uploading and running AI OCR...</p>}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
