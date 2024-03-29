import { BigNumber } from '@ethersproject/bignumber'
import { find } from 'lodash'
import { parseEther, parseUnits } from '@ethersproject/units'
import { JSBI, Percent, Price, Route, Token, TokenAmount, WVET } from 'vexchange-sdk'
import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { abi as IVexchangeV2Router02ABI } from '../../constants/abis/IVexchangeV2Router02.json'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import { BlueCard, GreyCard, LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import ConfirmationModal from '../../components/ConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleLogo from '../../components/DoubleLogo'
import PositionCard from '../../components/PositionCard'
import Row, { AutoRow, RowBetween, RowFixed, RowFlat } from '../../components/Row'
import SearchModal from '../../components/SearchModal'

import TokenLogo from '../../components/TokenLogo'

import { DUMMY_VET, ROUTER_ADDRESS } from '../../constants'
import { usePair } from '../../data/Reserves'
import { useTotalSupply } from '../../data/TotalSupply'
import { useWeb3React } from '../../hooks'

import { useApproveCallback, Approval } from '../../hooks/useApproveCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useTokenByAddressAndAutomaticallyAdd } from '../../hooks/Tokens'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useTokenBalanceTreatingWETHasETH } from '../../state/wallet/hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { calculateSlippageAmount } from '../../utils'
import { Dots, Wrapper } from './styleds'

// denominated in bips
const ALLOWED_SLIPPAGE = 50

// denominated in seconds
const DEADLINE_FROM_NOW = 60 * 20

const FixedBottom = styled.div`
  position: absolute;
  margin-top: 2rem;
  width: 100%;
`

enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

interface AddState {
  independentField: Field
  typedValue: string
  [Field.INPUT]: {
    address: string | undefined
  }
  [Field.OUTPUT]: {
    address: string | undefined
  }
}

function initializeAddState(inputAddress?: string, outputAddress?: string): AddState {
  return {
    independentField: Field.INPUT,
    typedValue: '',
    [Field.INPUT]: {
      address: inputAddress
    },
    [Field.OUTPUT]: {
      address: outputAddress
    }
  }
}

enum AddAction {
  SELECT_TOKEN,
  SWITCH_TOKENS,
  TYPE
}

interface Payload {
  [AddAction.SELECT_TOKEN]: {
    field: Field
    address: string
  }
  [AddAction.SWITCH_TOKENS]: undefined
  [AddAction.TYPE]: {
    field: Field
    typedValue: string
  }
}

function reducer(
  state: AddState,
  action: {
    type: AddAction
    payload: Payload[AddAction]
  }
): AddState {
  switch (action.type) {
    case AddAction.SELECT_TOKEN: {
      const { field, address } = action.payload as Payload[AddAction.SELECT_TOKEN]
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (address === state[otherField].address) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { address },
          [otherField]: { address: state[field].address }
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { address }
        }
      }
    }
    case AddAction.TYPE: {
      const { field, typedValue } = action.payload as Payload[AddAction.TYPE]
      return {
        ...state,
        independentField: field,
        typedValue
      }
    }
    default: {
      throw Error
    }
  }
}

interface AddLiquidityProps extends RouteComponentProps {
  token0: string
  token1: string
}

