import { createContext, useState, useContext, useEffect } from 'react'
import { doFetch, getItemStorage, METHODS, setItemStorage } from '../lib/api'

const ConfigContext = createContext()

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null)

  useEffect(() => {
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
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => {
  return useContext(ConfigContext)
}
