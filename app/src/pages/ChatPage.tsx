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
}

const CONVERSATIONS: Conversation[] = [
  { id: 'c1', title: 'Study Group — Physics', preview: 'Can someone explain KCL again?', time: '2m', unread: 3 },
  { id: 'c2', title: 'Emma Wilson', preview: 'I uploaded the biology notes!', time: '14m' },
  { id: 'c3', title: 'Study Group — Math', preview: 'Integration test on Friday', time: '1h' },
  { id: 'c4', title: 'Jason Park', preview: 'Did you finish the WW2 summary?', time: '3h' },
  { id: 'c5', title: 'Sarah Chen', preview: 'Check out my flashcard deck', time: '5h' },
];

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', role: 'ai',   text: 'Hey! I uploaded the circuit theory notes. Let me know if you need anything explained.', time: '9:30 AM' },
  { id: 'm2', role: 'user', text: 'Great, thanks Emma! Can you clarify KCL for node analysis?', time: '9:32 AM' },
  { id: 'm3', role: 'ai',   text: 'Sure! KCL says the sum of currents entering any node = sum of currents leaving. So if you label branch currents i₁, i₂, i₃, you set up equations accordingly.', time: '9:33 AM' },
  { id: 'm4', role: 'user', text: 'Got it. What about when there are voltage sources in the loop?', time: '9:35 AM' },
];

const ChatPage: React.FC = () => {
  const [activeConv, setActiveConv] = useState('c1');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, time: 'Now' };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { id: (Date.now() + 1).toString(), role: 'ai', text: 'Great question! Let me pull the relevant section from our shared notes and get back to you.', time: 'Now' }]);
      setTyping(false);
    }, 1800);
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
        {CONVERSATIONS.map(conv => (
          <button
            key={conv.id}
            className={`${styles.convItem} ${activeConv === conv.id ? styles.convActive : ''}`}
            onClick={() => setActiveConv(conv.id)}
            id={`conv-${conv.id}`}
          >
            <div className={styles.convAvatar}>{conv.title[0]}</div>
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

      {/* Chat Window */}
      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <div className={styles.headerAvatar}>S</div>
          <div>
            <div className={styles.headerName}>Study Group — Physics</div>
            <div className={styles.headerSub}>4 members · <span style={{ color: 'var(--success)' }}>3 online</span></div>
          </div>
        </div>

        <div className={styles.messages}>
          {messages.map(msg => (
            <div key={msg.id} className={`${styles.msgRow} ${msg.role === 'user' ? styles.msgUser : styles.msgAI}`}>
              {msg.role === 'ai' && <div className={styles.msgAvatar}>E</div>}
              <div className={styles.bubble}>
                <p className={styles.bubbleText}>{msg.text}</p>
                <span className={styles.bubbleTime}>{msg.time}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className={`${styles.msgRow} ${styles.msgAI}`}>
              <div className={styles.msgAvatar}>E</div>
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
