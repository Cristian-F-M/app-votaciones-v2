import { Text, View, Pressable, ScrollView, RefreshControl } from 'react-native'
import { Screen } from '../../components/Screen'
import LogoSena from '../../icons/Logo'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  doFetch,
  getApiErrorsEntries,
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
import { isEnrolledAsync, authenticateAsync } from 'expo-local-authentication'
import Finger from '../../icons/Finger'
import { toast, ToastPosition } from '@backpackapp-io/react-native-toast'
import { TOAST_STYLES } from '../../lib/toastConstants'
import { Input, INPUT_TYPES, SELECT_MODES } from '../../components/Input'
import { StyledPressable } from '../../components/StyledPressable'

export default function Login() {
  const [typesDocuments, setTypesDocuments] = useState([])
  const [typeDocumentCode, setTypeDocumentCode] = useState('CedulaCiudadania')
  const [document, setDocument] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const router = useRouter()
  const [passwordIsVisible, setPasswordIsVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false)
  const configs = useConfig()
  const config = configs?.config || []
  const colorConfig = findConfig({ configs: config, code: 'Color' })
  const color = colorConfig?.value || '#5b89d6'
  const [isBiometricsActive, setIsBiometricsActive] = useState(false)

  const getIsBiometricsActive = useCallback(async () => {
    const { isBiometricsActive } = await getConfigs()
    setIsBiometricsActive(isBiometricsActive || false)
  }, [])

  const resetInputs = useCallback(() => {
    setTypeDocumentCode('CedulaCiudadania')
    setDocument('')
    setPassword('')
    setPasswordIsVisible(false)
    setErrors({})
  }, [])

  const handleBiometrics = useCallback(async () => {
    const biometricRecords = await isEnrolledAsync()
    setIsBiometricsAvailable(biometricRecords)
  }, [])

  const getTypesDocuments = useCallback(async () => {
    const toastIdTypesDocument = toast.loading(
      'Cargando tipos de documentos...',
    )

    const url = `${process.env.EXPO_PUBLIC_API_URL}/typeDocument/`
    const res = await doFetch({ url, method: METHODS.GET })

    if (!res.ok || res.error) {
      toast.error(res.error || res.message, {
        styles: {
          ...TOAST_STYLES.ERROR,
        },
      })
      return
    }

    setTypesDocuments(res.typesDocuments)
    toast.dismiss(toastIdTypesDocument)
    toast.success('Tipos de documentos cargados', {
      styles: {
        ...TOAST_STYLES.SUCCESS,
      },
    })
  }, [])

  useEffect(() => {
    getIsBiometricsActive()
  }, [getIsBiometricsActive])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refs = {
    document: useRef(null),
    password: useRef(null),
    scrollView: useRef(null),
    typeDocument: useRef(null),
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTypesDocuments([])
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      resetInputs()
      getTypesDocuments()
      setRefreshing(false)
    }, 600)
  }, [getTypesDocuments, resetInputs])

  const handleClickLogin = useCallback(async () => {
    const localyErrors: Record<string, string | null> = {}

    if (document.trim() === '') localyErrors.document = 'Campo requerido'
    if (password.trim() === '') localyErrors.password = 'Campo requerido'

    setErrors(localyErrors)

    if (localyErrors.document)
      return scrollSmooth(refs.document, refs.scrollView)
    if (localyErrors.password)
      return scrollSmooth(refs.password, refs.scrollView)

    const localyErrorsEntries = getApiErrorsEntries(localyErrors)

    if (localyErrorsEntries.length > 0) return
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
        toast.error(res.error, {
          position: ToastPosition.TOP,
          styles: {
            ...TOAST_STYLES.ERROR,
          },
        })
      }

      if (!res.ok) {
        toast.error(res.message, {
          position: ToastPosition.TOP,
          styles: {
            ...TOAST_STYLES.ERROR,
          },
        })
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
      router.replace(res.urlRedirect || '404/')
    }
  }, [document, password, router, typeDocumentCode, isBiometricsActive, refs])

  const handleClickLoginBiometrics = useCallback(async () => {
    const { isBiometricsActive } = await getConfigs()

    if (!isBiometricsActive) {
      return toast.error(
        'Debes activar la autenticación de huella dactilar desde la aplicación.',
        {
          duration: 6000,
          styles: TOAST_STYLES.INFO,
        },
      )
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
        return toast.error(res.error, {
          styles: TOAST_STYLES.ERROR,
        })
      }

      if (!res.ok) {
        return toast.error(res.message, {
          styles: TOAST_STYLES.ERROR,
        })
      }

      setItemStorage({
        name: 'token',
        value: res.token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
      })

      router.navigate(res.urlRedirect || '404/')
    }
  }, [router])

  useEffect(() => {
    handleBiometrics()
  }, [handleBiometrics])

  useEffect(() => {
    getTypesDocuments()
  }, [getTypesDocuments])

  return (
    <Screen>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView
        ref={refs.scrollView}
        className="flex-1 p-5"
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[color]}
          />
        }
      >
        <View className="flex-1 justify-center pb-10">
          <View className="flex-col items-center gap-4 mb-10">
            <View>
              <LogoSena
                color={color}
                width={170}
                height={168}
              />
            </View>
            <Text className="text-4xl text-center tracking-widest">
              Inicio de sesión
            </Text>
          </View>

          <View>
            {/* //TODO Do the overload to the Input component */}
            <Input
              type={INPUT_TYPES.SELECT}
              selectedValue={typeDocumentCode}
              items={typesDocuments}
              errors={{ errors, setErrors }}
              innerRef={refs.typeDocument}
              inputRefName="typeDocument"
              label="Tipo de documento"
              dropdownIconRippleColor={color}
              mode={'dropdown'}
              required
            />

            <Input
              type={INPUT_TYPES.TEXT}
              value={{ value: document, setValue: setDocument }}
              placeholder={'123456789'}
              errors={{ errors, setErrors }}
              label="Documento"
              innerRef={refs.document}
              inputRefName="document"
              keyboardType="number-pad"
              required
            />

            <Input
              type={INPUT_TYPES.TEXT}
              value={{ value: password, setValue: setPassword }}
              placeholder={'*********'}
              errors={{ errors, setErrors }}
              label="Contraseña"
              innerRef={refs.password}
              inputRefName="password"
              secureTextEntry={!passwordIsVisible}
              required
            />

            <View className="flex flex-row justify-between items-center w-full">
              <View className="flex flex-row items-center justify-center gap-x-2 -mt-2">
                <BouncyCheckbox
                  size={24}
                  fillColor={color}
                  unFillColor="#FFFFFF"
                  iconStyle={{ borderColor: color }}
                  innerIconStyle={{ borderWidth: 2 }}
                  disableText
                  isChecked={passwordIsVisible}
                  onPress={isChecked => {
                    setPasswordIsVisible(isChecked)
                  }}
                />
                <Text
                  className="text-base"
                  onPress={() => {
                    setPasswordIsVisible(!passwordIsVisible)
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
                          ? color
                          : `${color}80`,
                      }}
                    >
                      <Finger
                        color={'#fff'}
                        width={32}
                        height={32}
                      />
                    </View>
                  </Pressable>
                )}
              </View>
            </View>

            <View className="flex flex-row justify-between items-center w-full">
              <StyledPressable
                text="Iniciar Sesión"
                backgroundColor={`${color}cc`}
                pressableClass="mt-3"
                isLoading={isLoading}
                showLoadingIndicator={true}
                onPress={handleClickLogin}
              />
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
