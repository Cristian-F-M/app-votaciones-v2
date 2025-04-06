import { ScrollView, Text, View } from 'react-native'
import { CardApprenticeWinner } from './CardApprenticeWinner'
import { doFetch, METHODS } from '@lib/api'
import { Screen } from './Screen'
import { Vote } from 'types/vote'
import { useCallback, useEffect, useState } from 'react'
import { LoaderWinner } from './LoaderWinner'

export function ApprenticeWinner() {
  const [vote, setVote] = useState<Vote>()

  const getLastVote = useCallback(async () => {
    const res: { lastVote: Vote; ok: boolean; error?: string } = await doFetch({
      url: `vote/`,
      method: METHODS.GET,
    })

    if (res.error || !res.ok) return

    const { lastVote: vote } = res
    setVote(vote)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      getLastVote()
    }, 500)
  }, [getLastVote])

  if (!vote) return <LoaderWinner />

  const endDate = new Date(vote.endDate)
  const endWinnerDate = new Date(endDate.setFullYear(endDate.getFullYear() + 1))
  const endWinnerDateString = endWinnerDate.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Screen safeArea={false}>
      <ScrollView
        className="flex flex-col"
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View
          className="flex mt-14 w-11/12 mx-auto py-4 pt-0 border border-gray-200 rounded-lg"
          style={{
            boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          <View className="w-full justify-center items-center bg-blue-100/70 rounded-t-lg px-2 py-6">
            <Text className="text-3xl text-center">
              Resultados de la Votación
            </Text>
          </View>
          <View className="flex mt-6 w-11/12 mx-auto">
            <CardApprenticeWinner vote={vote} />
          </View>
        </View>
        <View className="w-full flex flex-row justify-center mt-10 mb-2 self-end justify-self-end">
          <Text className="text-center text-sm text-gray-700">
            El Aprendiz será representante hasta el {endWinnerDateString}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  )
}
