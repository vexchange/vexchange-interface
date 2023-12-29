import { Menu as MenuIcon } from 'react-feather'
import { Menu as ChakraMenu, MenuButton, MenuList, MenuItem, Button, IconButton } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { useDarkModeManager } from '../../state/user/hooks'

export default function Menu() {
  const [isDark] = useDarkModeManager()

  return (
    <ChakraMenu>
      <MenuButton as={IconButton} icon={<MenuIcon />} variant="primary" />

      <MenuList border="1px solid black">
        <MenuItem>
          <Link to="https://info.vexchange.io">Info</Link>
        </MenuItem>
        <MenuItem>
          <Link to="https://docs.vexchange.io">Docs</Link>
        </MenuItem>
      </MenuList>
    </ChakraMenu>
  )
}
