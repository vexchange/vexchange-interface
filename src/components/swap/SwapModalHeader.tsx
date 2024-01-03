import { Token, TokenAmount } from 'vexchange-sdk/dist'
import React, { useContext } from 'react'
import { ArrowDown } from 'react-feather'
import { Text } from '@chakra-ui/react'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import { TokenLogo } from '../TokenLogo'
import { TruncatedText } from './styleds'

export default function SwapModalHeader({
  formattedAmounts,
  tokens,
  slippageAdjustedAmounts,
  priceImpactSeverity,
  independentField
}: {
  formattedAmounts?: { [field in Field]?: string }
  tokens?: { [field in Field]?: Token }
  slippageAdjustedAmounts?: { [field in Field]?: TokenAmount }
  priceImpactSeverity: number
  independentField: Field
}) {
  const theme = useContext(ThemeContext)
  return (
    <AutoColumn style={{ marginTop: '20px' }}>
      <RowBetween>
        <TruncatedText fontSize={24} fontWeight={500}>
          {!!formattedAmounts[Field.INPUT] && formattedAmounts[Field.INPUT]}
        </TruncatedText>
        <RowFixed>
          <TokenLogo address={tokens[Field.INPUT]?.address} size={'24px'} />
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {tokens[Field.INPUT]?.symbol || ''}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" />
      </RowFixed>
      <RowBetween>
        <TruncatedText fontSize={24} fontWeight={500} color={priceImpactSeverity > 2 ? theme.red1 : ''}>
          {!!formattedAmounts[Field.OUTPUT] && formattedAmounts[Field.OUTPUT]}
        </TruncatedText>
        <RowFixed>
          <TokenLogo address={tokens[Field.OUTPUT]?.address} size={'24px'} />
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {tokens[Field.OUTPUT]?.symbol || ''}
          </Text>
        </RowFixed>
      </RowBetween>
      <AutoColumn style={{ padding: '12px 0 0 0px' }}>
        {independentField === Field.INPUT ? (
          <TYPE.italic textAlign="left" style={{ width: '100%' }}>
            {`Output is estimated. You will receive at least `}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {tokens[Field.OUTPUT]?.symbol}{' '}
            </b>
            {' or the transaction will revert.'}
          </TYPE.italic>
        ) : (
          <TYPE.italic textAlign="left" style={{ width: '100%' }}>
            {`Input is estimated. You will sell at most `}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {tokens[Field.INPUT]?.symbol}
            </b>
            {' or the transaction will revert.'}
          </TYPE.italic>
        )}
      </AutoColumn>
    </AutoColumn>
  )
}
