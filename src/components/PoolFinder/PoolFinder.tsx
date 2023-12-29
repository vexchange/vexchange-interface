import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TokenAmount, JSBI, Token, Pair } from 'vexchange-sdk/dist'
import { useTokenBalanceTreatingWETHasETH } from '../../state/wallet/hooks'
import { Text, Button, Flex, Box } from '@chakra-ui/react'
import { Plus } from 'react-feather'

import { Row } from '../Row'
import TokenLogo from '../TokenLogo'
import { SearchModal } from '../SearchModal'
import { PositionCard } from '../PositionCard'
import { Link } from '../../theme'

import { LightCard } from '../Card'
import { AutoColumn, ColumnCenter } from '../Column'
import { ButtonPrimary, ButtonDropwdown, ButtonDropwdownLight } from '../Button'

import { useToken } from '../../hooks/Tokens'
import { useWeb3React } from '../../hooks'
import { usePairAdder } from '../../state/user/hooks'
import { usePair } from '../../data/Reserves'

const Fields = {
  TOKEN0: 0,
  TOKEN1: 1
}

export const PoolFinder = () => {
  const navigate = useNavigate()
  const { account } = useWeb3React()
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN0)

  const [token0Address, setToken0Address] = useState<string>()
  const [token1Address, setToken1Address] = useState<string>()
  const token0: Token = useToken(token0Address)
  const token1: Token = useToken(token1Address)

  const pair: Pair = usePair(token0, token1)
  const addPair = usePairAdder()

  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const position: TokenAmount = useTokenBalanceTreatingWETHasETH(account, pair?.liquidityToken)

  const newPair: boolean =
    pair === null ||
    (!!pair && JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) && JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0)))
  const allowImport: boolean = position && JSBI.greaterThan(position.raw, JSBI.BigInt(0))

  return (
    <Box p={4}>
      <Flex direction="column" gap={4}>
        {!token0Address ? (
          <Button
            variant="primary"
            onClick={() => {
              setShowSearch(true)
              setActiveField(Fields.TOKEN0)
            }}
          >
            <Text>Select first token</Text>
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              setShowSearch(true)
              setActiveField(Fields.TOKEN0)
            }}
          >
            <Row>
              <TokenLogo address={token0Address} />
              <Text marginLeft={'12px'}>{token0?.symbol}</Text>
            </Row>
          </Button>
        )}
        <ColumnCenter>
          <Plus size="16" color="#888D9B" />
        </ColumnCenter>
        {!token1Address ? (
          <Button
            variant="primary"
            onClick={() => {
              setShowSearch(true)
              setActiveField(Fields.TOKEN1)
            }}
          >
            <Text>Select second token</Text>
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              setShowSearch(true)
              setActiveField(Fields.TOKEN1)
            }}
          >
            <Row>
              <TokenLogo address={token1Address} />
              <Text marginLeft={'12px'}>{token1?.symbol}</Text>
            </Row>
          </Button>
        )}
        {allowImport && (
          <ColumnCenter style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px' }}>
            <Text textAlign="center" fontWeight={500} color="">
              Pool Imported!
            </Text>
          </ColumnCenter>
        )}
        {position ? (
          !JSBI.equal(position.raw, JSBI.BigInt(0)) ? (
            <PositionCard pair={pair} minimal={true} border="1px solid #CED0D9" />
          ) : (
            <LightCard>
              <AutoColumn>
                <Text textAlign="center">Pool found, you don’t have liquidity on this pair yet.</Text>
                <Link
                  onClick={() => {
                    navigate('/add/' + token0Address + '-' + token1Address)
                  }}
                >
                  <Text textAlign="center">Add liquidity to this pair instead.</Text>
                </Link>
              </AutoColumn>
            </LightCard>
          )
        ) : newPair ? (
          <LightCard>
            <AutoColumn>
              <Text>No pool found.</Text>
              <Link
                onClick={() => {
                  navigate('/add/' + token0Address + '-' + token1Address)
                }}
              >
                Create pool?
              </Link>
            </AutoColumn>
          </LightCard>
        ) : (
          <LightCard>
            <Text textAlign="center">Select a token pair to find your liquidity.</Text>
          </LightCard>
        )}

        <Button variant="primary" disabled={!allowImport} onClick={() => navigate(-1)}>
          <Text>Close</Text>
        </Button>
      </Flex>

      <SearchModal
        isOpen={showSearch}
        filterType="tokens"
        onTokenSelect={address => {
          activeField === Fields.TOKEN0 ? setToken0Address(address) : setToken1Address(address)
        }}
        onDismiss={() => {
          setShowSearch(false)
        }}
        hiddenToken={activeField === Fields.TOKEN0 ? token1Address : token0Address}
      />
    </Box>
  )
}
