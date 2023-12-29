import { Trade, TradeType, Percent } from 'vexchange-sdk/dist'
import React, { useContext } from 'react'
import { ChevronUp } from 'react-feather'
import { Text } from '@chakra-ui/react'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { CursorPointer, TYPE } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import { SectionBreak } from './styleds'
import { QuestionHelper } from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import SlippageTabs, { SlippageTabsProps } from '../SlippageTabs'
import FormattedPriceImpact from './FormattedPriceImpact'

export interface AdvancedSwapDetailsProps extends SlippageTabsProps {
  trade: Trade
  swapFee: Percent
  onDismiss: () => void
}

export function AdvancedSwapDetails({ trade, swapFee, onDismiss, ...slippageTabProps }: AdvancedSwapDetailsProps) {
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade, swapFee)
  const theme = useContext(ThemeContext)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, slippageTabProps.rawSlippage)

  return (
    <AutoColumn>
      <CursorPointer>
        <RowBetween onClick={onDismiss} padding={'8px 20px'}>
          <Text fontSize={16} fontWeight={500} style={{ userSelect: 'none' }}>
            Hide Advanced
          </Text>
          <ChevronUp />
        </RowBetween>
      </CursorPointer>
      <SectionBreak />
      <AutoColumn style={{ padding: '0 20px' }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400}>
              {isExactIn ? 'Minimum received' : 'Maximum sold'}
            </TYPE.black>
            <QuestionHelper
              text={
                isExactIn
                  ? 'Price can change between when a transaction is submitted and when it is executed. This is the minimum amount you will receive. A worse rate will cause your transaction to revert.'
                  : 'Price can change between when a transaction is submitted and when it is executed. This is the maximum amount you will pay. A worse rate will cause your transaction to revert.'
              }
            />
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme.text1} fontSize={14}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.token.symbol}` ?? '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.token.symbol}` ?? '-'}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper
              text={`A portion of each trade (${swapFee.toSignificant(
                4
              )}%) goes to liquidity providers as a protocol incentive.`}
            />
          </RowFixed>
          <TYPE.black fontSize={14} color={theme.text1}>
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.token.symbol}` : '-'}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
      <SectionBreak />
      <RowFixed>
        <TYPE.black fontWeight={400} fontSize={14}>
          Set slippage tolerance
        </TYPE.black>
        <QuestionHelper text="Your transaction will revert if the execution price changes by more than this amount after you submit your trade." />
      </RowFixed>
      <SlippageTabs {...slippageTabProps} />
    </AutoColumn>
  )
}
