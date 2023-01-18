import React from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'

const Wrapper = styled.div`
  color: rgba(255, 255, 255, 0.3);
  margin-top: -130px;
  text-align: center;
  font-size: 80%;
`

export default function Disclaimer() {
  const { pathname } = useLocation()
  const matches = pathname === '/fiat-onramp'

  return matches ? (
    <Wrapper>
      This service is provided by{' '}
      <a href="https://www.stably.io/" target="_blank" rel="noopener noreferrer">
        Stably
      </a>
      . Vexchange is providing a link to a third-party service and is unaffiliated with Stably.
    </Wrapper>
  ) : null
}
