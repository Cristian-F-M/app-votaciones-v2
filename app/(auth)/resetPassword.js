import { Text, View } from 'react-native'
import { Screen } from '../../components/Screen'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { doFetch, getItemStorage, METHODS, setItemStorage } from '../../lib/api'
import { StatusBar } from 'expo-status-bar'
import LogoSena from '../../icons/Logo'

export default function ResetPassword() {
  const [Color, setColor] = useState()

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

    getConfigs()
  }, [])

  return (
    <Screen>
      <StatusBar style="auto" />
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerRight: () => (
            <LogoSena
              width={40}
              height={40}
              style={{ fill: Color }}
            />
          ),
        }}
      />
      <View>
        <Text>Reset password</Text>
      </View>
    </Screen>
  )
}
