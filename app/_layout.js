import { Stack } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function Layout() {
  return (
    <SafeAreaProvider>
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaProvider>
  )
}
