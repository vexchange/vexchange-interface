import { Pair, Token } from 'vexchange-sdk/dist'
import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDarkMode } from 'usehooks-ts'
import { ArrowDown } from 'react-feather'
import { HStack, Button, Text, Box, useDisclosure } from '@chakra-ui/react'

import { ButtonPrimary } from '../Button'

import { Field } from '../../state/swap/actions'
import { useTokenBalanceTreatingWETHasETH } from '../../state/wallet/hooks'

import { TokenLogo } from '../TokenLogo'
import DoubleLogo from '../DoubleLogo'
import { SearchModal } from '../SearchModal'
import { RowBetween } from '../Row'
import { TYPE, CursorPointer } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'

import { useWeb3React } from '../../hooks'

import styles from './currency-input-panel.module.scss'

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

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { account } = useWeb3React()
  const userTokenBalance = useTokenBalanceTreatingWETHasETH(account, token)

  return (
    <Box id={id} mb={4}>
      <div>
        {!hideInput && (
          <div>
            <RowBetween>
              <TYPE.body fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
              {account && (
                <CursorPointer>
                  <TYPE.body onClick={onMax} fontWeight={500} fontSize={14} style={{ display: 'inline' }}>
                    {!hideBalance && !!token && userTokenBalance
                      ? 'Balance: ' + userTokenBalance?.toSignificant(6)
                      : ' -'}
                  </TYPE.body>
                </CursorPointer>
              )}
            </RowBetween>
          </div>
        )}

        <HStack style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableTokenSelect}>
          {!hideInput && (
            <>
              <NumericalInput
                value={value}
                onUserInput={val => {
                  onUserInput(field, val)
                }}
              />
              {account && !!token?.address && showMaxButton && label !== 'To' && <Button onClick={onMax}>MAX</Button>}
            </>
          )}
          <Button
            className={styles['token-name']}
            selected={!!token}
            variant="primary"
            flexShrink={0}
            rightIcon={!disableTokenSelect && <ArrowDown selected={!!token?.address} size={16} />}
            onClick={() => {
              if (!disableTokenSelect) {
                onOpen()
              }
            }}
          >
            <HStack>
              {isExchange ? (
                <DoubleLogo a0={pair?.token0.address} a1={pair?.token1.address} size={24} />
              ) : token?.address ? (
                <TokenLogo address={token?.address} size={'24px'} />
              ) : null}
              {isExchange ? (
                <Text>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                // <StyledTokenName active={Boolean(token && token.symbol)}>
                <Text>{(token && token.symbol) || t('selectToken')}</Text>
              )}
            </HStack>
          </Button>
        </HStack>
      </div>
      {!disableTokenSelect && isOpen && (
        <SearchModal
          isOpen={isOpen}
          onClose={onClose}
          filterType="tokens"
          urlAddedTokens={urlAddedTokens}
          onTokenSelect={onTokenSelection}
          showSendWithSwap={showSendWithSwap}
          hiddenToken={token?.address}
          otherSelectedTokenAddress={otherSelectedTokenAddress}
          otherSelectedText={field === Field.INPUT ? 'Selected as output' : 'Selected as input'}
        />
      )}
    </Box>
  )
}
