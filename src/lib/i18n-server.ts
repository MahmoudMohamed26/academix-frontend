// app/i18n/server.ts (for server components)
import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'

import translationEN from '@/lib/locales/en/translation.json'
import translationAR from '@/lib/locales/ar/translation.json'

export async function useTranslation(lng: string, ns: string = 'translation') {
  const i18nextInstance = createInstance()
  
  await i18nextInstance
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: translationEN },
        ar: { translation: translationAR },
      },
      lng,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    })

  return {
    t: i18nextInstance.getFixedT(lng, ns),
    i18n: i18nextInstance,
  }
}