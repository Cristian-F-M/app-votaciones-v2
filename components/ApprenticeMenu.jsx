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
import { MenuItem } from './MenuItem.jsx'

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

  function handleClickApprenticeProfile() {
    setMenuIsVisible(false)
    router.navigate('apprentice/profile/')
  }

  return (
    <Screen>
      <StatusBar
        style="auto"
        backgroundColor="#fff"
      />
      <ScrollView className="flex-1 bg-gray-[#e0e2e4]">
        <Profile />

        <View className="py-2 flex flex-col">
          <MenuItem
            text="Perfil"
            pressableClass="bg-[#A3D9A5]"
            onPress={handleClickApprenticeProfile}
          />
          {user?.roleUser.code === 'Candidate' && (
            <MenuItem
              pressableClass=" bg-[#A3C9F1]"
              onPress={handleClickCandidateProfile}
              text="Perfil de candidato"
            />
          )}
          <MenuItem
            pressableClass=" bg-[#B0BEC5]"
            onPress={handleClickConfig}
            text="Configuraciones"
          />
          {/*  */}
          <MenuItem
            pressableClass=" bg-[#FFB3A1]"
            onPress={handleClickLogout}
            text="Cerrar Sesión"
          />
        </View>
      </ScrollView>
    </Screen>
  )
}
