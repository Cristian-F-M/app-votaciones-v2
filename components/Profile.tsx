import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { UserBaseLogo } from '../icons/UserBaseLogo.jsx'
import { useUser } from '../context/user.js'
import { useConfig } from '../context/config.js'
import { Shadow } from 'react-native-shadow-2'
import { findConfig } from '../lib/config'
import { CandidateImage } from './CandidateImage'

export function Profile() {
  const url = process.env.EXPO_PUBLIC_API_URL
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const userContext = useUser()
  const user = userContext?.user
  const configs = useConfig()
  const config = configs?.config || []
  const configColor = findConfig({ configs: config, code: 'Color' })
  const color = configColor?.value || '#5b89d6'

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

  return (
    <Shadow>
      <View
        className="bg-gray-300/40 py-3 px-3 flex-row items-center max-h-[110px] overflow-hidden w-full h-full"
        style={{ backgroundColor: `${color}55` }}
      >
        <View className="w-[22%] h-full flex items-center justify-center">
          <View className="rounded-full overflow-hidden w-full h-auto aspect-square items-center justify-center bg-[#ffe6d9] bg-opacity-80">
            {!imageUrl && <UserBaseLogo letter={userLetter || ''} />}
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
        <ScrollView
          className="w-[75%] ml-3"
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
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
              Rol : {user?.roleUser?.code || '------'}
            </Text>
          </View>
        </ScrollView>
      </View>
    </Shadow>
  )
}

const styles = StyleSheet.create({
  labelTextInformation: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    width: '100%',
  },
  containerLabelText: {
    display: 'flex',
    flexDirection: 'row',
  },
})
