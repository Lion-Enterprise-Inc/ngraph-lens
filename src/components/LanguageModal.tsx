import { Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, t, type LangCode } from '../i18n/uiCopy';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LanguageModal({ open, onClose }: Props) {
  const { language, setLanguage } = useApp();

  if (!open) return null;

  const handleSelect = (code: LangCode) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="lang-modal-backdrop" onClick={onClose}>
      <div className="lang-modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="lang-modal-header">
          <h3>{t('selectLanguage', language)}</h3>
          <button className="lang-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="lang-modal-list">
          {LANGUAGES.map(lang => (
            <div
              key={lang.code}
              className={`lang-modal-item ${language === lang.code ? 'selected' : ''}`}
              onClick={() => handleSelect(lang.code)}
            >
              <span className="lang-badge">{lang.badge}</span>
              <span className="lang-modal-name">{lang.nativeName}</span>
              {language === lang.code && <Check className="lang-modal-check" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
