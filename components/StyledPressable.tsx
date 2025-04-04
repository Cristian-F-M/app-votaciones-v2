import { ActivityIndicator, Pressable, Text } from 'react-native'

export function StyledPressable({
  backgroundColor = 'white',
  text = 'no-text',
  pressableClass = '',
  textClassName = '',
  onPress = (e?: any) => {},
  showLoadingIndicator = false,
  isLoading = false,
  disabled = false,
}) {
  return (
    <Pressable
      className={`px-2 py-3 rounded-lg w-full active:opacity-70 flex-row justify-center items-center ${isLoading ? 'opacity-70' : ''} ${pressableClass}`}
      style={{ backgroundColor: disabled ? '#b3b6bd' : backgroundColor }}
      onPress={!isLoading ? onPress : null}
      disabled={isLoading || disabled}
    >
      <Text
        className={`text-black text-lg text-center w-full ${textClassName}`}
      >
        {text}
      </Text>
      {showLoadingIndicator && isLoading && (
        <ActivityIndicator
          className="absolute right-0 mr-2"
          size={30}
          color="white"
        />
      )}
    </Pressable>
  )
}
