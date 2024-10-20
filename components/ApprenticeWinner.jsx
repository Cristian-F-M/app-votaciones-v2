import { Text, View } from 'react-native'
import { CardApprenticeWinner } from './CardApprenticeWinner'
import { useConfig } from '../context/config'
import { findConfig } from '../lib/config'
import { Shadow } from 'react-native-shadow-2'

export function ApprenticeWinner() {
  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  return (
    <>
      <View className="flex h-full">
        <View className="">
          <View className="flex flex-row gap-x-1 items-center justify-center">
            <Text className="text-center text-2xl">SENA</Text>
            <Text
              className="font-semibold text-center text-2xl"
              style={{ color }}
            >
              CGAO
            </Text>
          </View>
          <Text className="text-center text-base text-gray-600 -mt-1">
            Resultados de la votación
          </Text>
        </View>
        <View className="flex mt-4 w-11/12 mx-auto">
          <CardApprenticeWinner />
        </View>

        <View className="mt-auto w-full flex flex-row justify-center">
          <Text className="px-[7px] text-center text-xs"> 
            El Aprendiz será representante hasta el 15 de septiembre de 2022
          </Text>
        </View>
      </View>
    </>
  )
}

