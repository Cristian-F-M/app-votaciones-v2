import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { Main } from './components/Main'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as Notifications from 'expo-notifications'

export default function App() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  })

  return (
    <SafeAreaProvider>
      <View className="flex-1 items-center justify-center">
        <StatusBar style="auto" />
        <Main />
      </View>
    </SafeAreaProvider>
  )
}
