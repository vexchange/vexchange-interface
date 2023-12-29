import { Percent } from 'vexchange-sdk/dist'
import React, { useContext } from 'react'
import { ChevronDown } from 'react-feather'
import { Text } from '@chakra-ui/react'
import { ThemeContext } from 'styled-components'
import { CursorPointer } from '../../theme'
import { warningServerity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'
import { PriceSlippageWarningCard } from './PriceSlippageWarningCard'
import { AdvancedDropwdown, FixedBottom } from './styleds'

export default function AdvancedSwapDetailsDropdown({
  priceImpactWithoutFee,
  showAdvanced,
  setShowAdvanced,
  ...rest
}: Omit<AdvancedSwapDetailsProps, 'onDismiss'> & {
  showAdvanced: boolean
  setShowAdvanced: (showAdvanced: boolean) => void
  priceImpactWithoutFee: Percent
}) {
  const theme = useContext(ThemeContext)
  const severity = warningServerity(priceImpactWithoutFee)
  return (
    <AdvancedDropwdown>
      {showAdvanced ? (
        <AdvancedSwapDetails {...rest} onDismiss={() => setShowAdvanced(false)} />
      ) : (
        <CursorPointer>
          <RowBetween onClick={() => setShowAdvanced(true)} id="show-advanced">
            <Text fontSize={16} fontWeight={500} style={{ userSelect: 'none' }}>
              Show Advanced
            </Text>
            <ChevronDown />
          </RowBetween>
        </CursorPointer>
      )}
      <FixedBottom>
        <AutoColumn>{severity > 2 && <PriceSlippageWarningCard priceSlippage={priceImpactWithoutFee} />}</AutoColumn>
      </FixedBottom>
    </AdvancedDropwdown>
  )
}
