import { extendTheme } from '@chakra-ui/react'

import { styles } from './global'

export const theme = extendTheme({
  styles,
  components: {
    Button: {
      variants: {
        primary: {
          bg: 'white',
          color: 'black',
          border: '1px solid black',
          _hover: {
            bg: '#2261FF',
            color: 'white'
          }
        }
      }
    }
  }
})
