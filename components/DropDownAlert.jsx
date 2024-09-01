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

export function DropDownAlert() {
  return (
    <DropdownAlert
      alert={func => (alert = func)}
      translucent={true}
      dismissInterval={1000}
      inactiveStatusBarBackgroundColor="#f2f2f2"
      inactiveStatusBarStyle="dark-content"
    />
  )
}
