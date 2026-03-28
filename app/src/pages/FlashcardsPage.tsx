import React, { useState } from 'react';
import FlipCard from '../components/ui/FlipCard';
import { Trash2 } from 'lucide-react';
import styles from './FlashcardsPage.module.css';

interface Deck {
  id: string;
  title: string;
  count: number;
  due: number;
  color: string;
}

interface Card {
  id: string;
  question: string;
  answer: string;
}

const DECKS: Deck[] = [];

const CARDS: Card[] = [
  { id: 'c1', question: 'What does Kirchhoff\'s Current Law (KCL) state?', answer: 'The total current entering a junction equals the total current leaving. Σ Iᵢₙ = Σ Iₒᵤₜ' },
  { id: 'c2', question: 'What is the formula for Ohm\'s Law?', answer: 'V = IR — Voltage equals Current multiplied by Resistance.' },
  { id: 'c3', question: 'What are the four phases of Mitosis?', answer: 'Prophase → Metaphase → Anaphase → Telophase (PMAT)' },
  { id: 'c4', question: 'What is the Power Rule for integration?', answer: '∫xⁿ dx = xⁿ⁺¹ / (n+1) + C, valid for n ≠ -1' },
];

const FlashcardsPage: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>(DECKS);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [cardIdx, setCardIdx] = useState(0);

  const handleCreateDeck = () => {
    const newDeck: Deck = {
      id: `d${decks.length + 1}`,
      title: 'Synthesized from Notes',
      count: 15,
      due: 15,
      color: '#a78bfa' // Theme accent color
    };
    setDecks([newDeck, ...decks]);
  };

  const handleDeleteDeck = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDecks(decks.filter(d => d.id !== id));
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!selectedDeck) return;
    const handleKey = (e: KeyboardEvent) => {
      // Space to flip
      if (e.code === 'Space') {
        e.preventDefault();
        const flipEl = document.getElementById(`flipcard-${CARDS[cardIdx % CARDS.length].id}`);
        if (flipEl) flipEl.click();
      }
      // Left/Right to navigate
      else if (e.key === 'ArrowRight') {
        if (cardIdx < CARDS.length - 1) setCardIdx(i => i + 1);
      }
      else if (e.key === 'ArrowLeft') {
        if (cardIdx > 0) setCardIdx(i => i - 1);
      }
      // 1, 2, 3 for ratings
      else if (e.key === '1') {
        document.getElementById('rate-hard')?.click();
      } else if (e.key === '2') {
        document.getElementById('rate-ok')?.click();
      } else if (e.key === '3') {
        document.getElementById('rate-easy')?.click();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedDeck, cardIdx]);

  if (!selectedDeck) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className="text-heading" style={{ fontSize: 18 }}>Your Decks</h2>
          <button className="btn-accent" id="create-deck-btn" onClick={handleCreateDeck}>
            Create Deck
          </button>
        </div>
        {decks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <p>You have no decks yet. Extract one from your notes!</p>
          </div>
        )}
        <div className={styles.decksGrid}>
          {decks.map(deck => (
            <div
              key={deck.id}
              className={styles.deckCard}
              onClick={() => { setSelectedDeck(deck.id); setCardIdx(0); }}
              id={`deck-${deck.id}`}
              style={{ borderTopColor: deck.color }}
            >
              <div 
                className={styles.deleteDeckBtn} 
                onClick={(e) => handleDeleteDeck(e, deck.id)}
                title="Delete Deck"
              >
                <Trash2 size={16} />
              </div>
              <span className={styles.deckTitle}>{deck.title}</span>
              <div className={styles.deckMeta}>
                <span className={styles.deckCount}>{deck.count} cards</span>
                <span className={styles.deckDue} style={{ background: deck.color + '30', color: deck.color }}>
                  {deck.due} due
                </span>
              </div>
              <div className={styles.deckProgress}>
                <div className={styles.progressBar} style={{ width: `${((deck.count - deck.due) / deck.count) * 100}%`, background: deck.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const deck = decks.find(d => d.id === selectedDeck)!;
  const card = CARDS[cardIdx % CARDS.length];
  const progress = Math.round((cardIdx / CARDS.length) * 100);

  return (
    <div className={styles.page}>
      <div className={styles.studyHeader}>
        <button className="btn-ghost" onClick={() => setSelectedDeck(null)} id="back-to-decks">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Decks
        </button>
        <span className={styles.deckName}>{deck.title}</span>
        <span className={styles.cardCount}>{cardIdx + 1} / {CARDS.length}</span>
      </div>

      {/* Progress */}
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {/* Card */}
      <div className={styles.cardWrap}>
        <FlipCard
          key={card.id}
          id={`flipcard-${card.id}`}
          front={
            <div className={styles.cardFace}>
              <span className="text-label text-muted">Question</span>
              <p className={styles.cardText}>{card.question}</p>
            </div>
          }
          back={
            <div className={styles.cardFace}>
              <span className="text-label" style={{ color: 'var(--accent)' }}>Answer</span>
              <p className={styles.cardText}>{card.answer}</p>
            </div>
          }
        />
      </div>

      {/* Nav */}
      <div className={styles.cardNav}>
        <button className="btn-ghost" onClick={() => setCardIdx(i => Math.max(0, i - 1))} disabled={cardIdx === 0} id="prev-card">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Previous
        </button>
        <div className={styles.ratingRow}>
          <button className={styles.rateBtn} style={{ '--c': '#f87171' } as React.CSSProperties} id="rate-hard">Hard</button>
          <button className={styles.rateBtn} style={{ '--c': '#facc15' } as React.CSSProperties} id="rate-ok">Okay</button>
          <button className={styles.rateBtn} style={{ '--c': '#4ade80' } as React.CSSProperties} onClick={() => setCardIdx(i => i + 1)} id="rate-easy">Easy</button>
        </div>
        <button className="btn-ghost" onClick={() => setCardIdx(i => i + 1)} disabled={cardIdx >= CARDS.length - 1} id="next-card">
          Next
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
};

export default FlashcardsPage;
