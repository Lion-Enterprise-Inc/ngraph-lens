import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/uiCopy';
import { listLogs, deleteLog, type LocalFoodLog } from '../services/localLogs';

export default function MyPage() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LocalFoodLog[]>(() => listLogs());

  const handleDelete = (uid: string) => {
    deleteLog(uid);
    setLogs(prev => prev.filter(l => l.uid !== uid));
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="page-container mypage">
      <div className="mypage-header">
        <button className="result-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <span className="result-logo">{t('myFoodLog', language)}</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="mypage-body">
        {logs.length === 0 && (
          <div className="mypage-empty">
            <p>{t('noLogs', language)}</p>
            <button className="camera-btn-main small" onClick={() => navigate('/camera')}>
              <Camera size={20} />
            </button>
          </div>
        )}

        {logs.map(log => (
          <div key={log.uid} className="log-card" onClick={() => navigate(`/log/${log.uid}`)}>
            <img src={log.thumbnail} alt="" className="log-card-image" />
            <div className="log-card-info">
              <div className="log-card-title">
                {log.items[0]?.name_jp || log.items[0]?.name_en || 'Food'}
                {log.items.length > 1 && ` +${log.items.length - 1}`}
              </div>
              {log.location_label && (
                <div className="log-card-location">📍 {log.location_label}</div>
              )}
              {log.memo && <div className="log-card-memo">{log.memo}</div>}
              <div className="log-card-date">{formatDate(log.created_at)}</div>
            </div>
            <div className="log-card-actions" onClick={e => e.stopPropagation()}>
              <button className="log-action-btn danger" onClick={() => handleDelete(log.uid)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
