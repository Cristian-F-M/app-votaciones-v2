import { ActivityIndicator, Text, View } from 'react-native'
import LogoSena from '../icons/Logo'
import { useEffect, useState } from 'react'
import { getItemStorage, doFetch, METHODS } from '../lib/api.js'
import { setItemStorage } from '../lib/api.js'
import { Stack, useRouter } from 'expo-router'
import { Screen } from './Screen.jsx'
import { StatusBar } from 'expo-status-bar'

export function Main() {
  const [Color, setColor] = useState('#ff6719')
  const router = useRouter()

  useEffect(() => {
    async function getConfigs() {
      const colorStoraged = await getItemStorage({ name: 'color' })
      if (!colorStoraged || new Date() > colorStoraged.expires) {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/config/?code=Color`
        const res = await doFetch({ url, method: METHODS.GET })
        const color = res.config.value

        await setItemStorage({
          name: 'color',
          value: color,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 4),
        })
        return setColor(color)
      }
      setColor(colorStoraged.value)
    }

    async function verifyToken() {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/`

      const res = await doFetch({ url, method: METHODS.GET })

      if (res.ok) {
        router.replace('apprentice/')
        return
      }

      router.replace('login')
    }

    async function init() {
      getConfigs()
      // eslint-disable-next-line no-undef
      await new Promise(resolve => setTimeout(resolve, 1000))
      verifyToken()
    }

    init()
  }, [router])

  return (
    <>
      <Screen className="flex-1 items-center justify-center gap-y-24">
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
        />
        <Stack.Screen options={{ headerShown: false }} />
        <View className="items-center">
          <LogoSena
            width={190}
            height={188}
            style={{ fill: Color }}
          />
          <Text className={`text-5xl mt-5`}>Votaciones</Text>
          <Text
            className="text-4xl"
            style={{ color: Color }}
          >
            CGAO
          </Text>
        </View>
        <View>
          <ActivityIndicator
            size={60}
            color={Color}
          />
        </View>
      </Screen>
    </>
  )
}
