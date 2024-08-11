import { Text, View } from 'react-native'

export function UserBaseLogo({ letter }) {
  return (
    <View className="w-full h-full flex justify-center items-center">
      <Text className="text-2xl font-semibold">{letter}</Text>
    </View>
  )
}
