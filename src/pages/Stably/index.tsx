import React from 'react'
import styled from 'styled-components'

export const Iframe = styled.iframe`
  position: relative;
  width: 100%;
  border: none;
  height: 700px;
  border-radius: 0 0 26px 26px;
`

export default function Stably() {
  return (
    <div>
      <Iframe src="https://ramp.stably.io/?address=hx777535db1b4039c837580e74aac35d0bbaaa7b4c&amount=42.42&network=icon&asset=USDS&filter=true"></Iframe>
    </div>
  )
}
