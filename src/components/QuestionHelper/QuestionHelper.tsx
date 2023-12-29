import React from 'react'
import { HelpCircle as Question } from 'react-feather'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton
} from '@chakra-ui/react'

export const QuestionHelper = ({ text }: { text: string }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Question size={16} />
      </PopoverTrigger>
      <PopoverContent bg="white">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>{text}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
