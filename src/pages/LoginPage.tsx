import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/uiCopy';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (el: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function LoginPage() {
  const { language, login, isLoggedIn } = useApp();
  const navigate = useNavigate();
  const btnRef = useRef<HTMLDivElement>(null);

  const handleCredential = useCallback(async (response: any) => {
    try {
      await login(response.credential);
      navigate('/mypage');
    } catch {
      alert(t('error', language));
    }
  }, [login, navigate, language]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/mypage');
      return;
    }

    const render = () => {
      if (!window.google || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 300,
      });
    };

    if (window.google) {
      render();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          render();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, navigate, handleCredential]);

  return (
    <div className="page-container login-page">
      <div className="login-header">
        <button className="result-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="login-content">
        <div className="home-logo">NGraph</div>
        <p className="login-subtitle">{t('loginSubtitle', language)}</p>

        <div className="login-google-btn" ref={btnRef} />

        <button className="login-skip" onClick={() => navigate('/')}>
          {t('continueAsGuest', language)}
        </button>
      </div>
    </div>
  );
}
