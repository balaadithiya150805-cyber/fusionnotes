import React, { ReactNode } from 'react';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  main: ReactNode;
  side: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ main, side }) => (
  <main className={styles.layout}>
    <div className={`glass ${styles.mainPanel}`}>
      {main}
    </div>
    <div className={`glass ${styles.sidePanel}`}>
      {side}
    </div>
  </main>
);

export default PageLayout;
