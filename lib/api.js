import AsyncStorage from '@react-native-async-storage/async-storage'

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
}) {
  const token = await getItemStorage({ name: 'token' })

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token?.value}`,
      },
      body: JSON.stringify(body),
    })
    const d = await res.json()
    return d
  } catch (e) {
    console.log({ err: e })
    return { error: 'An error has ocurred' }
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
