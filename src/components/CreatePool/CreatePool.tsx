import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Token, WVET } from 'vexchange-sdk/dist'
import { Text, Button, Box, Flex, useDisclosure } from '@chakra-ui/react'
import { Plus } from 'react-feather'

import { Row, AutoRow } from '../Row'
import { TokenLogo } from '../TokenLogo'
import { SearchModal } from '../SearchModal'
import { AddLiquidity } from '../../pages/AddLiquidity'
import { TYPE, Link } from '../../theme'
import { AutoColumn, ColumnCenter } from '../Column'
import { ButtonPrimary, ButtonDropwdown, ButtonDropwdownLight } from '../Button'

import { useToken } from '../../hooks/Tokens'
import { useWeb3React } from '../../hooks'
import { usePair } from '../../data/Reserves'

const Fields = {
  TOKEN0: 0,
  TOKEN1: 1
}

const STEP = {
  SELECT_TOKENS: 'SELECT_TOKENS', // choose input and output tokens
  READY_TO_CREATE: 'READY_TO_CREATE', // enable 'create' button
  SHOW_CREATE_PAGE: 'SHOW_CREATE_PAGE' // show create page
}

export const CreatePool = () => {
  const { chainId } = useWeb3React()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN0)

  const [token0Address, setToken0Address] = useState<string>(WVET[chainId].address)
  const [token1Address, setToken1Address] = useState<string>()

  const token0: Token = useToken(token0Address)
  const token1: Token = useToken(token1Address)

  const [step, setStep] = useState<string>(STEP.SELECT_TOKENS)

  const pair = usePair(token0, token1)

  // if both tokens selected but pair doesnt exist, enable button to create pair
  useEffect(() => {
    if (token0Address && token1Address && pair === null) {
      setStep(STEP.READY_TO_CREATE)
    }
  }, [pair, token0Address, token1Address])

  // if theyve clicked create, show add liquidity page
  if (step === STEP.SHOW_CREATE_PAGE) {
    return <AddLiquidity token0={token0Address} token1={token1Address} />
  }

  return (
    <Box>
      <Flex direction="column" gap={4}>
        <Button
          variant="primary"
          onClick={() => {
            onOpen()
            setActiveField(Fields.TOKEN0)
          }}
        >
          Select first token
        </Button>

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
            disabled={step !== STEP.SELECT_TOKENS}
          >
            Select second token
          </Button>
        ) : (
          <Button
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
        <Box>
          {pair ? ( // pair already exists - prompt to add liquidity to existing pool
            <AutoRow>
              <TYPE.body textAlign="center">
                Pool already exists!
                <Link onClick={() => navigate('/add/' + token0Address + '-' + token1Address)}> Join the pool.</Link>
              </TYPE.body>
            </AutoRow>
          ) : (
            <Button
              variant="primary"
              width="100%"
              disabled={step !== STEP.READY_TO_CREATE}
              onClick={() => setStep(STEP.SHOW_CREATE_PAGE)}
            >
              Create Pool
            </Button>
          )}
        </Box>
      </Flex>
      <SearchModal
        isOpen={showSearch}
        filterType="tokens"
        onTokenSelect={address => {
          activeField === Fields.TOKEN0 ? setToken0Address(address) : setToken1Address(address)
        }}
        onClose={() => {
          setShowSearch(false)
        }}
        hiddenToken={activeField === Fields.TOKEN0 ? token1Address : token0Address}
        showCommonBases={activeField === Fields.TOKEN0}
      />
    </Box>
  )
}
