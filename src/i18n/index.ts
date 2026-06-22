import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './locales/en';
import { sq } from './locales/sq';

export const SUPPORTED_LANGUAGES = ['en', 'sq'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function getDeviceLanguage(): AppLanguage {
  const deviceLocales = Localization.getLocales();
  const primary = deviceLocales[0]?.languageCode;
  return primary === 'sq' ? 'sq' : 'en';
}

if (!i18n.isInitialized) {
  // eslint-disable-next-line import/no-named-as-default-member
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      sq: { translation: sq },
    },
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });
}

export default i18n;
