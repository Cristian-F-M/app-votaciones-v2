import { useEffect, useRef } from 'react'
import { View, Animated, useAnimatedValue } from 'react-native'

export function StepCircle({ color, currentStep, step }) {
  const scaleAnimatedValue = useAnimatedValue(0)
  const scaleAnimationValuePulse = useAnimatedValue(0.5)
  const opacityAnimationValuePulse = useAnimatedValue(0.8)

  const stepCompleted = currentStep >= step
  const isThisStep = currentStep === step

  useEffect(() => {
    const scaleValue = currentStep >= step ? 1 : 0.2

    const animation = Animated.timing(scaleAnimatedValue, {
      toValue: scaleValue,
      duration: 200,
      useNativeDriver: true,
    })

    animation.start()
  }, [currentStep, scaleAnimatedValue, step])

  const scalePulse = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimationValuePulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ),
    [],
  )

  const opacityPulse = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnimationValuePulse, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ),
    [],
  )

  useEffect(() => {
    if (isThisStep) scalePulse?.current.start()
    if (isThisStep) opacityPulse?.current.start()
  }, [isThisStep, scaleAnimationValuePulse, opacityAnimationValuePulse])

  return (
    <View
      key={step}
      className="relative justify-center items-center"
    >
      <Animated.View
        className="absolute z-10 w-12 h-12 rounded-full"
        style={{
          backgroundColor: `${color}9f`,
          transform: [{ scale: isThisStep ? scaleAnimationValuePulse : 0 }],
          opacity: opacityAnimationValuePulse,
        }}
      ></Animated.View>
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
