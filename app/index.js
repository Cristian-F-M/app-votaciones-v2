import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { Main } from '../components/Main'

export default function App() {
  return (
    <View className="flex-1 items-center justify-center">
      <StatusBar style="auto" />
      <Main />
    </View>
  )
}
