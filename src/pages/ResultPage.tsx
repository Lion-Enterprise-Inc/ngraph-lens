import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/uiCopy';
import { quickExplain, type QuickExplainItem } from '../services/api';
import NFGCard from '../components/NFGCard';
import LanguageSelect from '../components/LanguageSelect';
import LanguageModal from '../components/LanguageModal';
import ChatDock from '../components/ChatDock';
import SaveButton from '../components/SaveButton';

export default function ResultPage() {
  const { language, capturedImage, gps } = useApp();
  const navigate = useNavigate();

  const [items, setItems] = useState<QuickExplainItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const imageUrl = useMemo(() => {
    if (!capturedImage) return null;
    return URL.createObjectURL(capturedImage);
  }, [capturedImage]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!capturedImage) {
      navigate('/');
      return;
    }
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await quickExplain(capturedImage, language);
        if (!cancelled) {
          setItems(res.result.items);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [capturedImage, language, navigate]);

  const handleRetry = () => {
    if (!capturedImage) return;
    setLoading(true);
    setError(false);
    quickExplain(capturedImage, language)
      .then(res => {
        setItems(res.result.items);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  return (
    <div className="page-container result-page">
      <div className="result-header">
        <div className="result-header-left">
          <button className="result-back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
          </button>
          <span className="result-logo">NGraph</span>
        </div>
        <LanguageSelect onClick={() => setLangOpen(true)} />
      </div>

      <div className="result-body">
        {imageUrl && (
          <img src={imageUrl} alt="" className="result-image-thumb" />
        )}

        {gps.label && (
          <div className="result-gps-info">
            <span>📍</span>
            <span>{t('nearLocation', language)} {gps.label}</span>
          </div>
        )}

        {loading && (
          <div className="result-loading">
            <div className="result-spinner" />
            <span>{t('analyzing', language)}</span>
          </div>
        )}

        {error && !loading && (
          <div className="result-error">
            <p>{t('error', language)}</p>
            <button onClick={handleRetry}>{t('retry', language)}</button>
          </div>
        )}

        {!loading && !error && items.length > 0 && capturedImage && (
          <SaveButton items={items} image={capturedImage} />
        )}

        {!loading && !error && items.map((item, i) => (
          <NFGCard key={item.menu_uid || `${item.name_jp}-${i}`} item={item} index={i} />
        ))}
      </div>

      <ChatDock />
      <LanguageModal open={langOpen} onClose={() => setLangOpen(false)} />
    </div>
  );
}
