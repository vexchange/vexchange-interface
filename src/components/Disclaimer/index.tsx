import React from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { useDarkModeManager } from '../../state/user/hooks'

const Wrapper = styled.div<{ isDark?: boolean }>`
  margin-top: -130px;
  text-align: center;
  font-size: 80%;

  color: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)')};

  a {
    color: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)')};
  }
`

export default function Disclaimer() {
  const { pathname } = useLocation()
  const [isDark] = useDarkModeManager()

  const matches = pathname === '/fiat-onramp'

  return matches ? (
    <Wrapper isDark={isDark}>
      This service is provided by{' '}
      <a href="https://www.stably.io/" target="_blank" rel="noopener noreferrer">
        Stably
      </a>
      . Vexchange is providing a link to a third-party service and is unaffiliated with Stably.
    </Wrapper>
  ) : null
}
