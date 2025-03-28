import { View, Text } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { TimeCard } from './TimeCard'
import { useRemainingTime } from '../hooks/useRemainingTime'
import { useCallback, useEffect, useState } from 'react'
import { doFetch, METHODS } from '../lib/api'

export function CardRemainingTime() {
  const [date, setDate] = useState(null)

  const getLastVote = useCallback(async () => {
    const url = process.env.EXPO_PUBLIC_API_URL
    doFetch({ url: `${url}/vote/`, method: METHODS.GET }).then(data => {
      if (data.error) return

      const { lastVote } = data
      const { endDate } = lastVote
      setDate(endDate)
    })
  }, [])

  useEffect(() => {
    getLastVote()
  }, [getLastVote])

  const { timeLeft, isVotingClosed } = useRemainingTime(date)
  return (
    <>
      <Shadow
        className="rounded-lg mb-4"
        distance={20}
      >
        <View className="bg-gray-100/70 flex items-center py-2 px-5 min-w-[85%] bg-white w-11/12">
          <View>
            <Text className={`${isVotingClosed ? 'text-xl' : 'texte-base'}`}>
              {isVotingClosed && 'Votación cerrada'}
              {!isVotingClosed && 'Tiempo restante para votar'}
            </Text>
          </View>
          {!isVotingClosed && (
            <View className="flex flex-row w-full mt-3 items-center justify-evenly">
              <TimeCard
                text="Dias"
                time={timeLeft.days}
              />
              <TimeCard
                text="Horas"
                time={timeLeft.hours}
              />
              <TimeCard
                text="Minutos"
                time={timeLeft.minutes}
              />
              <TimeCard
                text="Segundos"
                time={timeLeft.seconds}
              />
            </View>
          )}
        </View>
      </Shadow>
    </>
  )
}
