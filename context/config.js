import { createContext, useState, useContext, useEffect } from 'react'
import { doFetch, getItemStorage, METHODS, setItemStorage } from '../lib/api'

const ConfigContext = createContext()

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    getConfigs()
  }, [])

  async function getConfigs() {
    const configs = await getItemStorage({ name: 'configs' })

    if (!configs || new Date() > configs.expires) {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/config/`
      const res = await doFetch({ url, method: METHODS.GET })

      const { config, error } = res
      if (error) return setConfig(configs.value)

      setConfig(config)
      setItemStorage({
        name: 'configs',
        value: config,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 4),
      })
      return
    }
    setConfig(configs.value)
  }

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => {
  return useContext(ConfigContext)
}
