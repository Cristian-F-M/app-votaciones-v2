import {
  Button,
  findNodeHandle,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from 'react-native'
import { Screen } from '../../../components/Screen.jsx'
import { Stack } from 'expo-router'
import { Input, INPUT_TYPES } from '../../../components/Input.jsx'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ArrowLeft from '../../../icons/ArrowLeft'
import { router } from 'expo-router'
import { UpLoadImage } from '../../../components/UpLoadImage.jsx'
import { CandidateImage } from '../../../components/CandidateImage.jsx'
import * as ImagePicker from 'expo-image-picker'
import { useConfig } from '../../../context/config.js'
import { findConfig } from '../../../lib/config.js'
import { useUser } from '../../../context/user.js'
import { doFetch, METHODS } from '../../../lib/api.js'
import { getApiErrors } from '../../../lib/api.js'
import { scrollSmooth } from '../../../lib/scrollSmooth.js'

export default function ApprenticeProfilePage() {
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [typeDocumentCode, setTypeDocumentCode] = useState('')
  const [document, setDocument] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [roleCode, setRoleCode] = useState('')
  const [errors, setErrors] = useState({})
  const [typesDocuments, setTypesDocuments] = useState(null)
  const [roles, setRoles] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const { user } = useUser()
  const [refreshing, setRefreshing] = useState(false)
  const url = process.env.EXPO_PUBLIC_API_URL

  const getTypeDocuments = useCallback(async () => {
    const data = await doFetch({
      url: `${url}/typeDocument/`,
      method: METHODS.GET,
    })

    if (data.error) return
    setTypesDocuments(data.typesDocuments)
  }, [url])

  const getUser = useCallback(async () => {
    if (!user) return

    const imageUrl = user.imageUrl?.startsWith('http')
      ? user.imageUrl
      : `${url}/user/image/${user.imageUrl}`

    setName(user.name)
    setLastname(user.lastname)
    setTypeDocumentCode(user.typeDocumentUser.code)
    setDocument(user.document)
    setPhone(user.phone)
    setEmail(user.email)
    setRoleCode(user.roleUser.code)
    setImageUrl(imageUrl)
  }, [url, user])

  const getRoles = useCallback(async () => {
    const data = await doFetch({
      url: `${url}/role?code=${user.roleUser.code}`,
      method: METHODS.GET,
    })

    if (data.error) return
    setRoles(data.roles)
  }, [url, user.roleUser.code])

  useEffect(() => {
    getUser()
    getRoles()
    getTypeDocuments()
  }, [getTypeDocuments, getRoles, getUser])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refs = {
    name: useRef(null),
    lastname: useRef(null),
    typeDocument: useRef(null),
    document: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    roleCode: useRef(null),
    scrollViewRef: useRef(null),
  }

  async function onRefresh() {
    setRefreshing(true)
    await getTypeDocuments()
    await getRoles()
    await getUser()
    setRefreshing(false)
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      aspect: [4, 4],
      quality: 1,
    })

    if (result.canceled) return
    setImageUrl(result.assets[0].uri)
    setErrors(prev => ({ ...prev, image: null }))
  }

  const handleClickSaveProfile = useCallback(async () => {
    let localyErrors = {}

    if (name.trim() === '')
      localyErrors = { ...localyErrors, name: 'Campo requerido' }
    if (lastname.trim() === '')
      localyErrors = { ...localyErrors, lastname: 'Campo requerido' }
    if (phone.trim() === '')
      localyErrors = { ...localyErrors, phone: 'Campo requerido' }
    if (email.trim() === '')
      localyErrors = { ...localyErrors, email: 'Campo requerido' }

    setErrors(prev => ({ ...prev, ...localyErrors }))

    const localyErrorsEntries = Object.entries(localyErrors)
    const errorsEntries = Object.entries(errors)

    if (localyErrorsEntries.length > 0 || errorsEntries.length > 0) {
      const [key] = localyErrorsEntries[0] || errorsEntries[0]
      scrollSmooth(refs[key], refs.scrollViewRef)
      return
    }

    const formData = new FormData()
    const urlSplited = imageUrl.split('.')
    const fileType = urlSplited[urlSplited?.length - 1]

    formData.set('name', name)
    formData.set('lastname', lastname)
    formData.set('phone', phone)
    formData.set('email', email)

    formData.set(
      'image',
      {
        uri: imageUrl,
        name: `image.${fileType}`,
        type: `image/${fileType}`,
      },
      `image.${fileType}`,
    )

    const data = await doFetch({
      url: `${url}/user/profile`,
      method: METHODS.PUT,
      body: formData,
      includeContentType: false,
      stringifyBody: false,
    })

    if (!data.ok && data.errors) {
      const apiErrors = getApiErrors(data.errors)
      setErrors(prev => ({ ...prev, ...apiErrors }))
      scrollSmooth(refs[Object.keys(apiErrors)[0]], refs.scrollViewRef)
      return
    }

    ToastAndroid.show(data.message, ToastAndroid.LONG)
    router.replace('apprentice/')
  }, [name, lastname, phone, email, imageUrl, url, refs, errors])

  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  return (
    <Screen
      safeArea={false}
      className="flex items-center justify-center w-full"
    >
      <Stack.Screen
        options={{
          headerTitle: 'Perfil',
          headerTitleAlign: 'center',
          headerShown: true,
          headerLeft: null,
        }}
      />
      <ScrollView
        ref={refs.scrollViewRef}
        contentContainerStyle={{ alignItems: 'center' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View
          className="w-4/5 h-auto aspect-square mt-7 border-gray-400 border-[3px] rounded-lg overflow-hidden flex justify-center items-center"
          style={{ borderColor: imageUrl ? `${color}77` : 'rgb(156 163 175)' }}
        >
          {!imageUrl && (
            <Pressable onPress={pickImage}>
              <UpLoadImage />
            </Pressable>
          )}

          {imageUrl && (
            <Pressable onPress={pickImage}>
              <CandidateImage
                imageUrl={imageUrl}
                alt="Foto de perfil"
                classImageContainer="w-full h-full"
              />
            </Pressable>
          )}
        </View>
        <View className="mt-10 w-11/12 flex mx-auto">
          <Input
            label={'Nombre'}
            value={{ value: name, setValue: setName }}
            placeholder={'Luna Sophia'}
            classNameInput=""
            errors={{
              errors,
              setErrors: setErrors,
            }}
            inputRefName="name"
            innerRef={refs.name}
          />

          <Input
            label={'Apellido'}
            value={{ value: lastname, setValue: setLastname }}
            placeholder={'Smith Miller'}
            classNameInput=""
            errors={{
              errors,
              setErrors: setErrors,
            }}
            inputRefName="lastname"
            innerRef={refs.lastname}
          />

          <Input
            label={'Tipo de document'}
            type={INPUT_TYPES.SELECT}
            innerRef={refs.typeDocument}
            selectedValue={typeDocumentCode}
            items={typesDocuments}
            onValueChange={(itemValue, itemIndex) => {
              setTypeDocumentCode(itemValue)
              setErrors(prev => ({ ...prev, typeDocument: null }))
            }}
            selectText="Seleccione tipo de documento"
            errors={{
              errors,
              setErrors: setErrors,
            }}
            disabled={true}
          />

          <Input
            placeholder={'123456789'}
            value={{ value: document, setValue: setDocument }}
            label={'Documento'}
            errors={{
              errors,
              setErrors: setErrors,
            }}
            inputRefName="document"
            innerRef={refs.document}
            disabled={true}
          />

          <Input
            placeholder={'3512345678'}
            keyboardType="phone-pad"
            value={{ value: phone, setValue: setPhone }}
            label={'Telefono'}
            errors={{
              errors,
              setErrors: setErrors,
            }}
            inputRefName="phone"
            innerRef={refs.phone}
          />

          <Input
            placeholder={'example@gmail.com'}
            value={{ value: email, setValue: setEmail }}
            label={'Correo electronico'}
            errors={{
              errors,
              setErrors: setErrors,
            }}
            inputRefName="email"
            innerRef={refs.email}
            disabled={true}
          />

          <Input
            type={INPUT_TYPES.SELECT}
            value={{ value: roleCode, setValue: setRoleCode }}
            label={'Rol'}
            errors={{
              errors,
              setErrors: setErrors,
            }}
            inputRefName="roleCode"
            innerRef={refs.roleCode}
            items={roles}
            selectText="Seleccione el rol"
            onValueChange={(itemValue, itemIndex) => {
              setRoleCode(itemValue)
              setErrors(prev => ({ ...prev, roleCode: null }))
            }}
            disabled={true}
          />

          <Pressable
            className="rounded-lg px-4 py-2 mt-2 flex-row justify-center items-center active:opacity-60 mb-6"
            style={{
              backgroundColor: `${color}cc`,
            }}
            onPress={handleClickSaveProfile}
          >
            <Text className="text-lg">Guardar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  )
}
