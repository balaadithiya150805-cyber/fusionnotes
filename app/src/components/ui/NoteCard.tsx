import React from 'react';
import type { Note } from '../../types/note';
import styles from './NoteCard.module.css';

interface NoteCardProps {
  note: Note;
  onClick?: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick }) => (
  <article
    className={styles.card}
    onClick={() => onClick?.(note.id)}
    tabIndex={0}
    role="button"
    aria-label={`Open note: ${note.title}`}
    onKeyDown={e => e.key === 'Enter' && onClick?.(note.id)}
    id={`note-card-${note.id}`}
  >
    <div className={styles.colorBar} style={{ background: note.color ?? 'var(--accent)' }} />
    <div className={styles.content}>
      <h3 className={styles.title}>{note.title}</h3>
      <p className={styles.excerpt}>{note.excerpt}</p>
      <div className={styles.footer}>
        <div className={styles.tags}>
          {note.tags.map(tag => (
            <span key={tag} className="tag-chip">{tag}</span>
          ))}
        </div>
        <div className={styles.meta}>
          <span className={styles.authorDot}>{note.authorInitial}</span>
          <span className={styles.date}>{note.date}</span>
        </div>
      </div>
    </div>
  </article>
);

export default NoteCard;
