import React, { useState, useEffect, useCallback } from 'react';
import type { Note } from './types/note';
import { ThemeProvider } from './context/ThemeContext';
import AnimatedBackground from './components/AnimatedBackground';
import TopBar from './components/layout/TopBar';
import PageLayout from './components/layout/PageLayout';
import { DashboardSide, FlashcardSide, ChatSide, NotesSide } from './components/layout/SidePanels';
import DashboardPage from './pages/DashboardPage';
import NotesPage from './pages/NotesPage';
import FlashcardsPage from './pages/FlashcardsPage';
import ChatPage from './pages/ChatPage';
import SearchResultsView from './pages/SearchResultsView';
import { AuthPage } from './pages/AuthPage';
import styles from './App.module.css';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const INITIAL_CHAT: Record<string, Message[]> = {
  c1: [
    { id: 'm1', role: 'ai',   text: "Hey! I uploaded the circuit theory notes. Let me know if you need anything explained.", time: '9:30 AM' },
    { id: 'm2', role: 'user', text: "Great, thanks Emma! Can you clarify KCL for node analysis?", time: '9:32 AM' },
    { id: 'm3', role: 'ai',   text: "Sure! KCL says the sum of currents entering any node = sum of currents leaving. So if you label branch currents i₁, i₂, i₃, you set up equations accordingly.", time: '9:33 AM' },
  ],
  c2: [{ id: 'm1', role: 'ai', text: "Hey! I just uploaded all my biology notes for Chapter 6. Check them out!", time: '11:00 AM' }],
  c3: [{ id: 'm1', role: 'ai', text: "Reminder: Integration test this Friday. Make sure you know substitution and parts.", time: '8:00 AM' }],
  c4: [{ id: 'm1', role: 'ai', text: "Did you finish writing up the WW2 summary for the group?", time: '2:00 PM' }],
  c5: [{ id: 'm1', role: 'ai', text: "I made a new flashcard deck based on the synthesized notes. It covers all 4 subjects!", time: 'Yesterday' }],
};

type Tab = 'dashboard' | 'notes' | 'flashcard' | 'chat';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [noteFilter, setNoteFilter] = useState('All Subjects');
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(INITIAL_CHAT);
  
  // Lifted Notes State
  const [notes, setNotes] = useState<Note[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'info' | 'error' | 'success'; text: string } | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      const headers: Record<string, string> = jwtToken ? { 'Authorization': `Bearer ${jwtToken}` } : {};
      const res = await fetch(`/api/notes`, { headers });
      if (res.ok) {
        const rawData = await res.json();
        const mappedNotes: Note[] = rawData.map((dbNote: any) => ({
          id: dbNote.id,
          title: dbNote.group_id.charAt(0).toUpperCase() + dbNote.group_id.slice(1) + ' Notes',
          excerpt: dbNote.extracted_text.substring(0, 150) + '...',
          fullText: dbNote.extracted_text,
          tags: [dbNote.group_id.charAt(0).toUpperCase() + dbNote.group_id.slice(1)],
          date: dbNote.created_at,
          author: dbNote.user_id,
          authorInitial: dbNote.user_id.charAt(0).toUpperCase(),
          color: '#4ade80'
        }));
        setNotes(mappedNotes);
      }
    } catch (e) {
      console.error('Error fetching notes', e);
    }
  }, [jwtToken]);

  useEffect(() => {
    if (isAuthenticated) fetchNotes();
  }, [isAuthenticated, fetchNotes]);

  const handleUpload = async (files: File[], subject: string = 'General') => {
    if (!files.length) return;
    if (!jwtToken) {
      setStatusMsg({ type: 'error', text: 'Sign in with a real account to upload.' });
      return;
    }
    setIsUploading(true);
    setStatusMsg({ type: 'info', text: `Uploading to ${subject}...` });
    try {
      const headers: HeadersInit = { 'Authorization': `Bearer ${jwtToken}` };
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('group_id', subject.toLowerCase());
        await fetch('/api/upload', { method: 'POST', headers, body: formData });
      }
      await fetchNotes();
      setStatusMsg({ type: 'success', text: `✓ ${files.length} note(s) uploaded!` });
    } catch (e) {
      setStatusMsg({ type: 'error', text: 'Upload failed.' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  const handleSearch = (q: string) => setSearchQuery(q);
  const handleBackFromSearch = () => setSearchQuery(null);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as Tab);
    setSearchQuery(null);
  };

  const navigateToNotesWithFilter = (tag: string) => {
    setNoteFilter(tag);
    setActiveTab('notes');
    setSearchQuery(null);
  };

  const mainContent = searchQuery ? (
    <SearchResultsView query={searchQuery} onBack={handleBackFromSearch} />
  ) : activeTab === 'dashboard' ? (
    <DashboardPage 
      onNavigate={handleTabChange} 
      onTagClick={navigateToNotesWithFilter} 
      notes={notes}
      onUpload={handleUpload}
      isUploading={isUploading}
      onSelectNote={(id) => { setSelectedNoteId(id); setActiveTab('notes'); }}
    />
  ) : activeTab === 'notes' ? (
    <NotesPage 
      noteFilter={noteFilter} 
      setNoteFilter={setNoteFilter} 
      token={jwtToken} 
      notes={notes}
      onUpload={handleUpload}
      isUploading={isUploading}
      statusMsg={statusMsg}
      setStatusMsg={setStatusMsg}
      selectedNoteId={selectedNoteId}
      setSelectedNoteId={setSelectedNoteId}
      fetchNotes={fetchNotes}
    />
  ) : activeTab === 'flashcard' ? (
    <FlashcardsPage />
  ) : (
    <ChatPage allMessages={allMessages} setAllMessages={setAllMessages} />
  );

  const sideContent = searchQuery ? null
    : activeTab === 'dashboard' ? <DashboardSide />
    : activeTab === 'notes' ? <NotesSide />
    : activeTab === 'flashcard' ? <FlashcardSide />
    : <ChatSide />;

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        <AuthPage onLogin={(token) => { setJwtToken(token); setIsAuthenticated(true); }} />
      ) : (
        <div className={styles.appShell}>
          <AnimatedBackground />
          <TopBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onSearch={handleSearch}
          />
          <PageLayout
            main={
              <div key={searchQuery ? 'search' : activeTab} className="animate-hypr" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                <div className={styles.mainInner}>{mainContent}</div>
              </div>
            }
            side={
              <div key={activeTab} className="animate-hypr" style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                <div className={styles.sideInner}>{sideContent}</div>
              </div>
            }
          />
        </div>
      )}
    </ThemeProvider>
  );
};

export default App;
