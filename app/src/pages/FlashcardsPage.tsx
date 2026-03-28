import React, { useState } from 'react';
import FlipCard from '../components/ui/FlipCard';
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

const DECKS: Deck[] = [
  { id: 'd1', title: 'Circuit Theory', count: 48, due: 12, color: '#8b7fff' },
  { id: 'd2', title: 'Biology — Cell Division', count: 32, due: 8, color: '#4ade80' },
  { id: 'd3', title: 'WWII History', count: 24, due: 3, color: '#facc15' },
  { id: 'd4', title: 'Calculus Fundamentals', count: 60, due: 15, color: '#f87171' },
];

const CARDS: Card[] = [
  { id: 'c1', question: 'What does Kirchhoff\'s Current Law (KCL) state?', answer: 'The total current entering a junction equals the total current leaving. Σ Iᵢₙ = Σ Iₒᵤₜ' },
  { id: 'c2', question: 'What is the formula for Ohm\'s Law?', answer: 'V = IR — Voltage equals Current multiplied by Resistance.' },
  { id: 'c3', question: 'What are the four phases of Mitosis?', answer: 'Prophase → Metaphase → Anaphase → Telophase (PMAT)' },
  { id: 'c4', question: 'What is the Power Rule for integration?', answer: '∫xⁿ dx = xⁿ⁺¹ / (n+1) + C, valid for n ≠ -1' },
];

const FlashcardsPage: React.FC = () => {
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [cardIdx, setCardIdx] = useState(0);

  if (!selectedDeck) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className="text-heading" style={{ fontSize: 18 }}>Your Decks</h2>
          <button className="btn-accent" id="create-deck-btn">Create Deck</button>
        </div>
        <div className={styles.decksGrid}>
          {DECKS.map(deck => (
            <button
              key={deck.id}
              className={styles.deckCard}
              onClick={() => { setSelectedDeck(deck.id); setCardIdx(0); }}
              id={`deck-${deck.id}`}
              style={{ borderTopColor: deck.color }}
            >
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
            </button>
          ))}
        </div>
      </div>
    );
  }

  const deck = DECKS.find(d => d.id === selectedDeck)!;
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
