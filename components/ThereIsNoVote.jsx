import { Linking, Pressable, Text, View } from 'react-native'
import CalendarX from '../icons/CalendarX'
import { useConfig } from '../context/config'
import { activateNotifications, findConfig } from '../lib/config'
import ExclamationCircle from '../icons/ExclamationCircle'
import { useCallback } from 'react'
import { AnimatedModal, showModal } from './Modal'

export function ThereIsNoVote() {
  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  const checkPermissions = useCallback(async () => {
    const isActivated = await activateNotifications()

    if (isActivated)
      showModal({
        content: (
          <>
            <View>
              <Text>
                Te informarem cuando la votación comience, y cuando haya
                finalizado.
              </Text>
            </View>
          </>
        ),
        title: 'Notificaciones',
        closeButton: true,
      })

    if (!isActivated)
      showModal({
        content: (
          <>
            <View>
              <Text>
                Para recibir notificaciones, por favor, habilite las
                notificaciones en la configuración del dispositivo.
              </Text>
            </View>
          </>
        ),
        title: 'Habilitar notificaciones',
        closeButton: true,
        buttons: [
          {
            text: 'Abrir configuración',
            onPress: () => Linking.openSettings(),
            hideModalOnPress: true,
            className: `p-2 px-3 rounded-lg bg-blue-500/60`,
            textClassName: 'text-gray-800 text-base text-center',
          },
        ],
      })
  }, [])

  return (
    <>
      <AnimatedModal />
      <View className="mx-auto flex flex-1 items-center justify-center bg-gray-100">
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
            <Pressable
              className="mt-6 px-6 py-3 rounded-lg w-full"
              style={{ backgroundColor: `${color}cc` }}
              onPress={checkPermissions}
            >
              <Text className="text-gray-100 text-base text-center">
                Notificarme al iniciar la votación
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  )
}
