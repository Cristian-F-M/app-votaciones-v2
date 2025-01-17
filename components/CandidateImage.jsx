import { Image, View } from 'react-native'

export function CandidateImage({ candidate }) {
  const url = process.env.EXPO_PUBLIC_API_URL

  return (
    <View className="flex justify-center items-center rounded-full w-4/5 h-auto aspect-square">
      <Image
        className="rounded-full overflow-hidden w-full h-full"
        source={{
          uri: `${url}/candidate/image/${candidate.id}`,
        }}
        alt={`Foto del candidato ${candidate.name}`}
        resizeMode="cover"
        style={{ width: 200, height: 200 }}
      />
    </View>
  )
}
