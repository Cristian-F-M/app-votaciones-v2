import { Button, Pressable, Text, View } from 'react-native'
import { Screen } from '../../components/Screen'
import { doFetch, METHODS, removeItemStorage } from '../../lib/api'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { useRouter } from 'expo-router'
import SideMenu from '@chakrahq/react-native-side-menu'
import { useState } from 'react'
import { Shadow } from 'react-native-shadow-2'

export default function Index() {
  const router = useRouter()

  return (
    <View className="flex-1 bg-white">
      <Text className="mb-10">Aprenttice</Text>
      <Shadow>
        <View>
          <Text>Aprenttice</Text>
        </View>
      </Shadow>
    </View>
  )
}
