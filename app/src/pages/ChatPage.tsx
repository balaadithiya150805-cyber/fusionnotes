import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatPage.module.css';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  time: string;
  unread?: number;
  avatar: string;
  memberCount?: number;
  onlineCount?: number;
}

const CONVERSATIONS: Conversation[] = [
  { id: 'c1', title: 'Study Group — Physics', preview: 'Can someone explain KCL again?', time: '2m', unread: 3, avatar: 'S', memberCount: 4, onlineCount: 3 },
  { id: 'c2', title: 'Emma Wilson', preview: 'I uploaded the biology notes!', time: '14m', avatar: 'E', memberCount: 2, onlineCount: 1 },
  { id: 'c3', title: 'Study Group — Math', preview: 'Integration test on Friday', time: '1h', avatar: 'S', memberCount: 5, onlineCount: 2 },
  { id: 'c4', title: 'Jason Park', preview: 'Did you finish the WW2 summary?', time: '3h', avatar: 'J', memberCount: 2, onlineCount: 0 },
  { id: 'c5', title: 'Sarah Chen', preview: 'Check out my flashcard deck', time: '5h', avatar: 'S', memberCount: 2, onlineCount: 1 },
];

const AI_REPLIES = [
  'Great question! Let me pull the relevant section from our shared notes.',
  'I think the synthesized guide covers this — check the master notes for that subject.',
  'Let me look that up. In the meantime, did you check the uploaded notes?',
  "Good point! I'll add that to the notes summary when I get a chance.",
];

interface ChatPageProps {
  allMessages: Record<string, Message[]>;
  setAllMessages: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
}

const ChatPage: React.FC<ChatPageProps> = ({ allMessages, setAllMessages }) => {
  const [activeConv, setActiveConv] = useState('c1');
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const messages = allMessages[activeConv] ?? [];
  const activeConvData = CONVERSATIONS.find(c => c.id === activeConv)!;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, activeConv]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, time: now };
    setAllMessages(prev => ({
      ...prev,
      [activeConv]: [...(prev[activeConv] ?? []), userMsg],
    }));
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)];
      setAllMessages(prev => ({
        ...prev,
        [activeConv]: [...(prev[activeConv] ?? []), {
          id: (Date.now() + 1).toString(), role: 'ai', text: reply, time: now,
        }],
      }));
      setTyping(false);
    }, 1500 + Math.random() * 800);
  };

  return (
    <div className={styles.layout}>
      {/* Conversation List */}
      <div className={styles.convList}>
        <div className={styles.convHeader}>
          <span className={styles.convTitle}>Messages</span>
          <button className="icon-btn" id="new-chat-btn" title="New chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <div className={styles.convItems}>
          {CONVERSATIONS.map(conv => (
            <button
              key={conv.id}
              className={`${styles.convItem} ${activeConv === conv.id ? styles.convActive : ''}`}
              onClick={() => setActiveConv(conv.id)}
              id={`conv-${conv.id}`}
            >
              <div className={styles.convAvatar}>{conv.avatar}</div>
              <div className={styles.convInfo}>
                <div className={styles.convName}>{conv.title}</div>
                <div className={styles.convPreview}>{conv.preview}</div>
              </div>
              <div className={styles.convRight}>
                <span className={styles.convTime}>{conv.time}</span>
                {conv.unread && <span className={styles.badge}>{conv.unread}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <div className={styles.headerAvatar}>{activeConvData.avatar}</div>
          <div>
            <div className={styles.headerName}>{activeConvData.title}</div>
            <div className={styles.headerSub}>
              {activeConvData.memberCount && activeConvData.memberCount > 2
                ? `${activeConvData.memberCount} members · `
                : ''}
              {activeConvData.onlineCount != null && activeConvData.onlineCount > 0
                ? <span style={{ color: 'var(--success)' }}>{activeConvData.onlineCount} online</span>
                : <span style={{ color: 'var(--text-muted)' }}>Away</span>}
            </div>
          </div>
        </div>

        <div className={styles.messages}>
          {messages.map(msg => (
            <div key={msg.id} className={`${styles.msgRow} ${msg.role === 'user' ? styles.msgUser : styles.msgAI}`}>
              {msg.role === 'ai' && <div className={styles.msgAvatar}>{activeConvData.avatar}</div>}
              <div className={styles.bubble}>
                <p className={styles.bubbleText}>{msg.text}</p>
                <span className={styles.bubbleTime}>{msg.time}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className={`${styles.msgRow} ${styles.msgAI}`}>
              <div className={styles.msgAvatar}>{activeConvData.avatar}</div>
              <div className={`${styles.bubble} ${styles.typingBubble}`}>
                <span className={styles.dot} /><span className={styles.dot} /><span className={styles.dot} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className={styles.inputRow}>
          <button className="icon-btn" title="Attach file" id="attach-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
          <input
            id="chat-input"
            className={styles.chatInput}
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          />
          <button className={`btn-accent ${styles.sendBtn}`} onClick={send} id="send-btn" disabled={!input.trim()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
