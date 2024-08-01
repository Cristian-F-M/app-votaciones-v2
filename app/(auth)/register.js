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
import { useEffect, useState } from 'react'
import { doFetch, getItemStorage, METHODS, setItemStorage } from '../../lib/api'
import { Picker } from '@react-native-picker/picker'
import { Stack } from 'expo-router'

export default function Register() {
  const [Color, setColor] = useState('')
  const [errors, setErrors] = useState({})
  const [typeDocumentCode, setTypeDocumentCode] = useState('CedulaCiudadania')
  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [typesDocuments, setTypesDocuments] = useState(null)
  const [document, setDocument] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

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
      <ScrollView className="p-5 flex-1">
        <View className="flex-1 justify-center">
          <View className="flex-col items-center gap-4 mb-10">
            <Text className="text-4xl text-center tracking-widest">
              Registro
            </Text>
          </View>

          <View>
            <View style={styles.inputContainer}>
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
            </View>
            {/*  */}
            <View style={styles.inputContainer}>
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
            <View style={styles.inputContainer}>
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
                placeholder="123456789"
              />
            </View>
            {/*  */}
            <View style={styles.inputContainer}>
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
                placeholder="3512345678"
              />
            </View>
            {/*  */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Correo electronico
                <Text className="text-red-500"> *</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.inputText]}
                value={email}
                onChangeText={t => {
                  setEmail(t)
                  setErrors({ ...errors, email: null })
                }}
                placeholder="lunasophia@gmail.com"
              />
            </View>
            {/*  */}
            <View style={styles.inputContainer}>
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
