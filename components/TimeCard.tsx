import { View, Text } from 'react-native'
import { useConfig } from '../context/config'
import { findConfig } from '../lib/config'

export function TimeCard({ text, time }: { text: string; time: string }) {
  const configs = useConfig()
  const config = configs?.config || []
  const colorConfig = findConfig({ configs: config, code: 'Color' })
  const color = colorConfig?.value || '#5b89d6'

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
