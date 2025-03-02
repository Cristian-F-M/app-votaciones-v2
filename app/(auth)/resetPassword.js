import {
  ActivityIndicator,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from 'react-native'
import { Screen } from '../../components/Screen'
import { router, Stack } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import LogoSena from '../../icons/Logo'
import { useConfig } from '../../context/config'
import { findConfig } from '../../lib/config'
import { Input, INPUT_TYPES, SELECT_MODES } from '../../components/Input'
import {
  doFetch,
  getApiErrors,
  getApiErrorsEntries,
  METHODS,
} from '../../lib/api'
import { toast, ToastPosition } from '@backpackapp-io/react-native-toast'
import { TOAST_STYLES } from '../../lib/toastConstants'
import { Pressable, RefreshControl } from 'react-native-gesture-handler'
import { StepIndicator } from '../../components/StepIndicator'
import { scrollSmooth } from '../../lib/scrollSmooth'

export default function ResetPassword() {
  const [typesDocuments, setTypesDocuments] = useState([])
  const [typeDocumentCode, setTypeDocumentCode] = useState('CedulaCiudadania')
  const [document, setDocument] = useState('')
  const [errors, setErrors] = useState({})
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState({})
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  // const StyledPressable = styled(Pressable)

  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refs = {
    typeDocument: useRef(null),
    verificationCode: useRef(null),
    password: useRef(null),
    passwordConfirmation: useRef(null),
    scrollView: useRef(null),
  }

  const getTypesDocuments = useCallback(async () => {
    const toastIdTypesDocument = toast.loading(
      'Cargando tipos de documentos...',
    )

    const res = await doFetch({ url: 'typeDocument/', method: METHODS.GET })

    if (!res.ok || res.error) {
      toast.error(res.error || res.message, {
        styles: TOAST_STYLES.ERROR,
      })
      return
    }

    setTypesDocuments(res.typesDocuments)
    toast.dismiss(toastIdTypesDocument)
    toast.success('Tipos de documentos cargados', {
      styles: TOAST_STYLES.SUCCESS,
    })
  }, [])

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true)
    setTypesDocuments([])
    resetInputs()
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      setIsRefreshing(false)
      getTypesDocuments()
    }, 600)
  }, [getTypesDocuments, resetInputs])

  const resetInputs = useCallback(() => {
    setTypeDocumentCode('CedulaCiudadania')
    setDocument('')
    setErrors({})
  }, [])

  useEffect(() => {
    getTypesDocuments()
  }, [getTypesDocuments])

  const handleClickFindUser = useCallback(async () => {
    if (isLoading) ToastAndroid.show('Espera un momento...', ToastAndroid.SHORT)

    let localyErrors = {}

    if (typeDocumentCode === '')
      localyErrors.typeDocumentCode = 'Campo requerido'
    if (document.trim() === '') localyErrors.document = 'Campo requerido'

    setErrors(prev => ({ ...prev, ...localyErrors }))

    const localyErrorsEntries = getApiErrorsEntries(localyErrors)
    const errorsEntries = getApiErrorsEntries(errors)

    if (localyErrorsEntries.length > 0 || errorsEntries.length > 0) {
      const [key] = localyErrorsEntries[0] || errorsEntries[0]
      scrollSmooth(refs[key], refs.scrollView)
      return
    }

    const toastFindUserId = toast.loading('Buscando usuario...')
    setIsLoading(true)

    const res = await doFetch({
      url: 'user/findUser/',
      method: METHODS.POST,
      body: { typeDocumentCode, document },
    })

    setIsLoading(false)
    toast.dismiss(toastFindUserId)

    if (res.error)
      return toast.error(res.error, {
        position: ToastPosition.TOP,
        styles: {
          ...TOAST_STYLES.ERROR,
        },
      })

    if (!res.ok && res.errors) {
      const apiErrors = getApiErrors(res.errors)
      setErrors(prev => ({ ...prev, ...apiErrors }))
      scrollSmooth(refs[Object.keys(apiErrors)[0]], refs.scrollView)
      return
    }

    if (!res.ok) {
      toast.error(res.message, {
        position: ToastPosition.TOP,
        styles: {
          ...TOAST_STYLES.ERROR,
        },
      })
      return
    }

    setUser(res.user)
    setCurrentStep(1)
    setTypeDocumentCode('CedulaCiudadania')
    setDocument('')
  }, [typeDocumentCode, document, errors, refs, isLoading])

  const handleClickChangeUser = useCallback(() => {
    if (isLoading)
      return ToastAndroid.show('Espera un momento...', ToastAndroid.SHORT)
    setCurrentStep(0)
    setUser('')
    setDocument('')
    setTypeDocumentCode('CedulaCiudadania')
  }, [isLoading])

  const handleClickSendEmail = useCallback(async () => {
    if (!user) return setCurrentStep(0)
    if (isLoading)
      return ToastAndroid.show('Espera un momento...', ToastAndroid.SHORT)

    const toastSendEmailId = toast.loading('Enviando...')
    setIsLoading(true)

    const res = await doFetch({
      url: 'user/sendPasswordResetCode',
      method: METHODS.POST,
      body: { userId: user.id },
    })

    toast.dismiss(toastSendEmailId)
    setIsLoading(false)

    if (!res.ok) {
      return toast.error(res.message, {
        style: TOAST_STYLES.ERROR,
      })
    }

    setCurrentStep(2)
  }, [user, isLoading])

  const handleClickVerifyCode = useCallback(async () => {
    if (!user) return setCurrentStep(0)
    if (isLoading)
      return ToastAndroid.show('Espera un momento...', ToastAndroid.SHORT)

    let localyErrors = {}

    if (verificationCode.trim() === '')
      localyErrors.verificationCode = 'Campo requerido'

    setErrors(prev => ({ ...prev, ...localyErrors }))

    const localyErrorsEntries = getApiErrorsEntries(localyErrors)
    const errorsEntries = getApiErrorsEntries(errors)

    if (localyErrorsEntries.length > 0 || errorsEntries.length > 0) {
      const [key] = localyErrorsEntries[0] || errorsEntries[0]
      scrollSmooth(refs[key], refs.scrollView)
      return
    }

    const toastVerifyCodeId = toast.loading('Verificando...')
    setIsLoading(true)

    const res = await doFetch({
      url: 'user/verifyPasswordResetCode',
      method: METHODS.POST,
      body: { userId: user.id, code: verificationCode },
    })

    toast.dismiss(toastVerifyCodeId)
    setIsLoading(false)

    if (res.error)
      return toast.error(res.error, {
        position: ToastPosition.TOP,
        styles: {
          ...TOAST_STYLES.ERROR,
        },
      })

    if (res.errors) {
      const apiErrors = getApiErrors(res.errors)
      setErrors(prev => ({ ...prev, ...apiErrors }))
      scrollSmooth(refs[Object.keys(apiErrors)[0]], refs.scrollView)
      return
    }

    if (!res.ok) {
      return toast.error(res.message, {
        position: ToastPosition.TOP,
        styles: {
          ...TOAST_STYLES.ERROR,
        },
      })
    }

    setCurrentStep(3)
  }, [user, verificationCode, errors, refs, isLoading])

  const handleClickChangePassword = useCallback(async () => {
    if (isLoading)
      return ToastAndroid.show('Espera un momento...', ToastAndroid.SHORT)
    let localyErrors = {}

    if (password.trim() === '') localyErrors.password = 'Campo requerido'
    if (passwordConfirmation.trim() === '')
      localyErrors.passwordConfirmation = 'Campo requerido'
    if (password !== passwordConfirmation)
      localyErrors.passwordConfirmation = 'Las contraseñas no coinciden'

    setErrors(prev => ({ ...prev, ...localyErrors }))

    const localyErrorsEntries = getApiErrorsEntries(localyErrors)
    const errorsEntries = getApiErrorsEntries(errors)

    if (localyErrorsEntries.length > 0 || errorsEntries.length > 0) {
      const [key] = localyErrorsEntries[0] || errorsEntries[0]
      scrollSmooth(refs[key], refs.scrollView)
      return
    }

    setIsLoading(true)

    const res = await doFetch({
      url: 'user/updatePassword',
      method: METHODS.PUT,
      body: {
        userId: user.id,
        password: password,
        passwordConfirmation: passwordConfirmation,
        code: verificationCode,
      },
    })

    setIsLoading(false)

    if (res.errors) {
      const apiErrors = getApiErrors(res.errors)
      setErrors(prev => ({ ...prev, ...apiErrors }))
      return
    }

    if (res.error) {
      return toast.error(res.error, {
        style: TOAST_STYLES.ERROR,
      })
    }

    if (!res.ok) {
      toast.error(res.message, {
        style: TOAST_STYLES.ERROR,
      })
      setCurrentStep(0)
      setDocument('')
      setTypeDocumentCode('CedulaCiudadania')
      setErrors({})
      setVerificationCode('')
      setPassword('')
      setPasswordConfirmation('')
      return
    }

    setPassword('')
    setPasswordConfirmation('')
    setVerificationCode('')

    toast.success(res.message, {
      style: TOAST_STYLES.SUCCESS,
    })

    // eslint-disable-next-line no-undef
    setTimeout(() => {
      const urlReturn = res.returnUrl || 'login/'
      router.replace(urlReturn)
    }, 1000)
  }, [
    password,
    passwordConfirmation,
    errors,
    refs,
    user,
    verificationCode,
    isLoading,
  ])

  return (
    <Screen>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
        }}
      />
      <ScrollView
        className="flex-1 w-11/12 mx-auto"
        contentContainerStyle={{
          alignItems: 'center',
          // marginVertical: 'auto',
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[color]}
          />
        }
        ref={refs.scrollView}
      >
        <LogoSena
          width={160}
          height={160}
          style={{ fill: color }}
        />
        <Text className="text-3xl font-medium text-center mt-6">
          Restablecer contraseña
        </Text>
        <Text className="text-base text-center text-gray-500">
          Ingresa tu información para restablecer su contraseña
        </Text>

        <StepIndicator
          color={color}
          currentStep={currentStep}
          totalSteps={4}
        />

        <View className="w-full mt-10 mb-8">
          {currentStep === 0 && (
            <View
              id="step-0"
              className="user w-full"
            >
              <Input
                label="Tipo de documento"
                type={INPUT_TYPES.SELECT}
                selectedValue={typeDocumentCode}
                errors={{ errors, setErrors }}
                items={typesDocuments}
                innerRef={refs.typeDocument}
                inputRefName="typeDocument"
                dropdownIconRippleColor={color}
                mode={SELECT_MODES.DROPDOWN}
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

              <View clasName="flex flex-row justify-between items-center w-full overflow-hidden">
                <Pressable
                  onPress={handleClickFindUser}
                  className={`rounded-lg px-4 py-2 mt-6 flex-row justify-center relative items-center active:opacity-20`}
                  disabled={isLoading}
                  style={{
                    backgroundColor: `${color}${isLoading ? '80' : 'dd'}`,
                    color: `#000000${isLoading ? '80' : ''}`,
                  }}
                >
                  <Text className="text-lg">Buscar usuario</Text>
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
          )}

          {currentStep === 1 && (
            <View
              id="step-1"
              className=""
            >
              <Text className="text-center text-gray-700 flex">
                Se enviará un correo electrónico con instrucciones para
                restablecer su contraseña al correo{' '}
                <Text className="text-black font-semibold">{user.email}</Text>.
              </Text>
              <View className="flex flex-row justify-evenly mt-8 w-full">
                <Pressable
                  onPress={!isLoading ? handleClickChangeUser : null}
                  className="rounded px-6 py-3 w-[48%]"
                  style={{ borderColor: 'gray', borderWidth: 1 }}
                >
                  <Text className="text-center">Cambiar usuario</Text>
                </Pressable>
                <Pressable
                  onPress={!isLoading ? handleClickSendEmail : null}
                  className="rounded px-6 py-3 w-[48%]"
                  style={{ backgroundColor: color }}
                >
                  <Text className="text-white text-center">Enviar correo</Text>
                </Pressable>
              </View>
            </View>
          )}

          {currentStep === 2 && (
            <View
              id="step-2"
              className="w-full"
            >
              <View className="flex flex-row border border-red-300 rounded px-4 py-2 bg-red-100/20 items-center justify-between mb-5">
                <View className="self-start mr-2 w-[10%]">
                  <ExclamationCircle
                    style={{ color: 'red' }}
                    width={25}
                    height={25}
                  />
                </View>
                <Text className="text-center text-sm leading-4 w-[90%] text-red-700">
                  Ten en cuenta que el código de verificación tiene una validez
                  de 6 horas.
                </Text>
              </View>
              <Input
                type={INPUT_TYPES.TEXT}
                label="Código de Verificación"
                value={{
                  value: verificationCode,
                  setValue: setVerificationCode,
                }}
                placeholder={'A6JAS6'}
                errors={{ errors, setErrors }}
                innerRef={refs.verificationCode}
                inputRefName="verificationCode"
                required
              />

              <Pressable
                onPress={!isLoading ? handleClickVerifyCode : null}
                className="mt-2 px-2 py-3 rounded-lg w-full"
                style={{ backgroundColor: `${color}cc` }}
              >
                <Text className="text-white text-center text-base">
                  Verificar
                </Text>
              </Pressable>
            </View>
          )}

          {currentStep === 3 && (
            <View
              id="step-3"
              className="w-full"
            >
              <Input
                type={INPUT_TYPES.TEXT}
                label="Nueva contraseña"
                value={{ value: password, setValue: setPassword }}
                placeholder={'*********'}
                errors={{ errors, setErrors }}
                innerRef={refs.password}
                inputRefName="password"
                secureTextEntry={true}
                required
              />

              <Input
                type={INPUT_TYPES.TEXT}
                label="Confirmar contraseña"
                value={{
                  value: passwordConfirmation,
                  setValue: setPasswordConfirmation,
                }}
                placeholder={'*********'}
                errors={{ errors, setErrors }}
                innerRef={refs.passwordConfirmation}
                inputRefName="passwordConfirmation"
                secureTextEntry={true}
                required
              />
              <Pressable
                onPress={!isLoading ? handleClickChangePassword : null}
                className="bg-blue-400 mt-10 w-full"
              >
                <Text>Guardar</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  )
}
