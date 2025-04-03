import { Text, View } from 'react-native'
import UpLoad from '../icons/UpLoad'

export function UpLoadImage() {
  return (
    <>
      <View className="flex justify-center items-center w-full h-full">
        <UpLoad
          width={70}
          height={70}
        />
        <Text className="text-gray-400 text-lg mt-2 text-center">
          Haz click para seleccionar una imagen
        </Text>
      </View>
    </>
  )
}
