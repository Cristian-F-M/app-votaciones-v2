import { Text, View } from 'react-native'
import { useConfig } from '../context/config'
import { findConfig } from '../lib/config'
import { HorizontalSeparator } from './HorizontalSeparator'
import { Shadow } from 'react-native-shadow-2'

export function CardConfig({ children, title }) {
  const { config } = useConfig()
  const { value } = findConfig({ configs: config, code: 'Color' })

  return (
    <Shadow className="mb-6">
      <View className="bg-gray-200/60 p-2">
        <Text
          className="text-lg"
          style={{ color: value }}
        >
          {title}
        </Text>
        <HorizontalSeparator />
        <View className="mt-1">{children}</View>
      </View>
    </Shadow>
  )
}
