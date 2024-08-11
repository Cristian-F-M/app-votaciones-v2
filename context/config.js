import { createContext, useState, useContext, useEffect } from 'react'
import { doFetch, getItemStorage, METHODS, setItemStorage } from '../lib/api'
import { useLocales } from 'expo-localization'
import { getI18n } from '../lib/lenguages'

const ConfigContext = createContext()

export const ConfigProvider = ({ children }) => {
  const [i18n, setI18n] = useState(null)
  const [config, setConfig] = useState(null)
  const locales = useLocales()

  async function getI18() {
    const languageCodeAsyncStorage = await getItemStorage({
      name: 'languageCode',
    })

    const languageCode =
      languageCodeAsyncStorage.value || locales[0].languageCode
    setI18n(getI18n(languageCode))
  }

  async function setI18(languageCode) {
    setI18n(getI18n(languageCode))
    await setItemStorage({
      name: 'languageCode',
      value: languageCode,
    })
  }

  useEffect(() => {
    getI18()
    getConfigs()
  }, [])

  async function getConfigs() {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/config/`
    const res = await doFetch({ url, method: METHODS.GET })

    if (res.error) return

    const { config: configs } = res

    setConfig(configs)
  }

  return (
    <ConfigContext.Provider value={{ i18n, setI18, config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => {
  return useContext(ConfigContext)
}
