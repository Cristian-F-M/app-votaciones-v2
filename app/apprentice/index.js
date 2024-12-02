import { Button, Pressable, Text, View } from 'react-native'
import { Screen } from '../../components/Screen'
import { doFetch, METHODS, removeItemStorage } from '../../lib/api'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { useRouter } from 'expo-router'
import SideMenu from '@chakrahq/react-native-side-menu'
import { useCallback, useEffect, useState } from 'react'
import { useConfig } from '../../context/config'
import { findConfig } from '../../lib/config'
import { ApprenticeWinner } from '../../components/ApprenticeWinner'
import { Vote } from '../../components/Vote'
import { ThereIsNoVote } from '../../components/ThereIsNoVote'

export default function Index() {
  const url = process.env.EXPO_PUBLIC_API_URL
  const [isVoteFinished, setIsVoteFinished] = useState(false)
  const [thereIsVote, setThereIsVote] = useState(false)

  const getLastVote = useCallback(async () => {
    doFetch({ url: `${url}/vote/`, method: METHODS.GET }).then(data => {
      if (data.error) return

      const { vote } = data

      if (!vote) return setThereIsVote(false)
      if (new Date() > vote.endDate) return setIsVoteFinished(true)

      setThereIsVote(true)
      setIsVoteFinished(false)
    })
  }, [url])

  useEffect(() => {
    getLastVote()
  }, [getLastVote])

  const showVote = !isVoteFinished && thereIsVote
  const showWinner = isVoteFinished && thereIsVote

  return (
    <>
      {showWinner && <ApprenticeWinner />}
      {showVote && <Vote />}
      {!thereIsVote && <ThereIsNoVote />}
    </>
  )
}
