import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/uiCopy';
import type { QuickExplainItem } from '../services/api';

interface Props {
  item: QuickExplainItem;
  index: number;
  totalItems?: number;
}

export default function NFGCard({ item, index, totalItems = 1 }: Props) {
  const [expanded, setExpanded] = useState(totalItems === 1);
  const { language } = useApp();

  const isJa = language === 'ja';
  const mainName = isJa ? item.name_jp : (item.description_local || item.name_en || item.name_jp);
  const subName = isJa ? item.name_en : item.name_jp;

  const isVerified = item.source === 'db' || item.verification_rank === 'S' || item.verification_rank === 'A';

  const hasDetails = (item.allergens && item.allergens.length > 0)
    || (item.ingredients && item.ingredients.length > 0)
    || (item.restrictions && item.restrictions.length > 0)
    || item.estimated_calories
    || item.narrative
    || item.confidence;

  return (
    <div className="nfg-card">
      <div className="nfg-card-header" onClick={() => hasDetails && setExpanded(!expanded)}>
        <div className="nfg-card-title-row">
          <span className="nfg-card-number">{index + 1}</span>
          <div className="nfg-card-names">
            <div className="nfg-card-name-main">{mainName}</div>
            {subName && <div className="nfg-card-name-sub">{subName}</div>}
          </div>
          {item.price > 0 && (
            <span className="nfg-card-price">&yen;{item.price.toLocaleString()}</span>
          )}
        </div>
        <div className="nfg-card-meta">
          <span className={`nfg-badge ${isVerified ? 'verified' : 'ai'}`}>
            {isVerified ? `\u2705 ${t('verified', language)}` : t('aiEstimate', language)}
          </span>
        </div>
        {item.description && (
          <div className="nfg-card-desc">{item.description}</div>
        )}
      </div>

      {expanded && hasDetails && (
        <div className="nfg-card-details">
          {item.allergens && item.allergens.length > 0 && (
            <div className="nfg-detail-section">
              <span className="nfg-detail-label">{t('allergens', language)}</span>
              <div className="nfg-chip-list">
                {item.allergens.map(a => (
                  <span key={a} className="nfg-chip allergen">{a}</span>
                ))}
              </div>
            </div>
          )}

          {item.ingredients && item.ingredients.length > 0 && (
            <div className="nfg-detail-section">
              <span className="nfg-detail-label">{t('ingredients', language)}</span>
              <div className="nfg-chip-list">
                {item.ingredients.map(i => (
                  <span key={i} className="nfg-chip">{i}</span>
                ))}
              </div>
            </div>
          )}

          {item.restrictions && item.restrictions.length > 0 && (
            <div className="nfg-detail-section">
              <span className="nfg-detail-label">{t('restrictions', language)}</span>
              <div className="nfg-chip-list">
                {item.restrictions.map(r => (
                  <span key={r} className="nfg-chip">{r}</span>
                ))}
              </div>
            </div>
          )}

          {item.estimated_calories && (
            <div className="nfg-detail-section">
              <span className="nfg-detail-label">{t('calories', language)}</span>
              <span className="nfg-detail-value">{item.estimated_calories}</span>
            </div>
          )}

          {item.narrative && (
            <div className="nfg-detail-section">
              {item.narrative.story && (
                <div className="nfg-detail-story">{item.narrative.story}</div>
              )}
              {item.narrative.texture && (
                <span className="nfg-detail-value">🍽 {item.narrative.texture}</span>
              )}
              {item.narrative.how_to_eat && (
                <span className="nfg-detail-value">📖 {item.narrative.how_to_eat}</span>
              )}
              {item.narrative.pairing && (
                <span className="nfg-detail-value">🍶 {item.narrative.pairing}</span>
              )}
            </div>
          )}

          {item.serving && (
            <div className="nfg-detail-section">
              <span className="nfg-detail-label">{t('serving', language) || 'Serving'}</span>
              <span className="nfg-detail-value">
                {[item.serving.style, item.serving.portion, item.serving.temperature].filter(Boolean).join(' / ')}
              </span>
            </div>
          )}

          {item.taste_values && Object.keys(item.taste_values).length > 0 && (
            <div className="nfg-detail-section">
              <span className="nfg-detail-label">{t('taste', language) || 'Taste'}</span>
              <div className="nfg-chip-list">
                {Object.entries(item.taste_values)
                  .filter(([, v]) => v >= 6)
                  .map(([k, v]) => (
                    <span key={k} className="nfg-chip taste">{k} {v}/10</span>
                  ))}
              </div>
            </div>
          )}

          {item.confidence != null && (
            <div className="nfg-detail-section">
              <span className="nfg-detail-label">{t('confidence', language)}</span>
              <div className="nfg-confidence">
                <div className="nfg-confidence-bar">
                  <div
                    className="nfg-confidence-fill"
                    style={{ width: `${Math.min(Math.round(item.confidence), 100)}%` }}
                  />
                </div>
                <span className="nfg-confidence-text">
                  {Math.min(Math.round(item.confidence), 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
