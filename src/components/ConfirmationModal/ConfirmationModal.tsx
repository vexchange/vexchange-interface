import React, { useCallback, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'

import Modal from '../Modal'
import Loader from '../Loader'
import { Link } from '../../theme'
import { Text } from 'rebass'
import { CloseIcon } from '../../theme/components'
import { RowBetween } from '../Row'
import { ArrowUpCircle } from 'react-feather'
import { ButtonPrimary } from '../Button'
import { AutoColumn, ColumnCenter } from '../Column'

import { useWeb3React } from '../../hooks'
import { getExploreLink } from '../../utils'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)``

const BottomSection = styled(Section)`
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

const ConfirmedIcon = styled(ColumnCenter)``

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string
  topContent: () => React.ReactChild
  bottomContent: () => React.ReactChild
  attemptingTxn: boolean
  pendingConfirmation: boolean
  pendingText: string
  title?: string
}

export const ConfirmationModal = ({
  isOpen,
  onDismiss,
  hash,
  topContent,
  bottomContent,
  attemptingTxn,
  pendingConfirmation,
  pendingText,
  title = ''
}: ConfirmationModalProps) => {
  const location = useLocation()
  const navitage = useNavigate()

  const { chainId } = useWeb3React()
  const theme = useContext(ThemeContext)

  const dismissAndReturn = useCallback(() => {
    if (location.pathname.match('/add') || location.pathname.match('/remove')) {
      navitage('/pool')
    }
    onDismiss()
  }, [onDismiss, history])

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {!attemptingTxn ? (
        <Wrapper>
          <Section>
            <RowBetween>
              <Text fontWeight={500} fontSize={20}>
                {title}
              </Text>
              <CloseIcon onClick={onDismiss} />
            </RowBetween>
            {topContent()}
          </Section>
          <BottomSection>{bottomContent()}</BottomSection>
        </Wrapper>
      ) : (
        <Wrapper>
          <Section>
            <RowBetween>
              <div />
              <CloseIcon onClick={onDismiss} />
            </RowBetween>
            <ConfirmedIcon>
              {pendingConfirmation ? (
                <Loader size="90px" />
              ) : (
                <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
              )}
            </ConfirmedIcon>
            <AutoColumn>
              <Text fontWeight={500} fontSize={20}>
                {!pendingConfirmation ? 'Transaction Submitted' : 'Waiting For Confirmation'}
              </Text>
              <AutoColumn>
                <Text fontWeight={600} fontSize={14} color="" textAlign="center">
                  {pendingText}
                </Text>
              </AutoColumn>
              {!pendingConfirmation && (
                <>
                  <Link href={getExploreLink(chainId, hash, 'transaction')}>
                    <Text fontWeight={500} fontSize={14} color={theme.primary1}>
                      View on VeChain Stats
                    </Text>
                  </Link>
                  <ButtonPrimary onClick={dismissAndReturn} style={{ margin: '20px 0 0 0' }}>
                    <Text fontWeight={500} fontSize={20}>
                      Close
                    </Text>
                  </ButtonPrimary>
                </>
              )}

              {pendingConfirmation && (
                <Text fontSize={12} color="#f5a788" textAlign="center">
                  Confirm this transaction in your wallet
                </Text>
              )}
            </AutoColumn>
          </Section>
        </Wrapper>
      )}
    </Modal>
  )
}
