import { Alert, ScrollView, Text, View, RefreshControl } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { useConfig } from '../context/config'
import { findConfig } from '../lib/config'
import { useCallback, useEffect, useState } from 'react'
import { CardRemainingTime } from './CardRemainingTime'
import { Screen } from './Screen'
import { doFetch, getItemStorage, METHODS, setItemStorage } from '../lib/api'
import { NoCandidates } from './NoCandidates'
import { CandidateImage } from './CandidateImage'
import { useUser } from '../context/user.js'
import { YourVote } from './YourVote.jsx'
import { StyledPressable } from './StyledPressable.jsx'
import { toast } from '@backpackapp-io/react-native-toast'
import { TOAST_STYLES } from '../lib/toastConstants'

export function Vote() {
  const url = process.env.EXPO_PUBLIC_API_URL
  const [candidates, setCandidates] = useState([])
  const [isVotingClosed, setIsVotingClosed] = useState(false)
  const [userAlreadyVoted, setUserAlreadyVoted] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [voted, setVoted] = useState({})
  const { user } = useUser()

  const getLastVote = useCallback(async () => {
    doFetch({ url: `vote/`, method: METHODS.GET }).then(data => {
      if (data.error) return

      if (new Date() > data.vote.endDate) return setIsVotingClosed(true)
      setIsVotingClosed(false)
    })
  }, [])

  useEffect(() => {
    getLastVote()
    getItemStorage({ name: 'candidateVoted' }).then(data => {
      if (data) setVoted(data.value)
    })
  }, [getLastVote])

  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  useEffect(() => {
    setUserAlreadyVoted(user?.voted || false)
  }, [user])

  const getCandidates = useCallback(async () => {
    const toastGetCandidatesId = toast.loading('Cargando candidatos...')
    const res = await doFetch({ url: `candidate/all`, method: METHODS.GET })

    if (res.error) return toast.error(res.error, { styles: TOAST_STYLES.ERROR })
    if (!res.ok) return toast.error(res.message, { styles: TOAST_STYLES.ERROR })

    setCandidates(res.candidates)
    toast.dismiss(toastGetCandidatesId)
  }, [])

  useEffect(() => {
    getCandidates()
  }, [getCandidates])

  const handleClickVote = useCallback(
    async candidate => {
      setUserAlreadyVoted(true)
      const data = await doFetch({
        url: `candidate/${candidate.id}/vote`,
        method: METHODS.POST,
      })

      if (!data.ok) return Alert.alert(data.message)

      const votedObj = {
        userId: user.id,
        candidateId: candidate.id,
      }

      await setItemStorage({
        name: 'candidateVoted',
        value: votedObj,
      })

      setVoted(votedObj)
      toast.success('Voto exitoso, Votastes por ' + candidate.user.name, {
        styles: TOAST_STYLES.SUCCESS,
      })
    },
    [user],
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    setCandidates([])
    await getCandidates()
    setRefreshing(false)
  }, [getCandidates])

  const isApprentice = user?.roleUser.code === 'Apprentice'

  const buttonDisabled = isVotingClosed || userAlreadyVoted || !isApprentice

  return (
    <>
      <Screen safeArea={false}>
        <ScrollView
          className="w-full "
          contentContainerStyle={{ alignItems: 'center' }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[color, 'black']}
            />
          }
        >
          <View className="mb-4 mt-4">
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
                const imageUrl = candidate.imageUrl?.startsWith('http')
                  ? candidate.imageUrl
                  : `${url}/candidate/image/${candidate.imageUrl}`

                let buttonVoteText = 'Votación cerrada'
                const candidateName =
                  candidate.user.document === '0'
                    ? candidate.user.name
                    : candidate.user.name.split(' ')[0] +
                      ' ' +
                      candidate.user.lastname.split(' ')[0]

                if (
                  userAlreadyVoted &&
                  !isVotingClosed &&
                  !isThisCandidateVoted
                )
                  buttonVoteText = 'Ya has votado'
                if (!buttonDisabled)
                  buttonVoteText = `Votar por ${candidateName}`
                if (isThisCandidateVoted) buttonVoteText = 'Tu voto'
                if (!isApprentice) buttonVoteText = 'No puedes votar'

                return (
                  <Shadow
                    key={candidate.id}
                    className=" rounded-lg mb-4"
                    distance={20}
                  >
                    <View className="flex flex-col  justify-between max-w-[90%] min-w-[80%] p-6 px-5 rounded-lg bg-gray-100/70 items-center relative">
                      {isThisCandidateVoted && <YourVote />}
                      <CandidateImage
                        alt={`Foto del candidato ${candidate.user.name} ${candidate.user.lastname}`}
                        imageUrl={imageUrl}
                        classImage="rounded-xl"
                        classImageContainer="w-11/12 h-auto "
                      />

                      <View className="flex flex-col items-center mt-3 w-full">
                        <Text className="text-lg text-gray-700 text-center w-11/12">
                          {candidate.user.name} {candidate.user.lastname}
                        </Text>
                        {candidate.description && (
                          <Text className="text-sm text-gray-600 text-center mt-1">
                            {candidate.description}
                          </Text>
                        )}
                      </View>
                      <View className="mt-8 w-full self-center">
                        <StyledPressable
                          text={buttonVoteText}
                          backgroundColor={`${color}cc`}
                          disabled={buttonDisabled}
                          onPress={() => handleClickVote(candidate)}
                        />
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
