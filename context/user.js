import { createContext, useState, useContext, useEffect } from 'react'
import { doFetch, METHODS } from '../lib/api'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const urlGetUser = `${process.env.EXPO_PUBLIC_API_URL}/user/`
    const res = await doFetch({ url: urlGetUser, method: METHODS.GET })

    if (res.error) return router.navigate('login')

    setUser(res.user)
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

// Hook para usar el contexto más fácilmente
export const useUser = () => {
  return useContext(UserContext)
}
