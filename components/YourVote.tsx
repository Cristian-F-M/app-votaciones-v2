import { Text, View } from 'react-native'
import * as Animatable from 'react-native-animatable'

export function YourVote() {
  return (
    <Animatable.View
      animation={'pulse'}
      duration={1500}
      iterationCount={'infinite'}
      easing={'linear'}
      useNativeDriver={true}
      className="absolute z-50 -right-3 top-[5px]"
    >
      <View className="bg-green-500 px-3 py-1 rounded-lg rotate-[30deg]">
        <Text className="text-[#181818]">Tu voto</Text>
      </View>
    </Animatable.View>
  )
}
