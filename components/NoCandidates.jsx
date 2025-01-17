import { Text, View } from 'react-native'
import { Shadow } from 'react-native-shadow-2'

export function NoCandidates() {
  return (
    <View className="py-14 px-3 flex w-2/3">
      <Text className="text-lg text-black text-center">
        No hay Candidatos :(
      </Text>
      <Text className="text-sm text-gray-500 text-center">
        Vuelve mas tarde
      </Text>
    </View>
  )
}
