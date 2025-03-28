import { ScrollView, Text, ToastAndroid, View } from 'react-native'
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
import { RefreshControl } from 'react-native-gesture-handler'
import { StepIndicator } from '../../components/StepIndicator'
import { scrollSmooth } from '../../lib/scrollSmooth'
import ExclamationCircle from '../../icons/ExclamationCircle'
import { StyledPressable } from '../../components/StyledPressable'

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
  const [currentStep, setCurrentStep] = useState(1)
  const [secondsNewCode, setSecondsNewCode] = useState(0)
  const [dateNewCode, setDateNewCode] = useState('')

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
      setCurrentStep(1)
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

  useEffect(() => {
    if (!dateNewCode) return

    const { secondsTotal } = getRemainingTime(dateNewCode)
    if (secondsTotal > 0) setSecondsNewCode(secondsTotal)
    if (secondsTotal <= 0) setSecondsNewCode(0)

    // eslint-disable-next-line no-undef
    const interval = setInterval(() => {
      const { secondsTotal } = getRemainingTime(dateNewCode)

      if (secondsTotal <= 0) {
        // eslint-disable-next-line no-undef
        clearInterval(interval)
        setSecondsNewCode(0)
        return
      }
      if (!isNaN(secondsTotal)) setSecondsNewCode(secondsTotal)
    }, 1000)

    // eslint-disable-next-line no-undef
    return () => clearInterval(interval)
  }, [dateNewCode, getRemainingTime])

  const getRemainingTime = useCallback(targetDateString => {
    const targetDate = new Date(targetDateString).getTime()
    const now = new Date().getTime()
    const difference = targetDate - now

    if (difference <= 0)
      return { hours: null, minutes: null, seconds: null, secondsTotal: 0 }

    const secondsTotal = Math.floor(difference / 1000)
    const hours = Math.floor(secondsTotal / 3600) || null
    const minutes = Math.floor((secondsTotal % 3600) / 60) || null
    const seconds = secondsTotal % 60 || null

    return { hours, minutes, seconds, secondsTotal }
  }, [])

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
    setCurrentStep(2)
    setTypeDocumentCode('CedulaCiudadania')
    setDocument('')
    setDateNewCode(res.user.timeNewCode)
  }, [typeDocumentCode, document, errors, refs, isLoading])

  const handleClickChangeUser = useCallback(() => {
    if (isLoading)
      return ToastAndroid.show('Espera un momento...', ToastAndroid.SHORT)
    setCurrentStep(1)
    setUser('')
    setDocument('')
    setTypeDocumentCode('CedulaCiudadania')
  }, [isLoading])

  const handleClickSendEmail = useCallback(async () => {
    if (!user) return setCurrentStep(1)
    if (isLoading)
      return ToastAndroid.show('Espera un momento...', ToastAndroid.SHORT)

    const toastSendEmailId = toast.loading('Enviando...')
    setIsLoading(true)

    const res = await doFetch({
      url: 'user/sendPasswordResetCode',
      method: METHODS.POST,
      body: { userId: user.id },
    })

    setDateNewCode(res.timeNewCode)
    toast.dismiss(toastSendEmailId)
    setIsLoading(false)

    if (!res.ok) {
      return toast.error(res.message, {
        style: TOAST_STYLES.ERROR,
      })
    }

    setCurrentStep(3)
  }, [user, isLoading])

  const handleClickVerifyCode = useCallback(async () => {
    if (!user) return setCurrentStep(1)
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

    setCurrentStep(4)
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
      setCurrentStep(1)
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

  const getTimeString = useCallback(({ seconds, hours, minutes }) => {
    let text = ''
    if (hours) text += `${hours}h `
    if (minutes) text += `${minutes}m `
    text += `${seconds}s`

    return text
  }, [])

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
        className="flex-1 w-full mx-auto px-4"
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
          {currentStep === 1 && (
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
                <StyledPressable
                  text="Buscar usuario"
                  backgroundColor={`${color}cc`}
                  pressableClass="mt-3"
                  isLoading={isLoading}
                  showLoadingIndicator={true}
                  onPress={handleClickFindUser}
                />
              </View>
            </View>
          )}

          {currentStep === 2 && (
            <View
              id="step-1"
              className=""
            >
              <Text className="text-center text-gray-700 flex">
                Se enviará un correo electrónico con instrucciones para
                restablecer su contraseña al correo{' '}
                <Text className="text-black font-semibold">{user.email}</Text>.
              </Text>
              <Text
                className={`text-center mt-1 text-gray-500 ${secondsNewCode > 0 ? '' : 'opacity-0'}`}
              >
                Enviar nuevamente{' '}
                {secondsNewCode > 0
                  ? 'en ' + getTimeString(getRemainingTime(dateNewCode))
                  : ''}
              </Text>
              <View className="flex flex-row justify-evenly mt-6 w-full">
                <StyledPressable
                  text="Cambiar usuario"
                  backgroundColor="transparent"
                  pressableClass="!w-[48%] border border-gray-400"
                  onPress={handleClickChangeUser}
                />
                <StyledPressable
                  text="Enviar correo"
                  backgroundColor={`${color}cc`}
                  pressableClass="!w-[48%]"
                  onPress={handleClickSendEmail}
                  disabled={secondsNewCode > 0}
                />
              </View>
            </View>
          )}

          {currentStep === 3 && (
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

              <Text
                className={`text-center mt-1 text-gray-500 ${secondsNewCode > 0 ? '' : 'opacity-0'}`}
              >
                Reenviar{' '}
                {secondsNewCode > 0
                  ? 'en ' + getTimeString(getRemainingTime(dateNewCode))
                  : ''}
              </Text>

              <View className="flex flex-row justify-between">
                <StyledPressable
                  text={`Reenviar`}
                  backgroundColor="transparent"
                  pressableClass="mt-2 !w-[48%] border border-gray-400"
                  onPress={handleClickSendEmail}
                  isLoading={isLoading}
                  showLoadingIndicator={true}
                  disabled={secondsNewCode > 0}
                />

                <StyledPressable
                  text="Verificar"
                  backgroundColor={`${color}cc`}
                  pressableClass="mt-2 px-2 py-3 rounded-lg w-full !w-[48%]"
                  onPress={handleClickVerifyCode}
                  isLoading={isLoading}
                  showLoadingIndicator={true}
                />
              </View>
            </View>
          )}

          {currentStep === 4 && (
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

              <StyledPressable
                text="Restablecer"
                backgroundColor={`${color}cc`}
                pressableClass="mt-4 w-full px-2 py-3 rounded-lg"
                onPress={handleClickChangePassword}
                isLoading={isLoading}
                showLoadingIndicator={true}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  )
}
