import { ActivityIndicator, Text, View } from 'react-native'
import LogoSena from '../icons/Logo'
import { useEffect, useState } from 'react'
import { getItemStorage, doFetch, METHODS } from '../lib/api.js'
import { Stack, useRouter } from 'expo-router'
import { Screen } from './Screen.jsx'
import { StatusBar } from 'expo-status-bar'
import { useConfig } from '../context/config.js'
import { findConfig } from '../lib/config'

export function Main() {
  const [Color, setColor] = useState('#ff6719')
  const router = useRouter()
  const { config } = useConfig()

  useEffect(() => {
    async function getConfigs() {
      const colorStoraged = await getItemStorage({ name: 'color' })

      if (!colorStoraged || new Date() > colorStoraged.expires) {
        return setColor(findConfig({ configs: config, code: 'Color' }).value)
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
  }, [])

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
