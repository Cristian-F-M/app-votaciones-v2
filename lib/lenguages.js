import es from '../locales/es.json'
import en from '../locales/en.json'

export const LANGUAGES = {
  SPANISH: 'es',
  ENGLISH: 'en',
}

export const getI18n = lang => {
  if (lang === LANGUAGES.SPANISH) return es
  if (lang === LANGUAGES.ENGLISH) return en
  return en
}
