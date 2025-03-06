import { Text, View } from 'react-native'
import { StepCircle } from './StepCircle'

export function StepIndicator({ color, currentStep, totalSteps }) {
  return (
    <View className="w-11/12 mt-6">
      <View className="items-center justify-center w-full">
        {/* points - steps */}
        <View className="flex flex-row justify-between items-center w-full px-2">
          {Array.from({ length: totalSteps }).map((_, i) => {
            return (
              <StepCircle
                key={i}
                color={color}
                currentStep={currentStep}
                step={i + 1}
              />
            )
          })}
        </View>
        {/* Line */}
        <View className="absolute h-1 w-11/12 bg-gray-400/40"></View>
      </View>
      {/* text - steps */}
      <View className="flex flex-row justify-between items-center w-full">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <Text
            key={`step-text-${i}`}
            className="min-w-6 text-center text-gray-500"
          >
            Paso {i + 1}
          </Text>
        ))}
      </View>
    </View>
  )
}
