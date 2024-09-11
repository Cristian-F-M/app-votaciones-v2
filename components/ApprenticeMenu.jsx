import { Pressable, ScrollView, Text, View } from 'react-native'
import { Screen } from './Screen.jsx'
import { StatusBar } from 'expo-status-bar'
import { Profile } from './Profile.jsx'
import { Shadow } from 'react-native-shadow-2'
import { doFetch, METHODS, removeItemStorage } from '../lib/api.js'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { router } from 'expo-router'

export function ApprenticeMenu() {
  async function handleClickLogout() {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/Logout`
    const res = await doFetch({ url, method: METHODS.POST })

    if (res.error) {
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: `${res.error}, please try again`,
      })
    }

    removeItemStorage({ name: 'token' })
    router.replace('/')
  }

  return (
    <Screen>
      <StatusBar
        style="auto"
        backgroundColor="#fff"
      />
      <ScrollView className="flex-1 bg-gray-[#e0e2e4]">
        <Profile />

        <View className="py-4">
          <Text>Menu</Text>
          <Pressable
            className="mt-4 bg-red-400 py-4 px-2"
            onPress={handleClickLogout}
          >
            <Text className="text-base text-center">Cerrar Sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  )
}
