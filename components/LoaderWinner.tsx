import { View } from 'react-native'
import { Animated } from 'react-native'

export function LoaderWinner() {
  return (
    <View
      className="flex mt-14 w-11/12 mx-auto py-4 pt-0 border border-gray-300 rounded-lg"
      style={{
        boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Animated.View className="animate-pulse w-full">
        <View className="w-full justify-center items-center bg-blue-100/70 rounded-t-lg px-2 py-6">
          <View className="h-5 w-11/12 bg-gray-400/50 rounded"></View>
        </View>
        <View className="flex mt-6 w-11/12 mx-auto">
          <View className="items-center justify-center w-full">
            <View className="justify-center items-center w-full">
              <View className="w-3/4 h-auto aspect-square bg-gray-300/70 rounded-full"></View>
              <View className="w-3/4 h-5 bg-gray-300/70 rounded mt-5"></View>
            </View>

            <View className="items-center justify-center mt-6 w-full">
              <View className="w-11/12 h-4 bg-gray-300/70 rounded">
                <View className="w-3/4 h-full bg-gray-600/70 rounded py-2"></View>
              </View>
              <View className="w-2/4 h-2 bg-gray-300/70 rounded mt-2"></View>
            </View>

            <View className="mt-5 items-center justify-center w-10/12 h-10 bg-gray-300/80 rounded-md"></View>
          </View>
        </View>
      </Animated.View>
    </View>
  )
}
