import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type LangCode, detectLanguage } from '../i18n/uiCopy';

interface GpsState {
  lat: number | null;
  lng: number | null;
  label: string | null;
}

interface AppState {
  language: LangCode;
  setLanguage: (l: LangCode) => void;
  capturedImage: File | null;
  setCapturedImage: (f: File | null) => void;
  gps: GpsState;
}

const AppContext = createContext<AppState | null>(null);

const LANG_KEY = 'ngraph-plain-lang';

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LangCode>(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved) return saved as LangCode;
    return detectLanguage();
  });

  const [capturedImage, setCapturedImage] = useState<File | null>(null);

  const [gps, setGps] = useState<GpsState>({ lat: null, lng: null, label: null });

  const setLanguage = (l: LangCode) => {
    setLanguageState(l);
    localStorage.setItem(LANG_KEY, l);
  };

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setGps(prev => ({ ...prev, lat: latitude, lng: longitude }));
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=16&accept-language=en`
          );
          const data = await res.json();
          const addr = data.address;
          const label = addr?.suburb || addr?.neighbourhood || addr?.city || addr?.town || data.display_name?.split(',')[0] || null;
          setGps({ lat: latitude, lng: longitude, label });
        } catch {
          setGps({ lat: latitude, lng: longitude, label: null });
        }
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  return (
    <AppContext.Provider value={{ language, setLanguage, capturedImage, setCapturedImage, gps }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
