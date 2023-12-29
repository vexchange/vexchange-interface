import React from 'react'
import styled, { css } from 'styled-components'
import {
  Input as ChakraInput,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react'
import { useDarkMode } from 'usehooks-ts'

import { escapeRegExp } from '../../utils'

const StyledInput = styled(ChakraInput)<{ error?: boolean; fontSize?: string; align?: string; isDark?: boolean }>`
  border: 1px solid black;
`

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export const Input = React.memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  ...rest
}: {
  value: string | number
  onUserInput: (string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const { isDarkMode } = useDarkMode()
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }

  return (
    <NumberInput
      w="100%"
      precision={2}
      {...rest}
      // isDark={isDark}
      value={value}
      onChange={enforcer}
      // universal input options
      inputMode="decimal"
      title="Token Amount"
      autoCorrect="off"
      // text-specific options
      spellCheck="false"
    >
      <NumberInputField placeholder={placeholder || '0.0'} border="1px solid black" />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  )
})

export default Input
