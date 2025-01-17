import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { useConfig } from '../context/config'
import { findConfig } from '../lib/config'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CardRemainingTime } from './CardRemainingTime'
import { Screen } from './Screen'
import {
  doFetch,
  getItemStorage,
  METHODS,
  removeItemStorage,
  setItemStorage,
} from '../lib/api'
import { NoCandidates } from './NoCandidates'
import { CandidateImage } from './CandidateImage'
import { useUser } from '../context/user.js'
import { YourVote } from './YourVote.jsx'

// ! Obtener el valor de isVotingClosed de la api de la votación

export function Vote() {
  const url = process.env.EXPO_PUBLIC_API_URL
  const [candidates, setCandidates] = useState([])
  const [isVotingClosed, setIsVotingClosed] = useState(false)
  const [userAlreadyVoted, setUserAlreadyVoted] = useState(false)
  const [voted, setVoted] = useState({})
  const { user } = useUser()

  const getLastVote = useCallback(async () => {
    doFetch({ url: `${url}/vote/`, method: METHODS.GET }).then(data => {
      if (data.error) return

      if (new Date() > data.vote.endDate) return setIsVotingClosed(true)
      setIsVotingClosed(false)
    })
  }, [url])

  useEffect(() => {
    getLastVote()
    getItemStorage({ name: user.id }).then(data => {
      if (data) setVoted(data.value)
    })
  }, [getLastVote, user.id])

  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  useEffect(() => {
    setUserAlreadyVoted(user.voted)
  }, [user])

  useEffect(() => {
    const getCandidates = async () => {
      doFetch({ url: `${url}/candidate`, method: METHODS.GET }).then(data => {
        if (data.error) return

        setCandidates(data.candidates)
      })
    }

    getCandidates()
  }, [url])

  async function handleClickVote(candidate) {
    setUserAlreadyVoted(true)
    const data = await doFetch({
      url: `${url}/candidate/${candidate.id}/vote`,
      method: METHODS.POST,
    })

    if (!data.ok) return Alert.alert(data.message)

    const votedObj = {
      userId: user.id,
      candidateId: candidate.id,
    }

    await setItemStorage({
      name: user.id,
      value: votedObj,
    })

    setVoted(votedObj)
    Alert.alert('Voto exitoso, Votastes por ' + candidate.user.name)
  }

  const isApprentice = user?.roleUser.code === 'Apprentice'

  const buttonDisabled = isVotingClosed || userAlreadyVoted || !isApprentice

  return (
    <>
      <Screen safeArea={false}>
        <ScrollView
          className="w-full "
          contentContainerStyle={{ alignItems: 'center' }}
        >
          <View className="mb-4">
            <Text
              className="text-3xl text-center"
              style={{ color }}
            >
              Candidatos
            </Text>
          </View>

          <CardRemainingTime />

          <View className="mt-4 mb-2 justify-self-end">
            <Text className="text-gray-600 text-sm text-center">
              Recuerda que solo puede votar una vez.
            </Text>
          </View>

          {candidates.length > 0 && (
            <View className="flex flex-col items-center mt-4">
              {candidates.map(candidate => {
                const isThisCandidateVoted =
                  userAlreadyVoted &&
                  voted?.candidateId === candidate.id &&
                  user?.id === voted?.userId

                return (
                  <Shadow
                    key={candidate.id}
                    className=" rounded-lg mb-4"
                    distance={20}
                  >
                    <View className="flex flex-col  justify-between max-w-[90%] min-w-[80%] p-6 px-5 rounded-lg bg-gray-100/70 items-center relative">
                      {isThisCandidateVoted && <YourVote />}
                      <CandidateImage candidate={candidate} />

                      <View className="flex flex-col items-center mt-3 w-full">
                        <Text className="text-2xl text-gray-700">
                          {candidate.user.name}
                        </Text>
                        {candidate.description && (
                          <Text className="text-sm text-gray-600 text-center mt-1 bg-green-300">
                            {candidate.description}
                          </Text>
                        )}
                      </View>
                      <View className="mt-8 w-full self-center">
                        <Pressable
                          disabled={buttonDisabled}
                          className="w-full px-1 py-2 rounded-lg"
                          style={{
                            backgroundColor: buttonDisabled ? '#cdd0d6' : color,
                          }}
                          onPress={() => handleClickVote(candidate)}
                        >
                          <Text
                            className="w-full text-center text-lg text-gray-100"
                            style={{
                              color: buttonDisabled ? `#495160` : '#f3f4f6',
                            }}
                          >
                            {isVotingClosed && 'Votación cerrada'}
                            {userAlreadyVoted &&
                              !isVotingClosed &&
                              !isThisCandidateVoted &&
                              'Ya has votado'}
                            {!buttonDisabled &&
                              `Votar por ${candidate.user.name}`}
                            {isThisCandidateVoted && 'Tu voto'}
                            {buttonDisabled &&
                              !isApprentice &&
                              'No puedes votar'}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </Shadow>
                )
              })}
            </View>
          )}

          {candidates.length <= 0 && <NoCandidates />}
        </ScrollView>
      </Screen>
    </>
  )
}
