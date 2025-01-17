import { View, Text } from 'react-native'
import { useConfig } from '../context/config'
import { findConfig } from '../lib/config'

export function TimeCard({ text, time }) {
  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  return (
    <>
      <View className="flex flex-col items-center">
        <Text
          className="text-2xl"
          style={{ color }}
        >
          {time}
        </Text>
        <Text>{text}</Text>
      </View>
    </>
  )
}
