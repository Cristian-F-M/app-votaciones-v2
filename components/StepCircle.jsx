import { useEffect } from 'react'
import { View, Animated, useAnimatedValue } from 'react-native'

export function StepCircle({ color, currentStep, step }) {
  const scaleAnimatedValue = useAnimatedValue(0)
  const stepCompleted = currentStep >= step

  useEffect(() => {
    const animation = Animated.timing(scaleAnimatedValue, {
      toValue: currentStep >= step ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    })

    animation.start()
  }, [currentStep, scaleAnimatedValue, step])

  return (
    <View
      key={step}
      className="relative"
    >
      <Animated.View
        className="w-6 h-6 rounded-full z-50"
        style={{
          backgroundColor: stepCompleted ? `${color}cc` : '#f2f2f2',
          transform: [{ scale: scaleAnimatedValue }],
          borderColor: `${color}88`,
          borderWidth: stepCompleted ? 1 : 0,
        }}
      />
      <View
        className="w-6 h-6 rounded-full absolute z-40 border"
        style={{
          backgroundColor: '#f2f2f2',
          borderColor: `${color}88`,
          borderWidth: stepCompleted ? 1 : 0,
        }}
      />
    </View>
  )
}
