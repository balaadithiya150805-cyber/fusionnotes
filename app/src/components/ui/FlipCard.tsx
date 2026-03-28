import React, { useState } from 'react';
import styles from './FlipCard.module.css';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  id?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ front, back, id }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`${styles.scene}`}
      onClick={() => setFlipped(f => !f)}
      id={id}
      role="button"
      aria-label="Flip card"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setFlipped(f => !f)}
    >
      <div className={`${styles.card} ${flipped ? styles.flipped : ''}`}>
        <div className={`${styles.face} ${styles.front}`}>{front}</div>
        <div className={`${styles.face} ${styles.back}`}>{back}</div>
      </div>
      <p className={styles.hint}>{flipped ? 'Click to see question' : 'Click to reveal answer'}</p>
    </div>
  );
};

export default FlipCard;
