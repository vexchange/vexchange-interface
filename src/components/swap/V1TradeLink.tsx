import React, { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'

import { Link } from '../../theme'
import { YellowCard } from '../Card'
import { AutoColumn } from '../Column'

export default function V1TradeLink({ v1TradeLinkIfBetter }: { v1TradeLinkIfBetter: string }) {
  const theme = useContext(ThemeContext)
  return v1TradeLinkIfBetter ? (
    <YellowCard style={{ marginTop: '12px', padding: '8px 4px' }}>
      <AutoColumn gap="sm" justify="center" style={{ alignItems: 'center', textAlign: 'center' }}>
        <Text lineHeight="145.23%;" fontSize={14} fontWeight={400} color={theme.text1}>
          There is a better price for this trade on
          <Link href={v1TradeLinkIfBetter}>
            <b> Vexchange V1 ↗</b>
          </Link>
        </Text>
      </AutoColumn>
    </YellowCard>
  ) : null
}
