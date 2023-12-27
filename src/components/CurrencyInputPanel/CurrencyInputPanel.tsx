import { Pair, Token } from 'vexchange-sdk/dist'
import React, { useState, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
// import '@reach/tooltip/styles.css'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { useDarkMode } from 'usehooks-ts'
import { ArrowDown } from 'react-feather'
import { ButtonPrimary } from '../Button'

import { Field } from '../../state/swap/actions'
import { useTokenBalanceTreatingWETHasETH } from '../../state/wallet/hooks'
import { useDarkModeManager } from '../../state/user/hooks'

import TokenLogo from '../TokenLogo'
import DoubleLogo from '../DoubleLogo'
import { SearchModal } from '../SearchModal'
import { RowBetween } from '../Row'
import { TYPE, CursorPointer } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'

import { useWeb3React } from '../../hooks'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const CurrencySelect = styled(ButtonPrimary)<{ selected: boolean }>``

const LabelRow = styled.div``

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(ArrowDown)<{ selected: boolean }>``

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  z-index: 1;
`

const Container = styled.div``

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
`
const StyledBalanceMax = styled.button`
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};

  background-image: linear-gradient(137deg, rgba(231, 150, 49, 0.57) 0%, rgba(217, 41, 33, 0.4) 100%);
  border: none;
  color: #ffffff;
`

interface CurrencyInputPanelProps {
  value: string
  field: string
  onUserInput: (field: string, val: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  urlAddedTokens?: Token[]
  onTokenSelection?: (tokenAddress: string) => void
  token?: Token | null
  disableTokenSelect?: boolean
  hideBalance?: boolean
  isExchange?: boolean
  pair?: Pair | null
  hideInput?: boolean
  showSendWithSwap?: boolean
  otherSelectedTokenAddress?: string | null
  id: string
}

export const CurrencyInputPanel = ({
  value,
  field,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  urlAddedTokens = [], // used
  onTokenSelection = null,
  token = null,
  disableTokenSelect = false,
  hideBalance = false,
  isExchange = false,
  pair = null, // used for double token logo
  hideInput = false,
  showSendWithSwap = false,
  otherSelectedTokenAddress = null,
  id
}: CurrencyInputPanelProps) => {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useWeb3React()
  const userTokenBalance = useTokenBalanceTreatingWETHasETH(account, token)
  const theme = useContext(ThemeContext)

  return (
    <InputPanel id={id}>
      <Container>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
              {account && (
                <CursorPointer>
                  <TYPE.body
                    onClick={onMax}
                    color={theme.text2}
                    fontWeight={500}
                    fontSize={14}
                    style={{ display: 'inline' }}
                  >
                    {!hideBalance && !!token && userTokenBalance
                      ? 'Balance: ' + userTokenBalance?.toSignificant(6)
                      : ' -'}
                  </TYPE.body>
                </CursorPointer>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableTokenSelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(field, val)
                }}
              />
              {account && !!token?.address && showMaxButton && label !== 'To' && (
                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
              )}
            </>
          )}
          <CurrencySelect
            selected={!!token}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableTokenSelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {isExchange ? (
                <DoubleLogo a0={pair?.token0.address} a1={pair?.token1.address} size={24} margin={true} />
              ) : token?.address ? (
                <TokenLogo address={token?.address} size={'24px'} />
              ) : null}
              {isExchange ? (
                <StyledTokenName className="token-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                // <StyledTokenName active={Boolean(token && token.symbol)}>
                <StyledTokenName>{(token && token.symbol) || t('selectToken')}</StyledTokenName>
              )}
              {!disableTokenSelect && <StyledDropDown selected={!!token?.address} />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableTokenSelect && modalOpen && (
        <SearchModal
          isOpen={modalOpen}
          onDismiss={() => {
            setModalOpen(false)
          }}
          filterType="tokens"
          urlAddedTokens={urlAddedTokens}
          onTokenSelect={onTokenSelection}
          showSendWithSwap={showSendWithSwap}
          hiddenToken={token?.address}
          otherSelectedTokenAddress={otherSelectedTokenAddress}
          otherSelectedText={field === Field.INPUT ? 'Selected as output' : 'Selected as input'}
        />
      )}
    </InputPanel>
  )
}
