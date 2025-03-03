import { router } from 'expo-router'
import { ScrollView, Switch, Text, ToastAndroid } from 'react-native'
import { Screen } from '../../../components/Screen'
import { Stack } from 'expo-router'
import { View } from 'react-native'
import ArrowLeft from '../../../icons/ArrowLeft'
import { CardConfig } from '../../../components/CardConfig'
import { useCallback, useEffect, useState } from 'react'
import { useConfig } from '../../../context/config'
import { activateNotifications, findConfig } from '../../../lib/config'
import {
  hasHardwareAsync,
  isEnrolledAsync,
  authenticateAsync,
} from 'expo-local-authentication'
import {
  getConfigs,
  getItemStorage,
  removeConfig,
  removeItemStorage,
  saveConfig,
  setItemStorage,
  getAllKeys,
} from '../../../lib/api'
import { DropDownAlert, showAlert } from '../../../components/DropDownAlert'
import { DropdownAlertType } from 'react-native-dropdownalert'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { RowConfig } from '../../../components/RowConfig'
import { AnimatedModal } from '../../../components/Modal'
import { saveNotificationToken } from '../../../lib/config'
import { toast } from '@backpackapp-io/react-native-toast'
import { TOAST_STYLES } from '../../../lib/toastConstants'

export default function Config() {
  const { config } = useConfig()
  const { value } = findConfig({ configs: config, code: 'Color' })
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

  async function toggleLoginBiometrics() {
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
  }

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
      <AnimatedModal />
      <DropDownAlert
        dismissInterval={2000}
        alertPosition="bottom"
      />
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
            {isBiometricsAvailable && (
              <>
                <RowConfig>
                  <View>
                    <Text>Activar inicio con huella</Text>
                  </View>
                  <View>
                    <Switch
                      trackColor={{ false: '#767577', true: value }}
                      thumbColor="white"
                      onValueChange={() => {
                        setIsBiometricsActive(!isBiometricsActive)
                      }}
                      onChange={toggleLoginBiometrics}
                      value={isBiometricsActive}
                    />
                  </View>
                </RowConfig>
              </>
            )}
          </CardConfig>
          <CardConfig title="Notificaciones">
            <RowConfig>
              <View>
                <Text>Activar notificaciones</Text>
              </View>
              <View>
                <Switch
                  trackColor={{ false: '#767577', true: value }}
                  thumbColor="white"
                  onValueChange={() =>
                    setIsNotificationsActive(!isNotificationsActive)
                  }
                  onChange={toggleNotifications}
                  value={isNotificationsActive}
                />
              </View>
            </RowConfig>
          </CardConfig>
        </ScrollView>
      </Screen>
    </>
  )
}
