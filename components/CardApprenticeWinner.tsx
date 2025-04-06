import { Image, Text, View } from 'react-native'
import * as Progress from 'react-native-progress'
import { useConfig } from '../context/config'
import { findConfig } from '../lib/config'
import { useWindowDimensions } from 'react-native'
import { StyledPressable } from './StyledPressable'
import { Vote } from 'types/vote'

export function CardApprenticeWinner({ vote }: { vote: Vote }) {
  const { width } = useWindowDimensions()

  const porcentaje =
    vote.finishVoteInfo.cantVotesWinner === 0
      ? 0
      : vote.finishVoteInfo.cantVotesWinner / vote.finishVoteInfo.totalVotes

  const configs = useConfig()
  const config = configs?.config || []
  const configColor = findConfig({ configs: config, code: 'Color' })
  const color = configColor?.value || '#5b89d6'
  const defaultImage = `${process.env.EXPO_PUBLIC_API_URL}/assets/base_user`

  return (
    <View className="items-center justify-center">
      <View className="justify-center items-center">
        <Image
          className="rounded-full overflow-hidden w-3/4 h-auto aspect-square border border-gray-300"
          resizeMode="cover"
          source={{
            uri:
              vote.finishVoteInfo.candidates[0].imageUrl ||
              vote.finishVoteInfo.candidates[0].user.imageUrl ||
              defaultImage,
          }}
          defaultSource={{
            uri: `${process.env.EXPO_PUBLIC_API_URL}/assets/base_user`,
          }}
          alt={`Imagen del ganador ${vote.finishVoteInfo.candidates[0].user.name}`}
        />
        <Text className="text-2xl text-center font-medium mt-3">
          {vote.finishVoteInfo.candidates[0].user.name}{' '}
          {vote.finishVoteInfo.candidates[0].user.lastname}
        </Text>
      </View>

      <View className="items-center justify-center mt-2">
        <Progress.Bar
          progress={porcentaje}
          color={color}
          height={14}
          width={width * 0.8}
        />
        <Text className="text-gray-600 mt-1">
          {(porcentaje * 100).toFixed(1)}% de los votos totales
        </Text>
      </View>

      <View className="mt-5 items-center justify-center w-10/12">
        <StyledPressable
          backgroundColor={color}
          text="Ver detalles"
          textClassName="text-white"
        />
      </View>
    </View>
  )
}
