import { router } from 'expo-router'
import { ScrollView, ToastAndroid } from 'react-native'
import { Screen } from '../../../components/Screen'
import { Stack } from 'expo-router'
import ArrowLeft from '../../../icons/ArrowLeft'
import { CardConfig } from '../../../components/CardConfig'
import { useCallback, useEffect, useState } from 'react'
import { activateNotifications } from '../../../lib/config'
import { isEnrolledAsync, authenticateAsync } from 'expo-local-authentication'
import {
  getConfigs,
  getItemStorage,
  removeItemStorage,
  saveConfig,
  setItemStorage,
} from '../../../lib/api'
import { RowConfig } from '../../../components/RowConfig'
import { saveNotificationToken } from '../../../lib/config'
import { toast } from '@backpackapp-io/react-native-toast'
import { TOAST_STYLES } from '../../../lib/toastConstants'

export default function Config() {
  const [isBiometricsActive, setIsBiometricsActive] = useState(false)
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false)
  const [isNotificationsActive, setIsNotificationsActive] = useState(false)

  const getStoragedConfigs = useCallback(async () => {
    const configs = await getConfigs()
    setIsBiometricsActive(configs.isBiometricsActive || false)
    setIsNotificationsActive(configs.isNotificationsActive || false)
  }, [])

  useEffect(() => {
    async function getIsBiometricsAvailable() {
      const biometricRecords = await isEnrolledAsync()
      setIsBiometricsAvailable(biometricRecords)
    }

    getStoragedConfigs()

    getIsBiometricsAvailable()
    // getIsBiometricsActive()
  }, [getStoragedConfigs])

  function handleCliclHome() {
    router.push('/apprentice/')
  }

  const toggleLoginBiometrics = useCallback(async () => {
    if (isBiometricsActive) {
      await saveConfig('isBiometricsActive', false)
      await removeItemStorage({ name: 'tokenBiometrics' })

      toast.success('Autenticación de huella dactilar desactivada', {
        styles: TOAST_STYLES.INFO,
      })
      return setIsBiometricsActive(false)
    }

    const biometricResult = await authenticateAsync({
      promptMessage: 'Activar inicio huella dactilar',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: true,
    })

    const { success } = biometricResult

    if (!success) {
      ToastAndroid.show('Cancelado', ToastAndroid.SHORT)
      return setIsBiometricsActive(false)
    }

    const { value: token } = await getItemStorage({ name: 'token' })

    saveConfig('isBiometricsActive', true)
    setItemStorage({ name: 'tokenBiometrics', value: token })

    setIsBiometricsActive(true)
    toast.success('Autenticación de huella dactilar activada', {
      styles: TOAST_STYLES.SUCCESS,
    })
  }, [isBiometricsActive])

  const toggleNotifications = useCallback(async () => {
    if (isNotificationsActive) {
      await saveConfig('isNotificationsActive', false)

      const res = await saveNotificationToken(null)

      if (!res.ok) {
        toast.error(res.message, {
          styles: TOAST_STYLES.ERROR,
        })
        return
      }

      toast.success('Notificaciones desactivadas', {
        styles: TOAST_STYLES.SUCCESS,
      })
      return setIsNotificationsActive(false)
    }

    const isActivated = await activateNotifications()
    console.log({ isActivated })

    if (isActivated) {
      toast.success('Activaste correctamente las notificaciones', {
        styles: TOAST_STYLES.SUCCESS,
      })
      setIsNotificationsActive(true)
      return
    }

    toast.error('No se pudo activar las notificaciones', {
      styles: TOAST_STYLES.ERROR,
    })
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      setIsNotificationsActive(false)
    }, 1500)
  }, [isNotificationsActive])

  return (
    <>
      <Screen safeArea={false}>
        <Stack.Screen
          options={{
            headerTitle: 'Configuraciónes',
            headerTitleAlign: 'center',
            headerShown: true,
            headerLeft: () => (
              <ArrowLeft
                onPress={handleCliclHome}
                width={30}
                height={30}
                style={{ color: 'black' }}
              />
            ),
          }}
        />
        <ScrollView className="mt-3 flex-1">
          <CardConfig title="Inicio de sesión">
            <RowConfig
              label="Activar inicio con huella"
              onChange={toggleLoginBiometrics}
              switchValue={{
                value: isBiometricsActive,
                setValue: setIsBiometricsActive,
              }}
              disabled={!isBiometricsAvailable}
              useSwitch
            />
          </CardConfig>
          <CardConfig title="Notificaciones">
            <RowConfig
              label="Activar notificaciones"
              onChange={toggleNotifications}
              useSwitch
              switchValue={{
                value: isNotificationsActive,
                setValue: setIsNotificationsActive,
              }}
            />
          </CardConfig>
        </ScrollView>
      </Screen>
    </>
  )
}
