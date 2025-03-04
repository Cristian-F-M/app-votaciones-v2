import { Linking, Text, ToastAndroid, View } from 'react-native'
import CalendarX from '../icons/CalendarX'
import { useConfig } from '../context/config'
import { activateNotifications, findConfig } from '../lib/config'
import ExclamationCircle from '../icons/ExclamationCircle'
import { useCallback, useEffect, useRef, useState } from 'react'
import { StyledPressable } from './StyledPressable'
import { getConfigs } from '../lib/api'
import { Modalize } from 'react-native-modalize'
import Bell from '../icons/Bell'

export function ThereIsNoVote() {
  const [isNotificationsActive, setIsNotificationsActive] = useState(false)
  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value
  const modalizeRef = useRef(null)

  const setConfigs = useCallback(async () => {
    const configs = await getConfigs()
    setIsNotificationsActive(configs.isNotificationsActive || false)
  }, [])

  useEffect(() => {
    setConfigs()
  }, [setConfigs])

  const checkPermissions = useCallback(async e => {
    const isActivated = await activateNotifications()

    if (isActivated) {
      ToastAndroid.show(
        'Ya tienes las notificaciones activadas',
        ToastAndroid.LONG,
      )
      setIsNotificationsActive(true)
      return
    }

    if (!isActivated) {
      ToastAndroid.show(
        'Debes activar las notificaciones en la configuración del dispositivo',
        ToastAndroid.LONG,
      )

      openModalize(e)
    }
  }, [])

  const openModalize = e => {
    e.persist()
    modalizeRef.current.open()
  }
  const handleClickOpenSettings = useCallback(() => {
    Linking.openSettings()
    modalizeRef.current.close()
  }, [])

  const handleClickdDismissModalize = useCallback(() => {
    modalizeRef.current.close()
  }, [])

  return (
    <>
      <View className="mx-auto flex flex-1 items-center justify-center bg-gray-100">
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight
          modalStyle={{ paddingVertical: 15, paddingHorizontal: 20 }}
        >
          <View className="w-full items-center">
            <Bell
              width={50}
              height={50}
              style={{ color }}
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
        <View className="w-[95%] flex flex-col items-center bg-white p-5 rounded-lg border border-gray-200">
          <View className="bg-[#ffedd5] p-3 rounded-full">
            <CalendarX
              style={{ color }}
              width={40}
              height={40}
              className=""
            />
          </View>
          <Text className="mt-2 text-2xl text-center font-medium text-gray-900">
            No hay votaciones activas
          </Text>
          <Text className="mt-2 text-center text-gray-600 text-sm">
            En este momento no hay procesos de votación en curso. Por favor,
            vuelve más tarde para participar en futuras elecciones.
          </Text>
          <View className=" flex flex-row items-center justify-between mt-6 p-3 rounded-lg border border-[#fed7aa] bg-red-100/20">
            <View className="self-start">
              <ExclamationCircle
                style={{ color: 'red' }}
                width={25}
                height={25}
              />
            </View>
            <Text className="ml-2 text-center text-[12px] leading-4">
              Las votaciones se anunciarán con anticipación a través de nuestros
              canales oficiales. Mantente atento a las próximas convocatorias.
            </Text>
          </View>
          <View className="w-full">
            <StyledPressable
              text={
                isNotificationsActive
                  ? 'Notificaciones activadas'
                  : 'Notificarme al iniciar la votación'
              }
              backgroundColor={`${color}aa`}
              pressableClass="mt-6 px-6 py-3 rounded-lg w-full"
              onPress={checkPermissions}
            />
          </View>
        </View>
      </View>
    </>
  )
}
