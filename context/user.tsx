import { createContext, useState, useContext, useEffect } from 'react'
import { doFetch, METHODS } from '../lib/api'
import { router } from 'expo-router'
import type { User } from 'user'

type UserContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
} | null

const UserContext = createContext<UserContextType>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const urlGetUser = `${process.env.EXPO_PUBLIC_API_URL}/user/`
    const res = await doFetch({ url: urlGetUser, method: METHODS.GET })

    if (res.error) return router.replace('login')

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
