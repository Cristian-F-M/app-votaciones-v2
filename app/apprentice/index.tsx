import { doFetch, METHODS } from '../../lib/api'
import { useCallback, useEffect, useState } from 'react'
import { ApprenticeWinner } from '../../components/ApprenticeWinner'
import { Vote } from '../../components/Vote'
import { ThereIsNoVote } from '../../components/ThereIsNoVote'
import { LoadingWinner } from '../../components/LoadingWinner'
import { LoaderWinner } from '@components/LoaderWinner'
import { RefreshControl, ScrollView } from 'react-native'

export default function Index() {
  const url = process.env.EXPO_PUBLIC_API_URL
  const [isVoteFinished, setIsVoteFinished] = useState(false)
  const [thereIsVote, setThereIsVote] = useState(false)
  const [arrivedTime, setArrivedTime] = useState(true)
  const [loading, setLoading] = useState(true)

  const getLastVote = useCallback(async () => {
    setLoading(true)

    doFetch({ url: `${url}/vote/`, method: METHODS.GET }).then(data => {
      if (data.error) return

      const { lastVote: vote } = data

      if (vote) setThereIsVote(true)

      if (new Date().getTime() > new Date(vote.endDate).getTime())
        setArrivedTime(true)
      setIsVoteFinished(vote?.isFinished || false)
      setLoading(false)
    })
  }, [url])

  useEffect(() => {
    getLastVote()
  }, [getLastVote])

  const showVote = !isVoteFinished && thereIsVote && !arrivedTime && !loading
  const showWinner = isVoteFinished && thereIsVote && arrivedTime && !loading

  const onRefresh = async () => {
    getLastVote()
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          colors={['#5b89d6', 'black']}
        />
      }
    >
      {loading && <LoaderWinner />}
      {showWinner && <ApprenticeWinner />}
      {showVote && <Vote />}
      {!thereIsVote && !loading && <ThereIsNoVote />}
      {arrivedTime && !isVoteFinished && !loading && <LoadingWinner />}
    </ScrollView>
  )
}
