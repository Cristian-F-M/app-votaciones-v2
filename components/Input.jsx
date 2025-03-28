import { Picker } from '@react-native-picker/picker'
import { Text, TextInput, View } from 'react-native'

export const INPUT_TYPES = {
  TEXT: 'text',
  SELECT: 'select',
}

export const SELECT_MODES = {
  DROPDOWN: 'dropdown',
  MODAL: 'modal',
}

export function Input({
  value,
  placeholder,
  onChange,
  keyboardType = 'default',
  secureTextEntry = false,
  type = INPUT_TYPES.TEXT,
  label = 'no-label',
  classNameInput = '',
  errors = {},
  inputRefName = '',
  innerRef = null,
  selectedValue = '',
  dropdownIconRippleColor = 'gray',
  onValueChange = () => {},
  selectText = '',
  items = [],
  disabled = false,
  mode = SELECT_MODES.MODAL,
  required = false,
}) {
  return (
    <View
      className="mb-4"
      ref={innerRef}
    >
      <Text className="text-black mb-1 text-base">
        {label}
        {required && <Text className="text-red-500"> *</Text>}
      </Text>
      {type === INPUT_TYPES.TEXT && (
        <View className="border h-14 w-full rounded-lg items-center justify-center">
          <TextInput
            className={`h-full w-full items-center justify-center px-3 ${classNameInput}`}
            textAlignVertical="center"
            value={value.value}
            placeholder={placeholder}
            onChangeText={text => {
              value.setValue(text)
              errors.setErrors(prev => ({ ...prev, [inputRefName]: null }))
            }}
            keyboardType={keyboardType}
            editable={!disabled}
            secureTextEntry={secureTextEntry}
          />
        </View>
      )}

      {type === INPUT_TYPES.SELECT && (
        <View
          className={`border rounded-lg h-14 w-full justify-center text-base px-0 ${classNameInput}`}
        >
          <Picker
            selectedValue={selectedValue}
            dropdownIconRippleColor={dropdownIconRippleColor}
            mode={mode}
            prompt={selectText}
            onValueChange={(itemValue, itemIndex) =>
              onValueChange(itemValue, itemIndex)
            }
            enabled={!disabled}
          >
            {!items || items.length === 0 ? (
              <Picker.Item
                label={'Loading...'}
                value={0}
              />
            ) : (
              items.map(item => {
                return (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.code}
                  />
                )
              })
            )}
          </Picker>
        </View>
      )}

      {errors.errors && errors.errors[inputRefName] && (
        <Text className="text-red-600">{errors.errors[inputRefName]}</Text>
      )}
    </View>
  )
}
