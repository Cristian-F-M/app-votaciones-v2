export function scrollSmooth(toRef, scrollViewRef) {
  if (!scrollViewRef || !toRef) return

  toRef.current.measure((x, y) => {
    scrollViewRef.current.scrollTo({ x: 0, y, animated: true })
  })
}
