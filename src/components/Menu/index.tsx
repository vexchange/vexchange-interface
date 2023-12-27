import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Menu as MenuIcon } from 'react-feather'
import { ButtonSecondary } from '../Button'

import { Link } from '../../theme'
import { useToggle } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: rgba(255, 255, 255, 0.14);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;
`

const MenuItem = styled(Link)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
  }
`

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const [open, toggle] = useToggle(false)
  const [isDark] = useDarkModeManager()

  useEffect(() => {
    const handleClickOutside = e => {
      if (node.current?.contains(e.target) ?? false) {
        return
      }
      toggle()
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, toggle])

  return (
    <StyledMenu ref={node}>
      <ButtonSecondary onClick={() => toggle()}>
        <MenuIcon />
      </ButtonSecondary>

      {open ? (
        <MenuFlyout>
          <MenuItem id="link" href="/fiat-onramp">
            Fiat Onramp
          </MenuItem>
          <MenuItem id="link" href="https://info.vexchange.io">
            Info
          </MenuItem>
          <MenuItem id="link" href="https://docs.vexchange.io">
            Docs
          </MenuItem>
        </MenuFlyout>
      ) : (
        ''
      )}
    </StyledMenu>
  )
}