function AddLiquidity({ token0, token1 }: AddLiquidityProps) {
  const { account, chainId, library } = useWeb3React()
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()
  const [isDark] = useDarkModeManager()

  // modal states
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicke confirm
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true)

  // input state
  //initialize with VET instead of WVET
  const initialToken0 = token0 === WVET[chainId].address ? DUMMY_VET[chainId].address : token0
  const initialToken1 = token1 === WVET[chainId].address ? DUMMY_VET[chainId].address : token1

  const [state, dispatch] = useReducer(reducer, initializeAddState(initialToken0, initialToken1))
  const { independentField, typedValue, ...fieldData } = state
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  // get basic SDK entities
  const tokens: { [field in Field]: Token } = {
    [Field.INPUT]: useTokenByAddressAndAutomaticallyAdd(fieldData[Field.INPUT].address),
    [Field.OUTPUT]: useTokenByAddressAndAutomaticallyAdd(fieldData[Field.OUTPUT].address)
  }

  const outputIsVET = tokens[Field.OUTPUT].equals(DUMMY_VET[chainId])
  const inputIsVET = tokens[Field.INPUT].equals(DUMMY_VET[chainId])

  const tokensAdjusted: { [field in Field]: Token } = {
    [Field.INPUT]: inputIsVET ? WVET[chainId] : tokens[Field.INPUT],
    [Field.OUTPUT]: outputIsVET ? WVET[chainId] : tokens[Field.OUTPUT]
  }

  // exchange data
  const pair = usePair(tokensAdjusted[Field.INPUT], tokensAdjusted[Field.OUTPUT])
  const route: Route = pair ? new Route([pair], tokensAdjusted[independentField]) : undefined
  const totalSupply: TokenAmount = useTotalSupply(pair?.liquidityToken)
  const noLiquidity = // used to detect new exchange
    pair === null ||
    (!!pair && JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) && JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0)))

  // get user-pecific and token-specific lookup data
  const userBalances: { [field in Field]: TokenAmount } = {
    [Field.INPUT]: useTokenBalanceTreatingWETHasETH(account, tokens[Field.INPUT]),
    [Field.OUTPUT]: useTokenBalanceTreatingWETHasETH(account, tokens[Field.OUTPUT])
  }

  // track non relational amounts if first person to add liquidity
  const [nonrelationalAmounts, setNonrelationalAmounts] = useState({
    [Field.INPUT]: null,
    [Field.OUTPUT]: null
  })

  useEffect(() => {
    if (typedValue !== '.' && tokensAdjusted[independentField] && noLiquidity) {
      const newNonRelationalAmounts = nonrelationalAmounts
      if (typedValue === '') {
        if (independentField === Field.OUTPUT) {
          newNonRelationalAmounts[Field.OUTPUT] = null
        } else {
          newNonRelationalAmounts[Field.INPUT] = null
        }
      } else {
        try {
          const typedValueParsed = parseUnits(typedValue, tokensAdjusted[independentField].decimals).toString()
          if (independentField === Field.OUTPUT) {
            newNonRelationalAmounts[Field.OUTPUT] = new TokenAmount(tokensAdjusted[independentField], typedValueParsed)
          } else {
            newNonRelationalAmounts[Field.INPUT] = new TokenAmount(tokensAdjusted[independentField], typedValueParsed)
          }
        } catch (error) {
          console.log(error)
        }
      }
      setNonrelationalAmounts(newNonRelationalAmounts)
    }
  }, [independentField, nonrelationalAmounts, tokensAdjusted, typedValue, noLiquidity])

  // caclulate the token amounts based on the input
  const parsedAmounts: { [field: number]: TokenAmount } = {}
  if (noLiquidity) {
    parsedAmounts[independentField] = nonrelationalAmounts[independentField]
    parsedAmounts[dependentField] = nonrelationalAmounts[dependentField]
  }
  if (typedValue !== '' && typedValue !== '.' && tokensAdjusted[independentField]) {
    try {
      const typedValueParsed = parseUnits(typedValue, tokensAdjusted[independentField].decimals).toString()
      if (typedValueParsed !== '0')
        parsedAmounts[independentField] = new TokenAmount(tokensAdjusted[independentField], typedValueParsed)
    } catch (error) {
      console.error(error)
    }
  }

  if (
    route &&
    !noLiquidity &&
    parsedAmounts[independentField] &&
    JSBI.greaterThan(parsedAmounts[independentField].raw, JSBI.BigInt(0))
  ) {
    parsedAmounts[dependentField] = route.midPrice.quote(parsedAmounts[independentField])
  }

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField] ? parsedAmounts[dependentField]?.toSignificant(6) : ''
  }

  // used for displaying approximate starting price in UI
  const derivedPrice =
    parsedAmounts[Field.INPUT] &&
    parsedAmounts[Field.OUTPUT] &&
    nonrelationalAmounts[Field.INPUT] &&
    nonrelationalAmounts[Field.OUTPUT] &&
    typedValue !== ''
      ? new Price(
          parsedAmounts[Field.INPUT].token,
          parsedAmounts[Field.OUTPUT].token,
          parsedAmounts[Field.INPUT].raw,
          parsedAmounts[Field.OUTPUT].raw
        )
      : null

  // check for estimated liquidity minted
  const liquidityMinted: TokenAmount =
    !!pair &&
    !!totalSupply &&
    !!parsedAmounts[Field.INPUT] &&
    !!parsedAmounts[Field.OUTPUT] &&
    !JSBI.equal(parsedAmounts[Field.INPUT].raw, JSBI.BigInt(0)) &&
    !JSBI.equal(parsedAmounts[Field.OUTPUT].raw, JSBI.BigInt(0))
      ? pair.getLiquidityMinted(totalSupply, parsedAmounts[Field.INPUT], parsedAmounts[Field.OUTPUT])
      : undefined

  const poolTokenPercentage: Percent =
    !!liquidityMinted && !!totalSupply
      ? new Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw)
      : undefined

  const onTokenSelection = useCallback((field: Field, address: string) => {
    dispatch({
      type: AddAction.SELECT_TOKEN,
      payload: { field, address }
    })
  }, [])

  const onUserInput = useCallback((field: Field, typedValue: string) => {
    dispatch({ type: AddAction.TYPE, payload: { field, typedValue } })
  }, [])

  const onMax = useCallback((typedValue: string, field) => {
    dispatch({
      type: AddAction.TYPE,
      payload: {
        field: field,
        typedValue
      }
    })
  }, [])

  const MIN_ETHER: TokenAmount = new TokenAmount(WVET[chainId], JSBI.BigInt(parseEther('.01')))

  // get the max amounts user can add
  const [maxAmountInput, maxAmountOutput]: TokenAmount[] = [Field.INPUT, Field.OUTPUT].map(index => {
    const field = Field[index]
    return !!userBalances[Field[field]] &&
      JSBI.greaterThan(
        userBalances[Field[field]].raw,
        tokens[Field[field]]?.equals(WVET[chainId]) ? MIN_ETHER.raw : JSBI.BigInt(0)
      )
      ? tokens[Field[field]]?.equals(WVET[chainId])
        ? userBalances[Field[field]].subtract(MIN_ETHER)
        : userBalances[Field[field]]
      : undefined
  })

  const [atMaxAmountInput, atMaxAmountOutput]: boolean[] = [Field.INPUT, Field.OUTPUT].map(index => {
    const field = Field[index]
    const maxAmount = index === Field.INPUT ? maxAmountInput : maxAmountOutput
    return !!maxAmount && !!parsedAmounts[Field[field]]
      ? JSBI.equal(maxAmount.raw, parsedAmounts[Field[field]].raw)
      : undefined
  })

  // errors
  const [generalError, setGeneralError] = useState('')
  const [inputError, setInputError] = useState('')
  const [outputError, setOutputError] = useState('')
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    // reset errors
    setGeneralError(null)
    setInputError(null)
    setOutputError(null)
    setIsValid(true)

    if (!account) {
      setGeneralError('Connect Wallet')
      setIsValid(false)
    }

    if (noLiquidity && parsedAmounts[Field.INPUT] && JSBI.equal(parsedAmounts[Field.INPUT].raw, JSBI.BigInt(0))) {
      setGeneralError('Enter an amount')
      setIsValid(false)
    }

    if (noLiquidity && parsedAmounts[Field.OUTPUT] && JSBI.equal(parsedAmounts[Field.OUTPUT].raw, JSBI.BigInt(0))) {
      setGeneralError('Enter an amount')
      setIsValid(false)
    }

    if (!parsedAmounts[Field.INPUT]) {
      setGeneralError('Enter an amount')
      setIsValid(false)
    }
    if (!parsedAmounts[Field.OUTPUT]) {
      setGeneralError('Enter an amount')
      setIsValid(false)
    }
    if (
      parsedAmounts?.[Field.INPUT] &&
      userBalances?.[Field.INPUT] &&
      JSBI.greaterThan(parsedAmounts?.[Field.INPUT]?.raw, userBalances?.[Field.INPUT]?.raw)
    ) {
      setInputError('Insufficient ' + tokens[Field.INPUT]?.symbol + ' balance')
      setIsValid(false)
    }
    if (
      parsedAmounts?.[Field.OUTPUT] &&
      userBalances?.[Field.OUTPUT] &&
      JSBI.greaterThan(parsedAmounts?.[Field.OUTPUT]?.raw, userBalances?.[Field.OUTPUT]?.raw)
    ) {
      setOutputError('Insufficient ' + tokens[Field.OUTPUT]?.symbol + ' balance')
      setIsValid(false)
    }
  }, [noLiquidity, parsedAmounts, tokens, userBalances, account])

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.INPUT], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.OUTPUT], ROUTER_ADDRESS)

  // state for txn
  const addTransaction = useTransactionAdder()
  const [txHash, setTxHash] = useState<string>('')

  async function onAdd() {
    setAttemptingTxn(true)

    const minInput = calculateSlippageAmount(parsedAmounts[Field.INPUT], ALLOWED_SLIPPAGE)[0]
    const minOutput = calculateSlippageAmount(parsedAmounts[Field.OUTPUT], ALLOWED_SLIPPAGE)[0]

    const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

    let args, value, abi

    // one of the tokens is ETH
    if (inputIsVET || outputIsVET) {
      abi = find(IVexchangeV2Router02ABI, { name: 'addLiquidityVET' })

      const outputIsETH = tokens[Field.OUTPUT].equals(DUMMY_VET[chainId])

      args = [
        tokens[outputIsETH ? Field.INPUT : Field.OUTPUT].address, // token
        parsedAmounts[outputIsETH ? Field.INPUT : Field.OUTPUT].raw.toString(), // token desired
        outputIsETH ? minInput.toString() : minOutput.toString(), // token min
        outputIsETH ? minOutput.toString() : minInput.toString(), // eth min
        account,
        deadline
      ]
      value = BigNumber.from(parsedAmounts[outputIsETH ? Field.OUTPUT : Field.INPUT].raw.toString())
    } else {
      abi = find(IVexchangeV2Router02ABI, { name: 'addLiquidity' })

      args = [
        tokens[Field.INPUT].address,
        tokens[Field.OUTPUT].address,
        parsedAmounts[Field.INPUT].raw.toString(),
        parsedAmounts[Field.OUTPUT].raw.toString(),
        noLiquidity ? parsedAmounts[Field.INPUT].raw.toString() : minInput.toString(),
        noLiquidity ? parsedAmounts[Field.OUTPUT].raw.toString() : minOutput.toString(),
        account,
        deadline
      ]
      value = null
    }

    const method = library.thor.account(ROUTER_ADDRESS).method(abi)
    const clause = method.asClause(...args)

    return library.vendor
      .sign('tx', [
        {
          ...clause,
          value: value ? value.toString() : 0
        }
      ])
      .comment('Add Liquidity')
      .request()
      .then(response => {
        ReactGA.event({
          category: 'Liquidity',
          action: 'Add',
          label: [tokens[Field.INPUT]?.symbol, tokens[Field.OUTPUT]?.symbol].join('/')
        })
        setTxHash(response.txid)
        addTransaction(response, {
          summary:
            'Add ' +
            parsedAmounts[Field.INPUT]?.toSignificant(3) +
            ' ' +
            tokens[Field.INPUT]?.symbol +
            ' and ' +
            parsedAmounts[Field.OUTPUT]?.toSignificant(3) +
            ' ' +
            tokens[Field.OUTPUT]?.symbol
        })
        setPendingConfirmation(false)
      })
      .catch((e: Error) => {
        console.error(e)
        setPendingConfirmation(true)
        setAttemptingTxn(false)
        setShowConfirm(false)
      })
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <AutoColumn gap="12px">
        <LightCard margin={'30px 0'} borderRadius="20px">
          <ColumnCenter>
            <RowFixed>
              <Text fontSize={36} fontWeight={500} marginRight={20}>
                {tokens[Field.INPUT]?.symbol + '-' + tokens[Field.OUTPUT]?.symbol}
              </Text>{' '}
              <DoubleLogo a0={tokens[Field.INPUT]?.address} a1={tokens[Field.OUTPUT]?.address} size={36} />
            </RowFixed>
          </ColumnCenter>
        </LightCard>
        <TYPE.body>Starting pool prices</TYPE.body>
        <LightCard borderRadius="20px">
          <TYPE.mediumHeader>
            {parsedAmounts[0] &&
              parsedAmounts[1] &&
              JSBI.greaterThan(parsedAmounts[0].raw, JSBI.BigInt(0)) &&
              JSBI.greaterThan(parsedAmounts[1].raw, JSBI.BigInt(0)) &&
              derivedPrice?.invert().toSignificant(6)}{' '}
            {tokens[Field.INPUT]?.symbol + '/' + tokens[Field.OUTPUT]?.symbol}
          </TYPE.mediumHeader>
        </LightCard>
        <LightCard borderRadius="20px">
          <TYPE.mediumHeader>
            {parsedAmounts[0] &&
              parsedAmounts[1] &&
              JSBI.greaterThan(parsedAmounts[0].raw, JSBI.BigInt(0)) &&
              JSBI.greaterThan(parsedAmounts[1].raw, JSBI.BigInt(0)) &&
              derivedPrice?.toSignificant(6)}{' '}
            {tokens[Field.OUTPUT]?.symbol + '/' + tokens[Field.INPUT]?.symbol}
          </TYPE.mediumHeader>
        </LightCard>
      </AutoColumn>
    ) : (
      <AutoColumn gap="20px">
        <RowFlat style={{ marginTop: '20px' }}>
          <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>
            {liquidityMinted?.toSignificant(6)}
          </Text>
          <DoubleLogo a0={tokens[Field.INPUT]?.address} a1={tokens[Field.OUTPUT]?.address} size={30} />
        </RowFlat>
        <Row>
          <Text fontSize="24px">
            {tokens[Field.INPUT]?.symbol + ':' + tokens[Field.OUTPUT]?.symbol + ' Pool Tokens'}
          </Text>
        </Row>
        <TYPE.italic fontSize={12} textAlign="left" padding={'8px 0 0 0 '}>
          {`Output is estimated. You will receive at least ${liquidityMinted?.toSignificant(6)} VEX ${
            tokens[Field.INPUT]?.symbol
          }/${tokens[Field.OUTPUT]?.symbol} or the transaction will revert.`}
        </TYPE.italic>
      </AutoColumn>
    )
  }

  const modalBottom = () => {
    return (
      <>
        <RowBetween>
          <TYPE.body>{tokens[Field.INPUT]?.symbol} Deposited</TYPE.body>
          <RowFixed>
            <TokenLogo address={tokens[Field.INPUT]?.address} style={{ marginRight: '8px' }} />
            <TYPE.body>{!!parsedAmounts[Field.INPUT] && parsedAmounts[Field.INPUT].toSignificant(6)}</TYPE.body>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <TYPE.body>{tokens[Field.OUTPUT]?.symbol} Deposited</TYPE.body>
          <RowFixed>
            <TokenLogo address={tokens[Field.OUTPUT]?.address} style={{ marginRight: '8px' }} />
            <TYPE.body>{!!parsedAmounts[Field.OUTPUT] && parsedAmounts[Field.OUTPUT].toSignificant(6)}</TYPE.body>
          </RowFixed>
        </RowBetween>
        {route && !JSBI.equal(route?.midPrice?.raw?.denominator, JSBI.BigInt(0)) && (
          <RowBetween>
            <TYPE.body>Rate</TYPE.body>
            <TYPE.body>
              {`1 ${tokens[Field.INPUT]?.symbol} = ${route?.midPrice &&
                route?.midPrice?.raw?.denominator &&
                route?.midPrice?.adjusted?.toSignificant(4)} ${tokens[Field.OUTPUT]?.symbol}`}
            </TYPE.body>
          </RowBetween>
        )}
        <RowBetween>
          <TYPE.body>Minted Pool Share:</TYPE.body>
          <TYPE.body>{noLiquidity ? '100%' : poolTokenPercentage?.toSignificant(6) + '%'}</TYPE.body>
        </RowBetween>
        <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
          <Text fontWeight={500} fontSize={20}>
            {noLiquidity ? 'Supply & Create Pool' : 'Confirm Supply'}
          </Text>
        </ButtonPrimary>
      </>
    )
  }

  const displayPriceInput = noLiquidity
    ? parsedAmounts[0] &&
      parsedAmounts[1] &&
      derivedPrice &&
      JSBI.greaterThan(parsedAmounts[0].raw, JSBI.BigInt(0)) &&
      JSBI.greaterThan(parsedAmounts[1].raw, JSBI.BigInt(0))
      ? derivedPrice?.toSignificant(6)
      : '-'
    : pair && route && tokens[Field.INPUT]
    ? route?.input.equals(tokens[Field.INPUT])
      ? route.midPrice.toSignificant(6)
      : route.midPrice.invert().toSignificant(6)
    : '-'

  const displayPriceOutput = noLiquidity
    ? parsedAmounts[0] &&
      parsedAmounts[1] &&
      derivedPrice &&
      JSBI.greaterThan(parsedAmounts[0].raw, JSBI.BigInt(0)) &&
      JSBI.greaterThan(parsedAmounts[1].raw, JSBI.BigInt(0))
      ? derivedPrice?.invert().toSignificant(6)
      : '-'
    : pair && route && tokens[Field.OUTPUT]
    ? route?.input.equals(tokens[Field.OUTPUT])
      ? route.midPrice.toSignificant(6)
      : route.midPrice.invert().toSignificant(6)
    : '-'

  const PriceBar = () => {
    return (
      <AutoColumn gap="md" justify="space-between">
        <AutoRow justify="space-between">
          <AutoColumn justify="center">
            <TYPE.black>{displayPriceInput}</TYPE.black>
            <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
              {tokens[Field.OUTPUT]?.symbol} per {tokens[Field.INPUT]?.symbol}
            </Text>
          </AutoColumn>
          <AutoColumn justify="center">
            <TYPE.black>{displayPriceOutput}</TYPE.black>
            <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
              {tokens[Field.INPUT]?.symbol} per {tokens[Field.OUTPUT]?.symbol}
            </Text>
          </AutoColumn>
          <AutoColumn justify="center">
            <TYPE.black>
              {noLiquidity && derivedPrice ? '100' : poolTokenPercentage?.toSignificant(4) ?? '0'}
              {'%'}
            </TYPE.black>
            <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
              Pool Share
            </Text>
          </AutoColumn>
        </AutoRow>
      </AutoColumn>
    )
  }

  const pendingText = `Supplying ${parsedAmounts[Field.INPUT]?.toSignificant(6)} ${
    tokens[Field.INPUT]?.symbol
  } ${'and'} ${parsedAmounts[Field.OUTPUT]?.toSignificant(6)} ${tokens[Field.OUTPUT]?.symbol}`

  return (
    <Wrapper>
      <ConfirmationModal
        isOpen={showConfirm}
        onDismiss={() => {
          setPendingConfirmation(true)
          setAttemptingTxn(false)
          setShowConfirm(false)
        }}
        attemptingTxn={attemptingTxn}
        pendingConfirmation={pendingConfirmation}
        hash={txHash ? txHash : ''}
        topContent={() => modalHeader()}
        bottomContent={modalBottom}
        pendingText={pendingText}
        title={noLiquidity ? 'You are creating a pool' : 'You will receive'}
      />
      <SearchModal
        isOpen={showSearch}
        onDismiss={() => {
          setShowSearch(false)
        }}
      />
      <AutoColumn gap="20px">
        {noLiquidity && (
          <ColumnCenter style={{ marginTop: '1.5rem' }}>
            <BlueCard>
              <AutoColumn gap="10px">
                <TYPE.link fontWeight={600}>You are the first liquidity provider.</TYPE.link>
                <TYPE.link fontWeight={400}>The ratio of tokens you add will set the price of this pool.</TYPE.link>
                <TYPE.link fontWeight={400}>Once you are happy with the rate click supply to review.</TYPE.link>
              </AutoColumn>
            </BlueCard>
          </ColumnCenter>
        )}
        <CurrencyInputPanel
          field={Field.INPUT}
          value={formattedAmounts[Field.INPUT]}
          onUserInput={onUserInput}
          onMax={() => {
            maxAmountInput && onMax(maxAmountInput.toExact(), Field.INPUT)
          }}
          showMaxButton={!atMaxAmountInput}
          token={tokens[Field.INPUT]}
          onTokenSelection={address => onTokenSelection(Field.INPUT, address)}
          pair={pair}
          label="Input"
          id="add-liquidity-input"
        />
        <ColumnCenter
          style={{
            padding: '0.5rem 0',
            backgroundImage: isDark
              ? `linear-gradient(270deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 97%)`
              : `none`,
            backgroundColor: isDark ? `none` : `rgba(99, 113, 142, 0.10)`
          }}
        >
          <Plus size="16" color={theme.text2} />
        </ColumnCenter>
        <CurrencyInputPanel
          field={Field.OUTPUT}
          value={formattedAmounts[Field.OUTPUT]}
          onUserInput={onUserInput}
          onMax={() => {
            maxAmountOutput && onMax(maxAmountOutput?.toExact(), Field.OUTPUT)
          }}
          showMaxButton={!atMaxAmountOutput}
          token={tokens[Field.OUTPUT]}
          onTokenSelection={address => onTokenSelection(Field.OUTPUT, address)}
          pair={pair}
          id="add-liquidity-output"
        />
        {tokens[Field.OUTPUT] && tokens[Field.INPUT] && (
          <>
            <GreyCard borderRadius={'20px'}>
              <RowBetween marginBottom="1rem">
                <TYPE.subHeader fontWeight={500} fontSize={14}>
                  {noLiquidity ? 'Initial prices' : 'Prices'} and pool share
                </TYPE.subHeader>
              </RowBetween>{' '}
              <LightCard padding="1rem" borderRadius={'20px'}>
                <PriceBar />
              </LightCard>
            </GreyCard>
          </>
        )}

        <div style={{ padding: '2.4rem 4rem' }}>
          {!account ? (
            <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
          ) : approvalA === Approval.NOT_APPROVED || approvalA === Approval.PENDING ? (
            <ButtonLight onClick={approveACallback} disabled={approvalA === Approval.PENDING}>
              {approvalA === Approval.PENDING ? (
                <Dots>Unlocking {tokens[Field.INPUT]?.symbol}</Dots>
              ) : (
                'Unlock ' + tokens[Field.INPUT]?.symbol
              )}
            </ButtonLight>
          ) : approvalB === Approval.NOT_APPROVED || approvalB === Approval.PENDING ? (
            <ButtonLight onClick={approveBCallback} disabled={approvalB === Approval.PENDING}>
              {approvalB === Approval.PENDING ? (
                <Dots>Unlocking {tokens[Field.OUTPUT]?.symbol}</Dots>
              ) : (
                'Unlock ' + tokens[Field.OUTPUT]?.symbol
              )}
            </ButtonLight>
          ) : (
            <ButtonPrimary
              onClick={() => {
                setShowConfirm(true)
              }}
              disabled={!isValid}
            >
              <Text fontSize={20} fontWeight={500}>
                {generalError ? generalError : inputError ? inputError : outputError ? outputError : 'Supply'}
              </Text>
            </ButtonPrimary>
          )}
        </div>
      </AutoColumn>

      {!noLiquidity && (
        <FixedBottom>
          <AutoColumn>
            <PositionCard pair={pair} minimal={true} />
          </AutoColumn>
        </FixedBottom>
      )}
    </Wrapper>
  )
}

export default withRouter(AddLiquidity)
