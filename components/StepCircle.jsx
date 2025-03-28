import { useEffect, useRef } from 'react'
import { View, Animated, useAnimatedValue } from 'react-native'

export function StepCircle({ color, currentStep, step }) {
  const scaleAnimatedValue = useAnimatedValue(0)
  const scaleAnimationValuePulse = useAnimatedValue(0.5)
  const opacityAnimationValuePulse = useAnimatedValue(0.8)
  const animationDuration = 1300

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
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimationValuePulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ),
  ).current

  const opacityPulse = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnimationValuePulse, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimationValuePulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ),
  ).current

  useEffect(() => {
    if (isThisStep) scalePulse.start()
    if (isThisStep) opacityPulse.start()
  }, [
    isThisStep,
    scaleAnimationValuePulse,
    opacityAnimationValuePulse,
    scalePulse,
    opacityPulse,
  ])

  return (
    <View
      key={step}
      className="relative justify-center items-center"
    >
      <Animated.View
        className="absolute z-10 size-14 rounded-full"
        style={{
          backgroundColor: `${color}9f`,
          transform: [{ scale: isThisStep ? scaleAnimationValuePulse : 0 }],
          opacity: opacityAnimationValuePulse,
        }}
      ></Animated.View>
      <Animated.View
        className="size-7 rounded-full z-50"
        style={{
          backgroundColor: stepCompleted ? `${color}cc` : '#f2f2f2',
          transform: [{ scale: scaleAnimatedValue }],
          borderColor: `${color}88`,
          borderWidth: stepCompleted ? 1 : 0,
        }}
      />
      <View
        className="size-7 rounded-full absolute z-40 border"
        style={{
          backgroundColor: '#f2f2f2',
          borderColor: `${color}88`,
          borderWidth: stepCompleted ? 0 : 1,
        }}
      />
    </View>
  )
}
