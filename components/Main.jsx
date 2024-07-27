import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function Main() {
  const insets = useSafeAreaInsets()

  return (
    <>
      <View
        className="flex-1 items-center justify-evenly"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      ></View>
    </>
  )
}
