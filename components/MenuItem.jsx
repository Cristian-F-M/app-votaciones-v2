import { Pressable, Text } from 'react-native'

export function MenuItem({ text, onPress, pressableClass = '', children }) {
  return (
    <>
      <Pressable
        className={`mt-3 bg-gray-400 py-4 px-2 rounded-sm ${pressableClass}`}
        onPress={onPress}
      >
        {children && children}
        {!children && <Text className="text-lg text-center">{text}</Text>}
      </Pressable>
    </>
  )
}
