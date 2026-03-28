import React, { useState } from 'react';
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

type Tab = 'dashboard' | 'notes' | 'flashcard' | 'chat';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const handleSearch = (q: string) => setSearchQuery(q);
  const handleBackFromSearch = () => setSearchQuery(null);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as Tab);
    setSearchQuery(null);
  };

  const mainContent = searchQuery ? (
    <SearchResultsView query={searchQuery} onBack={handleBackFromSearch} />
  ) : activeTab === 'dashboard' ? (
    <DashboardPage />
  ) : activeTab === 'notes' ? (
    <NotesPage />
  ) : activeTab === 'flashcard' ? (
    <FlashcardsPage />
  ) : (
    <ChatPage />
  );

  const sideContent = searchQuery ? null
    : activeTab === 'dashboard' ? <DashboardSide />
    : activeTab === 'notes' ? <NotesSide />
    : activeTab === 'flashcard' ? <FlashcardSide />
    : <ChatSide />;

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        <AuthPage onLogin={() => setIsAuthenticated(true)} />
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
            <div key={searchQuery ? 'search' : activeTab} className="animate-hypr" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className={styles.mainInner}>{mainContent}</div>
            </div>
          }
          side={
            <div key={activeTab} className="animate-hypr" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
