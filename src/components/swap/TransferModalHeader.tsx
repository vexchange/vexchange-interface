import { TokenAmount } from 'vexchange-sdk/dist'
import React from 'react'
import { Text } from '@chakra-ui/react'
import { useWeb3React } from '../../hooks'
import { Link, TYPE } from '../../theme'
import { getExploreLink } from '../../utils'
import Copy from '../AccountDetails/Copy'
import { AutoColumn } from '../Column'
import { AutoRow, RowBetween } from '../Row'
import TokenLogo from '../TokenLogo'

export function TransferModalHeader({ recipient, amount }: { recipient: string; amount: TokenAmount }) {
  const { chainId } = useWeb3React()
  return (
    <AutoColumn style={{ marginTop: '40px' }}>
      <RowBetween>
        <Text fontSize={36} fontWeight={500}>
          {amount?.toSignificant(6)} {amount?.token?.symbol}
        </Text>
        <TokenLogo address={amount?.token?.address} size={'30px'} />
      </RowBetween>
      <TYPE.darkGray fontSize={20}>To</TYPE.darkGray>
      <AutoRow>
        <Link href={getExploreLink(chainId, recipient, 'address')}>
          <TYPE.blue fontSize={36}>
            {recipient?.slice(0, 6)}...{recipient?.slice(36, 42)}↗
          </TYPE.blue>
        </Link>
        <Copy toCopy={recipient} />
      </AutoRow>
    </AutoColumn>
  )
}
