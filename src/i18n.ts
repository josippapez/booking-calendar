import i18next, { use } from 'i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import { initReactI18next } from 'react-i18next';
import translations from './Translations';

if (!i18next.isInitialized && typeof window !== 'undefined') {
  if (!localStorage.getItem('i18nextLng')) {
    localStorage.setItem('i18nextLng', 'hr');
  }

  use(intervalPlural)
    .use(initReactI18next)
    .init({
      debug: false,
      fallbackLng: 'hr',
      lng: localStorage.getItem('i18nextLng') || 'hr',
      interpolation: {
        escapeValue: false,
      },
      resources: translations,
      defaultNS: 'translation',
    });
}

export default i18next;
