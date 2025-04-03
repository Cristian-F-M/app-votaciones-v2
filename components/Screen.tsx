import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function Screen({
  children,
  safeArea = true,
  className = '',
}: {
  children: React.ReactNode
  safeArea?: boolean
  className?: string
}) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className={`flex-1 ${className}`}
      style={
        safeArea ? { paddingTop: insets.top, paddingBottom: insets.bottom } : {}
      }
    >
      {children}
    </View>
  )
}
