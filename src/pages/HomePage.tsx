import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/uiCopy';
import LanguageSelect from '../components/LanguageSelect';
import LanguageModal from '../components/LanguageModal';
import ChatDock from '../components/ChatDock';

export default function HomePage() {
  const [langOpen, setLangOpen] = useState(false);
  const { language } = useApp();
  const navigate = useNavigate();

  return (
    <div className="page-container home-page">
      <div className="home-top-bar">
        <div className="home-logo">NGraph</div>
        <button className="mypage-link-btn" onClick={() => navigate('/mypage')}>
          <BookOpen size={20} />
        </button>
      </div>

      <div className="home-main">
        <div className="home-heading">
          <h1>{t('snapTitle', language)}</h1>
          <p>{t('snapSub', language)}</p>
        </div>

        <button className="camera-btn-main" onClick={() => navigate('/camera')}>
          <Camera />
        </button>

        <LanguageSelect onClick={() => setLangOpen(true)} />
      </div>

      <ChatDock />
      <LanguageModal open={langOpen} onClose={() => setLangOpen(false)} />
    </div>
  );
}
