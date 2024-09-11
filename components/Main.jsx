import { ActivityIndicator, BackHandler, Text, View } from 'react-native'
import LogoSena from '../icons/Logo'
import { useEffect, useState } from 'react'
import { getItemStorage, doFetch, METHODS } from '../lib/api.js'
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

  useEffect(() => {
    const { isConnected } = netInfo
    if (isConnected !== null && !isConnected) {
      return Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error de conexión',
        textBody:
          'Necesitas estar conectado a intenet para acceder a la apliacción',
        button: 'Aceptar',
        onPressButton: () => closeApp(),
        closeOnOverlayTap: false,
      })
    }

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

      if (res.error) {
        return Dialog.show({
          type: ALERT_TYPE.DANGER,
          // title: 'Error de conexión',
          textBody: 'Un error ha ocurrido, por favor intenta mas tarde',
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
