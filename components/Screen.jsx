import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function Screen({ children }) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {children}
    </View>
  )
}
