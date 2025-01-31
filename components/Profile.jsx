import { useEffect, useState } from 'react'
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { UserBaseLogo } from '../icons/UserBaseLogo.jsx'
import { doFetch, METHODS } from '../lib/api.js'
import { useUser } from '../context/user.js'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import { useConfig } from '../context/config.js'
import { Shadow } from 'react-native-shadow-2'
import { findConfig } from '../lib/config'
import { CandidateImage } from './CandidateImage'

export function Profile() {
  const url = process.env.EXPO_PUBLIC_API_URL
  const [imageUrl, setImageUrl] = useState(null)
  const { user } = useUser()
  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  const userLetter = user?.name.split(' ')[0].charAt(0)

  useEffect(() => {
    if (user?.imageUrl) {
      const imageUrl = user?.imageUrl?.startsWith('http')
        ? user?.imageUrl
        : `${url}/user/image/${user?.imageUrl}`
      setImageUrl(imageUrl)
    }

    if (!user?.imageUrl) setImageUrl(null)
  }, [user, url])

  function handleClickEditProfile() {
    Dialog.show({
      type: ALERT_TYPE.INFO,
      textBody:
        'Para ver o editar los datos de tu perfil debes hacerlo desde el sitio web de votaciones. \n Puedes usar las mismas credenciales que usaste para acceder a esta aplicación.',
      button: 'Ir al sitio web',
      onPressButton: () => {
        Linking.openURL(process.env.EXPO_PUBLIC_APP_WEB)
      },
    })
  }

  return (
    <Shadow className="flex-1 w-full">
      <Pressable
        onPress={handleClickEditProfile}
        className="w-full"
      >
        <View
          className="bg-gray-300/40 py-6 px-3 flex-row items-center max-h-[140px] overflow-hidden w-full h-full"
          style={{ backgroundColor: `${color}77` }}
        >
          <View className="w-[25%] h-full flex items-center justify-center">
            <View className="rounded-full overflow-hidden w-full h-auto aspect-square items-center justify-center bg-[#ffe6d9] bg-opacity-80">
              {!imageUrl && <UserBaseLogo letter={userLetter} />}
              {imageUrl && (
                <CandidateImage
                  imageUrl={imageUrl}
                  alt="Foto de perfil"
                  classImageContainer="w-full h-full"
                />
              )}
            </View>
          </View>
          {/*  */}
          <View className="w-[75%] h-full ml-3">
            <View style={styles.containerLabelText}>
              <Text style={styles.labelTextInformation}>
                {user?.name} {user?.lastname}
              </Text>
            </View>
            <View style={styles.containerLabelText}>
              <Text style={styles.labelTextInformation}>{user?.document}</Text>
            </View>
            <View style={styles.containerLabelText}>
              <Text
                style={styles.labelTextInformation}
                className=""
              >
                {user?.email}
              </Text>
            </View>
            <View style={styles.containerLabelText}>
              <Text style={styles.labelTextInformation}>
                Rol : {user?.roleUser.code}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Shadow>
  )
}

const styles = StyleSheet.create({
  labelTextInformation: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  containerLabelText: {
    display: 'flex',
    flexDirection: 'row',
  },
})
