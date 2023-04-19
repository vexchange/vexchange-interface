import React from 'react'
import styled from 'styled-components'
import queryString from 'query-string'

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
    network: 'vechainthor',
    asset: 'VeUSD',
    lock: true
  })

  if (!account) {
    return (
      <Wrapper>
        <div>Please sign in to use our Stably VeUSD Ramp</div>
      </Wrapper>
    )
  }
  //ramp.stably.io/?address=hx777535db1b4039c837580e74aac35d0bbaaa7b4c&amount=42.42&network=icon&asset=USDS&filter=true
  https: return (
    <div>
      <Iframe src={`https://ramp.stably.io/?${stringified}`}></Iframe>
    </div>
  )
}
