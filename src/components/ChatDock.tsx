import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/uiCopy';

export default function ChatDock() {
  const [text, setText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { language, setCapturedImage } = useApp();
  const navigate = useNavigate();

  const handleGallery = () => {
    fileRef.current?.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedImage(file);
      navigate('/result');
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-dock">
      <div className="chat-dock-inner">
        <button className="chat-dock-btn" onClick={handleGallery} aria-label="Gallery">
          <ImageIcon size={20} />
        </button>
        <input
          className="chat-input"
          placeholder={t('chatPlaceholder', language)}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={`chat-dock-btn ${text.trim() ? 'send-active' : ''}`}
          onClick={handleSend}
          aria-label="Send"
        >
          <Send size={18} />
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="camera-hidden-input"
        onChange={handleFile}
      />
    </div>
  );
}
