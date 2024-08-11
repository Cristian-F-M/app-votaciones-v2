import { Stack } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ConfigProvider } from '../context/config.js'

export default function Layout() {
  return (
    <ConfigProvider>
      <SafeAreaProvider>
        <View className="flex-1">
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </SafeAreaProvider>
    </ConfigProvider>
  )
}
