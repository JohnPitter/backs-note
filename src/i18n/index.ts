import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';

export const languages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
] as const;

export type LanguageCode = typeof languages[number]['code'];

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en', 'es'],

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'backs-note-language',
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
