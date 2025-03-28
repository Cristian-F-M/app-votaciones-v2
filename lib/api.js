import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

export async function doFetch({
  url = process.env.API_URL,
  method = METHODS.GET,
  body,
  includeContentType = true,
  contentType = 'application/json',
  stringifyBody = true,
}) {
  const token = await getItemStorage({ name: 'token' })
  const newBody = stringifyBody ? JSON.stringify(body) : body
  let res
  url = url.startsWith('http')
    ? url
    : `${process.env.EXPO_PUBLIC_API_URL}/${url}`

  const headers = {
    Cookie: `token=${token?.value}`,
    'User-Agent': 'mobile',
  }

  if (includeContentType) headers['Content-Type'] = contentType

  try {
    res = await fetch(url, {
      method,
      headers,
      body: newBody,
    })
    const d = await res.json()

    if (!d.ok && d.returnUrl) router.replace(d.returnUrl)

    return d
  } catch (e) {
    const text = await res?.text()
    if (text) console.log({ text })
    console.log({ err: e.message })
    return { ok: false, error: 'An error has ocurred' }
  }
}

export async function getItemStorage({ name }) {
  return await JSON.parse(await AsyncStorage.getItem(name))
}

export async function setItemStorage({ name, value, expires = null }) {
  return await AsyncStorage.setItem(
    name,
    JSON.stringify({ name, value, expires }),
  )
}

export async function removeItemStorage({ name }) {
  return await AsyncStorage.removeItem(name)
}

export async function saveConfig(key, value) {
  const settings = (await getConfigs()) || {}
  settings[key] = value
  await setItemStorage({ name: 'settings', value: settings })
}

export async function getConfigs() {
  const settigs = await AsyncStorage.getItem('settings')
  return JSON.parse(settigs)?.value || {}
}

export async function removeConfig(key) {
  const settings = (await getConfigs()) || {}
  delete settings[key]
  await setItemStorage({ name: 'settings', value: settings })
}

export function getApiErrors(errors) {
  const apiErrors = {}

  Object.entries(errors).forEach(([_, v]) => {
    const { path, msg } = v[0]
    apiErrors[path] = msg
  })

  return apiErrors
}

export function getApiErrorsEntries(errors) {
  const entries = Object.entries(errors)
  let localyEntries = []
  entries.forEach(([key, value]) => {
    if (value != null) localyEntries.push([key, value])
  })

  return localyEntries
}
