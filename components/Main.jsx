import { ActivityIndicator, BackHandler, Text, View } from 'react-native'
import LogoSena from '../icons/Logo'
import { useCallback, useEffect, useState } from 'react'
import { doFetch, METHODS } from '../lib/api.js'
import { Stack, useRouter } from 'expo-router'
import { Screen } from './Screen.jsx'
import { StatusBar } from 'expo-status-bar'
import { useConfig } from '../context/config.js'
import { findConfig } from '../lib/config'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import { useNetInfo } from '@react-native-community/netinfo'

export function Main() {
  const [Color, setColor] = useState('#ff6719')
  const router = useRouter()
  const { config } = useConfig()
  const netInfo = useNetInfo()

  function closeApp() {
    BackHandler.exitApp()
  }

  // Verifica si hay conexión a internet
  const hasConnection = useCallback(() => {
    return netInfo.isConnected
  }, [netInfo])

  useEffect(() => {
    const configColor = findConfig({ configs: config, code: 'configColor' })
    if (!configColor) return
    setColor(configColor.value)
  }, [config])

  useEffect(() => {
    async function verifyToken() {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/`

      const res = await doFetch({ url, method: METHODS.GET })

      if (res.error) {
        return Dialog.show({
          type: ALERT_TYPE.DANGER,
          textBody: 'Un error ha ocurrido, por favor intenta más tarde',
          button: 'Aceptar',
          onPressButton: () => closeApp(),
          closeOnOverlayTap: false,
        })
      }

      if (res.ok) {
        router.replace('apprentice/')
        return
      }

      router.replace('login')
    }

    async function init() {
      // eslint-disable-next-line no-undef
      await new Promise(resolve => setTimeout(resolve, 1000))

      const connection = hasConnection()
      const connectionIsNull = connection == null

      if (!connection && !connectionIsNull) {
        router.replace('no-connection/')
        return
      }

      if (connection && !connectionIsNull) verifyToken()
    }

    init()
  }, [router, hasConnection])

  return (
    <>
      <Screen className="flex-1 items-center justify-center gap-y-24">
        <StatusBar
          style="dark"
          backgroundColor="#f2f2f2"
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
