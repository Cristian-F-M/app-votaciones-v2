import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Screen } from '../../components/Screen'
import LogoSena from '../../icons/Logo'
import { useCallback, useEffect, useRef, useState } from 'react'
import { doFetch, getItemStorage, METHODS, setItemStorage } from '../../lib/api'
import { Picker } from '@react-native-picker/picker'
import { Stack, useRouter } from 'expo-router'
import { scrollSmooth } from '../../lib/scrollSmooth'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { DropDownAlert, showAlert } from '../../components/DropDownAlert'
import { DropdownAlertType } from 'react-native-dropdownalert'
import { StatusBar } from 'expo-status-bar'
import { Input, INPUT_TYPES, SELECT_MODES } from '../../components/Input'

export default function Register() {
  const [Color, setColor] = useState('')
  const [errors, setErrors] = useState({})
  const [typeDocumentCode, setTypeDocumentCode] = useState('CedulaCiudadania')
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

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
  const [typesDocuments, setTypesDocuments] = useState(null)
  const [document, setDocument] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  function handleClickRegister() {
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
    setErrors(localyErrors)

    if (localyErrors.name) return scrollSmooth(refs.name, refs.scrollView)
    if (localyErrors.phone) return scrollSmooth(refs.phone, refs.scrollView)
    if (localyErrors.email) return scrollSmooth(refs.email, refs.scrollView)
    if (localyErrors.lastname)
      return scrollSmooth(refs.lastname, refs.scrollView)
    if (localyErrors.document)
      return scrollSmooth(refs.document, refs.scrollView)
    if (localyErrors.password)
      return scrollSmooth(refs.password, refs.scrollView)

    if (localyErrors.length > 0) return

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
      if (res.error) {
        return showAlert({
          message: res.error,
          type: DropdownAlertType.Error,
          title: 'Error',
        })
      }

      if (res.errors) {
        const { errors } = res

        for (const key in errors) {
          const { msg, path, message } = errors[key][0]
          setErrors({ ...errors, [path]: msg || message })
          scrollSmooth(refs[path], refs.scrollView)
        }
        return
      }
      clearInputs()
      scrollSmooth(refs.title, refs.scrollView)
      // eslint-disable-next-line no-undef
      await new Promise(resolve => setTimeout(resolve, 500))

      showAlert({
        message: 'Registro exitoso',
        type: DropdownAlertType.Success,
        title: 'Exitoso',
      })

      // eslint-disable-next-line no-undef
      setTimeout(() => {
        router.replace('login')
      }, 2000)
    }
  }

  function clearInputs() {
    setName('')
    setLastname('')
    setDocument('')
    setPhone('')
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
    setErrors({})
  }
  useEffect(() => {
    async function getConfigs() {
      const colorStoraged = await getItemStorage({ name: 'color' })

      if (!colorStoraged || new Date() > colorStoraged.expires) {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/config/?code=Color`
        const res = await doFetch({ url, method: METHODS.GET })
        const color = res.config.value

        await setItemStorage({
          name: 'color',
          value: color,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 4),
        })
        return setColor(color)
      }
      setColor(colorStoraged.value)
    }

    async function getTypesDocuments() {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/typeDocument/`
      const res = await doFetch({ url, method: METHODS.GET })
      setTypesDocuments(res.typesDocuments)
    }

    getConfigs()
    getTypesDocuments()
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      router.replace('register')
      setRefreshing(false)
    }, 600)
  }, [])

  return (
    <Screen>
      <StatusBar style="dark" />
      <DropDownAlert />
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Registro',
          headerTitleAlign: 'center',
          headerRight: () => (
            <LogoSena
              width={40}
              height={40}
              style={{ fill: Color }}
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
              dropdownIconRippleColor={Color}
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
          </View>
          {/*  */}
          <View className="mb-16">
            <Pressable
              // onPress={!isLoading ? handleClickLogin : null}
              className={`rounded-lg px-4 py-2 mt-6 flex-row justify-center gap-x-3 relative items-center active:opacity-60`}
              disabled={isLoading}
              style={{
                backgroundColor: `${Color}${isLoading ? '80' : ''}`,
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
})
