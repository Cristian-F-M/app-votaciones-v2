import { Pressable, ScrollView, Text, View } from 'react-native'
import { Screen } from './Screen.jsx'
import { StatusBar } from 'expo-status-bar'
import { Profile } from './Profile.jsx'
import { Shadow } from 'react-native-shadow-2'

export function ApprenticeMenu() {
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
        </View>
      </ScrollView>
    </Screen>
  )
}
