import React, { useState } from 'react'
import { Modal, Pressable, Text, View, Animated } from 'react-native'
import { useAnimatedValue } from 'react-native'
import { useConfig } from '../context/config'
import { findConfig } from '../lib/config'

let modalInstance = null

export function AnimatedModal() {
  const { config } = useConfig()
  const color = findConfig({ configs: config, code: 'Color' }).value

  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('Title')
  const [modalContent, setModalContent] = useState(null)
  const [closeButton, setCloseButton] = useState(true)
  const [buttons, setButtons] = useState([])

  const opacity = useAnimatedValue(0)
  const scale = useAnimatedValue(0.6)

  const show = ({
    content,
    closeButton = true,
    title = null,
    buttons = [],
  }) => {
    setModalContent(content)
    setVisible(true)
    setTitle(title)
    setButtons(buttons)
    setCloseButton(closeButton)

    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()

    Animated.timing(scale, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const hide = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => setVisible(false))

    Animated.timing(scale, {
      toValue: 0.6,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  // Asignar la instancia para acceder a `showModal` y `hideModal`
  modalInstance = { show, hide }

  if (!visible) return null

  return (
    <Animated.View
      style={{ opacity }}
      className="absolute inset-x-0 inset-y-0 z-50  bg-black/50 "
    >
      <Pressable
        onPress={hideModal}
        className="w-full h-full flex items-center justify-center"
      >
        <Animated.View
          className="w-11/12 bg-white p-4 rounded-lg"
          style={{
            opacity,
            transform: [{ scale }],
          }}
        >
          {title && (
            <View className="mb-3">
              <Text className="text-2xl font-medium">{title}</Text>
            </View>
          )}

          <View>
            {modalContent}
            <View className="flex flex-row justify-between mt-5">
              {buttons.length > 0 &&
                buttons.map((b, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      b.onPress()
                      if (b.hideModalOnPress) hideModal()
                    }}
                    className={` ${b.className}`}
                  >
                    <Text className={`${b.textClassName}`}>{b.text}</Text>
                  </Pressable>
                ))}
              {closeButton && (
                <Pressable
                  className="p-2 px-3 rounded-lg self-end justify-self-end bg-gray-600/60"
                  onPress={hideModal}
                >
                  <Text className="text-white text-center">Cerrar</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  )
}

export function showModal(content) {
  modalInstance?.show(content)
}

export function hideModal() {
  modalInstance?.hide()
}
