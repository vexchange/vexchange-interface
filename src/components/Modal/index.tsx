import React from 'react'
import styled, { css } from 'styled-components'
import { useTransition, useSpring } from 'react-spring'
import { useDarkMode } from 'usehooks-ts'
import { isMobile } from 'react-device-detect'
import { transparentize } from 'polished'
import { useGesture } from 'react-use-gesture'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'
interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.Ref<any>
  children?: React.ReactNode
}

export default function Modal({
  isVisible,
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 50,
  initialFocusRef = null,
  children
}: ModalProps) {
  const cancelRef = React.useRef()
  const styles = useSpring({
    opacity: isVisible ? 1 : 0,
    y: isVisible ? 0 : 24
  })
  const { isDarkMode } = useDarkMode()

  const transitions = useTransition(isOpen, null, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  })

  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))
  const bind = useGesture({
    onDrag: state => {
      let velocity = state.velocity
      if (velocity < 1) {
        velocity = 1
      }
      if (velocity > 8) {
        velocity = 8
      }
      set({
        xy: state.down ? state.movement : [0, 0],
        config: { mass: 1, tension: 210, friction: 20 }
      })
      if (velocity > 3 && state.direction[1] > 0) {
        onDismiss()
      }
    }
  })

  if (isMobile) {
    return (
      <>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <AlertDialog key={key} isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onDismiss}>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogBody>{children}</AlertDialogBody>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            )
        )}
      </>
    )
  } else {
    return (
      <>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <AlertDialog key={key} isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onDismiss}>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogBody> {children}</AlertDialogBody>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            )
        )}
      </>
    )
  }
}
