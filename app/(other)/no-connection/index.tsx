import { View, Text } from 'react-native'
import { Screen } from '../../../components/Screen'
import { Link, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import WifiOff from '../../../icons/WifiOff'
import { useConfig } from '../../../context/config'
import { findConfig } from '../../../lib/config'

export default function NoWifiPage() {
  const configs = useConfig()
  const config = configs?.config || []
  const color =
    findConfig({ configs: config, code: 'Color' })?.value || '#5b89d6'

  return (
    <Screen>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center w-full">
        <View className="w-4/5 items-center">
          <WifiOff
            width={154}
            height={154}
            color={color}
          />
          <Text className="text-2xl font-bold mb-4 text-center">
            Sin conexión a internet
          </Text>
          <Text className="text-center mb-8 text-gray-700">
            No se pudo conectar a Internet. Por favor, verifica tu conexión e
            intenta nuevamente.
          </Text>

          <Link
            href="/"
            asChild
            className="px-5 py-2 items-center rounded-lg w-full"
            style={{ backgroundColor: `${color}dd` }}
          >
            <Text className="text-white text-lg text-center">Reintentar</Text>
          </Link>
        </View>
      </View>
    </Screen>
  )
}
