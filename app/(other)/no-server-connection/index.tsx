import { Screen } from '@components/Screen'
import { StatusBar } from 'expo-status-bar'
import { BackHandler, Text, View } from 'react-native'
import AlertTriangle from 'icons/AlertTriangle'
import { useConfig } from 'context/config'
import { findConfig } from '@lib/config'
import { StyledPressable } from '@components/StyledPressable'

export default function NoServerConnection() {
  const configs = useConfig()
  const config = configs?.config || []
  const configColor = findConfig({ configs: config, code: 'configColor' })
  const color = configColor?.value || '#ff6719'

  return (
    <Screen className="items-center justify-center">
      <StatusBar style="dark" />
      <View
        className="w-11/12 border rounded-md"
        style={{ borderColor: `${color}5f` }}
      >
        <View
          className="border-b w-full flex-row items-center py-6 gap-x-2 px-5"
          style={{ borderColor: `${color}5f` }}
        >
          <AlertTriangle color={color} />
          <View>
            <Text
              className="text-xl"
              style={{ color: `${color}` }}
            >
              Error de conexión
            </Text>
          </View>
        </View>
        <View className="px-5 py-6 gap-y-3">
          <Text className="text-gray-500">
            No hay conexión con el servidor en este momento. Estamos trabajando
            para solucionar este problema lo más antes posible.
          </Text>
          <Text className="text-gray-500">
            Por favor, intente nuevamente más tarde. Lamentamos las molestias
            ocasionadas.
          </Text>
          <StyledPressable
            pressableClass="w-32 self-end mt-4"
            backgroundColor={`${color}bb`}
            text="Salir"
            onPress={() => BackHandler.exitApp()}
          />
        </View>
      </View>
    </Screen>
  )
}
