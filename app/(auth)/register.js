import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { Screen } from '../../components/Screen'
import LogoSena from '../../icons/Logo'
import { useCallback, useEffect, useRef, useState } from 'react'
import { doFetch, getApiErrors, METHODS } from '../../lib/api'
import { Stack, useRouter } from 'expo-router'
import { scrollSmooth } from '../../lib/scrollSmooth'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { StatusBar } from 'expo-status-bar'
import { Input, INPUT_TYPES, SELECT_MODES } from '../../components/Input'
import { findConfig } from '../../lib/config'
import { useConfig } from '../../context/config'
import { toast } from '@backpackapp-io/react-native-toast'
import { TOAST_STYLES } from '../../lib/toastConstants'

export default function Register() {
  const [errors, setErrors] = useState({})
  const [typeDocumentCode, setTypeDocumentCode] = useState('CedulaCiudadania')
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const { config } = useConfig()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refs = {
    name: useRef(null),
    lastname: useRef(null),
    typeDocument: useRef(null),
    document: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    password: useRef(null),
    passwordConfirm: useRef(null),
    scrollView: useRef(null),
    title: useRef(null),
  }

  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [typesDocuments, setTypesDocuments] = useState([])
  const [document, setDocument] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const color = findConfig({ configs: config, code: 'Color' }).value

  const handleClickRegister = useCallback(() => {
    let localyErrors = {}

    if (name.trim() === '')
      localyErrors = { ...localyErrors, name: 'Campo requerido' }
    if (lastname.trim() === '')
      localyErrors = { ...localyErrors, lastname: 'Campo requerido' }
    if (document.trim() === '')
      localyErrors = { ...localyErrors, document: 'Campo requerido' }
    if (phone.trim() === '')
      localyErrors = { ...localyErrors, phone: 'Campo requerido' }
    if (email.trim() === '')
      localyErrors = { ...localyErrors, email: 'Campo requerido' }

    if (password.trim() === '')
      localyErrors = { ...localyErrors, password: 'Campo requerido' }
    if (passwordConfirm.trim() === '')
      localyErrors = { ...localyErrors, passwordConfirm: 'Campo requerido' }
    if (password !== passwordConfirm)
      localyErrors = {
        ...localyErrors,
        passwordConfirm: 'Las contraseñas no coinciden',
      }

    setErrors(prev => ({ ...prev, ...localyErrors }))

    const localyErrorsEntries = Object.entries(localyErrors)
    const errorsEntries = Object.entries(errors)

    if (localyErrorsEntries.length > 0 || errorsEntries.length > 0) {
      const [key] = localyErrorsEntries[0] || errorsEntries[0]
      scrollSmooth(refs[key], refs.scrollView)
      return
    }

    register()

    async function register() {
      setIsLoading(true)
      const url = `${process.env.EXPO_PUBLIC_API_URL}/register/`
      const res = await doFetch({
        url,
        method: METHODS.POST,
        body: {
          name,
          lastname,
          typeDocumentCode,
          document,
          phone,
          email,
          password,
        },
      })

      setIsLoading(false)

      if (res.error)
        return toast.error(res.error, {
          styles: {
            ...TOAST_STYLES.ERROR,
          },
        })

      if (res.errors) {
        const { errors } = res
        const apiErrors = getApiErrors(errors)
        const apiErrorsEntries = Object.entries(apiErrors)

        setErrors(prev => ({ ...prev, ...apiErrors }))

        if (apiErrorsEntries.length > 0) {
          const [key] = apiErrorsEntries[0]
          scrollSmooth(refs[key], refs.scrollView)
        }
        return
      }
      clearInputs()
      scrollSmooth(refs.title, refs.scrollView)
      // eslint-disable-next-line no-undef
      await new Promise(resolve => setTimeout(resolve, 500))

      toast.success('Registro exitoso', {
        styles: {
          ...TOAST_STYLES.SUCCESS,
        },
      })

      // eslint-disable-next-line no-undef
      setTimeout(() => {
        router.replace('login')
      }, 2000)
    }
  }, [
    document,
    email,
    lastname,
    name,
    password,
    passwordConfirm,
    phone,
    refs,
    errors,
    router,
    typeDocumentCode,
    clearInputs,
  ])

  const clearInputs = useCallback(() => {
    setName('')
    setLastname('')
    setDocument('')
    setPhone('')
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
    setErrors({})
    setTypeDocumentCode('CedulaCiudadania')
    setIsVisible(false)
  }, [])

  const getTypesDocuments = useCallback(async () => {
    const toastIdTypesDocument = toast.loading(
      'Cargando tipos de documentos...',
    )
    setTypesDocuments([])
    const url = `${process.env.EXPO_PUBLIC_API_URL}/typeDocument/`
    const res = await doFetch({ url, method: METHODS.GET })

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

  useEffect(() => {
    getTypesDocuments()
  }, [getTypesDocuments])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      clearInputs()
      getTypesDocuments()
      setRefreshing(false)
    }, 600)
  }, [getTypesDocuments, clearInputs])

  return (
    <Screen>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Registro',
          headerTitleAlign: 'center',
          headerRight: () => (
            <LogoSena
              width={40}
              height={40}
              style={{ fill: color }}
            />
          ),
        }}
      />
      <ScrollView
        className="p-5 flex-1"
        ref={refs.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View className="flex-1 justify-center">
          <View>
            <Input
              type={INPUT_TYPES.TEXT}
              value={{ value: name, setValue: setName }}
              placeholder={'Luna Sophia'}
              errors={{ errors, setErrors }}
              label="Nombre"
              innerRef={refs.name}
              inputRefName="name"
              required
            />

            <Input
              type={INPUT_TYPES.TEXT}
              value={{ value: lastname, setValue: setLastname }}
              placeholder={'Smith Miller'}
              errors={{ errors, setErrors }}
              label="Apellido"
              innerRef={refs.lastname}
              inputRefName="lastname"
              required
            />

            <Input
              type={INPUT_TYPES.SELECT}
              selectedValue={typeDocumentCode}
              items={typesDocuments}
              errors={{ errors, setErrors }}
              innerRef={refs.typeDocument}
              inputRefName="typeDocument"
              label="Tipo de documento"
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

            <Input
              type={INPUT_TYPES.TEXT}
              value={{ value: phone, setValue: setPhone }}
              placeholder={'3512345678'}
              errors={{ errors, setErrors }}
              label="Telefono"
              innerRef={refs.phone}
              inputRefName="phone"
              keyboardType="phone-pad"
              required
            />

            <Input
              type={INPUT_TYPES.TEXT}
              value={{ value: email, setValue: setEmail }}
              placeholder={'lunasophia@gmail.com'}
              errors={{ errors, setErrors }}
              label="Correo electronico"
              innerRef={refs.email}
              inputRefName="email"
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
              secureTextEntry={!isVisible}
              required
            />

            <Input
              type={INPUT_TYPES.TEXT}
              value={{ value: passwordConfirm, setValue: setPasswordConfirm }}
              placeholder={'*********'}
              errors={{ errors, setErrors }}
              label="Confirmar contraseña"
              innerRef={refs.passwordConfirm}
              inputRefName="passwordConfirm"
              secureTextEntry={true}
              required
            />

            <View className="flex-row items-center gap-x-2 -mt-2">
              <BouncyCheckbox
                size={24}
                fillColor={color}
                unFillColor="#FFFFFF"
                iconStyle={{ borderColor: color }}
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
          </View>
          <View className="mb-16">
            <Pressable
              // onPress={!isLoading ? handleClickLogin : null}
              className={`rounded-lg px-4 py-2 mt-6 flex-row justify-center gap-x-3 relative items-center active:opacity-60`}
              disabled={isLoading}
              style={{
                backgroundColor: `${color}${isLoading ? '80' : 'dd'}`,
                color: `#000000${isLoading ? '80' : ''}`,
              }}
              onPress={!isLoading ? handleClickRegister : null}
            >
              <Text className="text-lg">Registro</Text>
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
      </ScrollView>
    </Screen>
  )
}
