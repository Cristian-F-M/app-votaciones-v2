import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { Main } from './components/Main'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function App() {
  return (
    <SafeAreaProvider>
      <View className="flex-1 items-center justify-center">
        <StatusBar style="auto" />
        <Main />
      </View>
    </SafeAreaProvider>
  )
}
