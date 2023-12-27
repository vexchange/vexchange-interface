import React from 'react'
import styled from 'styled-components'
import { Send } from 'react-feather'

import { ButtonSecondary } from '../Button'

const FooterFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

export const Footer = () => {
  return (
    <FooterFrame>
      <form action="https://discord.gg/bzvUNqTENp" target="_blank">
        <ButtonSecondary p="8px 12px">
          <Send size={16} style={{ marginRight: '8px' }} /> Feedback
        </ButtonSecondary>
      </form>
    </FooterFrame>
  )
}
