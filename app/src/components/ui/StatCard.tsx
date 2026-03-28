import React from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  delta?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, delta }) => (
  <div className={styles.card} id={`stat-${label.toLowerCase().replace(/\s/g,'-')}`}>
    <div className={styles.iconWrap} style={{ background: color ?? 'var(--accent-soft)', color: color ? '#fff' : 'var(--accent)' }}>
      {icon}
    </div>
    <div className={styles.info}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
      {delta && <span className={styles.delta}>{delta}</span>}
    </div>
  </div>
);

export default StatCard;
