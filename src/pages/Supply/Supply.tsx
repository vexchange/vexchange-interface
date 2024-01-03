import React, { useState, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { JSBI, Pair } from 'vexchange-sdk/dist'
import { useNavigate } from 'react-router-dom'
import { Text, Button, Center, useDisclosure, Flex } from '@chakra-ui/react'

import { QuestionHelper } from '../../components/QuestionHelper'
import { SearchModal } from '../../components/SearchModal'
import { PositionCard } from '../../components/PositionCard'
import { useTokenBalances } from '../../state/wallet/hooks'
import { Link, TYPE } from '../../theme'
import { LightCard } from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { AutoColumn, ColumnCenter } from '../../components/Column'

import { useWeb3React } from '../../hooks'
import { usePair } from '../../data/Reserves'
import { useAllDummyPairs, useDarkModeManager } from '../../state/user/hooks'

const Positions = styled.div`
  position: relative;
  width: 100%;
`

const FixedBottom = styled.div`
  position: absolute;
  bottom: -80px;
  width: 100%;
`

export const PositionCardWrapper = ({ dummyPair }: { dummyPair: Pair }) => {
  const pair = usePair(dummyPair.token0, dummyPair.token1)
  return <PositionCard pair={pair} />
}

export const Supply = () => {
  const navigate = useNavigate()
  const theme = useContext(ThemeContext)
  const { account } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [showPoolSearch, setShowPoolSearch] = useState(false)
  const [isDark] = useDarkModeManager()

  // initiate listener for LP balances
  const pairs = useAllDummyPairs()
  const pairBalances = useTokenBalances(
    account,
    pairs?.map(p => p.liquidityToken)
  )

  const filteredExchangeList = pairs
    .filter(pair => {
      return (
        pairBalances?.[pair.liquidityToken.address] &&
        JSBI.greaterThan(pairBalances[pair.liquidityToken.address].raw, JSBI.BigInt(0))
      )
    })
    .map((pair, i) => {
      return <PositionCardWrapper key={i} dummyPair={pair} />
    })

  return (
    <Flex direction="column">
      <Button variant="primary" id="join-pool-button" onClick={onOpen}>
        <Text>Join {filteredExchangeList?.length > 0 ? 'another' : 'a'} pool</Text>
      </Button>
      <Positions>
        <AutoColumn>
          <RowBetween>
            <Text fontWeight={500}>Your Pooled Liquidity</Text>
            <QuestionHelper text="When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below." />
          </RowBetween>
          {filteredExchangeList?.length === 0 && (
            <LightCard>
              <TYPE.body textAlign="center">No liquidity found.</TYPE.body>
            </LightCard>
          )}
          {filteredExchangeList}
          <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
            {filteredExchangeList?.length !== 0 ? `Don't see a pool you joined? ` : 'Already joined a pool? '}{' '}
            <Link
              id="import-pool-link"
              onClick={() => {
                navigate('/find')
              }}
            >
              Import it.
            </Link>
          </Text>
        </AutoColumn>
        <FixedBottom>
          <Center>
            <Button
              // isDark={isDark}
              variant="primary"
              width="136px"
              onClick={() => navigate('/create')}
            >
              + Create Pool
            </Button>
          </Center>
        </FixedBottom>
      </Positions>
      <SearchModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  )
}
