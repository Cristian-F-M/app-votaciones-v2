import { Text, View } from 'react-native'

export function UserBaseLogo({ letter }: { letter: string }) {
  return (
    <View className="w-full h-full flex justify-center items-center">
      <Text className="text-3xl font-semibold">{letter}</Text>
    </View>
  )
}
