import { Text, View } from 'react-native'
import { Screen } from '../../components/Screen'
import ShieldAlert from '../../icons/ShieldAlert'
import { useConfig } from '../../context/config'
import { findConfig } from '../../lib/config'
import { StyledPressable } from '../../components/StyledPressable'
import { Shadow } from 'react-native-shadow-2'
import { router, Stack } from 'expo-router'
import LogoSena from '../../icons/Logo'
import { StatusBar } from 'expo-status-bar'
import { doFetch, METHODS, removeItemStorage } from '../../lib/api'
import { toast } from '@backpackapp-io/react-native-toast'
import { TOAST_STYLES } from '../../lib/toastConstants'

export default function AdministratorPage() {
  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  async function handleClickLogout() {
    const res = await doFetch({ url: 'Logout', method: METHODS.POST })

    if (res.error) {
      return toast.error(res.error, {
        styles: TOAST_STYLES.ERROR,
      })
    }

    if (!res.ok) {
      return toast.error(res.message, {
        styles: TOAST_STYLES.ERROR,
      })
    }

    removeItemStorage({ name: 'token' })
    router.replace('/')
  }

  return (
    <Screen>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Administrador',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <LogoSena
              width={40}
              height={40}
              style={{ fill: color }}
            />
          ),
        }}
      />
      <View className="flex-1 items-center w-full mt-14">
        <Shadow>
          <View className="w-[95%] items-center justify-center px-4 py-10">
            <View className="bg-red-200/80 w-fit h-fit items-center justify-center rounded-full p-3">
              <ShieldAlert
                style={{ color: color }}
                width={54}
                height={54}
              />
            </View>
            <Text className="mt-4 text-2xl font-semibold text-center">
              Acceso Administrativo
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              Cuenta con privilegios de administrador
            </Text>
            <Text className="text-gray-800 text-center mt-5">
              Para acceder a todas las funcionalidades administrativas, por
              favor utilice la versión web completa.
            </Text>
            <Text className="mt-4 text-center text-gray-800">
              La versión móvil tiene funcionalidades limitadas para
              administradores.
            </Text>
            <StyledPressable
              pressableClass="mt-6"
              text="Cerrar Sesión"
              backgroundColor={`${color}cc`}
              onPress={handleClickLogout}
            />
          </View>
        </Shadow>
      </View>
    </Screen>
  )
}
