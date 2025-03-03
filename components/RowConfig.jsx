import { Switch, Text, View } from 'react-native'
import { useConfig } from '../context/config'
import { findConfig } from '../lib/config'

export function RowConfig({
  label,
  useSwitch,
  switchValue = {},
  falseColor = '#767577',
  trueColor = '',
  onChange = () => {},
  children,
  configContent,
  disabled = false,
}) {
  const { config } = useConfig()
  const configColor = findConfig({ configs: config, code: 'Color' }).value
  const color = trueColor || configColor

  return (
    <>
      <View className="flex flex-row justify-between items-center w-full">
        {children && children}
        {!children && (
          <>
            <View>
              <Text style={{ color: disabled ? '#99a1af' : '#000' }}>
                {label}
              </Text>
            </View>
            {useSwitch && (
              <View>
                <Switch
                  trackColor={{
                    false: disabled ? '#99a1af' : falseColor,
                    true: color,
                  }}
                  thumbColor="white"
                  onValueChange={() => {
                    switchValue.setValue(!switchValue.value)
                  }}
                  onChange={onChange}
                  value={!disabled ? switchValue.value : false}
                  disabled={disabled}
                />
              </View>
            )}
            {!useSwitch && configContent}
          </>
        )}
      </View>
    </>
  )
}
