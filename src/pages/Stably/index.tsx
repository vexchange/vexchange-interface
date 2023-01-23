import React from 'react'
import styled from 'styled-components'
import queryString from 'query-string';

import { useWeb3React } from '../../hooks'

export const Iframe = styled.iframe`
  position: relative;
  width: 100%;
  border: none;
  height: 700px;
  border-radius: 0 0 26px 26px;
`

const Wrapper = styled.div`
  text-align: center;
  padding: 20px;
`

export default function Stably() {
  const { account } = useWeb3React()

  const stringified = queryString.stringify({
    address: account,
    network: 'vechain',
    asset: 'VEUSD',
    filter: true
  })

  if (!account) {
    return (
      <Wrapper>
        <div>Please sign in to use our Stably VeUSD Ramp</div>
      </Wrapper>
    )
  }

  return (
    <div>
      <Iframe src={`https://ramp.stably.io/?${stringified}`}></Iframe>
    </div>
  )
}
