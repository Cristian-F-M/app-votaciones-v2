import { router } from 'expo-router'
import { ScrollView, Switch, Text } from 'react-native'
import { Screen } from '../../../components/Screen'
import { Stack } from 'expo-router'
import { View } from 'react-native'
import ArrowLeft from '../../../icons/ArrowLeft'
import { CardConfig } from '../../../components/CardConfig'
import { useCallback, useEffect, useState } from 'react'
import { useConfig } from '../../../context/config'
import { findConfig } from '../../../lib/config'
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
} from '../../../lib/api'
import { DropDownAlert, showAlert } from '../../../components/DropDownAlert'
import { DropdownAlertType } from 'react-native-dropdownalert'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { RowConfig } from '../../../components/RowConfig'

export default function Config() {
  const { config } = useConfig()
  const { value } = findConfig({ configs: config, code: 'Color' })
  const [isBiometricsActive, setIsBiometricsActive] = useState(false)
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false)

  const getStoragedConfigs = useCallback(async () => {
    const configs = await getConfigs()
    setIsBiometricsActive(configs.isBiometricsActive || false)
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
    router.navigate('/apprentice/')
  }

  async function activateBiometrics() {
    if (isBiometricsActive) {
      removeConfig('isBiometricsActive')
      removeItemStorage({ name: 'tokenBiometrics' })

      showAlert({
        message: 'Se desactivo la autenticación de huella dactilar',
        type: DropdownAlertType.Success,
      })
      return
    }

    const biometricResult = await authenticateAsync({
      promptMessage: 'Activar inicio huella dactilar',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: true,
    })

    const { success } = biometricResult

    if (!success) return setIsBiometricsActive(false)

    const { value: token } = await getItemStorage({ name: 'token' })

    saveConfig('isBiometricsActive', true)
    setItemStorage({ name: 'tokenBiometrics', value: token })

    showAlert({
      message: 'Activaste correctamente la autenticación de huella dactilar',
      type: DropdownAlertType.Success,
    })
  }

  return (
    <>
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
                      onChange={activateBiometrics}
                      value={isBiometricsActive}
                    />
                  </View>
                </RowConfig>
              </>
            )}
          </CardConfig>
        </ScrollView>
      </Screen>
    </>
  )
}
