import { ActivityIndicator, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import LogoSena from '../icons/Logo'
import { useEffect, useState } from 'react'
import { getItemStorage, doFetch, METHODS } from '../lib/api.js'
import { setItemStorage } from '../lib/api.js'
import { removeItemStorage } from '../lib/api.js'
import { Stack, useRouter } from 'expo-router'
import { Screen } from './Screen.jsx'
import { StatusBar } from 'expo-status-bar'

export function Main() {
  const [Color, setColor] = useState()
  const router = useRouter()
  const configs = {
    textColor: `text-[${Color}]`,
    logoColor: Color,
  }

  useEffect(() => {
    async function getConfigs() {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/config/?code=Color`
      const res = await doFetch({ url, method: METHODS.GET })
      const color = res.config.value

      setColor(color)
    }

    async function verifyToken() {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/`

      const res = await doFetch({ url, method: METHODS.GET })

      if (res.ok) {
        router.replace('/about')
        return
      }

      router.replace('login')
    }

    async function init() {
      getConfigs()
      // eslint-disable-next-line no-undef
      await new Promise(resolve => setTimeout(resolve, 2000))
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
            style={{ fill: configs.logoColor }}
          />
          <Text className={`${configs.textColor} text-5xl mt-5`}>
            Votaciones
          </Text>
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
            color={configs.logoColor}
          />
        </View>
      </Screen>
    </>
  )
}
