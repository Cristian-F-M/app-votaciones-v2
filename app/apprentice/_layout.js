import { Stack } from 'expo-router'
import SideMenu from '@chakrahq/react-native-side-menu'
import { ApprenticeMenu } from '../../components/ApprenticeMenu.jsx'
import { useEffect, useState } from 'react'
import LogoSena from '../../icons/Logo.jsx'
import ClosedMenu from '../../icons/ClosedMenu.jsx'
import {
  doFetch,
  getItemStorage,
  METHODS,
  setItemStorage,
} from '../../lib/api.js'
import OpenedMenu from '../../icons/OpenedMenu.jsx'
import { Dimensions } from 'react-native'
import { UserProvider } from '../../context/user.js'
import { Link, router, usePathname } from 'expo-router'

export default function ApprenticeLayout() {
  const [menuIsVisible, setMenuIsVisible] = useState(false)
  const [Color, setColor] = useState()
  const windowWidth = Dimensions.get('window').width
  const sideMenuPorcentage = (windowWidth * 80) / 100
  const path = usePathname()

  function handleClickHome() {
    if (path === '/apprentice') return
    router.replace('apprentice/')
  }

  useEffect(() => {
    async function getConfigs() {
      const colorStoraged = await getItemStorage({ name: 'color' })

      if (!colorStoraged || new Date() > colorStoraged.expires) {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/config/?code=Color`
        const res = await doFetch({ url, method: METHODS.GET })
        const color = res.config.value

        await setItemStorage({
          name: 'color',
          value: color,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 4),
        })
        return setColor(color)
      }
      setColor(colorStoraged.value)
    }

    getConfigs()
  }, [])

  return (
    <UserProvider>
      <SideMenu
        isOpen={menuIsVisible}
        menuPosition="right"
        menu={<ApprenticeMenu setMenuIsVisible={setMenuIsVisible} />}
        onChange={isOpen => setMenuIsVisible(isOpen)}
        openMenuOffset={sideMenuPorcentage}
      >
        <Stack
          screenOptions={{
            headerShown: true,
            headerTitle: '',
            headerLeft: () => (
              <LogoSena
                onPress={handleClickHome}
                width={45}
                height={45}
                style={{ fill: Color }}
              />
            ),
            headerRight: () =>
              menuIsVisible ? (
                <OpenedMenu
                  width={35}
                  height={35}
                  style={{ color: '#000' }}
                />
              ) : (
                <ClosedMenu
                  width={35}
                  height={35}
                  style={{ color: '#000' }}
                  onPress={() => setMenuIsVisible(true)}
                />
              ),
          }}
        />
      </SideMenu>
    </UserProvider>
  )
}
