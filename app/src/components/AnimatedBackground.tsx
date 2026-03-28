import React from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './AnimatedBackground.module.css';

const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className={`${styles.bg} ${styles[theme]}`} aria-hidden="true" />
  );
};

export default AnimatedBackground;
