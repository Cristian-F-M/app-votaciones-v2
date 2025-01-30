import { Stack } from 'expo-router'
import { UserProvider } from '../../context/user.js'

export default function CandidateLayout() {
  return (
    <>
      <UserProvider>
        <Stack />
      </UserProvider>
    </>
  )
}
