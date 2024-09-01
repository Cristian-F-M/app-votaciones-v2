import { findNodeHandle } from 'react-native'

export function scrollSmooth(toRef, scrollViewRef) {
  if (!scrollViewRef || !toRef) return

  const scrollViewNode = findNodeHandle(scrollViewRef.current)
  toRef.current.measureLayout(scrollViewNode, (x, y) => {
    scrollViewRef.current.scrollTo({ x: 0, y, animated: true })
  })
}
