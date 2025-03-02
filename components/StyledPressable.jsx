import { ActivityIndicator, Pressable, Text } from 'react-native'
import { styled } from 'nativewind'

export function StyledPressable({
  color = 'white',
  text = 'no-text',
  pressableClass = '',
  textClassName = '',
  onPress = () => {},
  showLoadingIndicator = false,
  isLoading = false,
}) {
  const StyledPressable = styled(Pressable)

  return (
    <StyledPressable
      className={`px-2 py-3 rounded-lg w-full active:opacity-70 flex-row justify-center items-center ${isLoading ? 'opacity-70' : ''} ${pressableClass}`}
      style={{ backgroundColor: color }}
      onPress={!isLoading ? onPress : null}
      disabled={isLoading}
    >
      <Text className={`text-black text-base text-center ${textClassName}`}>
        {text}
      </Text>
      {showLoadingIndicator && isLoading && (
        <ActivityIndicator
          className="absolute right-0 mr-2"
          size={30}
          color="white"
        />
      )}
    </StyledPressable>
  )
}
