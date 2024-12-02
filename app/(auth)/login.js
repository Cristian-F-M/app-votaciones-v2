import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  RefreshControl,
  BackHandler,
} from 'react-native'
import { Screen } from '../../components/Screen'
import { Picker } from '@react-native-picker/picker'
import LogoSena from '../../icons/Logo'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  doFetch,
  getConfigs,
  getItemStorage,
  METHODS,
  setItemStorage,
} from '../../lib/api'
import { Link, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { useConfig } from '../../context/config'
import { findConfig } from '../../lib/config'
import { scrollSmooth } from '../../lib/scrollSmooth'
import { DropdownAlertType } from 'react-native-dropdownalert'
import { DropDownAlert, showAlert } from '../../components/DropDownAlert'
import { useNetInfo } from '@react-native-community/netinfo'
import { isEnrolledAsync, authenticateAsync } from 'expo-local-authentication'
import Finger from '../../icons/Finger'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'

export default function Login() {
  const [Color, setColor] = useState()
  const [typesDocuments, setTypesDocuments] = useState(null)
  const [typeDocumentCode, setTypeDocumentCode] = useState('CedulaCiudadania')
  const [document, setDocument] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false)
  const { config } = useConfig()
  const refPrueba = useRef()
  const netInfo = useNetInfo()
  const [isBiometricsActive, setIsBiometricsActive] = useState(false)

  useEffect(() => {
    async function getIsBiometricsActive() {
      const { isBiometricsActive } = await getConfigs()
      console.log(isBiometricsActive)
      setIsBiometricsActive(isBiometricsActive || false)
    }

    getIsBiometricsActive()
  }, [])

  const refs = {
    document: useRef(null),
    password: useRef(null),
    scrollView: useRef(null),
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      router.replace('login')
      setRefreshing(false)
    }, 600)
  }, [router])

  function handleClickLogin() {
    const localyErrors = {}

    if (document.trim() === '') localyErrors.document = 'Campo requerido'
    if (password.trim() === '') localyErrors.password = 'Campo requerido'

    setErrors(localyErrors)

    if (localyErrors.document) return scrollSmooth(refPrueba, refs.scrollView)
    if (localyErrors.password)
      return scrollSmooth(refs.password, refs.scrollView)

    if (localyErrors.length > 0) return
    Login()

    async function Login() {
      setIsLoading(true)

      const res = await doFetch({
        url: `${process.env.EXPO_PUBLIC_API_URL}/login/`,
        method: METHODS.POST,
        body: { typeDocumentCode, document, password },
      })

      // eslint-disable-next-line no-undef
      await new Promise(resolve => setTimeout(resolve, 500))

      if (res.error) {
        showAlert({
          message: res.error,
          type: DropdownAlertType.Error,
          title: 'Error',
        })
      }

      if (!res.ok) {
        showAlert({ message: res.message, type: DropdownAlertType.Warn })
      }

      setIsLoading(false)

      if (!res.ok || res.error) return

      setItemStorage({
        name: 'token',
        value: res.token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
      })

      if (isBiometricsActive) {
        setItemStorage({
          name: 'tokenBiometrics',
          value: res.token,
        })
      }
      router.replace('apprentice/')
    }
  }

  function closeApp() {
    BackHandler.exitApp()
  }

  async function handleClickLoginBiometrics() {
    const { isBiometricsActive } = await getConfigs()

    if (!isBiometricsActive) {
      return showAlert({
        message:
          'Debes activar la autenticación de huella dactilar desde la aplicación.',
        type: DropdownAlertType.Info,
      })
    }

    const biometricResult = await authenticateAsync({
      promptMessage: 'Inicia sesión usando huella dactilar',
      fallbackLabel: 'Inicia sesión con contraseña',
    })
    const { value: tokenBiometrics } = await getItemStorage({
      name: 'tokenBiometrics',
    })

    const { success } = biometricResult
    if (success) {
      const res = await doFetch({
        url: `${process.env.EXPO_PUBLIC_API_URL}/LoginBiometrics/`,
        method: METHODS.POST,
        body: { tokenBiometrics },
      })

      if (res.error) {
        showAlert({
          message: res.error,
          type: DropdownAlertType.Error,
          title: 'Error',
        })
        return
      }

      if (!res.ok) {
        showAlert({ message: res.message, type: DropdownAlertType.Warn })
        return
      }

      setItemStorage({
        name: 'token',
        value: res.token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
      })

      router.replace('apprentice/')
    }
  }

  useEffect(() => {
    async function handleBiometrics() {
      const biometricRecords = await isEnrolledAsync()
      setIsBiometricsAvailable(biometricRecords)
    }

    handleBiometrics()
  }, [])

  useEffect(() => {
    async function getConfigs() {
      const { value: color } = findConfig({ configs: config, code: 'Color' })
      setColor(color)
    }

    async function getTypesDocuments() {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/typeDocument/`
      const res = await doFetch({ url, method: METHODS.GET })

      if (res.error) {
        return Dialog.show({
          type: ALERT_TYPE.DANGER,
          // title: 'Error de conexión',
          textBody: 'Un error ha ocurrido, por favor intenta mas tarde',
          button: 'Aceptar',
          onPressButton: () => closeApp(),
          closeOnOverlayTap: false,
        })
      }
      setTypesDocuments(res.typesDocuments)
    }

    getConfigs()
    getTypesDocuments()
  }, [config, netInfo])

  useEffect(() => {
    const { type } = netInfo

    if (type !== 'wifi' && type == null) {
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        showAlert({
          message: 'Estás accediendo a la aplicación con datos móviles',
          type: DropdownAlertType.Info,
        })
      }, 200)
    }
  }, [netInfo])

  return (
    <Screen>
      <DropDownAlert dismissInterval={2000} />
      <StatusBar
        style="dark"
        backgroundColor="#f2f2f2"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView
        ref={refs.scrollView}
        className="p-5 flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View className="flex-1 justify-center pb-10">
          <View className="flex-col items-center gap-4 mb-10">
            <View>
              <LogoSena
                style={{ fill: Color }}
                width={170}
                height={168}
              />
            </View>
            <Text className="text-4xl text-center tracking-widest">
              Inicio de sesión
            </Text>
          </View>

          <View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tipo de documento</Text>
              <View style={styles.input}>
                <Picker
                  selectedValue={typeDocumentCode}
                  dropdownIconRippleColor={Color}
                  mode="modal"
                  prompt="Seleccione tipo de documento"
                  onValueChange={(itemValue, itemIndex) =>
                    setTypeDocumentCode(itemValue)
                  }
                >
                  {!typesDocuments ? (
                    <Picker.Item
                      label={'Loading...'}
                      value={0}
                    />
                  ) : (
                    typesDocuments.map(typeDocument => {
                      return (
                        <Picker.Item
                          key={typeDocument.id}
                          label={typeDocument.name}
                          value={typeDocument.code}
                        />
                      )
                    })
                  )}
                </Picker>
              </View>
            </View>

            <View
              style={styles.inputContainer}
              ref={refPrueba}
            >
              <Text style={styles.label}>
                Documento
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputText]}
                inputMode="numeric"
                value={document}
                onChangeText={t => {
                  setDocument(t)
                  setErrors({ ...errors, document: null })
                }}
                placeholder="123456789"
              />
              {!!errors.document && (
                <Text style={styles.errorMessage}>{errors.document}</Text>
              )}
            </View>
            <View
              style={styles.inputContainer}
              ref={refs.password}
            >
              <Text style={styles.label}>
                Contraseña
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputText]}
                secureTextEntry={!isVisible}
                value={password}
                onChangeText={t => {
                  setPassword(t)
                  setErrors({ ...errors, password: null })
                }}
                placeholder="*********"
              />
              {!!errors.password && (
                <Text style={styles.errorMessage}>{errors.password}</Text>
              )}
            </View>

            <View className="flex flex-row justify-between items-center w-full">
              <View className="flex flex-row items-center justify-center gap-x-2 -mt-2">
                <BouncyCheckbox
                  size={24}
                  fillColor={Color}
                  unFillColor="#FFFFFF"
                  iconStyle={{ borderColor: Color }}
                  innerIconStyle={{ borderWidth: 2 }}
                  disableText
                  isChecked={isVisible}
                  onPress={isChecked => {
                    setIsVisible(isChecked)
                  }}
                />
                <Text
                  className="text-sm"
                  onPress={() => {
                    setIsVisible(!isVisible)
                  }}
                >
                  Mostrar contraseña
                </Text>
              </View>
              <View>
                {isBiometricsAvailable && (
                  <Pressable onPress={handleClickLoginBiometrics}>
                    <View
                      className="flex p-1 w-[42px] h-[42px] items-center justify-center rounded-full bg-white"
                      style={{
                        backgroundColor: isBiometricsActive
                          ? Color
                          : `${Color}80`,
                      }}
                    >
                      <Finger
                        style={{ color: '#fff' }}
                        width={32}
                        height={32}
                      />
                    </View>
                  </Pressable>
                )}
              </View>
            </View>

            <View clasName="flex flex-row justify-between items-center w-full">
              <Pressable
                onPress={!isLoading ? handleClickLogin : null}
                className={`rounded-lg px-4 py-2 mt-6 flex-row justify-center gap-x-3 relative items-center active:opacity-60`}
                disabled={isLoading}
                style={{
                  backgroundColor: `${Color}${isLoading ? '80' : ''}`,
                  color: `#000000${isLoading ? '80' : ''}`,
                }}
              >
                <Text className="text-lg">Iniciar sesión</Text>
                {isLoading && (
                  <ActivityIndicator
                    className="absolute right-0 mr-2"
                    size={30}
                    color="white"
                  />
                )}
              </Pressable>
            </View>
          </View>
          <View className="flex-row items-center justify-between pt-1">
            <Link
              href="register"
              asChild
            >
              <Pressable>
                <Text className="text-center text-[15px] text-[#4f00ef] underline">
                  Registro
                </Text>
              </Pressable>
            </Link>
            <Link
              href="resetPassword"
              asChild
            >
              <Pressable>
                <Text className="text-center text-[15px] text-[#4f00ef] underline">
                  Restablecer contraseña
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    height: 55,
    fontSize: 16,
  },
  inputText: {
    paddingHorizontal: 20,
  },
  label: {
    color: '#000',
    marginBottom: 4,
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
  },
  eyeIcon: {
    color: 'black',
    position: 'absolute',
    top: 0,
    right: 0,
  },
})
