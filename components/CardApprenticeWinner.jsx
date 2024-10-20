import { Image, Pressable, Text, View } from 'react-native'
import * as Progress from 'react-native-progress'
import { useConfig } from '../context/config'
import { findConfig } from '../lib/config'
import { Link } from 'expo-router'
import ChevronRight from '../icons/ChevronRight'
import { Shadow } from 'react-native-shadow-2'

export function CardApprenticeWinner() {
  const votos = 1200
  const total = 1500
  const porcentaje = votos / total

  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  return (
    <>
      <Shadow
        className="w-full rounded-lg"
        distance={40}
      >
        <View className="bg-gray-100/70 flex flex-col items-center py-2 rounded-lg">
          <View>
            <Text className="text-xl">Ganador de la votación</Text>
          </View>
          <View className="mt-2">
            {/* Foto del ganador */}
            <Image
              className="rounded-full overflow-hidden w-full h-full"
              style={{ width: 150, height: 150 }}
              width={150}
              height={150}
              resizeMode="cover"
              source={{
                uri: 'https://codigoesports.com/wp-content/uploads/2022/08/Steve.webp',
              }}
            />
          </View>
          <View className="mt-2 flex flex-col">
            <Text className="text-xl text-center">Steve de Minecraft</Text>
            <Text className="text-sm text-center text-gray-600 -mt-1">
              Representande de la jornada
            </Text>
          </View>
          <View className="flex flex-row items-baseline gap-x-1 mt-3">
            <Text className="text-center text-2xl font-semibold">
              {votos.toLocaleString('es-CO')}
            </Text>
            <Text className="text-sm text-gray-600">Votos</Text>
          </View>
          <View className="mt-1">
            <Progress.Bar
              progress={porcentaje}
              width={200}
              color={color}
            />
          </View>
          <Text className="text-center text-sm text-gray-600/90">
            {(porcentaje * 100).toFixed(0)}% de los votos totales
          </Text>

          <View className="mt-4 w-[85%] mb-2">
            <Link
              href={'/voteDetails'}
              asChild={true}
            >
              <Pressable
                className="px-4 py-2 rounded-lg flex flex-row justify-center items-center gap-x-2"
                style={{ backgroundColor: '#2e2e31' }}
              >
                <Text className="text-white">Ver detalles</Text>
                <ChevronRight
                  className="text-white"
                  width={20}
                  height={20}
                />
              </Pressable>
            </Link>
          </View>
        </View>
      </Shadow>
    </>
  )
}
