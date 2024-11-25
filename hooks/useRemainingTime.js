import { useEffect, useState } from 'react'

export function useRemainingTime(initialDate = '2024-12-31T23:59:59') {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isVotingClosed, setIsVotingClosed] = useState(false)

  useEffect(() => {
    setIsVotingClosed(false)
    const targetDate = new Date(initialDate).getTime()

    const now = new Date().getTime()
    const difference = targetDate - now

    if (difference < 0) {
      setIsVotingClosed(true)
    }

    // eslint-disable-next-line no-undef
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))

      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      })

      if (difference < 0) {
        // eslint-disable-next-line no-undef
        clearInterval(interval)
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' })
        setIsVotingClosed(true)
      }
    }, 1000)

    // eslint-disable-next-line no-undef
    return () => clearInterval(interval)
  }, [initialDate])

  return { timeLeft, isVotingClosed }
}
