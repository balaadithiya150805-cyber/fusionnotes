import React from 'react';
import styles from './AuthPage.module.css';
import AnimatedBackground from '../components/AnimatedBackground';
import { useTheme } from '../context/ThemeContext';
import { LogIn, User, Mail } from 'lucide-react';

export const AuthPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const { theme } = useTheme();

  return (
    <div className={styles.authContainer}>
      <AnimatedBackground />
      <div className={styles.authPanel}>
        <div className={styles.logoWrap}>
          <img 
            src={theme === 'dark' ? '/darklogo.png' : '/lightlogo.png'} 
            alt="FusionNotes" 
            className={styles.logo} 
          />
        </div>
        
        <div className={styles.authCore}>
          <h1 className={styles.title}>Welcome back.</h1>
          <p className={styles.subtitle}>Log in to access your intelligent workspace.</p>
          
          <div className={styles.providers}>
            <button className={`${styles.btnProvider} pill-btn`} onClick={onLogin}>
              <User size={20} />
              Continue with GitHub
            </button>
            <button className={`${styles.btnProvider} pill-btn`} onClick={onLogin}>
              <Mail size={20} />
              Continue with Email
            </button>
          </div>

          <div className={styles.divider}>
            <span>Or</span>
          </div>

          <form className={styles.loginForm} onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className={styles.inputGroup}>
              <label>Username</label>
              <input type="text" placeholder="alex.student" className={styles.inputField} />
            </div>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input type="password" placeholder="••••••••" className={styles.inputField} />
            </div>
            <button className={`pill-btn btn-accent ${styles.loginBtn}`} type="submit">
              <LogIn size={18} />
              Sign in securely
            </button>
          </form>
          
          <p className={styles.footerText}>
            Don't have an account? <a href="#">Request access</a>
          </p>
        </div>
      </div>
    </div>
  );
};
