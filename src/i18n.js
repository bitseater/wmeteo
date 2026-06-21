import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'

const supportedLanguages = ['es', 'en']

const normalizeLanguage = (language) => {
  const lang = language?.split('-')[0]
  return supportedLanguages.includes(lang) ? lang : null
}

const getDefaultLanguage = () => {
  const savedLanguage = normalizeLanguage(localStorage.getItem('wmeteo-lang'))
  if (savedLanguage) return savedLanguage

  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]

  return browserLanguages.map(normalizeLanguage).find(Boolean) || 'es'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    lng: getDefaultLanguage(),
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
