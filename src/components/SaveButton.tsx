import { useState } from 'react';
import { Bookmark, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/uiCopy';
import { addLog } from '../services/localLogs';
import type { QuickExplainItem } from '../services/api';

interface Props {
  items: QuickExplainItem[];
  image: File;
}

export default function SaveButton({ items, image }: Props) {
  const { language, gps } = useApp();
  const [memo, setMemo] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="save-done">
        <Check size={16} />
        <span>{t('saved', language)}</span>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await addLog({
        image,
        items,
        location_lat: gps.lat,
        location_lng: gps.lng,
        location_label: gps.label,
        memo: memo || undefined,
      });
      setSaved(true);
    } catch {
      alert(t('error', language));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="save-section">
      <input
        className="save-memo-input"
        placeholder={t('memoPlaceholder', language)}
        value={memo}
        onChange={e => setMemo(e.target.value)}
      />
      <button className="save-btn" onClick={handleSave} disabled={saving}>
        <Bookmark size={16} />
        <span>{saving ? '...' : t('save', language)}</span>
      </button>
    </div>
  );
}
