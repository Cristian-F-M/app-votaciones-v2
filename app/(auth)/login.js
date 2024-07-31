import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
} from 'react-native'
import { Screen } from '../../components/Screen'
import { Picker } from '@react-native-picker/picker'
import LogoSena from '../../icons/Logo'
import { useEffect, useState } from 'react'
import { doFetch, getItemStorage, METHODS, setItemStorage } from '../../lib/api'
import { useDebounce } from '../../lib/useDebounce'
import { Link, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification'
import { useRouter } from 'expo-router'

export default function Login() {
  const [Color, setColor] = useState()
  const [typesDocuments, setTypesDocuments] = useState(null)
  const [typeDocumentCode, setTypeDocumentCode] = useState('CedulaCiudadania')
  const [document, setDocument] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const router = useRouter()

  function handleClickLogin() {
    async function Login() {
      if (document.trim() === '')
        return setErrors({ ...errors, document: 'Campo requerido' })
      if (password.trim() === '')
        return setErrors({ ...errors, password: 'Campo requerido' })

      setIsLoading(true)

      const res = await doFetch({
        url: `${process.env.EXPO_PUBLIC_API_URL}/login/`,
        method: METHODS.POST,
        body: { typeDocumentCode, document, password },
      })

      // eslint-disable-next-line no-undef
      await new Promise(resolve => setTimeout(resolve, 500))

      if (res.error) {
        setIsLoading(false)
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: `${res.error}, please try again`,
        })
      }

      if (!res.ok) {
        setIsLoading(false)
        return Toast.show({
          type: ALERT_TYPE.WARNING,
          textBody: res.message,
        })
      }

      setIsLoading(false)
      router.replace('apprentice/')
    }

    Login()
  }

  useEffect(() => {
    async function getConfigs() {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/config/?code=Color`
      const res = await doFetch({ url, method: METHODS.GET })
      const color = res.config.value

      setColor(color)
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
      <StatusBar style="auto" />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <AlertNotificationRoot>
        <View className="p-5 flex-1">
          <View className="flex-1 justify-center">
            <View className="flex-col items-center gap-4 mb-10">
              <View>
                <LogoSena
                  style={{ fill: Color }}
                  width={170}
                  height={168}
                />
              </View>
              <Text className="text-4xl text-center tracking-widest">
                Inicio de Sesión
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
                    prompt="Select type of document"
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

              <View style={styles.inputContainer}>
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
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Contraseña
                  <Text className="text-red-500"> *</Text>
                </Text>
                <TextInput
                  style={[styles.input, styles.inputText]}
                  secureTextEntry
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

              <View>
                <Pressable
                  onPress={!isLoading ? handleClickLogin : null}
                  className={`rounded-lg px-4 py-2 mt-6 flex-row justify-center gap-x-3 relative items-center active:opacity-60`}
                  disabled={isLoading}
                  style={{
                    backgroundColor: `${Color}${isLoading ? '80' : ''}`,
                    color: `#000000${isLoading ? '80' : ''}`,
                  }}
                >
                  <Text className="text-lg">Login</Text>
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
        </View>
      </AlertNotificationRoot>
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
