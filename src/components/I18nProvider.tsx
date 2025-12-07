'use client';

import { ReactNode, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '@/lib/locales/en/translation.json';
import arTranslations from '@/lib/locales/ar/translation.json';

export default function I18nProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const i18nInstance = useMemo(() => {
    const instance = i18n.createInstance();
    
    instance
      .use(initReactI18next)
      .init({
        resources: {
          en: { translation: enTranslations },
          ar: { translation: arTranslations },
        },
        lng: locale,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });

    return instance;
  }, [locale]);
  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}