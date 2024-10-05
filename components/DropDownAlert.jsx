import DropdownAlert from 'react-native-dropdownalert'

export let alert = _data => new Promise(res => res)
export async function showAlert({
  message = 'Un error ha ocurrido',
  type,
  title,
}) {
  await alert({
    type,
    message,
    title,
  })
}

export function DropDownAlert({
  dismissInterval = 1000,
  alertPosition = 'top',
}) {
  return (
    <DropdownAlert
      alert={func => (alert = func)}
      translucent={true}
      dismissInterval={dismissInterval}
      inactiveStatusBarBackgroundColor="#f2f2f2"
      inactiveStatusBarStyle="dark-content"
      alertPosition={alertPosition}
      successImageSrc={require('../assets/success.png')}
      successColor={'#32a54a'}
      dangerColor={'#cc3232'}
      warningColor={'#cd853f'}
      infoColor={'#2b73b6'}
    />
  )
}
