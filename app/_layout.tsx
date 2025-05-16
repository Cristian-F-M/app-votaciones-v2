import { Stack } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { ConfigProvider } from '../context/config'
import { AlertNotificationRoot } from 'react-native-alert-notification'
import * as Notifications from 'expo-notifications'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Toasts } from '@backpackapp-io/react-native-toast'
import '../global.css'

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
            <SafeAreaView className="flex-1">
              <Toasts globalAnimationType="spring" />
              <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaView>
          </GestureHandlerRootView>
        </AlertNotificationRoot>
      </SafeAreaProvider>
    </ConfigProvider>
  )
}
