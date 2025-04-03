import { Text, View } from 'react-native'
import { useConfig } from '../context/config'
import { findConfig } from '../lib/config'
import { HorizontalSeparator } from './HorizontalSeparator'
import { Shadow } from 'react-native-shadow-2'

export function CardConfig({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  const configs = useConfig()
  const config = configs?.config || []
  const configColor = findConfig({ configs: config, code: 'Color' })
  const color = configColor?.value || '#5b89d6'

  return (
    <Shadow style={{ marginBottom: 24 }}>
      <View className="bg-gray-200/60 p-2">
        <Text
          className="text-lg"
          style={{ color }}
        >
          {title}
        </Text>
        <HorizontalSeparator />
        <View className="mt-1">{children}</View>
      </View>
    </Shadow>
  )
}
