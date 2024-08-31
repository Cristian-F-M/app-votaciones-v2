import { useEffect, useState } from 'react'
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { UserBaseLogo } from '../icons/UserBaseLogo.jsx'
import { doFetch, METHODS } from '../lib/api.js'
import { useUser } from '../context/user.js'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import { useConfig } from '../context/config.js'
import { Shadow } from 'react-native-shadow-2'
import { findConfig } from '../lib/config'

export function Profile() {
  const { user } = useUser()
  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  const userLetter = user?.name.split(' ')[0].charAt(0)

  useEffect(() => {})

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
    <Shadow>
      <Pressable onPress={handleClickEditProfile}>
        <View
          className="bg-gray-300/40 px-3 py-6 flex-row gap-4 items-center"
          style={{ backgroundColor: `${color}cc` }}
        >
          <View className="rounded-full overflow-hidden w-12 h-12 items-center justify-center bg-[#ffe6d9] bg-opacity-80">
            <UserBaseLogo letter={userLetter} />
          </View>
          {/*  */}
          <View className="">
            <View style={styles.containerLabelText}>
              <Text style={styles.labelTextInformation}>
                {user?.name} {user?.lastname}
              </Text>
            </View>
            <View style={styles.containerLabelText}>
              <Text style={styles.labelTextInformation}>{user?.document}</Text>
            </View>
            <View style={styles.containerLabelText}>
              <Text style={styles.labelTextInformation}>{user?.email}</Text>
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
  },
  containerLabelText: {
    display: 'flex',
    flexDirection: 'row',
  },
})
