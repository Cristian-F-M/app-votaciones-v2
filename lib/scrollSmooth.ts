import { RefObject } from 'react'
import { ScrollView } from 'react-native'

export function scrollSmooth(
  toRef: RefObject<any>,
  scrollViewRef: RefObject<ScrollView>,
) {
  if (!scrollViewRef || !toRef) return

  toRef.current?.measure(
    (x: number, y: number, width: number, height: number) => {
      scrollViewRef.current?.scrollTo({ x: 0, y, animated: true })
    },
  )
}
