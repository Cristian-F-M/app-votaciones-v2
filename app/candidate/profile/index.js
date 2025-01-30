import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  RefreshControl,
  ToastAndroid,
} from 'react-native'
import { Screen } from '../../../components/Screen'
import { router, Stack } from 'expo-router'
import { useConfig } from '../../../context/config'
import { findConfig } from '../../../lib/config'
import { useCallback, useEffect, useState } from 'react'
import { UpLoadImage } from '../../../components/UpLoadImage'
import { CandidateImage } from '../../../components/CandidateImage'
import * as ImagePicker from 'expo-image-picker'
import Save from '../../../icons/Save'
import { doFetch, METHODS } from '../../../lib/api'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { useUser } from '../../../context/user'

export default function CandidateProfile() {
  const url = process.env.EXPO_PUBLIC_API_URL
  const { user } = useUser()

  const [candidate, setCandidate] = useState({})
  const [imageUrl, setImageUrl] = useState(null)
  const [isProfileImage, setIsProfileImage] = useState(false)
  const [useForProfileImage, setUseForProfileImage] = useState(false)
  const [useSameUserImage, setUseSameUserImage] = useState(false)
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const isSameImage = user?.imageUrl === candidate?.imageUrl
    setIsProfileImage(isSameImage)
    setUseForProfileImage(isSameImage)
  }, [user, candidate])

  const getUser = useCallback(async () => {
    return await doFetch({ url: `${url}/user/`, method: METHODS.GET })
  }, [url])

  const getCandidate = useCallback(async () => {
    const { candidate: c } = await doFetch({
      url: `${url}/candidate?userId=${user?.id}`,
      method: METHODS.GET,
    })
    if (c.imageUrl) {
      const imageUrl = c.imageUrl?.startsWith('http')
        ? c.imageUrl
        : `${url}/candidate/image/${c.imageUrl}`
      setImageUrl(imageUrl)
    }
    setCandidate(c)
    setDescription(c.description)
  }, [url, user])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      aspect: [4, 4],
      quality: 1,
    })

    if (result.canceled) return
    setImageUrl(result.assets[0].uri)
    setIsProfileImage(false)
    setErrors(prev => ({ ...prev, image: null }))
  }

  const getProfileImage = useCallback(async () => {
    if (isProfileImage)
      return ToastAndroid.show(
        'Ya has seleccionado la foto de perfil',
        ToastAndroid.SHORT,
      )

    const data = await getUser()

    if (data.error)
      return ToastAndroid.show('No se pudo obtener la imagen', ToastAndroid.TOP)
    const { imageUrl } = data.user

    if (!imageUrl)
      return ToastAndroid.show(
        'No cuentas con imagen de perfil',
        ToastAndroid.TOP,
      )

    setImageUrl(imageUrl)
    setIsProfileImage(true)
    setUseSameUserImage(true)
    ToastAndroid.show('Foto de perfil seleccionada', ToastAndroid.TOP)
  }, [isProfileImage, getUser])

  const saveCandidateInfo = useCallback(async () => {
    // TODO Hacer el fetch

    const localyErrors = {}

    if (!imageUrl) localyErrors.image = 'Debes seleccionar una imagen'
    if (!description)
      localyErrors.description = 'Debes escribir una descripción'
    if (description.trim() === '')
      localyErrors.description = 'Debes escribir una descripción'

    setErrors(localyErrors)

    if (Object.keys(localyErrors).length > 0) return

    const urlSplited = imageUrl.split('.')
    const fileType = urlSplited[urlSplited.length - 1]

    const formData = new FormData()

    formData.set(
      'image',
      {
        uri: imageUrl,
        name: `image.${fileType}`,
        type: `image/${fileType}`,
      },
      `image.${fileType}`,
    )

    formData.set('useSameUserImage', useSameUserImage)
    formData.set('description', description)
    formData.set('useForProfileImage', useForProfileImage)

    const data = await doFetch({
      url: `${url}/candidate`,
      method: METHODS.PUT,
      body: formData,
      includeContentType: false,
      stringifyBody: false,
    })

    if (!data.ok) return ToastAndroid.show(data.message, ToastAndroid.SHORT)

    return ToastAndroid.showWithGravity(
      'Tú perfi ha sido actualizado',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    )
  }, [url, imageUrl, useForProfileImage, description, useSameUserImage])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)

    // setImageUrl('')
    // setDescription('')
    await getCandidate()
    setRefreshing(false)
  }, [getCandidate])

  useEffect(() => {
    getCandidate()
  }, [getCandidate])

  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  return (
    <Screen safeArea={false}>
      <Stack.Screen
        options={{
          headerTitle: 'Perfil de Candidato',
          headerTitleAlign: 'center',
          headerShown: true,
        }}
      />
      <ScrollView
        className="mt-4 flex w-full"
        contentContainerStyle={{ alignItems: 'center' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* <Text className="text-center text-3xl text-gray-800">
          Perfil de Candidato
        </Text> */}

        <View
          className="w-3/4 h-auto aspect-square mt-7 border-gray-400 border-[3px] rounded-lg overflow-hidden flex justify-center items-center"
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
        <View style={styles.errorContainer}>
          {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
        </View>
        <View className="mt-5">
          <Pressable
            className="px-8 py-2 rounded"
            style={{
              backgroundColor: !isProfileImage ? `${color}cc` : '#9e9d9d',
            }}
            onPress={getProfileImage}
          >
            <Text className="text-[#122313] text-base">
              Usar foto de perfil
            </Text>
          </Pressable>
        </View>

        <View className="w-3/4 mt-10">
          <Text className="text-lg text-gray-600">Descripción</Text>
          <View className="border w-full h-28 mt-2 rounded-lg border-gray-400">
            <TextInput
              keyboardType="default"
              placeholder="Escribe aquí tu descripción"
              placeholderTextColor={'#9ca3af'}
              multiline={true}
              className="w-full h-full px-3 py-2"
              style={{ textAlignVertical: 'top' }}
              maxLength={250}
              numberOfLines={10}
              value={description}
              onChangeText={text => {
                setDescription(text)
                setErrors(prev => ({ ...prev, description: null }))
              }}
            />
          </View>
        </View>
        <View style={styles.errorContainer}>
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        <View className="mt-10 ml-[12%] flex flex-row items-center justify-between self-start">
          <BouncyCheckbox
            className="w-7"
            fillColor={color}
            isChecked={useForProfileImage}
            onPress={() => {
              setUseForProfileImage(prev => !prev)
            }}
            size={20}
          />
          <Text className="text-gray-600 text-sm">
            Usar también para foto de perfil
          </Text>
        </View>

        <Pressable
          style={{ backgroundColor: `${color}cc` }}
          className="flex flex-row items-center justify-center px-10 py-2 mt-2 mb-10 w-3/4 rounded"
          onPress={saveCandidateInfo}
        >
          <Save
            className="text-gray-100"
            width={24}
            height={24}
          />
          <Text className="ml-2 text-[#122313] text-base">Guardar</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  errorContainer: {
    width: '75%',
    marginTop: 3,
  },
  errorText: {
    color: 'red',
    textAlign: 'left',
  },
})
