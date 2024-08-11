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
import {
  ALERT_TYPE,
  Toast,
  AlertNotificationRoot,
} from 'react-native-alert-notification'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { getI18n, LANGUAGES } from '../../lib/lenguages'
import { useLocales } from 'expo-localization'

export default function Register() {
  const [Color, setColor] = useState('')
  const [errors, setErrors] = useState({})
  const [typeDocumentCode, setTypeDocumentCode] = useState('CedulaCiudadania')
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const locales = useLocales()
  const { languageCode } = locales[0]
  const i18n = getI18n(languageCode)
  const [i18, setI18] = useState(i18n)
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
      localyErrors = { ...localyErrors, name: i18.t.fieldRequired }
    if (lastname.trim() === '')
      localyErrors = { ...localyErrors, lastname: i18.t.fieldRequired }
    if (document.trim() === '')
      localyErrors = { ...localyErrors, document: i18.t.fieldRequired }
    if (phone.trim() === '')
      localyErrors = { ...localyErrors, phone: i18.t.fieldRequired }
    if (email.trim() === '')
      localyErrors = { ...localyErrors, email: i18.t.fieldRequired }

    if (password.trim() === '')
      localyErrors = { ...localyErrors, password: i18.t.fieldRequired }
    if (passwordConfirm.trim() === '')
      localyErrors = { ...localyErrors, passwordConfirm: i18.t.fieldRequired }
    if (password !== passwordConfirm)
      localyErrors = {
        ...localyErrors,
        passwordConfirm: i18.t.passwordsDoNotMatch,
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

      // eslint-disable-next-line no-undef
      await new Promise(resolve => setTimeout(resolve, 2000))

      setIsLoading(false)
      if (res.error) {
        return Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: `${res.error}, please try again`,
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

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'Registro exitoso',
      })

      // eslint-disable-next-line no-undef
      setTimeout(() => {
        router.replace('login')
      }, 8000)
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
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
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
          <View
            className="flex-col items-center gap-4 mb-10"
            ref={refs.title}
          >
            <Text className="text-4xl text-center tracking-widest">
              {i18.t.titleRegister}
            </Text>
          </View>

          <View>
            <View
              style={styles.inputContainer}
              ref={refs.name}
            >
              <Text style={styles.label}>
                {i18.t.labelName}
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputText]}
                value={name}
                onChangeText={t => {
                  setName(t)
                  setErrors({ ...errors, name: null })
                }}
                placeholder="Luna Sophia"
              />
              {!!errors.name && (
                <Text style={styles.errorMessage}>{errors.name}</Text>
              )}
            </View>
            {/*  */}
            <View
              style={styles.inputContainer}
              ref={refs.lastname}
            >
              <Text style={styles.label}>
                {i18.t.labelLastname}
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputText]}
                value={lastname}
                onChangeText={t => {
                  setLastname(t)
                  setErrors({ ...errors, lastname: null })
                }}
                placeholder="Smith Miller"
              />
              {!!errors.lastname && (
                <Text style={styles.errorMessage}>{errors.lastname}</Text>
              )}
            </View>
            {/*  */}
            <View
              style={styles.inputContainer}
              ref={refs.typeDocument}
            >
              <Text style={styles.label}>{i18.t.labelTypeDocument}</Text>
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
            {/*  */}
            <View
              style={styles.inputContainer}
              ref={refs.document}
            >
              <Text style={styles.label}>
                {i18.t.labelDocument}
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputText]}
                value={document}
                onChangeText={t => {
                  setDocument(t)
                  setErrors({ ...errors, document: null })
                }}
                keyboardType="numeric"
                placeholder="123456789"
              />
              {!!errors.document && (
                <Text style={styles.errorMessage}>{errors.document}</Text>
              )}
            </View>
            {/*  */}
            <View
              style={styles.inputContainer}
              ref={refs.phone}
            >
              <Text style={styles.label}>
                {i18.t.labelPhone}
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputText]}
                value={phone}
                onChangeText={t => {
                  setPhone(t)
                  setErrors({ ...errors, phone: null })
                }}
                keyboardType="phone-pad"
                placeholder="3512345678"
              />
              {!!errors.phone && (
                <Text style={styles.errorMessage}>{errors.phone}</Text>
              )}
            </View>
            {/*  */}
            <View
              style={styles.inputContainer}
              ref={refs.email}
            >
              <Text style={styles.label}>
                {i18.t.labelEmail}
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputText]}
                value={email}
                keyboardType="email-address"
                onChangeText={t => {
                  setEmail(t)
                  setErrors({ ...errors, email: null })
                }}
                placeholder="lunasophia@gmail.com"
              />
              {!!errors.email && (
                <Text style={styles.errorMessage}>{errors.email}</Text>
              )}
            </View>
            {/*  */}
            <View
              style={styles.inputContainer}
              ref={refs.password}
            >
              <Text style={styles.label}>
                {i18.t.labelPassword}
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputText]}
                value={password}
                secureTextEntry={!isVisible}
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
            {/*  */}
            <View
              style={styles.inputContainer}
              ref={refs.passwordConfirm}
            >
              <Text style={styles.label}>
                {i18.t.labelConfirmPassword}
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputText]}
                value={passwordConfirm}
                secureTextEntry={!isVisible}
                onChangeText={t => {
                  setPasswordConfirm(t)
                  setErrors({ ...errors, passwordConfirm: null })
                }}
                placeholder="*********"
              />
              {!!errors.passwordConfirm && (
                <Text style={styles.errorMessage}>
                  {errors.passwordConfirm}
                </Text>
              )}
            </View>
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
                {i18.t.showPassword}
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
              <Text className="text-lg">{i18.t.butonRegister}</Text>
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
