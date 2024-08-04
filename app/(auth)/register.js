import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Screen } from '../../components/Screen'
import LogoSena from '../../icons/Logo'
import { useEffect, useRef, useState } from 'react'
import { doFetch, getItemStorage, METHODS, setItemStorage } from '../../lib/api'
import { Picker } from '@react-native-picker/picker'
import { Stack } from 'expo-router'
import { scrollSmooth } from '../../lib/scrollSmooth'

export default function Register() {
  const [Color, setColor] = useState('')
  const [errors, setErrors] = useState({})
  const [typeDocumentCode, setTypeDocumentCode] = useState('CedulaCiudadania')
  const [isLoading, setIsLoading] = useState(false)

  const scrollViewRef = useRef(null)
  const nameRef = useRef(null)
  const lastnameRef = useRef(null)
  const documentRef = useRef(null)
  const phoneRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

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

    if (localyErrors.name) return scrollSmooth(nameRef, scrollViewRef)
    if (localyErrors.lastname) return scrollSmooth(lastnameRef, scrollViewRef)
    if (localyErrors.document) return scrollSmooth(documentRef, scrollViewRef)
    if (localyErrors.phone) return scrollSmooth(phoneRef, scrollViewRef)
    if (localyErrors.email) return scrollSmooth(emailRef, scrollViewRef)
    if (localyErrors.password) return scrollSmooth(passwordRef, scrollViewRef)

    if (localyErrors.length > 0) return

    async function Register() {}
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
        ref={scrollViewRef}
      >
        <View className="flex-1 justify-center">
          <View className="flex-col items-center gap-4 mb-10">
            <Text className="text-4xl text-center tracking-widest">
              Registro
            </Text>
          </View>

          <View>
            <View
              style={styles.inputContainer}
              ref={nameRef}
            >
              <Text style={styles.label}>
                Nombre
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
              ref={lastnameRef}
            >
              <Text style={styles.label}>
                Apellido
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
            {/*  */}
            <View
              style={styles.inputContainer}
              ref={documentRef}
            >
              <Text style={styles.label}>
                Documento
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
              ref={phoneRef}
            >
              <Text style={styles.label}>
                Telefono
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
              ref={emailRef}
            >
              <Text style={styles.label}>
                Correo electronico
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
              ref={passwordRef}
            >
              <Text style={styles.label}>
                Contraseña
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputText]}
                value={password}
                secureTextEntry
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
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Confirmar contraseña
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputText]}
                value={passwordConfirm}
                secureTextEntry
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
              <Text className="text-lg">Registrar</Text>
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
