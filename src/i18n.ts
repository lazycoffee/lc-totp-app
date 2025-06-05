import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './i18n/en.json';
import zhTranslation from './i18n/zh.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n; 