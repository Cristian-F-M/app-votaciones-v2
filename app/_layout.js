import { Stack } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ConfigProvider } from '../context/config.js'
import { AlertNotificationRoot } from 'react-native-alert-notification'

import * as Notifications from 'expo-notifications'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Toasts } from '@backpackapp-io/react-native-toast'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default function Layout() {
  return (
    <ConfigProvider>
      <SafeAreaProvider>
        <AlertNotificationRoot>
          <GestureHandlerRootView>
            <View className="flex-1">
              <Toasts globalAnimationType="spring" />
              <Stack screenOptions={{ headerShown: false }} />
            </View>
          </GestureHandlerRootView>
        </AlertNotificationRoot>
      </SafeAreaProvider>
    </ConfigProvider>
  )
}
