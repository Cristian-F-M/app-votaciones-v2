import { Text, View } from 'react-native'
import { Screen } from '../../../components/Screen'
import { router, Stack } from 'expo-router'
import ArrowLeft from '../../../icons/ArrowLeft'

export default function CandidateProfile() {
  function handleCliclHome() {
    router.replace('/apprentice/')
  }

  return (
    <Screen safeArea={false}>
      <Stack.Screen
        options={{
          headerTitle: 'Perfil',
          headerTitleAlign: 'center',
          headerShown: true,
        }}
      />
      <View>
        <Text className="text-center">Perfil de Candidato</Text>
      </View>
    </Screen>
  )
}
