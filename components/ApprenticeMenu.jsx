import { Pressable, ScrollView, Text, View } from 'react-native'
import { Screen } from './Screen.jsx'
import { StatusBar } from 'expo-status-bar'
import { Profile } from './Profile.jsx'
import { Shadow } from 'react-native-shadow-2'
import { doFetch, METHODS, removeItemStorage } from '../lib/api.js'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { Link, router } from 'expo-router'
import { useUser } from '../context/user.js'
import { useEffect } from 'react'

export function ApprenticeMenu({ setMenuIsVisible }) {
  const { user } = useUser()

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

  function handleClickConfig() {
    setMenuIsVisible(false)
    router.push('apprentice/config/')
  }

  function handleClickCandidateProfile() {
    setMenuIsVisible(false)
    router.navigate('candidate/profile/')
  }

  return (
    <Screen>
      <StatusBar
        style="auto"
        backgroundColor="#fff"
      />
      <ScrollView className="flex-1 bg-gray-[#e0e2e4]">
        <Profile />

        <View className="py-4 flex flex-col gap-y-2">
          {user?.roleUser.code === 'Candidate' && (
            <Pressable
              className="mt-4 bg-green-400 py-4 px-2"
              onPress={handleClickCandidateProfile}
            >
              <Text className="text-base text-center">Perfil de candidato</Text>
            </Pressable>
          )}
          <Pressable
            className="mt-4 bg-blue-400 py-4 px-2"
            onPress={handleClickConfig}
          >
            <Text className="text-base text-center">Configuraciones</Text>
          </Pressable>
          {/*  */}
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
