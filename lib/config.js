import * as Notifications from 'expo-notifications'
import { doFetch, METHODS, saveConfig } from './api'

export const API_URL = process.env.EXPO_PUBLIC_API_URL

export function findConfig({ configs, code }) {
  configs = configs || []
  return configs.find(c => {
    return c.code === code.trim()
  })
}

export async function activateNotifications() {
  const settings = await Notifications.getPermissionsAsync()

  if (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    const res = await saveNotificationToken()

    if (!res.ok) return false

    saveConfig('isNotificationsActive', true)
    return true
  } else if (settings.canAskAgain) {
    await Notifications.requestPermissionsAsync()
    return activateNotifications()
  } else {
    return false
  }
}

export async function saveNotificationToken(token = '') {
  const { data } = await Notifications.getExpoPushTokenAsync()
  const notificationToken = token === '' ? data : null

  const res = await doFetch({
    url: `${API_URL}/user/notificationToken/`,
    method: METHODS.POST,
    body: { notificationToken },
  })

  return res
}
