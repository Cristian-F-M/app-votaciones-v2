import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

export async function doFetch({
  url,
  method = METHODS.GET,
  body,
  includeContentType = true,
  contentType = 'application/json',
  stringifyBody = true,
}: {
  url: string
  method?: (typeof METHODS)[keyof typeof METHODS]
  body?: Record<string, any> | FormData
  includeContentType?: boolean
  contentType?: string
  stringifyBody?: boolean
}) {
  const token = await getItemStorage({ name: 'token' })
  let newBody: FormData | string = JSON.stringify(body)
  if (!stringifyBody && body instanceof FormData) newBody = body

  let res
  url = url?.startsWith('http')
    ? url
    : `${process.env.EXPO_PUBLIC_API_URL}/${url}`

  const headers: RequestInit['headers'] = {
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
  } catch (e: unknown) {
    const text = await res?.text()
    if (text) console.log({ text })
    if (e instanceof Error) console.log({ err: e.message })
    return { ok: false, error: 'An error has ocurred' }
  }
}

export async function getItemStorage({ name }: { name: string }) {
  const item = await AsyncStorage.getItem(name)
  return item ? JSON.parse(item) : null
}

export async function setItemStorage({
  name,
  value,
  expires = null,
}: {
  name: string
  value: any
  expires?: Date | null
}) {
  return await AsyncStorage.setItem(
    name,
    JSON.stringify({ name, value, expires }),
  )
}

export async function removeItemStorage({ name }: { name: string }) {
  return await AsyncStorage.removeItem(name)
}

export async function saveConfig(key: string, value: any) {
  const settings = (await getConfigs()) || {}
  settings[key] = value
  await setItemStorage({ name: 'settings', value: settings })
}

export async function getConfigs() {
  const settigs = await AsyncStorage.getItem('settings')
  if (!settigs) return {}
  return JSON.parse(settigs)?.value || {}
}

export async function removeConfig(key: string) {
  const settings = (await getConfigs()) || {}
  delete settings[key]
  await setItemStorage({ name: 'settings', value: settings })
}

export function getApiErrors(errors: Record<string, any>) {
  const apiErrors: Record<string, string> = {}

  Object.entries(errors).forEach(([_, v]) => {
    const { path, msg } = v[0]
    apiErrors[path] = msg
  })

  return apiErrors
}

export function getApiErrorsEntries(errors: Record<string, any>) {
  const entries = Object.entries(errors)
  let localyEntries: [string, any][] = []
  entries.forEach(([key, value]) => {
    if (value != null) localyEntries.push([key, value])
  })

  return localyEntries
}
