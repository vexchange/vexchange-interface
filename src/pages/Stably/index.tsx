import React from 'react'
import styled from 'styled-components'

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

  if (!account) {
    return (
      <Wrapper>
        <div>Please sign in to continue</div>
      </Wrapper>
    )
  }

  return (
    <div>
      <Iframe src={`https://ramp.stably.io/?address=${account}&network=vechain&asset=veusd&filter=true`}></Iframe>
    </div>
  )
}
