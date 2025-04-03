import { Linking, Text, ToastAndroid, View } from 'react-native'
import BarChart from '../icons/BarChart'
import { StyledPressable } from './StyledPressable'
import Bell from '../icons/Bell'
import { Modalize } from 'react-native-modalize'
import { useCallback, useRef, useState } from 'react'
import { activateNotifications } from '../lib/config'

export function LoadingWinner() {
  const color = '#ff6719'
  const [isNotificationsActive, setIsNotificationsActive] = useState(false)
  const modalizeRef = useRef<Modalize>(null)
  const handleClickOpenSettings = useCallback(() => {
    Linking.openSettings()
    modalizeRef.current?.close()
  }, [])

  const checkPermissions = useCallback(async (e: any) => {
    const isActivated = await activateNotifications()

    if (isActivated) {
      ToastAndroid.show(
        'Ya tienes las notificaciones activadas',
        ToastAndroid.LONG,
      )
      setIsNotificationsActive(true)
      return
    }

    if (!isActivated) openModalize(e)
  }, [])

  const openModalize = (e: any) => {
    e.persist()
    modalizeRef.current?.open()
  }

  const handleClickdDismissModalize = useCallback(() => {
    modalizeRef.current?.close()
  }, [])

  return (
    <View className="flex-1 justify-center items-center">
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        modalStyle={{ paddingVertical: 15, paddingHorizontal: 20 }}
      >
        <View className="w-full items-center">
          <Bell
            width={50}
            height={50}
            color={color}
          />
          <Text className="text-xl font-semibold mt-2">
            Activa las notificaciones
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            Para recibir actualizaciones importantes, debes activar las
            notificaciones en la configuración de tu dispositivo.
          </Text>
          <StyledPressable
            pressableClass="mt-5"
            text="Abrir configuraciones"
            backgroundColor={`${color}cc`}
            onPress={handleClickOpenSettings}
          />
          <StyledPressable
            text="Más tarde"
            textClassName="text-sm text-gray-600"
            pressableClass="h-7 p-0 mt-2 mb-4"
            onPress={handleClickdDismissModalize}
          />
        </View>
      </Modalize>
      <View
        className="w-11/12 h-auto border rounded-lg"
        style={{ borderColor: color }}
      >
        <View
          className="py-6 px-5 rounded-tr-md rounded-tl-md"
          style={{ backgroundColor: color }}
        >
          <Text className="text-center text-2xl text-white">
            Votación finalizada
          </Text>
        </View>
        <View className="w-full items-center gap-y-3 py-6 px-5">
          <View className="animate-pulse">
            <BarChart
              width={90}
              height={90}
              color={color}
            />
          </View>
          <Text className="text-xl text-gray-700 font-semibold text-center">
            Calculando resultados...
          </Text>
          <Text className="text-gray-500 text-center">
            La votación ha finalizado. Estamos procesando todos los votos para
            determinar el ganador. Este proceso puede tomar algún tiempo.
          </Text>

          <View className="mt-5">
            <StyledPressable
              text="Notificar cuando haya un ganador"
              backgroundColor={color}
              textClassName="text-white"
              onPress={checkPermissions}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
