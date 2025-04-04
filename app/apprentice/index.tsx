import { doFetch, METHODS } from '../../lib/api'
import { useCallback, useEffect, useState } from 'react'
import { ApprenticeWinner } from '../../components/ApprenticeWinner'
import { Vote } from '../../components/Vote'
import { ThereIsNoVote } from '../../components/ThereIsNoVote'
import { LoadingWinner } from '../../components/LoadingWinner'

export default function Index() {
  const url = process.env.EXPO_PUBLIC_API_URL
  const [isVoteFinished, setIsVoteFinished] = useState(false)
  const [thereIsVote, setThereIsVote] = useState(false)
  const [arrivedTime, setArrivedTime] = useState(true)

  const getLastVote = useCallback(async () => {
    doFetch({ url: `${url}/vote/`, method: METHODS.GET }).then(data => {
      if (data.error) return

      const { lastVote: vote } = data

      if (vote) setThereIsVote(true)

      if (new Date().getTime() > new Date(vote.startDate).getTime())
        setThereIsVote(true)
      if (new Date().getTime() > new Date(vote.endDate).getTime())
        setArrivedTime(true)
      if (vote?.isFinished) setIsVoteFinished(true)
    })
  }, [url])

  useEffect(() => {
    getLastVote()
  }, [getLastVote])

  const showVote = !isVoteFinished && thereIsVote && !arrivedTime
  const showWinner = isVoteFinished && thereIsVote && arrivedTime

  return (
    <>
      {showWinner && <ApprenticeWinner />}
      {showVote && <Vote />}
      {!thereIsVote && <ThereIsNoVote />}
      {arrivedTime && !isVoteFinished && <LoadingWinner />}
    </>
  )
}
