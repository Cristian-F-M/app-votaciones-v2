import { useEffect, useState } from 'react'

export function useRemainingTime(date: string | null, starDate = false) {
  const [timeLeft, setTimeLeft] = useState({
    days: '0',
    hours: '0',
    minutes: '0',
    seconds: '0',
  })
  const [isVotingClosed, setIsVotingClosed] = useState(false)
  const [isVotingStarted, setIsVotingStarted] = useState(false)

  useEffect(() => {
    setIsVotingClosed(false)
    if (!date)
      return setTimeLeft({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      })
    const targetDate = new Date(date).getTime()
    const now = new Date().getTime()

    const difference = targetDate - now

    if (difference < 0) return setIsVotingClosed(true)

    setTimeLeft(getRemainingTime(targetDate))

    // eslint-disable-next-line no-undef
    const interval = setInterval(() => {
      const { days, hours, minutes, seconds } = getRemainingTime(targetDate)

      setTimeLeft({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      })

      if (difference < 0) {
        // eslint-disable-next-line no-undef
        clearInterval(interval)
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' })
        setIsVotingClosed(true)
      }

      if (starDate) {
        setIsVotingClosed(false)
        setIsVotingStarted(true)
      }
    }, 1000)

    // eslint-disable-next-line no-undef
    return () => clearInterval(interval)
  }, [date, starDate])

  return { timeLeft, isVotingClosed, isVotingStarted }
}

function getRemainingTime(targetDate: number) {
  const now = new Date().getTime()
  const difference = targetDate - now

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))

  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  }
}
