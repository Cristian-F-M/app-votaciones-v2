import { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { UserBaseLogo } from '../icons/UserBaseLogo.jsx'
import { doFetch, METHODS } from '../lib/api.js'
import { useUser } from '../context/user.js'
import { useLocales } from 'expo-localization'
import { getI18n, LANGUAGES } from '../lib/lenguages'

export function Perfil() {
  const { user } = useUser()
  const locales = useLocales()
  const { languageCode } = locales[0]
  const i18n = getI18n(languageCode)
  const [i18, setI18] = useState(i18n)

  const codeRole = i18n.t[user?.roleUser.code]
  const userLetter = user?.name.split(' ')[0].charAt(0)

  return (
    <View className="bg-gray-300/60 p-3 flex-row gap-4 items-center">
      <View
        className={`rounded-full overflow-hidden bg-gray-400 w-12 h-12 items-center justify-center`}
      >
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
            {i18.t.labelRole}: {codeRole}
          </Text>
        </View>
      </View>
    </View>
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
