import { useEffect, useState } from 'react'

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // eslint-disable-next-line no-undef
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
