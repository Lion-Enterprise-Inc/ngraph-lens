import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/uiCopy';
import { getLog, type LocalFoodLog } from '../services/localLogs';
import NFGCard from '../components/NFGCard';

export default function LogDetailPage() {
  const { uid } = useParams<{ uid: string }>();
  const { language } = useApp();
  const navigate = useNavigate();
  const [log, setLog] = useState<LocalFoodLog | null>(null);

  useEffect(() => {
    if (uid) {
      const found = getLog(uid);
      if (!found) {
        navigate('/mypage');
        return;
      }
      setLog(found);
    }
  }, [uid, navigate]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="page-container log-detail-page">
      <div className="result-header">
        <div className="result-header-left">
          <button className="result-back-btn" onClick={() => navigate('/mypage')}>
            <ArrowLeft size={20} />
          </button>
          <span className="result-logo">NGraph</span>
        </div>
      </div>

      <div className="result-body">
        {log && (
          <>
            <img src={log.thumbnail} alt="" className="result-image-thumb" />

            {log.location_label && (
              <div className="result-gps-info">
                <span>📍</span>
                <span>{log.location_label}</span>
              </div>
            )}

            {log.memo && <div className="log-detail-memo">{log.memo}</div>}

            <div className="log-detail-date">{formatDate(log.created_at)}</div>

            {log.items.map((item: any, i: number) => (
              <NFGCard key={item.menu_uid || `${item.name_jp}-${i}`} item={item} index={i} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
