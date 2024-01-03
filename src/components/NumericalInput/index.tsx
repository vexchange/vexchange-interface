import React from 'react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react'
import { useDarkMode } from 'usehooks-ts'

import { escapeRegExp } from '../../utils'

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
      <NumberInputField placeholder={placeholder || '0.0'} borderRadius="0" />
    </NumberInput>
  )
})

export default Input
