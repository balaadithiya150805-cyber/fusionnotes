import React, { useState, useRef } from 'react';
import styles from './UploadDropzone.module.css';

interface UploadDropzoneProps {
  onUpload?: (files: File[]) => void;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onUpload }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onUpload?.(files);
  };

  return (
    <div
      className={`${styles.zone} ${dragging ? styles.dragging : ''}`}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload notes"
      id="upload-dropzone"
      onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.txt,.md"
        className={styles.hiddenInput}
        onChange={e => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onUpload?.(files);
        }}
      />
      <div className={styles.icon}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <p className={styles.primary}>Drop notes here or <span className={styles.link}>browse files</span></p>
      <p className={styles.sub}>Supports handwritten scans, PDFs, images, and markdown</p>
    </div>
  );
};

export default UploadDropzone;
