import { Image, View } from 'react-native'

export function CandidateImage({
  imageUrl = '',
  classImageContainer = '',
  classImage = '',
  alt = '',
}) {
  return (
    <View
      className={`flex justify-center items-center w-4/5 h-auto aspect-square ${classImageContainer}`}
    >
      <Image
        className={`overflow-hidden w-full h-full ${classImage}`}
        source={{
          uri: imageUrl,
          cache: 'reload',
        }}
        alt={alt}
        resizeMode="cover"
      />
    </View>
  )
}
