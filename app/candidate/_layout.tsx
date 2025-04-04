import { Stack } from 'expo-router'
import { UserProvider } from '../../context/user'

export default function CandidateLayout() {
  return (
    <>
      <UserProvider>
        <Stack />
      </UserProvider>
    </>
  )
}
