import { Globe, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../i18n/uiCopy';

interface Props {
  onClick: () => void;
}

export default function LanguageSelect({ onClick }: Props) {
  const { language } = useApp();
  const lang = LANGUAGES.find(l => l.code === language);

  return (
    <button className="lang-select-btn" onClick={onClick}>
      <Globe />
      <span>{lang?.nativeName ?? 'English'}</span>
      <ChevronDown />
    </button>
  );
}
